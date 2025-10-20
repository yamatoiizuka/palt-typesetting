import type { TransformFunction, TypesettingOptions } from '../types'
import { whitespaceRegex } from './util-regex.js'

/**
 * HTMLコンテンツの変換と処理を行うクラスです。
 */
class HTMLProcessor {
  private transformFunctions: TransformFunction[]
  private options: TypesettingOptions

  constructor(transformFunctions: TransformFunction[], options: TypesettingOptions) {
    this.transformFunctions = transformFunctions
    this.options = options
  }

  /**
   * 与えられたHTML文字列に対して、各変換関数を順次適用し、変換されたHTML文字列を返します。
   * DOM パーサやツリー操作は用いず、すべての処理を文字列操作で実現しています。
   *
   * @param srcHtml - 変換を適用する元のHTML文字列。
   * @return 変換後のHTML文字列。
   */
  processHtmlWithFunctions(srcHtml: string): string {
    if (srcHtml === '') return srcHtml

    let processedHtml = srcHtml
    for (const transformFunction of this.transformFunctions) {
      processedHtml = this.processHtml(processedHtml, transformFunction)
    }
    return processedHtml
  }

  /**
   * HTML文字列を正規表現で「タグ」と「テキスト」に分割し、テキスト部分に対して指定された変換関数を適用します。
   *
   * @param html - 解析および変換するHTML文字列。
   * @param transformFunction - テキスト部分に適用する変換関数。
   * @return 変換後のHTML文字列。
   */
  private processHtml(html: string, transformFunction: TransformFunction): string {
    if (html === '') return html

    // タグとテキストに分割する正規表現
    // グループ1: タグ、グループ2: テキスト
    const tokenRegex = /(<[^>]+>)|([^<]+)/g
    const tokens: { type: 'tag' | 'text'; value: string }[] = []
    let match: RegExpExecArray | null

    while ((match = tokenRegex.exec(html)) !== null) {
      if (match[1]) {
        tokens.push({ type: 'tag', value: match[1] })
      } else if (match[2]) {
        tokens.push({ type: 'text', value: match[2] })
      }
    }

    // テキストトークンに対して変換関数を適用
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'text') {
        // 空白のみのテキストノード（タグ間の改行やインデント）はスキップ
        const isWhitespaceOnly = new RegExp(`^${whitespaceRegex.source}*$`).test(tokens[i].value)
        if (isWhitespaceOnly) {
          continue
        }

        // 隣接するテキストノードがあれば、その値を文脈として取得する
        let nextText = ''
        for (let j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type === 'text') {
            nextText = tokens[j].value
            break
          }
        }
        let transformed = tokens[i].value
        transformed = transformFunction(transformed, nextText, this.options)
        tokens[i].value = transformed
      }
    }

    return tokens.map(token => token.value).join('')
  }
}

export default HTMLProcessor
export type { TransformFunction, TypesettingOptions }
