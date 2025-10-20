import Typesetter from '../src/'
import { createThinSpace, applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle } from '../src/util-tags'
import win from '../src/win'
import { describe, test, expect, beforeEach } from 'vitest'

// prettier-ignore
describe('Typesetter', () => {
  const options = Typesetter.getDefaultOptions()
  const spaceWidth = options.thinSpaceWidth
  const space = createThinSpace(spaceWidth, true)

  const halfSpaceWidth = `calc(${spaceWidth} / 2.0)`
  const halfSpace  = createThinSpace(halfSpaceWidth, true)
  const halfNbsp  = createThinSpace(halfSpaceWidth, false)

  const srcHtml = `
  <article>
    <p>──<b>こんにちは。</b>「日本語」とEnglish、晴れ・28度。</p>
  </article>`

  const expectedHtml = `
  <article>
    <p>${applyWrapperStyle(`${applyNoBreaksStyle('──')}${space}`, true)}<b>${applyWrapperStyle(`こんにちは。${space}`, true)}</b>${applyWrapperStyle(`「日本語」${space}と${space}${applyLatinStyle('English')}、${space}晴れ${halfNbsp}・${halfSpace}${applyLatinStyle('28')}${space}度。`, true)}</p>
  </article>`

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
