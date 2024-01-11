import HTMLProcessor from './html-processor'
import insertSeparatorsToText from './insert-separators'
import { applyStyleToText, applyStyleToSegment } from './apply-style'
import win from './win'
import type { TypesettingOptions, KerningRule } from './types'

/**
 * HTMLテキストを処理し、カスタムスタイルと区切り文字を適用するためのクラス。
 * HTMLProcessor クラスを拡張し、特定の変換関数を適用します。
 */
class Typesetter extends HTMLProcessor {
  /**
   * Typesetter のデフォルトの設定です。
   */
  static defaultOptions: TypesettingOptions = {
    classNamePrefix: 'typeset',
    useWordBreak: true,
    wrapLatin: true,
    noSpaceBetweenNoBreaks: true,
    insertThinSpaces: true,
    thinSpaceWidth: '50%',
    kerningRules: [],
  }

  /**
   * Intl.Segmenter API が現在の実行環境でサポートされているかどうかを示します。
   */
  private isIntlSegmenterSupported: boolean

  constructor(options: Partial<TypesettingOptions> = {}) {
    const transformFunctions = [applyStyleToText, insertSeparatorsToText, applyStyleToSegment]
    const validatedOptions = Typesetter.validateOptions(options)

    super(transformFunctions, validatedOptions)

    /**
     * 現在の実行環境で Intl.Segmenter がサポートされているかどうかを確認します。
     * Intl.Segmenter は、テキストを言語固有のセグメントに分割する機能を提供します。
     * サポートされていない場合は警告をコンソールに表示します。
     */
    this.isIntlSegmenterSupported = typeof Intl.Segmenter !== 'undefined'
    if (!this.isIntlSegmenterSupported) {
      console.warn(`
        Intl.Segmenter is not supported in this environment. 
        The original HTML string will be returned. 
        For more information, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
        `)
    }
  }

  /**
   * 与えられたオプションを検証し、修正されたオプションを返します。
   *
   * @param options - 検証するオプション。
   * @return 修正されたオプション。
   */
  private static validateOptions(options: Partial<TypesettingOptions>): TypesettingOptions {
    if (options.kerningRules) {
      options.kerningRules = options.kerningRules.filter(Typesetter.isValidKerningRule)
    }

    // デフォルトのオプションとマージ
    return {
      ...Typesetter.defaultOptions,
      ...options,
    }
  }

  /**
   * カーニングルールが適切かどうかを検証します。
   *
   * @param kerningRule - 検証するカーニングルール。
   * @return ルールが有効な場合はtrue、そうでない場合はfalse。
   */
  private static isValidKerningRule(kerningRule: KerningRule): boolean {
    if (kerningRule.between[0].length !== 1 || kerningRule.between[1].length !== 1) {
      console.warn(
        `Kerning rule between '${kerningRule.between[0]}' and '${kerningRule.between[1]}' must be single characters.`
      )
      return false
    }

    return true
  }

  /**
   * 与えられたHTML文字列を処理し、指定されたスタイルと区切り文字を適用した結果を返します。
   *
   * @param srcHtml - 処理するHTML文字列。
   * @return 処理後のHTML文字列。
   */
  render(srcHtml: string): string {
    if (!this.isIntlSegmenterSupported || !srcHtml) {
      return srcHtml
    }

    return this.processHtmlWithFunctions(srcHtml)
  }

  /**
   * 与えられたElementまたはElementの配列に対して、スタイルと区切り文字を適用します。
   * 各要素のinnerHTMLを取得し、変換処理を適用した後、変換されたHTMLで元の内容を置き換えます。
   *
   * @param elements - スタイルを適用するElementまたはHTMLElementの配列。
   */
  renderToElements(elements: Element | Element[] | null): void {
    if (!this.isIntlSegmenterSupported || !elements) {
      return
    }

    if (!Array.isArray(elements)) {
      elements = [elements]
    }

    elements.forEach(element => {
      const processedHtml = this.render(element.innerHTML)
      element.innerHTML = processedHtml
    })
  }

  /**
   * 指定されたCSSセレクタに一致するすべての要素にスタイルを適用します。
   * document.querySelectorAllを使用して要素を取得し、それぞれに対してスタイル適用処理を行います。
   *
   * @param selector - スタイルを適用する要素を選択するCSSセレクタ。
   */
  renderToSelector(selector: string | null): void {
    if (!this.isIntlSegmenterSupported || !selector) {
      return
    }

    const elements = win.document.querySelectorAll(selector)
    this.renderToElements(Array.from(elements))
  }
}

module.exports = Typesetter
