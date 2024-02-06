/**
 * ２つの文字列引数を受け取り、変換後の文字列を返す関数の型定義です。
 * この関数は、現在のノードの値と次のノードの値を元に、何らかの変換処理を行うことを想定しています。
 *
 * @param currentNodeValue - 現在のノードの値。
 * @param nextNodeValue - 次のノードの値（存在する場合）。存在しない場合は空文字列を想定。
 * @return 変換後の文字列。
 */
export type TransformFunction = (currentNodeValue: string, nextNodeValue: string, options: TypesettingOptions) => string

/**
 * 組版処理に関する設定オプションの型定義です。
 */
export interface TypesettingOptions {
  /**
   * HTML内のテキストにWBRタグを自動的に追加するかどうかを指定します。
   * WBRタグは、必要に応じて改行の挿入を許可するために使用されます。
   */
  useWordBreak: boolean

  /**
   * 英数を .typeset-latin でラップします。
   * useWordBreak が true の場合にのみ有効です。
   */
  wrapLatin: boolean

  /**
   * 分離禁則文字を .typeset-nobreaks でラップし、文字間を 0 に設定します。
   * useWordBreak が true の場合にのみ有効です。
   */
  noSpaceBetweenNoBreaks: boolean

  /**
   * HTML内のテキストにTHIN SPACEを自動的に挿入するかどうかを指定します。
   * THIN SPACEは、視覚的なスペースを微調整するために使用されます。
   */
  insertThinSpaces: boolean

  /**
   * THIN SPACEの幅を指定します。
   * 例えば'20%'と指定すると、THIN SPACEは通常のスペースの20%の幅になります。
   * insertThinSpaces が true の場合のみ有効です。
   */
  thinSpaceWidth: string

  /**
   * カーニングを適用するためのルールのリスト。
   * 各ルールは、特定の文字ペア間に適用されるカーニング値を指定します。
   */
  kerningRules: KerningRule[]
}

/**
 * カーニングルールを定義するインターフェース。
 * between: 文字ペアを定義します。
 * value: 適用するカーニング値（1000 = 1em）を指定します。
 */
export interface KerningRule {
  between: [string, string]
  value: string | number
}

export default class Typesetter extends HTMLProcessor {
  /**
   * Typesetter のデフォルトの設定を返します。
   */
  static getDefaultOptions(): TypesettingOptions

  /**
   * Intl.Segmenter API が現在の実行環境でサポートされているかどうかを示します。
   */
  private isIntlSegmenterSupported: boolean

  /**
   * コンストラクタ
   */
  constructor(options?: Partial<TypesettingOptions>)

  /**
   * 与えられたオプションを検証し、修正されたオプションを返します。
   *
   * @param options - 検証するオプション。
   * @return 修正されたオプション。
   */
  private static validateOptions(options: Partial<TypesettingOptions>): TypesettingOptions

  /**
   * カーニングルールが適切かどうかを検証します。
   *
   * @param kerningRule - 検証するカーニングルール。
   * @return ルールが有効な場合はtrue、そうでない場合はfalse。
   */
  private static isValidKerningRule(kerningRule: KerningRule): boolean

  /**
   * 与えられたHTML文字列を処理し、指定されたスタイルと区切り文字を適用した結果を返します。
   *
   * @param srcHtml - 処理するHTML文字列。
   * @return 処理後のHTML文字列。
   */
  render(srcHtml: string): string

  /**
   * 与えられたElementまたはElementの配列に対して、スタイルと区切り文字を適用します。
   * 各要素のinnerHTMLを取得し、変換処理を適用した後、変換されたHTMLで元の内容を置き換えます。
   *
   * @param elements - スタイルを適用するElementまたはHTMLElementの配列。
   */
  renderToElements(elements: Element | Element[] | null): void

  /**
   * 指定されたCSSセレクタに一致するすべての要素にスタイルを適用します。
   * document.querySelectorAllを使用して要素を取得し、それぞれに対してスタイル適用処理を行います。
   *
   * @param selector - スタイルを適用する要素を選択するCSSセレクタ。
   */
  renderToSelector(selector: string | null): void
}
