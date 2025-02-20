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
  useWordBreak?: boolean

  /**
   * 英数を .typesetting-latin でラップします。
   * useWordBreak が true の場合にのみ有効です。
   */
  wrapLatin?: boolean

  /**
   * 分離禁則文字を .typesetting-no-breaks でラップし、文字間を 0 に設定します。
   * useWordBreak が true の場合にのみ有効です。
   */
  noSpaceBetweenNoBreaks?: boolean

  /**
   * HTML内のテキストに四分アキを自動的に挿入するかどうかを指定します。
   * 四分アキは、視覚的なスペースを微調整するために使用されます。
   */
  insertThinSpaces?: boolean

  /**
   * 四分アキの幅を指定します。
   * 例えば'20%'と指定すると、四分アキは通常のスペースの20%の幅になります。
   * insertThinSpaces が true の場合のみ有効です。
   */
  thinSpaceWidth?: string

  /**
   * カーニングを適用するためのルールのリスト。
   * 各ルールは、特定の文字ペア間に適用されるカーニング値を指定します。
   */
  kerningRules?: KerningRule[]

  /**
   * 特例文字の設定。
   *
   */
  wrapChars?: WrapChar[]
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

/**
 * 特例文字の設定を定義するインターフェース。
 * char: ラッピング対象の文字を指定します。
 * label: ラッピング時に使用するクラス名の一部となる文字列（任意）。
 * label が未設定の場合は、char の値がそのままクラス名の一部として使用されます。
 */
export interface WrapChar {
  char: string
  label?: string
}
