import HTMLProcessor from './html-processor'
import insertSeparatorsToText from './insert-separators'
import { applyStyleToText, applyStyleToSegment } from './apply-style'
import win from './win'
import type { TypeSetttingOptions } from './types'

/**
 * HTMLテキストを処理し、カスタムスタイルと区切り文字を適用するためのクラス。
 * HTMLProcessor クラスを拡張し、特定の変換関数を適用します。
 */
class TypeSet extends HTMLProcessor {
  private isSupported: boolean

  constructor(options: Partial<TypeSetttingOptions> = {}) {
    const transformFunctions = [applyStyleToText, insertSeparatorsToText, applyStyleToSegment]
    super(transformFunctions, options)

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
  renderFromElements(elements: Element | Element[] | null): void {
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
  renderFromSelector(selector: string | null): void {
    if (!this.isSupported || !selector) {
      return
    }

    const elements = win.document.querySelectorAll(selector)
    this.renderFromElements(Array.from(elements))
  }
}

/**
 * 与えられたHTML文字列に区切り文字を挿入し、スタイルを適用します。
 *
 * @param srcHtml - 処理する元のHTML文字列。
 * @return 区切り文字が挿入され、スタイルが適用されたHTML文字列。
 */
const createTypeSetting = (srcHtml: string, options: Partial<TypeSetttingOptions> = {}): string => {
  const typeset = new TypeSet(options)
  return typeset.render(srcHtml)
}

export { TypeSet, createTypeSetting }