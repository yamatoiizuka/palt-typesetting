import Typesetter from '../src/'
import { createWbr, createThinSpace, applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle } from '../src/utils-tags'
import win from '../src/win'
import { describe, test, expect, beforeEach } from 'vitest'

// prettier-ignore
describe('Typesetter', () => {
  const options = Typesetter.getDefaultOptions()
  const spaceWidth = options.thinSpaceWidth
  const space = createThinSpace(spaceWidth, true)
  const nbsp = createThinSpace(spaceWidth, false)
  const wbr = createWbr()
  const srcHtml = `<p>──<b>こんにちは。</b>「日本語」とEnglish、晴れ・28度。</p>`

  const expectedHtml = `<p>${applyWrapperStyle(`${applyNoBreaksStyle('──')}${wbr}`, true)}<b>${applyWrapperStyle(`こんにちは。${space}`, true)}</b>${applyWrapperStyle(`「日本語」${space}と${space}${applyLatinStyle('English')}${nbsp}、${space}晴れ${nbsp}・${space}${applyLatinStyle('28')}${space}度。`, true)}</p>`

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
