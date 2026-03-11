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

  test('render should be idempotent for already typeset HTML', () => {
    const renderedOnce = typeset.render(srcHtml)
    expect(typeset.render(renderedOnce)).toEqual(renderedOnce)
  })

  test('render should skip excluded tags', () => {
    const html = [
      '<script>const value = "日本語English";</script>',
      '<style>.sample::before { content: "日本語English"; }</style>',
      '<textarea>日本語English</textarea>',
      '<code>日本語English</code>',
      '<pre>日本語English</pre>',
    ].join('')

    expect(typeset.render(html)).toEqual(html)
  })

  test('render should not skip user-authored wbr tags', () => {
    const html = '日本語<wbr>English'
    const output = typeset.render(html)

    expect(output).not.toEqual(html)
    expect(output).toContain('<wbr>')
    expect(output).toContain('typesetting-wrapper')
  })

  test('render should process children under user-authored typesetting-prefixed classes', () => {
    const html = '<div class="typesetting-custom">日本語English</div>'
    const output = typeset.render(html)

    expect(output).toContain('class="typesetting-custom"')
    expect(output).toContain('typesetting-wrapper')
    expect(output).toContain('typesetting-latin')
  })

  test('render should keep generated spans untouched while processing surrounding text', () => {
    const html = '<div><span class="typesetting-latin">English</span>日本語</div>'
    const output = typeset.render(html)

    expect(output).toContain('<span class="typesetting-latin">English</span>')
    expect(output).toContain('typesetting-wrapper')
    expect(output).not.toContain('<span class="typesetting-latin"><span class="typesetting-latin">English</span></span>')
  })

  test('renderToElements should skip excluded tags', () => {
    win.document.body.innerHTML = '<div id="test"><script>const value = \"日本語English\";</script><p>「日本語」とEnglish</p></div>'
    const element = win.document.getElementById('test')

    typeset.renderToElements(element)

    expect(element?.innerHTML).toContain('<script>const value = "日本語English";</script>')
  })

  test('renderToElements should be idempotent for already processed elements', () => {
    const element = win.document.getElementById('test')

    typeset.renderToElements(element)
    const renderedOnce = element?.innerHTML
    typeset.renderToElements(element)

    expect(element?.innerHTML).toEqual(renderedOnce)
  })
})
