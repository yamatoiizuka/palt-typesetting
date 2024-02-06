/**
 * ユーザーインターフェースのアクセシビリティと検索エンジンの最適化に関連する設定を定義します。
 * - preventSelect: ユーザーがテキストを選択してコピーすることを防止します。
 * - hiddenFromReader: スクリーンリーダーなどのアクセシビリティツールからこの要素を隠します。
 * - noIndex: 検索エンジンがこの要素の内容を検索結果のスニペットとして表示しないようにします。
 */
const uiIgnoreSettings = {
  styles: {
    preventSelect: 'user-select:none;',
  },
  attributes: {
    hiddenFromReader: 'aria-hidden="true"',
    noIndex: 'data-nosnippet=""',
  },
}

/**
 * `<wbr>`タグはHTML文書内で単語の区切りを示し、必要に応じて改行の挿入を許可するタグです。
 */
const wbr = '<wbr>'

/**
 * THIN SPACEを指定した幅で生成する関数です。
 * @param thisSpaceWidth - THIN SPACEの幅。
 * @return スタイル適用されたTHIN SPACEを含むspanタグ。
 */
const createThinSpace = (thisSpaceWidth: string): string => {
  const THIN_SPACE = String.fromCharCode(0x2009) // U+2009 THIN SPACE
  const className = 'typeset-thin-space'
  const style = `font-size: ${thisSpaceWidth}; letter-spacing: 0; line-height: 0; ${uiIgnoreSettings.styles.preventSelect}`
  return `<span class="${className}" style="${style}" ${uiIgnoreSettings.attributes.hiddenFromReader} ${uiIgnoreSettings.attributes.noIndex}>${THIN_SPACE}</span>`
}

/**
 * 指定した数値でカーニング（文字間隔調整）タグを生成する関数です。
 *
 * @param kerningValue - カーニング値（千分率）。例: 1000 は 1em のカーニングを意味します。
 * @return カーニング適用後のHTMLコンテンツ。
 */
const createKerning = (kerningValue: number): string => {
  const emValue = kerningValue / 1000 / 2 + 'em'
  const className = 'typeset-kerning'
  const style = `margin: ${emValue}; ${uiIgnoreSettings.styles.preventSelect}`
  return `<span class="${className}" style="${style}" ${uiIgnoreSettings.attributes.hiddenFromReader} ${uiIgnoreSettings.attributes.noIndex}></span>`
}

/**
 * 与えられたテキストに typeset クラスを適用します。
 * @param text - スタイルを適用するテキスト。
 * @param useWordBreak - 単語や助詞など、単語区切りでの改行を行うかどうか。デフォルトは true。
 * @return スタイル適用されたテキストを含むspanタグ。
 */
const applyWrapperStyle = (text: string, useWordBreak: boolean): string => {
  // <wbr> 以外の箇所で改行しないためのスタイリング
  const className = 'typeset'
  const style = useWordBreak ? 'word-break: keep-all; overflow-wrap: anywhere;' : ''
  return `<span class="${className}" style="${style}">${text}</span>`
}

/**
 * 与えられたセグメントに latin クラスを適用します。
 * @param segment - クラスを適用するセグメント。
 * @return クラス適用されたセグメントを含むspanタグ。
 */
const applyLatinStyle = (segment: string): string => {
  const className = 'typeset-latin'
  return `<span class="${className}">${segment}</span>`
}

/**
 * 与えられたセグメントに no-breaks クラスを適用します。
 * @param segment - スタイルを適用するセグメント。
 * @return スタイル適用されたセグメントを含むspanタグ。
 */
const applyNoBreakStyle = (segment: string): string => {
  const className = 'typeset-no-breaks'
  return `<span class="${className}" style="letter-spacing: 0">${segment}</span>`
}

export { wbr, createThinSpace, createKerning, applyWrapperStyle, applyLatinStyle, applyNoBreakStyle }
