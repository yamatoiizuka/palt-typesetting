import './style/typesetting.css'

/**
 * HTML文書内で単語の区切りを示し、必要に応じて改行の挿入を許可する`<wbr>`タグを生成します。
 * @return `<wbr>`タグを含む文字列。
 */
const createWbr = (): string => {
  return '<wbr>'
}

/**
 * 四分アキを指定した幅で生成します。この関数は、視覚的なテキストの区切りを改善するために使用されます。
 * @param thisSpaceWidth - 四分アキの幅を指定します（例: "0.2em"）。
 * @param breakable - 改行が許可されているかどうか。trueの場合、空白は通常のスペースとして扱われます。falseの場合、改行を防ぐためにノンブレーキングスペースが使用されます。
 * @return 指定した幅の四分アキを適用したspanタグを含む文字列。
 */
const createThinSpace = (thisSpaceWidth: string, breakable?: boolean): string => {
  const content = breakable ? ' ' : '&nbsp;'
  const className = 'typeset-thin-space'
  const style = `letter-spacing: ${thisSpaceWidth};`
  const uiIgnored = true
  return createStyledSpan(content, className, style, uiIgnored)
}

/**
 * 指定した数値でカーニング（文字間隔調整）を適用します。カーニングは、テキストの読みやすさを向上させるために使用されます。
 *
 * @param kerningValue - カーニング値（千分率）。1000 は 1em のカーニングを意味します。
 * @param breakable - 改行が許可されているかどうか。trueの場合、空白は通常のスペースとして扱われます。falseの場合、改行を防ぐためにノンブレーキングスペースが使用されます。
 * @return 指定した数値のカーニングを適用したspanタグ。
 */
const createKerning = (kerningValue: number, breakable?: boolean): string => {
  if (kerningValue === 0) return ''

  const className = 'typeset-kerning'
  const uiIgnored = true

  if (kerningValue < 0) {
    const content = ''
    const emValue = kerningValue / 1000 / 2 + 'em' // margin は上下左右にかかるので、1/2 にする
    const style = `margin: ${emValue};`
    return createStyledSpan(content, className, style, uiIgnored)
  } else {
    const content = breakable ? ' ' : '&nbsp;'
    const emValue = kerningValue / 1000 + 'em'
    const style = `letter-spacing: ${emValue};`
    return createStyledSpan(content, className, style, uiIgnored)
  }
}

/**
 * 単語区切りでの改行を行う場合にのみ、与えられたテキストに`typeset-word-break`クラスを適用します。
 * @param text - クラスを適用するテキスト。
 * @param useWordBreak - 単語区切りでの改行を行うかどうか。
 * @return クラス適用されたテキストを含むspanタグ。
 */
const applyWrapperStyle = (text: string, useWordBreak: boolean): string => {
  const wrapperName = 'typeset'
  const wordBreakName = 'typeset-word-break'
  const className = useWordBreak ? `${wrapperName} ${wordBreakName}` : wrapperName
  return createStyledSpan(text, className)
}

/**
 * 与えられたセグメントに`typeset-latin`クラスを適用します。
 * @param segment - クラスを適用するセグメント。
 * @return クラス適用されたセグメントを含むspanタグを返します。
 */
const applyLatinStyle = (segment: string): string => {
  const className = 'typeset-latin'
  return createStyledSpan(segment, className)
}

/**
 * 与えられたセグメントに`typeset-no-breaks`クラスを適用します。このクラスは、指定されたセグメント内の`letter-spacing`を0にするために使用されます。
 * @param segment - クラスを適用するセグメント。
 * @return クラス適用されたセグメントを含むspanタグを返します。
 */
const applyNoBreaksStyle = (segment: string): string => {
  const className = 'typeset-no-breaks'
  return createStyledSpan(segment, className)
}

/**
 * スタイリングされた`span`タグを生成し、指定された内容とクラス名を適用します。オプショナルでスタイルとUI無視の属性も設定可能です。
 *
 * @param content - `span`タグ内に表示される内容。
 * @param className - この`span`タグに適用するCSSクラス名。
 * @param style - `span`タグに適用するインラインスタイル（オプショナル）。デフォルトは空文字列で、スタイルが必要な場合に使用します。
 * @param attr - `span`タグに適用する属性（オプショナル）。デフォルトは空文字列で、class/style 以外の属性が必要な場合に使用します。
 * @return 指定されたパラメータに基づいて構築された`span`タグを含む文字列。
 */
const createStyledSpan = (content: string, className: string, style: string = '', attr: string = ''): string => {
  const styleAttr = style ? ` style="${style}"` : ''
  return `<span class="${className}"${styleAttr}${attr}>${content}</span>`
}

export { createWbr, createThinSpace, createKerning, applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle }
