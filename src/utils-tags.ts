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
 * @param classNamePrefix - 適用するCSSクラス名のプレフィックス。デフォルトは 'typeset'。
 * @return スタイル適用されたTHIN SPACEを含むspanタグ。
 */
const thinSpace = (thisSpaceWidth: string, classNamePrefix: string): string => {
  const THIN_SPACE = String.fromCharCode(0x2009) // U+2009 THIN SPACE
  const className = classNamePrefix + '-thin-space'
  const style = `font-size: ${thisSpaceWidth}; ${uiIgnoreSettings.preventSelectStyle}`
  return `<span class="${className}" style="${style}" ${uiIgnoreSettings.hiddenFromReader} ${uiIgnoreSettings.noIndex}>${THIN_SPACE}</span>`
}

/**
 * 指定された文字にカーニング（文字間隔調整）を適用します。
 *
 * @param char - カーニングを適用する文字。
 * @param kerningValue - カーニング値（千分率）。例: 1000 は 1em のカーニングを意味します。
 * @param classNamePrefix - 適用するCSSクラス名のプレフィックス。デフォルトは 'typeset'。
 * @return カーニング適用後のHTMLコンテンツ。
 */
const applyKerning = (char: string, kerningValue: number, classNamePrefix: string): string => {
  const emValue = kerningValue / 1000 / 2 + 'em'
  const className = classNamePrefix + '-kerning'
  const style = `margin: ${emValue}; ${uiIgnoreSettings.preventSelectStyle}`
  return `${char}<span class="${className}" style="${style}" ${uiIgnoreSettings.hiddenFromReader} ${uiIgnoreSettings.noIndex}></span>`
}

/**
 * 与えられたテキストにword-breakとoverflow-wrapスタイルを適用します。
 * @param text - スタイルを適用するテキスト。
 * @param classNamePrefix - 適用するCSSクラス名のプレフィックス。デフォルトは 'typeset'。
 * @param useWordBreak - 単語や助詞など、単語区切りでの改行を行うかどうか。デフォルトは true。
 * @return スタイル適用されたテキストを含むspanタグ。
 */
const applyWrapperStyle = (text: string, classNamePrefix: string, useWordBreak: boolean): string => {
  // <wbr> 以外の箇所で改行しないためのスタイリング
  const style = useWordBreak ? 'word-break: keep-all; overflow-wrap: anywhere;' : ''
  return `<span class="${classNamePrefix}" style="${style}">${text}</span>`
}

/**
 * 与えられたセグメントにクラス名を適用します。
 * @param segment - クラスを適用するセグメント。
 * @param classNamePrefix - 適用するCSSクラス名のプレフィックス。デフォルトは 'typeset'。
 * @return クラス適用されたセグメントを含むspanタグ。
 */
const applyLatinStyle = (segment: string, classNamePrefix: string): string => {
  const className = classNamePrefix + '-latin'
  return `<span class="${className}">${segment}</span>`
}

/**
 * 与えられたセグメントにno-breakスタイルを適用します。
 * @param segment - スタイルを適用するセグメント。
 * @param classNamePrefix - 適用するCSSクラス名のプレフィックス。デフォルトは 'typeset'。
 * @return スタイル適用されたセグメントを含むspanタグ。
 */
const applyNoBreakStyle = (segment: string, classNamePrefix: string): string => {
  const className = classNamePrefix + '-no-breaks'
  return `<span class="${className}" style="letter-spacing: 0">${segment}</span>`
}

export { wbr, thinSpace, applyKerning, applyWrapperStyle, applyLatinStyle, applyNoBreakStyle }
