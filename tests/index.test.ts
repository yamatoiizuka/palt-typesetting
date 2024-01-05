import { createTypeSetting } from '../src/'
import { wbr, thinSpace, applyWbrStyle, applyLatinClass, applyNoBreakStyle } from '../src/utils-tags'

// prettier-ignore
describe('createTypeSet', () => {
  const space = thinSpace('50%')

  const srcHtml = `<p>──「<b>こんにちは。</b>」日本語とEnglish、晴れ・28度。</p>`
  const expected = `<p>${applyWbrStyle(`${applyNoBreakStyle('──')}${space}「`)}<b>${applyWbrStyle(`こんにちは。`)}</b>${applyWbrStyle(`」${space}${wbr}日本語${wbr}と${space}${wbr}${applyLatinClass('English')}${space}、${space}${wbr}晴れ${space}・${space}${wbr}${applyLatinClass('28')}${space}${wbr}度。`)}</p>`

  it('should insert separators and apply styles to HTML string', () => {
    expect(createTypeSetting(srcHtml)).toEqual(expected)
  })
})
