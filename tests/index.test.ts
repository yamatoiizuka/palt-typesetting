import { TypeSet } from '../src/'
import { wbr, thinSpace, applyWbrStyle, applyLatinClass, applyNoBreakStyle } from '../src/utils-tags'
import win from '../src/win'

// prettier-ignore
describe('TypeSet', () => {
  const space = thinSpace('50%')
  const srcHtml = `<p>──「<b>こんにちは。</b>」日本語とEnglish、晴れ・28度。</p>`
  const expectedHtml = `<p>${applyWbrStyle(`${applyNoBreakStyle('──')}${space}「`)}<b>${applyWbrStyle(`こんにちは。`)}</b>${applyWbrStyle(`」${space}${wbr}日本語${wbr}と${space}${wbr}${applyLatinClass('English')}${space}、${space}${wbr}晴れ${space}・${space}${wbr}${applyLatinClass('28')}${space}${wbr}度。`)}</p>`

  let typeset: TypeSet

  beforeEach(() => {
    typeset = new TypeSet()
    win.document.body.innerHTML = `<div id="test">${srcHtml}</div>`
  })

  test('render should insert separators and apply styles to HTML string', () => {
    expect(typeset.render(srcHtml)).toEqual(expectedHtml)
  })

  test('renderFromElement should apply styles to an HTMLElement', () => {
    const element = win.document.getElementById('test')
    typeset.renderFromElements(element)
    expect(element?.innerHTML).toEqual(expectedHtml)
  })

  test('renderFromSelector should apply styles to elements matching a CSS selector', () => {
    typeset.renderFromSelector('#test')
    const element = win.document.getElementById('test')
    expect(element?.innerHTML).toEqual(expectedHtml)
  })
})
