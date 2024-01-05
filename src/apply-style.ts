import { CharClass, LanguageClass } from './utils-text-classes'
import { applyWbrStyle, applyLatinClass, applyNoBreakStyle } from './utils-tags'
import { TypeSetttingOptions } from './types'

/**
 * 与えられたテキストに対して、word-breakとoverflow-wrapスタイルを持つspanタグでラップします。
 *
 * @param text - スタイリングされるテキスト。
 * @return スタイリングされたテキスト。テキストが空の場合は、そのまま返されます。
 */
const applyStyleToText = (currentNodeValue: string, nextNodeValue: string, options: TypeSetttingOptions): string => {
  // ここでは nextNodeValue を使用していませんが、関数のシグネチャはTransformFunctionに合わせています。
  if (!options.addWbrToHtml || currentNodeValue === ' ') {
    return currentNodeValue
  }

  return applyWbrStyle(currentNodeValue)
}

/**
 * 与えられたテキストセグメントにスタイリングを適用します。これには、セグメントの内容に基づいて、
 * 特定のクラスまたはスタイルでHTMLのspanタグでセグメントをラップすることが含まれる場合があります。
 *
 * @param segment - スタイリングされるテキストセグメント。
 * @return スタイリングされたテキストセグメント。セグメントがスペースであるか、特別なスタイリングが不要であれば、
 *     そのまま返されます。それ以外の場合は、適切なスタイリングでspanタグでラップされます。
 */
const applyStyleToSegment = (segment: string): string => {
  // セグメントがスペースであればそのまま返す
  if (segment === ' ') {
    return segment
  }

  // ラテン文字のセグメントには 'latin' クラスを適用
  if (LanguageClass.isLatin(segment)) {
    return applyLatinClass(segment)
  }

  // 改行をしないセグメントにはゼロの文字間隔スタイルを適用
  if (CharClass.shouldNotBreak(segment)) {
    return applyNoBreakStyle(segment)
  }

  // 特にスタイリングが必要ない場合は、セグメントを変更せずに返す
  return segment
}

export { applyStyleToText, applyStyleToSegment }
