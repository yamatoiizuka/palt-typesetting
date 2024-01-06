import HTMLProcessor from './html-processor'
import insertSeparatorsToText from './insert-separators'
import { applyStyleToText, applyStyleToSegment } from './apply-style'
import type { TypeSetttingOptions } from './types'

/**
 * HTMLテキストを処理し、カスタムスタイルと区切り文字を適用するためのクラス。
 * HTMLProcessor クラスを拡張し、特定の変換関数を適用します。
 */
class TypeSet extends HTMLProcessor {
  constructor(options: Partial<TypeSetttingOptions> = {}) {
    const transformFunctions = [applyStyleToText, insertSeparatorsToText, applyStyleToSegment]
    super(transformFunctions, options)
  }

  /**
   * 現在の実行環境で Intl.Segmenter がサポートされているかどうかを確認します。
   * Intl.Segmenter は、テキストを言語固有のセグメントに分割する機能を提供します。
   * サポートされていない場合は警告をコンソールに表示します。
   *
   * @return Intl.Segmenter がサポートされている場合は true、そうでない場合は false を返します。
   */
  private isIntlSegmenterSupported(): boolean {
    const isSupported = typeof Intl.Segmenter !== 'undefined'

    if (!isSupported) {
      console.warn(`
        Intl.Segmenter is not supported in this environment. 
        The original HTML string will be returned. 
        For more information, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter
        `)
    }

    return isSupported
  }

  /**
   * 与えられたHTML文字列を処理し、指定されたスタイルと区切り文字を適用した結果を返します。
   *
   * @param srcHtml - 処理するHTML文字列。
   * @return 処理後のHTML文字列。
   */
  render(srcHtml: string): string {
    if (!this.isIntlSegmenterSupported()) {
      return srcHtml
    }

    return this.processHtmlWithFunctions(srcHtml)
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
