// 約物の文字集合。単独の文字クラスとしても、他の文字クラスへの埋め込みにも使う。
const OPENINGS = '（［｛〔〈《「『【〘〖“‘'
const CLOSINGS = '）］｝〕〉》」』】〙〗”’'
const MIDDLE_DOTS = '・：；'
const COMMAS = '、，'
const PERIODS = '。．'

/**
 * ラテン文字、数字、基本的な記号類
 */
export const latinRegex =
  /[\p{scx=Latin}0-9⁰¹²³⁴-⁾₀-₎¢¤$€£¥+−×÷=≠><≥≤±≈~¬∅∞∫∏∑√∂%‰@&.,:;!¡?¿'"‘’“”\-(){}[\]|/\\^_`*#\s]+/gu

/**
 * ラテン文字の判定用（latinRegex の非 global 版）
 */
export const latinTestRegex = new RegExp(latinRegex.source, 'u')

/**
 * 全角初め括弧類
 */
export const openingsRegex = new RegExp(`[${OPENINGS}]`)

/**
 * 全角終わり括弧類
 */
export const closingsRegex = new RegExp(`[${CLOSINGS}]`)

/**
 * 全角中点類
 */
export const middleDotsRegex = new RegExp(`[${MIDDLE_DOTS}]`)

/**
 * 全角読点類
 */
export const commasRegex = new RegExp(`[${COMMAS}]`)

/**
 * 全角句点類
 */
export const periodsRegex = new RegExp(`[${PERIODS}]`)

/**
 * 全角終わり括弧類・読点類・句点類（後ろに四分アキが入る約物）
 */
export const spaceAfterRegex = new RegExp(`[${CLOSINGS}${COMMAS}${PERIODS}]`)

/**
 * 日本語（各種約物を含む）
 */
export const japaneseRegex = new RegExp(
  `[\\p{scx=Hiragana}\\p{scx=Katakana}ｦ-ﾟ\\p{scx=Han}${OPENINGS}${CLOSINGS}${MIDDLE_DOTS}${COMMAS}${PERIODS}]`,
  'u'
)

/**
 * 約物（ラテン文字の読点・句点と、全角の約物）
 */
export const punctuationRegex = new RegExp(`[,.${OPENINGS}${CLOSINGS}${MIDDLE_DOTS}${COMMAS}${PERIODS}]`)

/**
 * 分離禁則文字
 */
export const noBreakRulesRegex = /[—‥…＿─-╿]+/g

/**
 * 分離禁則文字の判定用（noBreakRulesRegex の非 global 版）
 */
export const noBreakRulesTestRegex = new RegExp(noBreakRulesRegex.source)

/**
 * 空白文字、制御文字
 */
export const whitespaceRegex = /\s/

/**
 * 空白文字、制御文字だけで構成されている
 */
export const whitespaceOnlyRegex = /^\s*$/

/**
 * ラテン文字（Script）または数字。句読点や約物を巻き込まないよう Script Extensions ではなく Script で判定する。
 */
export const latinOrDigitRegex = /[\p{sc=Latin}0-9]/u

/**
 * ひらがな・カタカナ・漢字（Script）
 */
export const cjkLetterRegex = /[\p{sc=Hiragana}\p{sc=Katakana}\p{sc=Han}]/u
