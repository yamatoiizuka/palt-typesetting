/**
 * ラテン文字、数字、基本的な記号類
 */
export const latinRegex = /[A-Za-z0-9!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/

/**
 * 日本語
 */
export const japaneseRegex = /[\p{scx=Hiragana}\p{scx=Katakana}|ｦ-ﾟ\p{scx=Han}]+/u

/**
 * 初め括弧類
 */
export const openingsRegex = /（|［|｛|〔|〈|《|「|『|【|〘|〖|“|‘/

/**
 * 終わり括弧類、句点類、読点類
 */
export const closingsRegex = /）|］|｝|〕|〉|》|」|』|】|〙|〗|”|’|、|，|。|．/

/**
 * 中点類
 */
export const middleDotsRegex = /・|：|；/

/**
 * 分離禁則文字
 */
export const noBreakRulesRegex = new RegExp(
  `[${'—‥…＿'}${String.fromCharCode(0x2500)}-${String.fromCharCode(0x257f)}]+`
)
