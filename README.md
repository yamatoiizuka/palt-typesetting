# Palt Typesetting

## Typesetting Library for Propotional Spacing

Palt Typesetting は、読みやすく美しいテキスト表示を実現するための JavaScript ライブラリです。和欧混合、およびメトリクス詰め(`font-feature-settings: 'palt'`) の版面設計において、最大限の力を発揮します。

四分アキの自動挿入、カーニングルールの適用、英語のような語単位での改行など、高度な組版機能を提供します。

## Demo

- [Interactive Demo](https://palt.typesetting.jp)
- [Simple Demo in CodeSandbox](https://codesandbox.io/p/sandbox/a-simple-demo-of-palt-typesetting-rptqm7?file=%2Fsrc%2Findex.js%3A12%2C1)

## Getting Started

### Install from NPM

```shell
npm install palt-typesetting
```

```javascript
import Typesetter from 'palt-typesetting'

const typesetter = new Typesetter()
typesetter.renderToSelector('.my-class')
```

### Add CSS (optional)

```css
.typeset {
  font-feature-settings: 'palt';
  letter-spacing: 0.1em;
  line-height: 1.8;
}

.typeset-latin {
  letter-spacing: 0.05em;

  /* if needed */
  font-size: 105%;
  line-height: calc(1.8 / 1.05);
}
```

## Typesetter Class

### Usage

```javascript
// Initialize
const typesetter = new Typesetter()

// Render to Selector
typesetter.renderToSelector('div')
typesetter.renderToSelector('.my-class')
typesetter.renderToSelector('#my-id')

// Render to HTMLElements
const elements = document.querySelectorAll('.my-class')
typesetter.renderToElements(elements)

// Render Typesetting
const srcHtml = '「日本語」とEnglish'
console.log(typesetter.render(srcHtml))
// <span class="typeset" /* 中略 */>「日本語」<span class="typeset-thin-space" style="font-size: 50%;" /* 中略 */> </span><wbr>と<span class="typeset-thin-space" style="font-size: 50%;" /* 中略 */> </span><wbr><span class="typeset-latin">English</span></span>
```

### Constructor

| コンストラクタ         | 説明                                                                                                  | 引数                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| `Typesetter(options?)` | Typesetter インスタンスを作成します。<br>オプションを指定することでカスタムの組版設定を適用できます。 | `options`: オプション（任意）。 |

### Methods

| メソッド名                   | 説明                                                                  | 引数                                                         | 返り値                                   |
| ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `render(srcHtml)`            | スタイルを適用した HTML 文字列を返します。                            | `srcHtml`: 処理する HTML 文字列                              | `string`: スタイルを適用した HTML 文字列 |
| `renderToElements(elements)` | 指定された Element または Element の配列にスタイルを適用します。      | `elements`: スタイルを適用する Element または Element の配列 | `void`                                   |
| `renderToSelector(selector)` | 指定された CSS セレクタに一致するすべての要素にスタイルを適用します。 | `selector`: スタイルを適用する要素を選択する CSS セレクタ    | `void`                                   |

## Options

### Usage

```javascript
const options = {
  // ライブラリで使用される CSS クラス名のプレフィックスを指定します。
  classNamePrefix: 'typeset',

  // 単語や助詞など、語単位での改行を行います。
  useWordBreak: true,

  // 英数を `.typeset-latin` でラップします。
  wrapLatin: true,

  // 罫線などの分離禁則文字を `.typeset-no-breaks` でラップし、文字間を 0 に設定します。
  noSpaceBetweenNoBreaks: true,

  // 四分アキスペースを自動で挿入します。
  insertThinSpaces: true,

  // 四分アキスペースの幅を設定します。
  thinSpaceWidth: '50%',

  // 特定の文字間のカーニングルールを設定します。
  kerningRules: [
    {
      between: ['す', '。'],
      value: '-80',
    },
    {
      between: ['で', '、'],
      value: '-120',
    },
  ],
}

const typeset = new Typesetter(options)
typesetter.renderToSelector('.my-class')
```

### Typesetting Options

| オプション名             | 説明                                                                                                                                       | 型                                                       | デフォルト値 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------ |
| `classNamePrefix`        | ライブラリで使用される CSS クラス名のプレフィックスを指定します。                                                                          | `string`                                                 | `'typeset' ` |
| `useWordBreak`           | 単語や助詞など、語単位での改行を行います。                                                                                                 | `boolean`                                                | `true`       |
| `wrapLatin`              | 英数を `span.typeset-latin` でラップします。<br>`useWordBreak` が `true` の場合にのみ有効です。                                            | `boolean`                                                | `true`       |
| `noSpaceBetweenNoBreaks` | 罫線などの分離禁則文字を `span.typeset-no-breaks` でラップし、文字間を 0 に設定します。<br>`useWordBreak` が `true` の場合にのみ有効です。 | `boolean`                                                | `true`       |
| `insertThinSpaces`       | 四分アキスペースを自動で追加します。                                                                                                       | `boolean`                                                | `true`       |
| `thinSpaceWidth`         | 四分アキスペースの幅を設定します。<br>`insertThinSpaces` が `true` の場合にのみ有効です。                                                  | `string`                                                 | `'50%' `     |
| `kerningRules`           | 特定の文字間のカーニングルールを設定します。                                                                                               | `{between: [string, string], value: string \| number}[]` | `[]`         |

## Notes

### 環境要件

Palt Typesetting ライブラリは、語単位の改行機能のコアとして `Intl.Segmenter` による分割処理を使用しています。そのため、以下の環境要件があります。

- Node.js: 16.0.0 以上
- ブラウザ: Intl.Segmenter をサポートしているブラウザ

`Intl.Segmenter` は、テキストを言語固有のセグメントに分割する機能を提供しますが、一部のブラウザでは利用できません（クライアントサイドで実行する場合）。Palt Typesetting ライブラリは、`Intl.Segmenter` がサポートされていない環境では組版処理をスキップし、元のテキストをそのまま返します。

`Intl.Segmenter` の対応状況については、[MDN Web Docs](https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Intl/Segmenter) で確認できます。

### 注意事項

Palt Typesetting ライブラリは HTML 入力をサポートしていますが、入力された HTML をサニタイズする機能は**含まれていません**。 入力を信頼できない場合は、適切なサニタイザライブラリと共に使用することを強く推奨します。

## Author

飯塚 大和 (Yamato Iizuka)
