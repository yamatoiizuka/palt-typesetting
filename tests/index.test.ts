import Typesetter from '../src/'
import { wbr, thinSpace, applyWrapperStyle, applyLatinStyle, applyNoBreakStyle } from '../src/utils-tags'
import win from '../src/win'

// prettier-ignore
describe('Typesetter', () => {
  const prefix = Typesetter.defaultOptions.classNamePrefix
  const addwbr = Typesetter.defaultOptions.useWordBreak
  const space = thinSpace('50%', prefix)
  const srcHtml = `<p>──「<b>こんにちは。</b>」日本語とEnglish、晴れ・28度。</p>`
  const expectedHtml = `<p>${applyWrapperStyle(`${applyNoBreakStyle('──', prefix)}${space}「`, prefix, addwbr)}<b>${applyWrapperStyle(`こんにちは。`, prefix, addwbr)}</b>${applyWrapperStyle(`」${space}${wbr}日本語${wbr}と${space}${wbr}${applyLatinStyle('English', prefix)}${space}、${space}${wbr}晴れ${space}・${space}${wbr}${applyLatinStyle('28', prefix)}${space}${wbr}度。`, prefix, addwbr)}</p>`

  const typeset = new Typesetter()

  beforeEach(() => {
    win.document.body.innerHTML = `<div id="test">${srcHtml}</div>`
  })

  test('render should insert separators and apply styles to HTML string', () => {
    expect(typeset.render(srcHtml)).toEqual(expectedHtml)
  })

  test('renderToElements should apply styles to an HTMLElement', () => {
    const element = win.document.getElementById('test')
    typeset.renderToElements(element)
    expect(element?.innerHTML).toEqual(expectedHtml)
  })

  test('renderToSelector should apply styles to elements matching a CSS selector', () => {
    typeset.renderToSelector('#test')
    const element = win.document.getElementById('test')
    expect(element?.innerHTML).toEqual(expectedHtml)
  })
})
