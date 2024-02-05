import Typesetter from '../src/'
import { wbr, createThinSpaceSpan, applyWrapperStyle, applyLatinStyle, applyNoBreakStyle } from '../src/utils-tags'
import win from '../src/win'
import { describe, test, expect, beforeEach } from 'vitest'

// prettier-ignore
describe('Typesetter', () => {
  const prefix = Typesetter.getDefaultOptions().classNamePrefix
  const addwbr = Typesetter.getDefaultOptions().useWordBreak
  const spaceWidth = Typesetter.getDefaultOptions().thinSpaceWidth
  const space = createThinSpaceSpan(spaceWidth, prefix)
  const srcHtml = `<p>──<b>こんにちは。</b>「日本語」とEnglish、晴れ・28度。</p>`

  const expectedHtml = `<p>${applyWrapperStyle(`${applyNoBreakStyle('──', prefix)}${wbr}`, prefix, addwbr)}<b>${applyWrapperStyle(`こんにちは。${space}${wbr}`, prefix, addwbr)}</b>${applyWrapperStyle(`「日本語」${space}${wbr}と${space}${wbr}${applyLatinStyle('English', prefix)}${space}、${space}${wbr}晴れ${space}・${space}${wbr}${applyLatinStyle('28', prefix)}${space}${wbr}度。`, prefix, addwbr)}</p>`

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
