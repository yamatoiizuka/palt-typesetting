import type { TransformFunction, TypesettingOptions } from '../types'
import { whitespaceOnlyRegex } from './util-regex.js'

const PROTECTED_BLOCK_TOKEN_PREFIX = '__TYPESETTING_PROTECTED_BLOCK__'
const PROTECTED_GENERATED_TOKEN_PREFIX = '__TYPESETTING_PROTECTED_GENERATED__'
// HTML をタグとテキストに分割する。'>' で閉じられていない '<' は、どちらにも含まれず取り除かれる。
const htmlTokenRegex = /<[^>]+>|[^<]+/g
const protectedBlockRegex = /<(script|style|textarea|code|pre|kbd|samp)\b[^>]*>[\s\S]*?<\/\1>/gi
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'])
const MANAGED_CLASS_NAMES = new Set([
  'typesetting-wrapper',
  'typesetting-word-break',
  'typesetting-latin',
  'typesetting-no-breaks',
  'typesetting-thin-space',
  'typesetting-kerning',
])
const MANAGED_CLASS_PREFIXES = ['typesetting-char-']

type TagInfo = {
  tagName: string
  isClosing: boolean
  isSelfClosing: boolean
  classNames: string[]
}

/**
 * HTMLコンテンツの変換と処理を行うクラスです。
 */
class HTMLProcessor {
  private transformFunctions: TransformFunction[]
  private options: TypesettingOptions

  /**
   * HTMLProcessor を初期化します。
   *
   * @param transformFunctions - テキストトークンごとに適用する変換関数の配列。
   * @param options - 各変換関数に渡す組版オプション。
   */
  constructor(transformFunctions: TransformFunction[], options: TypesettingOptions) {
    this.transformFunctions = transformFunctions
    this.options = options
  }

  /**
   * 与えられたHTML文字列に対して、各変換関数を順次適用し、変換されたHTML文字列を返します。
   * 文字列ベースで高速に処理しつつ、保護対象のブロックはそのまま保持します。
   *
   * @param srcHtml - 変換を適用する元のHTML文字列。
   * @return 変換後のHTML文字列。
   */
  processHtmlWithFunctions(srcHtml: string): string {
    if (srcHtml === '') return srcHtml

    const { html: htmlWithoutProtectedBlocks, protectedBlocks } = this.extractProtectedBlocks(srcHtml)
    const { html, protectedBlocks: protectedGeneratedBlocks } = this.extractManagedGeneratedBlocks(htmlWithoutProtectedBlocks)

    let processedHtml = html
    for (const transformFunction of this.transformFunctions) {
      processedHtml = this.processHtml(processedHtml, transformFunction)
    }

    const restoredGeneratedHtml = this.restoreProtectedBlocks(
      processedHtml,
      protectedGeneratedBlocks,
      PROTECTED_GENERATED_TOKEN_PREFIX
    )
    return this.restoreProtectedBlocks(restoredGeneratedHtml, protectedBlocks, PROTECTED_BLOCK_TOKEN_PREFIX)
  }

  /**
   * HTML文字列を「タグ」と「テキスト」に分割し、テキスト部分に対して変換関数を適用します。
   *
   * @param html - 解析および変換するHTML文字列。
   * @param transformFunction - テキスト部分に適用する変換関数。
   * @return 変換後のHTML文字列。
   */
  private processHtml(html: string, transformFunction: TransformFunction): string {
    if (html === '') return html

    const tokens = html.match(htmlTokenRegex) ?? []

    // 各テキストの「次のテキスト（変換前）」を、後ろから 1 回走査して求める。
    const nextTexts: string[] = []
    let nextText = ''
    for (let i = tokens.length - 1; i >= 0; i--) {
      if (tokens[i][0] === '<') continue
      nextTexts[i] = nextText
      nextText = tokens[i]
    }

    // 変換関数は前から順に呼ぶ。
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i][0] === '<' || whitespaceOnlyRegex.test(tokens[i])) continue
      tokens[i] = transformFunction(tokens[i], nextTexts[i], this.options)
    }

    return tokens.join('')
  }

  /**
   * 除外対象のブロック要素を一時的なプレースホルダに置き換えます。
   * これにより、文字列ベースのトークン処理中に script/style などの中身が
   * 組版対象として誤って書き換えられることを防ぎます。
   *
   * @param html - 保護対象のブロックを含むHTML文字列。
   * @return プレースホルダ化後のHTMLと、退避したブロックの配列。
   */
  private extractProtectedBlocks(html: string): { html: string; protectedBlocks: string[] } {
    const protectedBlocks: string[] = []
    const extractedHtml = html.replace(protectedBlockRegex, block => {
      const token = `<!--${PROTECTED_BLOCK_TOKEN_PREFIX}${protectedBlocks.length}-->`
      protectedBlocks.push(block)
      return token
    })

    return { html: extractedHtml, protectedBlocks }
  }

  /**
   * 既に組版済みの span 要素をプレースホルダに置き換えます。
   * ここで保護するのは入力HTMLに元から存在していた要素だけで、
   * 今回の render() 中に生成される wrapper や latin span は後続の変換対象に残します。
   *
   * @param html - 既生成の span 要素を含むHTML文字列。
   * @return プレースホルダ化後のHTMLと、退避した要素の配列。
   */
  private extractManagedGeneratedBlocks(html: string): { html: string; protectedBlocks: string[] } {
    const protectedBlocks: string[] = []
    const outputTokens: string[] = []
    const protectedTokens: string[] = []
    const protectedTagStack: string[] = []

    for (const token of html.match(htmlTokenRegex) ?? []) {
      const tagInfo = token[0] === '<' ? this.getTagInfo(token) : null
      const isInsideProtectedBlock = protectedTagStack.length > 0

      if (!isInsideProtectedBlock && tagInfo && !tagInfo.isClosing && !tagInfo.isSelfClosing && this.isManagedGeneratedTag(tagInfo)) {
        protectedTagStack.push(tagInfo.tagName)
        protectedTokens.push(token)
        continue
      }

      if (!isInsideProtectedBlock) {
        outputTokens.push(token)
        continue
      }

      protectedTokens.push(token)

      if (!tagInfo) {
        continue
      }

      if (tagInfo.isClosing) {
        if (protectedTagStack[protectedTagStack.length - 1] === tagInfo.tagName) {
          protectedTagStack.pop()
        }
      } else if (!tagInfo.isSelfClosing && !VOID_TAGS.has(tagInfo.tagName)) {
        protectedTagStack.push(tagInfo.tagName)
      }

      if (protectedTagStack.length === 0) {
        const placeholder = `<!--${PROTECTED_GENERATED_TOKEN_PREFIX}${protectedBlocks.length}-->`
        protectedBlocks.push(protectedTokens.join(''))
        outputTokens.push(placeholder)
        protectedTokens.length = 0
      }
    }

    return { html: outputTokens.join(''), protectedBlocks }
  }

  /**
   * extractProtectedBlocks で退避したブロック要素を、元の位置へ復元します。
   *
   * @param html - プレースホルダを含むHTML文字列。
   * @param protectedBlocks - 退避していたブロック要素の配列。
   * @param tokenPrefix - extract 側で使用したプレースホルダの接頭辞。
   * @return プレースホルダを元のブロック要素に戻したHTML文字列。
   */
  private restoreProtectedBlocks(html: string, protectedBlocks: string[], tokenPrefix: string): string {
    // 各プレースホルダの最初の 1 件だけを戻す（入力に同じ文字列のコメントがあっても置き換えない）。
    // 置換文字列ではなく関数で返し、ブロック内の "$&" などが置換パターンとして解釈されないようにする。
    return protectedBlocks.reduce(
      (restoredHtml, block, index) => restoredHtml.replace(`<!--${tokenPrefix}${index}-->`, () => block),
      html
    )
  }

  /**
   * タグ文字列から、タグ名とクラス名などの最小限の情報を抽出します。
   * コメントや doctype のような通常タグでないものは null を返します。
   *
   * @param tag - htmlTokenRegex で切り出したタグ文字列。
   * @return 抽出したタグ情報。通常タグでなければ null。
   */
  private getTagInfo(tag: string): TagInfo | null {
    const closingMatch = tag.match(/^<\s*\/\s*([a-zA-Z][\w:-]*)\b/)
    if (closingMatch) {
      return {
        tagName: closingMatch[1].toLowerCase(),
        isClosing: true,
        isSelfClosing: false,
        classNames: [],
      }
    }

    const openingMatch = tag.match(/^<\s*([a-zA-Z][\w:-]*)\b/)
    if (!openingMatch) {
      return null
    }

    const classMatch = tag.match(/\bclass\s*=\s*(["'])(.*?)\1/i)
    const classNames = classMatch ? classMatch[2].split(/\s+/).filter(Boolean) : []

    return {
      tagName: openingMatch[1].toLowerCase(),
      isClosing: false,
      isSelfClosing: /\/\s*>$/.test(tag),
      classNames,
    }
  }

  /**
   * このライブラリが生成した要素として扱うべきタグかを判定します。
   * `.typesetting-*` を一括判定せず、実際に出力で使用しているクラスだけを対象にします。
   *
   * @param tagInfo - 判定対象のタグ情報。
   * @return ライブラリ生成要素なら true、そうでなければ false。
   */
  private isManagedGeneratedTag(tagInfo: TagInfo): boolean {
    if (tagInfo.tagName !== 'span') {
      return false
    }

    return tagInfo.classNames.some(className => {
      return MANAGED_CLASS_NAMES.has(className) || MANAGED_CLASS_PREFIXES.some(prefix => className.startsWith(prefix))
    })
  }
}

export default HTMLProcessor
export type { TransformFunction, TypesettingOptions }
