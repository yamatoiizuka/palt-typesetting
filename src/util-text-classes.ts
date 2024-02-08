import * as utils from './util-regex'

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
    return utils.noBreakRulesRegex.test(segment)
  },

  /**
   * 2つのセグメント間に四分アキを追加すべきかを判断します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 四分アキを追加すべきかどうか
   */
  shouldAddThinSpace: (current: string, next: string): boolean => {
    const spaceAfterRegex = new RegExp(
      `(${utils.closingsRegex.source}|${utils.commasRegex.source}|${utils.periodsRegex.source})`
    )

    const settings = {
      spaceBefore: {
        regex: utils.openingsRegex,
        hasSpaceBefore: true,
        hasSpaceAfter: false,
      },
      spaceAfter: {
        regex: spaceAfterRegex,
        hasSpaceBefore: false,
        hasSpaceAfter: true,
      },
      spaceBoth: {
        regex: utils.middleDotsRegex,
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
    return utils.latinRegex.test(segment)
  },

  /**
   * セグメントが日本語文字で構成されているかどうかを判定します。
   * @param segment - 判定するテキストセグメント
   * @return 日本語文字で構成されている場合はtrue、そうでない場合はfalse
   */
  isJapanese: (segment: string): boolean => {
    return utils.japaneseRegex.test(segment)
  },

  /**
   * 2つのセグメントが異なる言語で構成されているかどうかを判定します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 2つのセグメントが異なる言語がどうか
   */
  isDifferentLanguageClass: (current: string, next: string): boolean => {
    return (
      (LanguageClass.isJapanese(current) && LanguageClass.isLatin(next)) ||
      (LanguageClass.isLatin(current) && LanguageClass.isJapanese(next))
    )
  },

  /**
   * 2つのセグメント間に四分アキを追加すべきかを判断します。
   * @param current - 現在のセグメント
   * @param next - 次のセグメント
   * @return 四分アキを追加すべきかどうか
   */
  shouldAddThinSpace: (current: string, next: string): boolean => {
    return LanguageClass.isDifferentLanguageClass(current, next)
  },
}

export { CharClass, LanguageClass }
