import * as util from './util-regex'

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
    return util.noBreakRulesRegex.test(segment)
  },

  /**
   * 2つのセグメント間に四分アキを追加すべきかを判断します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 四分アキを追加すべきかどうか
   */
  shouldAddThinSpace: (current: string, next: string): boolean => {
    const spaceAfterRegex = new RegExp(
      `(${util.closingsRegex.source}|${util.commasRegex.source}|${util.periodsRegex.source})`
    )

    const settings = {
      spaceBefore: {
        regex: util.openingsRegex,
        hasSpaceBefore: true,
        hasSpaceAfter: false,
      },
      spaceAfter: {
        regex: spaceAfterRegex,
        hasSpaceBefore: false,
        hasSpaceAfter: true,
      },
      spaceBoth: {
        regex: util.middleDotsRegex,
        hasSpaceBefore: true,
        hasSpaceAfter: true,
      },
    }

    for (const { regex, hasSpaceBefore, hasSpaceAfter } of Object.values(settings)) {
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
   * 与えられた文字列の最初の文字が句読点に一致するかどうか判断します。
   * @param {string} segment - 判断対象の文字列
   * @return {boolean} 最初の文字が句読点であればtrueを返します。
   */
  startsWithPunctuation: (segment: string): boolean => {
    // periodsRegexとcommasRegexを組み合わせて一つの正規表現を作成
    const combinedRegex = new RegExp(`^[${util.periodsRegex.source}${util.commasRegex.source}]`)
    return combinedRegex.test(segment)
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
    return util.latinRegex.test(segment)
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
    return LanguageClass.hasLanguageTransition(current, next) && !CharClass.startsWithPunctuation(next)
  },
}

export { CharClass, LanguageClass }
