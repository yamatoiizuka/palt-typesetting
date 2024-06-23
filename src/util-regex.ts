/**
 * ラテン文字、数字、基本的な記号類
 */
export const latinRegex =
  /[\p{scx=Latin}0-9⁰¹²³⁴-⁾₀-₎¢¤$€£¥+−×÷=≠><≥≤±≈~¬∅∞∫∏∑√∂%‰@&.,:;!¡?¿'"‘’“”\-(){}[\]|/\\^_`*#\s]+/gu

/**
 * 読点類（ラテン文字）
 */
export const latinCommaRegex = /,/

/**
 * 句点類（ラテン文字）
 */
export const latinPeriodRegex = /\./

/**
 * 全角初め括弧類
 */
export const openingsRegex = /（|［|｛|〔|〈|《|「|『|【|〘|〖|“|‘/

/**
 * 全角終わり括弧類
 */
export const closingsRegex = /）|］|｝|〕|〉|》|」|』|】|〙|〗|”|’/

/**
 * 全角中点類
 */
export const middleDotsRegex = /・|：|；/

/**
 * 全角読点類
 */
export const commasRegex = /、|，/

/**
 * 全角句点類
 */
export const periodsRegex = /。|．/

/**
 * 日本語（各種約物を含む）
 */
export const japaneseRegex = new RegExp(
  `[\\p{scx=Hiragana}\\p{scx=Katakana}|ｦ-ﾟ\\p{scx=Han}${openingsRegex.source}${closingsRegex.source}${middleDotsRegex.source}${commasRegex.source}${periodsRegex.source}]+`,
  'u'
)

/**
 * 分離禁則文字
 */
export const noBreakRulesRegex = new RegExp(
  `[${'—‥…＿'}${String.fromCharCode(0x2500)}-${String.fromCharCode(0x257f)}]+`,
  'g'
)

/**
 * 空白文字、制御文字
 */
export const whitespaceRegex = /[\s\u00A0]/

/**
 * 約物を合成
 */
export const punctuationRegex = new RegExp(
  `${latinCommaRegex.source}|${latinPeriodRegex.source}|${openingsRegex.source}|${closingsRegex.source}|${middleDotsRegex.source}|${commasRegex.source}|${periodsRegex.source}`,
  'u'
)
