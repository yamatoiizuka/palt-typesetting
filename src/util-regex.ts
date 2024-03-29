/**
 * ラテン文字、数字、基本的な記号類
 */
export const latinRegex =
  /[\p{scx=Latin}0-9⁰¹²³⁴-⁾₀-₎¢¤$€£¥+−×÷=≠><≥≤±≈~¬∅∞∫∏∑√∂%‰@&.,:;!¡?¿'"‘’“”\-(){}[\]|/\\^_`*#\s]+/gu

/**
 * 日本語
 */
export const japaneseRegex = /[\p{scx=Hiragana}\p{scx=Katakana}|ｦ-ﾟ\p{scx=Han}]+/u

/**
 * 初め括弧類
 */
export const openingsRegex = /（|［|｛|〔|〈|《|「|『|【|〘|〖|“|‘/

/**
 * 終わり括弧類
 */
export const closingsRegex = /）|］|｝|〕|〉|》|」|』|】|〙|〗|”|’/

/**
 * 中点類
 */
export const middleDotsRegex = /・|：|；/

/**
 * 読点類
 */
export const commasRegex = /、|，/

/**
 * 句点類
 */
export const periodsRegex = /。|．/

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
