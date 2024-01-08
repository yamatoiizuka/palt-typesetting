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
   * 分離禁則文字を .typeset-nobreaks でラップし、文字間を 0 に設定します。
   * useWordBreak が true の場合にのみ有効です。
   */
  noSpaceForNoBreaks: boolean

  /**
   * HTML内のテキストにTHIN SPACEを自動的に追加するかどうかを指定します。
   * THIN SPACEは、視覚的なスペースを微調整するために使用されます。
   */
  addThinSpaces: boolean

  /**
   * THIN SPACEの幅を指定します。
   * 例えば'20%'と指定すると、THIN SPACEは通常のスペースの20%の幅になります。
   */
  thinSpaceWidth: string

  /**
   * カーニングを適用するためのルールのリスト。
   * 各ルールは、特定の文字ペア間に適用されるカーニング値を指定します。
   */
  kerning: KerningRule[]
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
