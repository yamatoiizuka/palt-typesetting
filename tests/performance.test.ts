import { performance } from 'perf_hooks'
import { describe, it, expect } from 'vitest'
import HTMLProcessor from '../src/html-processor'
import type { TransformFunction, TypesettingOptions } from '../types'

const dummyTransform: TransformFunction = (current, next, options) => {
  return current
}

const options: TypesettingOptions = {
  useWordBreak: true,
  wrapLatin: true,
  noSpaceBetweenNoBreaks: true,
  insertThinSpaces: true,
  thinSpaceWidth: '0.2em',
  kerningRules: [],
}

describe('HTMLProcessor パフォーマンステスト', () => {
  it('大きなHTML文字列の処理時間', () => {
    // 引用元：俳句とはどんなものか 高浜虚子
    // URL：https://www.aozora.gr.jp/cards/001310/files/55509_53180.html
    const paragraph = `<div class="jisage_2" style="margin-left: 2em">
古池や<ruby><rb>蛙</rb><rp>（</rp><rt>かわず</rt><rp>）</rp></ruby>飛び込む水の音　　芭蕉<br />
初時雨猿も小蓑をほしげなり　　芭蕉<br />
何事ぞ花見る人の長刀　　去来<br />
馬は濡れ牛は夕日の村時雨　　杜国<br />
いろ／＼の名もむつかしや春の草　　<ruby><rb>珍磧</rb><rp>（</rp><rt>ちんせき</rt><rp>）</rp></ruby><br />
水鳥のはしについたる梅白し　　<ruby><rb>野水</rb><rp>（</rp><rt>やすい</rt><rp>）</rp></ruby><br />
行き／＼て倒れ伏すとも萩の原　　<ruby><rb>曾良</rb><rp>（</rp><rt>そら</rt><rp>）</rp></ruby><br />
子や待たん余り雲雀の高上り　　<ruby><rb>杉風</rb><rp>（</rp><rt>さんぷう</rt><rp>）</rp></ruby><br />
<ruby><rb>鬮</rb><rp>（</rp><rt>くじ</rt><rp>）</rp></ruby>とりて菜飯たかする<ruby><rb>夜伽</rb><rp>（</rp><rt>よとぎ</rt><rp>）</rp></ruby>かな　　<ruby><rb>木節</rb><rp>（</rp><rt>ぼくせつ</rt><rp>）</rp></ruby><br />
秋の空<ruby><rb>尾上</rb><rp>（</rp><rt>おのえ</rt><rp>）</rp></ruby>の杉に離れけり　　其角<br />
なが／＼と川一筋や雪の原　　凡兆<br />
初雪の見事や馬の鼻柱　　<ruby><rb>利牛</rb><rp>（</rp><rt>りぎゅう</rt><rp>）</rp></ruby><br />
黄菊白菊その外の名はなくもがな　　嵐雪<br />
<ruby><rb>十団子</rb><rp>（</rp><rt>とだんご</rt><rp>）</rp></ruby>も小粒になりぬ秋の風　　許六<br />
我事と<ruby><rb>鰌</rb><rp>（</rp><rt>どじょう</rt><rp>）</rp></ruby>の逃げし<ruby><rb>根芹</rb><rp>（</rp><rt>ねぜり</rt><rp>）</rp></ruby>かな　　丈草<br />
長松が親の名で来る<ruby><rb>御慶</rb><rp>（</rp><rt>ぎょけい</rt><rp>）</rp></ruby>かな　　<ruby><rb>野坡</rb><rp>（</rp><rt>やば</rt><rp>）</rp></ruby><br />
子や泣かんその子の母も蚊のくはん　　嵐蘭<br />
焼にけりされども花は散りすまし　　北枝<br />
<ruby><rb>若楓</rb><rp>（</rp><rt>わかかえで</rt><rp>）</rp></ruby>茶色になるも一さかり　　曲水<br />
目に青葉山<ruby><rb>郭公</rb><rp>（</rp><rt>ほととぎす</rt><rp>）</rp></ruby><ruby><rb>初松魚</rb><rp>（</rp><rt>はつがつお</rt><rp>）</rp></ruby>　　素堂<br />
<ruby><rb>藁</rb><rp>（</rp><rt>わら</rt><rp>）</rp></ruby><ruby><rb>積</rb><rp>（</rp><rt>つん</rt><rp>）</rp></ruby>で広く淋しき枯野かな　　尚白<br />
おもしろう松笠もえよ薄月夜　　士芳<br />
行燈の煤けぞ寒き雪の暮　　越人<br />
片枝に脈や通ひて梅の花　　支考<br />
時雨<ruby><rb>来</rb><rp>（</rp><rt>く</rt><rp>）</rp></ruby>や並びかねたるいさゞ船　　千那<br />
身の上を唯しをれけり<ruby><rb>女郎花</rb><rp>（</rp><rt>おみなえし</rt><rp>）</rp></ruby>　　<ruby><rb>凉菟</rb><rp>（</rp><rt>りょうと</rt><rp>）</rp></ruby><br />
</div>`
    const largeHtml = paragraph.repeat(100)

    const processor = new HTMLProcessor([dummyTransform], options)

    const start = performance.now()
    const result = processor.processHtmlWithFunctions(largeHtml)
    const end = performance.now()
    const duration = end - start

    // 処理完了までにかかった時間をログに出力
    console.log(`処理完了までにかかった時間は ${duration.toFixed(2)} ms です。`)

    expect(result).toBeTruthy()
  })
})
