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
  private isSupported: boolean

  constructor(options: Partial<TypesettingOptions> = {}) {
    const validatedOptions = Typesetter.validateOptions(options)
    const transformFunctions = [applyStyleToText, insertSeparatorsToText, applyStyleToSegment]

    super(transformFunctions, validatedOptions)

    /**
     * 現在の実行環境で Intl.Segmenter がサポートされているかどうかを確認します。
     * Intl.Segmenter は、テキストを言語固有のセグメントに分割する機能を提供します。
     * サポートされていない場合は警告をコンソールに表示します。
     */
    this.isSupported = typeof Intl.Segmenter !== 'undefined'
    if (!this.isSupported) {
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
    if (options.kerning) {
      options.kerning = options.kerning.filter(Typesetter.isValidKerningRule)
    }

    // デフォルトのオプションとマージ
    return {
      useWordBreak: true,
      addThinSpaces: true,
      thinSpaceWidth: '50%',
      kerning: [],
      ...options,
    }
  }

  /**
   * カーニングルールが適切かどうかを検証します。
   *
   * @param rule - 検証するカーニングルール。
   * @return ルールが有効な場合はtrue、そうでない場合はfalse。
   */
  private static isValidKerningRule(rule: KerningRule): boolean {
    if (rule.between[0].length !== 1 || rule.between[1].length !== 1) {
      console.warn(`Kerning rule between '${rule.between[0]}' and '${rule.between[1]}' must be single characters.`)
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
    if (!this.isSupported || !srcHtml) {
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
    if (!this.isSupported || !elements) {
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
    if (!this.isSupported || !selector) {
      return
    }

    const elements = win.document.querySelectorAll(selector)
    this.renderToElements(Array.from(elements))
  }
}

export default Typesetter
