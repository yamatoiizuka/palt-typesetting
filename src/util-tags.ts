const prefix = 'typesetting'

/**
 * HTML文書内で単語の区切りを示し、必要に応じて改行の挿入を許可する`<wbr>`タグを生成します。
 * @return `<wbr>`タグを含む文字列。
 */
const createWbr = (): string => {
  return '<wbr>'
}

/**
 * 四分アキを指定した幅で生成します。この関数は、視覚的なテキストの区切りを改善するために使用されます。
 * @param thinSpaceWidth - 四分アキの幅を指定します（例: "0.2em"）。
 * @param breakable - 改行が許可されているかどうか。true の場合、空白は通常の Space として扱われます。false の場合、改行を防ぐために No-Break Space が使用されます。
 * @return 指定した幅の四分アキを適用した`span`タグを含む文字列。
 */
const createThinSpace = (thinSpaceWidth: string, breakable?: boolean): string => {
  const content = ''
  const className = `${prefix}-thin-space`
  return createSpacer(content, className, thinSpaceWidth, breakable)
}

/**
 * 指定した数値でカーニング（文字間隔調整）を適用します。カーニングは、テキストの読みやすさを向上させるために使用されます。
 *
 * @param kerningValue - カーニング値（千分率）。1000 は 1em のカーニングを意味します。
 * @param breakable - 改行が許可されているかどうか。true の場合、空白は通常の Space として扱われます。false の場合、改行を防ぐために No-Break Space が使用されます。
 * @return 指定した数値のカーニングを適用した`span`タグ。
 */
const createKerning = (kerningValue: number, breakable?: boolean): string => {
  if (kerningValue === 0) return ''

  const content = ''
  const className = `${prefix}-kerning`

  if (kerningValue < 0) {
    const emValue = kerningValue / 1000 / 2 + 'em' // margin は上下左右にかかるので、1/2 にする
    const style = `margin: ${emValue};`
    return createStyledSpan(content, className, style)
  } else {
    const emValue = kerningValue / 1000 + 'em'
    return createSpacer(content, className, emValue, breakable)
  }
}

/**
 * 単語区切りでの改行を行う場合にのみ、与えられたテキストに`typesetting-word-break`クラスを適用します。
 * @param text - クラスを適用するテキスト。
 * @param useWordBreak - 単語区切りでの改行を行うかどうか。
 * @return クラス適用されたテキストを含む`span`タグ。
 */
const applyWrapperStyle = (text: string, useWordBreak?: boolean): string => {
  const wrapperName = `$${prefix}-wrapper`
  const wordBreakName = `${prefix}-word-break`
  const className = useWordBreak ? `${wrapperName} ${wordBreakName}` : wrapperName
  return createStyledSpan(text, className)
}

/**
 * 与えられたセグメントに`typesetting-latin`クラスを適用します。
 * @param segment - クラスを適用するセグメント。
 * @return クラス適用されたセグメントを含むspanタグを返します。
 */
const applyLatinStyle = (segment: string): string => {
  const className = `${prefix}-latin`
  return createStyledSpan(segment, className)
}

/**
 * 与えられたセグメントに`typesetting-no-breaks`クラスを適用します。このクラスは、指定されたセグメント内の`letter-spacing`を0にするために使用されます。
 * @param segment - クラスを適用するセグメント。
 * @return クラス適用されたセグメントを含む`span`タグを返します。
 */
const applyNoBreaksStyle = (segment: string): string => {
  const className = `${prefix}-no-breaks`
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

/**
 * 指定された値でスペーシングを適用した`span`タグを生成します。この関数は、テキスト間の視覚的な空白を管理し、
 * テキストの区切りや読みやすさを向上させるために使用されます。また、改行の挙動を制御するオプションを提供し、
 * 改行が許可されている場合は通常の空白（Space）、許可されていない場合は改行を防ぐ空白（No-Break Space）を
 * 使用します。
 *
 * @param content - `span`タグ内に表示される内容。この関数では主に空文字列が使用されます。
 * @param className - `span`タグに適用する CSS クラス名。スタイリングのために使用されます。
 * @param value - `letter-spacing`の値として適用するスペーシングの幅。例: "0.2em"。
 * @param breakable - 改行が許可されているかどうか。true の場合、スペーサーは改行可能とみなされ、false の場合は改行不可。
 * @return 指定されたスタイリングと挙動を持つ`span`タグを含む文字列。
 */
const createSpacer = (content: string, className: string, value: string, breakable?: boolean): string => {
  const style = `letter-spacing: ${value};`
  const data = ` data-content="${breakable ? ' ' : '&nbsp;'}"`
  return createStyledSpan(content, className, style, data)
}

export { createWbr, createThinSpace, createKerning, applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle }
