import { CharClass, LanguageClass } from './util-text-classes.js'
import { createWbr, createThinSpace } from './util-tags.js'
import { TypesettingOptions } from '../types'
import { middleDotsRegex, whitespaceRegex } from './util-regex.js'
import { canBreakBetween } from './line-break.js'

/**
 * HTMLテキストノードにセパレーター（四分アキ、<wbr>）を挿入します。
 * @param currentText - 現在のテキストノード
 * @param nextText - 次のテキストノード
 * @return セパレーターを挿入したHTML文字列
 */
const insertSeparatorsToText = (currentText: string, nextText: string, options: TypesettingOptions): string => {
  const currentSegments = createSegments(currentText)
  const nextSegments = createSegments(nextText)

  const formattedText = currentSegments.reduce((accumulatedText, segment, index, array) => {
    const current = segment
    const next = array[index + 1] || nextSegments[0]
    return accumulatedText + addSeparatorsToSegment(current, next, options)
  }, '')

  return formattedText
}

let segmenter: Intl.Segmenter | undefined

/**
 * 文章から文節区切りのセグメントの配列を生成します。
 * @param src - ソーステキスト
 * @return 文章から生成されたセグメントの配列
 */
const createSegments = (src: string): string[] => {
  // Intl.Segmenter がない環境では呼ばれないため、初回の呼び出し時に生成して使い回す。
  segmenter ??= new Intl.Segmenter('ja-JP', { granularity: 'word' })
  return Array.from(segmenter.segment(src), ({ segment }) => segment)
}

/**
 * 2つのセグメント間にセパレーター（四分アキ、<wbr>）を追加します。
 * @param current - 現在のセグメント
 * @param next - 次のセグメント
 * @return セパレーターを追加したセグメント
 */
const addSeparatorsToSegment = (current: string, next = '', options: TypesettingOptions): string => {
  if (!next) return current

  const addThinSpace = options.insertThinSpaces && shouldAddThinSpace(current, next)
  const breakable = isBreakable(current, next)

  if (addThinSpace) {
    // セグメントの片方が中点類の場合、四分アキの幅を 1/2 にする
    const hasMiddleDots = middleDotsRegex.test(current) || middleDotsRegex.test(next)
    const thinSpaceWidth = hasMiddleDots ? `calc(${options.thinSpaceWidth} / 2.0)` : options.thinSpaceWidth ?? ''
    return current + createThinSpace(thinSpaceWidth, breakable)
  }

  if (options.useWordBreak && breakable) {
    return current + createWbr()
  }

  return current
}

/**
 * 2つのセグメント間に四分アキを追加すべきかを判断します。
 * @param current - 現在のセグメント
 * @param next - 次のセグメント
 * @return 四分アキを追加すべきかどうか
 */
const shouldAddThinSpace = (current: string, next: string): boolean => {
  // 片方のセグメントが空白文字、制御文字であれば四分アキを追加しない
  if (whitespaceRegex.test(current) || whitespaceRegex.test(next)) return false

  return CharClass.includesPunctuation(current, next)
    ? CharClass.shouldAddThinSpace(current, next)
    : LanguageClass.shouldAddThinSpace(current, next)
}

/**
 * 2つのセグメント間で改行可能かを判定します。
 * @param current - 現在のセグメント
 * @param next - 次のセグメント
 * @return 改行可能かどうか
 */
const isBreakable = (current: string, next: string): boolean => {
  // 各セグメントの端 1 文字だけを取り出して判定する。従来 linebreak に 2 文字だけを渡していた挙動との互換用で、
  // UAX #14 の完全な判定ではない（LB30a のように、より前の文字に依存する規則は考慮しない）。
  // Array.from を使うのは、emoji やサロゲートペアを slice(-1) / [0] で壊さないため。
  const currentChar = Array.from(current).at(-1) ?? ''
  const nextChar = Array.from(next)[0] ?? ''

  if (!currentChar || !nextChar) return false
  // 次が空白なら <wbr> を足しても意味が薄く、既存の空白処理と競合しやすいのでここで止める。
  if (whitespaceRegex.test(nextChar)) return false

  if (canBreakBetween(currentChar, nextChar)) return true

  // UAX #14 はブラウザ実装ほど CJK ↔ Latin 境界に寛容ではないため、
  // Blink 相当の Tailoring を後段で適用する。
  return LanguageClass.canBreakAcrossScripts(currentChar, nextChar)
}

export default insertSeparatorsToText
export { createSegments, addSeparatorsToSegment, shouldAddThinSpace, isBreakable }
