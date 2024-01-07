import { CharClass, LanguageClass } from './utils-text-classes'
import { applyWbrStyle, applyLatinClass, applyNoBreakStyle, applyKerning } from './utils-tags'
import { TypeSetttingOptions, KerningRule } from './types'

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
const applyStyleToSegment = (currentSegment: string, nextSegment: string, options: TypeSetttingOptions): string => {
  // セグメントがスペースであればそのまま返す
  if (currentSegment === ' ') {
    return currentSegment
  }

  const kernedSegment = applyKerningToSegment(currentSegment, nextSegment, options.kerning)

  // ラテン文字のセグメントには 'latin' クラスを適用
  if (LanguageClass.isLatin(currentSegment)) {
    return applyLatinClass(kernedSegment)
  }

  // 改行をしないセグメントにはゼロの文字間隔スタイルを適用
  if (CharClass.shouldNotBreak(currentSegment)) {
    return applyNoBreakStyle(kernedSegment)
  }

  return kernedSegment
}

/**
 * カーニングルールに基づき、テキストセグメントにカーニングを適用します。
 *
 * @param currentSegment - カーニングを適用する現在のセグメント。
 * @param nextSegment - 次のセグメント（カーニング適用の判断に使用）。
 * @param kerningRules - 適用するカーニングルールの配列。
 * @return カーニング適用後のテキストセグメント。
 */
const applyKerningToSegment = (currentSegment: string, nextSegment: string, kerningRules: KerningRule[]): string => {
  const chars = [...currentSegment]

  const kernedChars = chars.map((currentChar, i) => {
    const nextChar = chars[i + 1] || nextSegment[0] || ''
    const kerningRule = kerningRules.find(rule => rule.between[0] === currentChar && rule.between[1] === nextChar)

    if (kerningRule) {
      const kerningValue = typeof kerningRule.value === 'number' ? kerningRule.value : parseInt(kerningRule.value, 10)
      return applyKerning(currentChar, kerningValue)
    }

    return currentChar
  })

  return kernedChars.join('')
}

export { applyStyleToText, applyStyleToSegment }
