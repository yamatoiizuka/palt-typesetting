import LineBreaker from 'linebreak'
import { CharClass, LanguageClass } from './utils-text-classes'
import { createWbr, createThinSpace } from './utils-tags'
import { TypesettingOptions } from './types'

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

/**
 * 文章から文節区切りのセグメントの配列を生成します。
 * @param src - ソーステキスト
 * @return 文章から生成されたセグメントの配列
 */
const createSegments = (src: string): string[] => {
  const segmenter = new Intl.Segmenter('ja-JP', { granularity: 'word' })
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

  const breakable = options.useWordBreak && isBreakable(current, next)
  const addThinSpace = options.insertThinSpaces && shouldAddThinSpace(current, next)

  if (addThinSpace) {
    return current + createThinSpace(options.thinSpaceWidth, breakable)
  } else {
    return current + (breakable ? createWbr() : '')
  }
}

/**
 * 2つのセグメント間に四分アキを追加すべきかを判断します。
 * @param current - 現在のセグメント
 * @param next - 次のセグメント
 * @return 四分アキを追加すべきかどうか
 */
const shouldAddThinSpace = (current: string, next: string): boolean => {
  return LanguageClass.shouldAddThinSpace(current, next) || CharClass.shouldAddThinSpace(current, next)
}

/**
 * 2つのセグメント間で改行可能かを判定します。
 * @param current - 現在のセグメント
 * @param next - 次のセグメント
 * @return 改行可能かどうか
 */
const isBreakable = (current: string, next: string): boolean => {
  const combinedText = current.slice(-1) + next.slice(0, 1)
  const lb = new LineBreaker(combinedText)
  const breakOpportunity = lb.nextBreak()
  return breakOpportunity ? breakOpportunity.position === 1 : false
}

export default insertSeparatorsToText
export { createSegments, addSeparatorsToSegment, shouldAddThinSpace, isBreakable }
