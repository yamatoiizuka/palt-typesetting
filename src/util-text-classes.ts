import * as util from './util-regex.js'

// 四分アキを入れる約物の規則: [対象の正規表現, 自身の前に入るか, 自身の後に入るか]
const thinSpaceRules: [RegExp, boolean, boolean][] = [
  [util.openingsRegex, true, false],
  [util.spaceAfterRegex, false, true],
  [util.middleDotsRegex, true, true],
]

/**
 * 文字クラス関連の処理を提供するクラスです。
 * 文章内の特定の文字や文字クラスに基づいて、
 * 分離禁則処理や四分アキの追加の判定を行います。
 */
const CharClass = {
  /**
   * セグメントが分離禁則文字で構成されているかどうかを判定します。
   * @param segment - 判定するテキストセグメント
   * @return 分離禁則文字で構成されている場合はtrue、そうでない場合はfalse
   */
  shouldNotBreak: (segment: string): boolean => {
    return util.noBreakRulesTestRegex.test(segment)
  },

  /**
   * 2つのセグメント間に四分アキを追加すべきかを判断します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 四分アキを追加すべきかどうか
   */
  shouldAddThinSpace: (current: string, next: string): boolean => {
    for (const [regex, hasSpaceBefore, hasSpaceAfter] of thinSpaceRules) {
      // 同じ文字クラスの記号が連続する場合はアキを入れない
      if (hasSpaceBefore && regex.test(next) && !regex.test(current)) {
        return true
      }

      if (hasSpaceAfter && regex.test(current) && !regex.test(next)) {
        return true
      }
    }

    return false
  },

  /**
   * セグメントの少なくとも一方に約物が含まれているかどうかを判定します。
   * @param {string} current - 現在のセグメント
   * @param {string} next - 次のセグメント
   * @return {boolean} 約物が含まれている場合はtrue、そうでない場合はfalse
   */
  includesPunctuation: (current: string, next: string): boolean => {
    return util.punctuationRegex.test(current) || util.punctuationRegex.test(next)
  },
}

/**
 * 言語クラスに関連する処理を提供するクラスです。
 * 文章内のセグメントがどの言語クラスに属するかを判定し、
 * それに応じたテキスト処理を行うためのメソッドを提供します。
 */
const LanguageClass = {
  /**
   * セグメントがラテン文字で構成されているかどうかを判定します。
   * @param segment - 判定するテキストセグメント
   * @return ラテン文字で構成されている場合はtrue、そうでない場合はfalse
   */
  isLatin: (segment: string): boolean => {
    return util.latinTestRegex.test(segment)
  },

  /**
   * セグメントが日本語文字で構成されているかどうかを判定します。
   * @param segment - 判定するテキストセグメント
   * @return 日本語文字で構成されている場合はtrue、そうでない場合はfalse
   */
  isJapanese: (segment: string): boolean => {
    return util.japaneseRegex.test(segment)
  },

  /**
   * 現在のセグメントと次のセグメントの言語が異なるかどうかを判定します。
   * この関数は、一方が日本語で他方が非日本語の場合にtrueを返します。
   * @param current - 現在のテキストセグメント
   * @param next - 次のテキストセグメント
   * @return 両セグメント間で言語が異なる場合にtrueを返す
   */
  hasLanguageTransition: (current: string, next: string): boolean => {
    return LanguageClass.isJapanese(current) !== LanguageClass.isJapanese(next)
  },

  /**
   * 2つのセグメント間に四分アキを追加すべきかを判断します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 四分アキを追加すべきかどうか
   */
  shouldAddThinSpace: (current: string, next: string): boolean => {
    return LanguageClass.hasLanguageTransition(current, next)
  },

  /**
   * UAX #14 が拾わない「ラテン・数字」と「CJK 文字／全角約物」の境界で
   * 改行を許容するかを判定します。日本語組版の慣習に合わせて、
   * 開き括弧の前・閉じ括弧や句読点の後では英数との境界で改行可能にします。
   *
   * 例: `e × 「` は true、`「 × h` は false（OP の後の禁則を尊重）。
   *
   * @param current - 現在の境界文字（1 文字）
   * @param next - 次の境界文字（1 文字）
   * @return 追加で改行可能とみなす場合は true
   */
  canBreakAcrossScripts: (current: string, next: string): boolean => {
    if (!current || !next) return false

    // 左: ラテン/数字 × 右: CJK 文字 or 全角開き括弧
    if (util.latinOrDigitRegex.test(current)) {
      return util.cjkLetterRegex.test(next) || util.openingsRegex.test(next)
    }

    // 左: CJK 文字 or 全角閉じ括弧/句読点 × 右: ラテン/数字
    return (
      (util.cjkLetterRegex.test(current) || util.spaceAfterRegex.test(current)) && util.latinOrDigitRegex.test(next)
    )
  },
}

export { CharClass, LanguageClass }
