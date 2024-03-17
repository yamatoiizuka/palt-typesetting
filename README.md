# Palt Typesetting

## Typesetting Library for Proportional Spacing

![a demo of Palt Typesetting](assets/demo.gif)

Palt Typesetting は、美しいテキスト表示を実現するための JavaScript ライブラリです。和欧混植、およびツメ組み (`font-feature-settings: 'palt'`) の版面設計において、最大限の力を発揮します。

四分アキの自動挿入、カーニングルールの適用、英語のような単語区切りでの改行など、洗練された組版機能を提供します。

## Demo

- [Interactive Demo](https://palt.typesetting.jp)
- [Try on CodePen](https://codepen.io/yamatoiizuka-the-animator/pen/PoLGrZe)

## Getting Started

### Install from NPM

```shell
npm install palt-typesetting
```

```javascript
import Typesetter from 'palt-typesetting'
import 'palt-typesetting/dist/typesetter.css'

// Typesetter のインスタンスを作成
const typesetter = new Typesetter()

// セレクターにマッチする要素に対して組版を適用
typesetter.renderToSelector('.my-class')
```

### Use Typesetter from CDN

```html
<script src="https://unpkg.com/palt-typesetting@0.6.0/bundle/typesetter.min.js"></script>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/palt-typesetting@0.6.0/bundle/typesetter.min.css" />
```

```html
<script>
  // Typesetter のインスタンスを作成
  const typesetter = new Typesetter()

  // セレクターにマッチする要素に対して組版を適用
  typesetter.renderToSelector('.my-class')
</script>
```

### Apply CSS (Example)

```css
/*
 * 共通のスタイリング（例）
 */
.typeset {
  /* プロポーショナルメトリクス（ツメ組み）の設定 */
  font-feature-settings: 'palt';

  /* 行間 */
  line-height: 1.8;

  /* 文字間 */
  letter-spacing: 0.1em;

  /*
   * Safari のフォントレンダリング対策。
   * 英数（.typeset-latin）で -webkit-text-stroke を使う場合は必須。
   * text-stroke-weight > 0, text-stroke-color: transparent
   */
  -webkit-text-stroke: 0.01em transparent;
}

/*
 * 英数のみのスタイリング（例）
 */
.typeset-latin {
  /* フォントの拡大・縮小 */
  font-size: 105%;

  /* ベースラインの調整 */
  vertical-align: 0.02em;

  /*
   * 行間の調整。親要素 .typeset の行間と視覚的に合わせます。
   * [.typeset の line-height] ÷ [フォントの拡大率] - [ベースラインの調整値の絶対値] × 2 
   */
  line-height: calc(1.8 / 1.05 - 0.02 * 2);

  /* 文字間の調整 */
  letter-spacing: 0.05em;

  /* 文字の細らせ・太らせ */
  -webkit-text-stroke: 0.01em #000;
}
```

## Typesetter Class

### Usage

```javascript
// Typesetter のインスタンスを作成
const typesetter = new Typesetter()

// セレクターにマッチする要素に対して組版を適用
typesetter.renderToSelector('div')
typesetter.renderToSelector('.my-class')
typesetter.renderToSelector('#my-id')

// HTML 要素に組版を適用
const elements = document.querySelectorAll('.my-class')
typesetter.renderToElements(elements)

// 組版を適用した HTML の取得
const srcHtml = '「日本語」とEnglish'
console.log(typesetter.render(srcHtml))
// <span class="typeset" /* 中略 */>「日本語」<span class="typeset-thin-space" style="font-size: 100%;" /* 中略 */> </span><wbr>と<span class="typeset-thin-space" style="font-size: 100%;" /* 中略 */> </span><wbr><span class="typeset-latin">English</span></span>
```

### Constructor

| コンストラクタ         | 説明                                                                                                  | 引数                            |
| ---------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------- |
| `Typesetter(options?)` | Typesetter インスタンスを作成します。<br>オプションを指定することでカスタムの組版設定を適用できます。 | `options`: オプション（任意）。 |

### Methods

| メソッド名                   | 説明                                                                  | 引数                                                         | 戻り値                                   |
| ---------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------- |
| `render(srcHtml)`            | スタイルを適用した HTML 文字列を返します。                            | `srcHtml`: 処理する HTML 文字列                              | `string`: スタイルを適用した HTML 文字列 |
| `renderToElements(elements)` | 指定された Element または Element の配列にスタイルを適用します。      | `elements`: スタイルを適用する Element または Element の配列 | `void`                                   |
| `renderToSelector(selector)` | 指定された CSS セレクタに一致するすべての要素にスタイルを適用します。 | `selector`: スタイルを適用する要素を選択する CSS セレクタ    | `void`                                   |

## Options

### Usage

```javascript
const options = {
  // 単語や助詞など、単語区切りでの改行を行います。
  useWordBreak: true,

  // 英数を `.typeset-latin` でラップします。
  wrapLatin: true,

  // 罫線などの分離禁則文字を `.typeset-no-breaks` でラップし、文字間を 0 に設定します。
  noSpaceBetweenNoBreaks: true,

  // 四分アキスペースを自動で挿入します。
  insertThinSpaces: true,

  // 四分アキスペースの幅を設定します。
  thinSpaceWidth: '0.2em',

  // 特定の文字間のカーニングルールを設定します。
  kerningRules: [
    {
      between: ['し', 'ま'],
      value: '60',
    },
    {
      between: ['す', '。'],
      value: '-80',
    },
  ],
}

const typeset = new Typesetter(options)
typesetter.renderToSelector('.my-class')
```

### Typesetting Options

| オプション名             | 説明                                                                                                                                       | 型                                                       | デフォルト値 |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------- | ------------ |
| `useWordBreak`           | 単語や助詞など、単語区切りでの改行を行います。                                                                                             | `boolean`                                                | `true`       |
| `wrapLatin`              | 英数を `span.typeset-latin` でラップします。<br>`useWordBreak` が `true` の場合にのみ有効です。                                            | `boolean`                                                | `true`       |
| `noSpaceBetweenNoBreaks` | 罫線などの分離禁則文字を `span.typeset-no-breaks` でラップし、文字間を 0 に設定します。<br>`useWordBreak` が `true` の場合にのみ有効です。 | `boolean`                                                | `true`       |
| `insertThinSpaces`       | 四分アキスペースを自動で挿入します。                                                                                                       | `boolean`                                                | `true`       |
| `thinSpaceWidth`         | 四分アキスペースの幅を設定します。<br>`insertThinSpaces` が `true` の場合にのみ有効です。                                                  | `string`                                                 | `'0.2em' `   |
| `kerningRules`           | 特定の文字間のカーニングルールを設定します。                                                                                               | `{between: [string, string], value: string \| number}[]` | `[]`         |

## for Frameworks

### Astro.js

#### Typesetting コンポーネントの作成

`components/Typesetting.astro`

```astro
---
import Typesetter from 'palt-typesetting';
import 'palt-typesetting/dist/typesetter.css';

const srcHtml = await Astro.slots.render('default');
const typesetter = new Typesetter();
---

<Fragment set:html={typesetter.render(srcHtml)}></Fragment>

<style is:global>
  /* 合成フォントのイメージでスタイルを設定 */

 .typeset {
  font-feature-settings: 'palt';
  line-height: 1.8;
  letter-spacing: 0.1em;
  /* ...その他のスタイル */
}

.typeset-latin {
  font-size: 105%;
  letter-spacing: 0.05em;
  /* ...その他のスタイル */
}
</style>
```

#### Typesetting コンポーネントの読み込み

`pages/index.astro`

```astro
---
import Typesetting from '../components/Typesetting.astro'
---

<p>
  <Typesetting>
    「日本語」とEnglish、晴れ・28度。
  </Typesetting>
</p>

<style>
 p {
  font-size: 1.8rem;
 }
</style>
```

## Notes

### 環境要件

Palt Typesetting ライブラリは、テキストを言語固有のセグメントに分割する `Intl.Segmenter` という機能に依存しています。そのため、以下の環境要件があります。

**SSG など、サーバーサイドで実行する場合**

- Node.js 16.0.0 以上

**クライアントサイドで実行する場合**

- Intl.Segmenter をサポートしているブラウザ

クライアントサイドで実行する場合、この機能は一部のブラウザで利用できません。Palt Typesetting ライブラリは、Firefox などの `Intl.Segmenter` がサポートされていない環境[^1] では、`useWordBreak`（単語区切りでの改行）と `insertThinSpaces`（四分アキの自動挿入）オプションがスキップされます。全てのモダンブラウザで同様の見え方を再現するには、サーバーサイドでの事前処理（SSG など）が必要となります。

`Intl.Segmenter` の対応状況については、[Can I use...](https://caniuse.com/?search=Intl.Segmenter) で確認できます。

[^1]: Firefox では、バージョン 125 から Intl.Segmenter のサポートが予定されています。

### 注意事項

Palt Typesetting ライブラリは HTML 入力をサポートしていますが、入力された HTML をサニタイズする機能は**含まれていません**。 入力を信頼できない場合は、適切なサニタイザライブラリと共に使用することを強く推奨します。

## Author

[飯塚 大和 (Yamato Iizuka)](https://yamatoiizuka.com)
