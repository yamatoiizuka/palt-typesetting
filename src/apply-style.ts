import { isBreakable } from './insert-separators.js'
import { CharClass, LanguageClass } from './util-text-classes.js'
import { applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle, createKerning } from './util-tags.js'
import * as util from './util-regex.js'
import { TypesettingOptions } from '../types'

/**
 * 与えられたテキストに対して、word-breakとoverflow-wrapスタイルを持つspanタグでラップします。
 *
 * @param currentNodeValue - スタイリングされるテキスト。
 * @param nextNodeValue - 次のテキスト（未使用ですが、TransformFunctionに合わせたシグネチャ）。
 * @param options - TypesettingOptions
 * @return スタイリングされたテキスト。テキストが空の場合はそのまま返されます。
 */
const applyStyleToText = (currentNodeValue: string, nextNodeValue: string, options: TypesettingOptions): string => {
  if (currentNodeValue === ' ') {
    return currentNodeValue
  }
  return applyWrapperStyle(currentNodeValue, options.useWordBreak)
}

/**
 * 与えられたテキストセグメントにスタイリングを適用します。
 * セグメントがスペースの場合はそのままとし、ラテン文字や分離禁則文字に対して固有のスタイルを適用します。
 *
 * @param currentSegment - 対象のテキストセグメント
 * @param nextSegment - 次のセグメント（判定に利用）
 * @param options - TypesettingOptions
 * @return 適切なスタイリングが適用されたテキストセグメント
 */
const applyStyleToSegment = (currentSegment: string, nextSegment: string, options: TypesettingOptions): string => {
  if (currentSegment === ' ') {
    return currentSegment
  }

  // ラテン文字の場合は 'latin' クラスでラップ
  if (options.wrapLatin && LanguageClass.isLatin(currentSegment)) {
    return currentSegment.replace(util.latinRegex, match => applyLatinStyle(match))
  }

  // 改行をしないセグメントにはゼロの文字間隔スタイルを適用
  if (options.noSpaceBetweenNoBreaks && CharClass.shouldNotBreak(currentSegment)) {
    return currentSegment.replace(util.noBreakRulesRegex, match => applyNoBreaksStyle(match))
  }

  return currentSegment
}

/**
 * カーニングルールに基づき、テキストセグメントにカーニングを適用します。
 *
 * @param currentSegment - カーニング適用対象となる現在のセグメント
 * @param nextSegment - 次のセグメント（カーニング適用の判断に使用）
 * @param options - TypesettingOptions
 * @return カーニング適用後のテキストセグメント
 */
const applyKerningToSegment = (currentSegment: string, nextSegment: string, options: TypesettingOptions): string => {
  const chars = [...currentSegment]

  const kernedChars = chars.map((currentChar, i) => {
    const nextChar = chars[i + 1] || nextSegment[0] || ''
    const kerningRule = options.kerningRules?.find(
      rule => rule.between[0] === currentChar && rule.between[1] === nextChar
    )

    if (kerningRule) {
      const kerningValue = typeof kerningRule.value === 'number' ? kerningRule.value : parseInt(kerningRule.value, 10)
      const breakable = options.useWordBreak ? false : isBreakable(currentChar, nextChar)
      return currentChar + createKerning(kerningValue, breakable)
    }

    return currentChar
  })

  return kernedChars.join('')
}

/**
 * 正規表現で特殊文字をエスケープするヘルパー関数
 *
 * @param str - エスケープする文字列
 * @return エスケープされた文字列
 */
const escapeRegExp = (str: string): string => str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

/**
 * 特例文字の設定に基づき、テキストセグメント内の対象文字（連続した部分）を指定のクラスでラップします。
 *
 * @param currentSegment - 対象のセグメント
 * @param nextSegment - 次のセグメント（本処理では未使用）
 * @param options - TypesettingOptions。wrapChars の設定を含む
 * @return 特例文字のラッピングを適用したセグメント
 */
const applyStyleToChar = (currentSegment: string, nextSegment: string, options: TypesettingOptions): string => {
  // wrapChars の設定がない場合はそのまま返す
  if (!options.wrapChars || options.wrapChars.length === 0) {
    return currentSegment
  }

  let updatedSegment = currentSegment
  options.wrapChars.forEach(rule => {
    const rawChar = rule.char
    // char が1文字であることを保証する（サロゲートペアも考慮）
    if (Array.from(rawChar).length !== 1) {
      console.error(`Invalid configuration in wrapChars: '${rawChar}' is not valid. 'char' must be a single character.`)
      // 該当ルールはスキップする
      return
    }

    // label が指定されていなければ、デフォルトは rawChar を採用する
    const label = rule.label ? rule.label : rawChar

    // クラス名として使用する際に安全な文字列か判定
    // クラス名に使用できるのは、空白や " ' < > などの特殊文字を含まない文字列
    const validClassRegex = /^[^"'<>\s]+$/
    if (!validClassRegex.test(label)) {
      console.error(
        `Invalid configuration in wrapChars: '${rawChar}' is used. ` +
          `To be used as a CSS class, the 'label' property must not contain spaces, quotes, '<' or '>'. ` +
          `Skipping this wrapping rule.`
      )
      return
    }

    // 有効な場合、クラス名を生成する（例: typesetting-char-あ など）
    const className = `typesetting-char-${label}`
    const escapedChar = escapeRegExp(rawChar)

    // 連続する該当文字をラッピングする正規表現を作成
    const regex = new RegExp(`(${escapedChar}+)`, 'gu')
    updatedSegment = updatedSegment.replace(regex, match => `<span class="${className}">${match}</span>`)
  })

  return updatedSegment
}

export { applyStyleToText, applyStyleToSegment, applyKerningToSegment, applyStyleToChar }
