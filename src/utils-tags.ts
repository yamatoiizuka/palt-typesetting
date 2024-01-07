const classnamePrefix = 'typeset'
const uiIgnore = 'user-select:none;" aria-hidden="true" data-nosnippet=""'

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
  const classname: string = classnamePrefix + '-thin-space'
  return `<span class="${classname}" style="font-size: ${width}; ${uiIgnore}>${THIN_SPACE}</span>`
}

/**
 * 指定された文字にカーニング（文字間隔調整）を適用します。
 *
 * @param char - カーニングを適用する文字。
 * @param value - カーニング値（千分率）。例: 1000 は 1em のカーニングを意味します。
 * @return カーニング適用後のHTMLコンテンツ。
 */
const applyKerning = (char: string, value: number) => {
  const emValue = value / 1000 / 2 + 'em'
  const classname: string = classnamePrefix + '-kerning'
  return `${char}<span class="${classname}" style="margin: ${emValue}; ${uiIgnore}></span>`
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

export { wbr, thinSpace, applyKerning, applyWbrStyle, applyLatinClass, applyNoBreakStyle }
