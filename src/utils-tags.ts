const classnamePrefix = 'typeset'

/**
 * `<wbr>`タグはHTML文書内で単語の区切りを示し、必要に応じて改行の挿入を許可するタグです。
 */
const wbr = '<wbr>'

/**
 * THIN SPACEを指定した幅で生成する関数です。
 * @param width - THIN SPACEの幅。
 * @return スタイル適用されたTHIN SPACEを含むspanタグ。
 */
const thinSpace = (width: string) => {
  const THIN_SPACE = String.fromCharCode(0x2009) // U+2009 THIN SPACE
  return `<span style="font-size: ${width}; user-select:none;" aria-hidden="true" data-nosnippet="">${THIN_SPACE}</span>`
}

/**
 * 与えられたテキストにword-breakとoverflow-wrapスタイルを適用します。
 * @param text - スタイルを適用するテキスト。
 * @return スタイル適用されたテキストを含むspanタグ。
 */
const applyWbrStyle = (text: string) => {
  return `<span style="word-break: keep-all; overflow-wrap: anywhere;">${text}</span>`
}

/**
 * 与えられたセグメントにクラス名を適用します。
 * @param segment - クラスを適用するセグメント。
 * @param classname - 適用するクラス名。デフォルトは 'typeset-latin'。
 * @return クラス適用されたセグメントを含むspanタグ。
 */
const applyLatinClass = (segment: string) => {
  const classname: string = classnamePrefix + '-latin'
  return `<span class="${classname}">${segment}</span>`
}

/**
 * 与えられたセグメントにno-breakスタイルを適用します。
 * @param segment - スタイルを適用するセグメント。
 * @param classname - 適用するクラス名。デフォルトは 'typeset-no-breaks'。
 * @return スタイル適用されたセグメントを含むspanタグ。
 */
const applyNoBreakStyle = (segment: string) => {
  const classname: string = classnamePrefix + '-no-breaks'
  return `<span class="${classname}" style="letter-spacing: 0">${segment}</span>`
}

export { wbr, thinSpace, applyWbrStyle, applyLatinClass, applyNoBreakStyle }
