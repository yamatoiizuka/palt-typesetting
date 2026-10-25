import Typesetter, { TypesettingOptions } from '../src/'
import { createThinSpace, applyWrapperStyle, applyLatinStyle, applyNoBreaksStyle } from '../src/util-tags'
import { JSDOM } from 'jsdom'
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest'

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
    <p>${applyWrapperStyle(`${applyNoBreaksStyle('──')}${space}`, true)}<b>${applyWrapperStyle(`こんにちは。${space}`, true)}</b>${applyWrapperStyle(`<span class="typesetting-opening">「</span>日本語」${space}と${space}${applyLatinStyle('English')}、${space}晴れ${halfNbsp}・${halfSpace}${applyLatinStyle('28')}${space}度。`, true)}</p>
  </article>`

  const typeset = new Typesetter()
  let win: JSDOM['window']

  beforeEach(() => {
    win = new JSDOM().window
    vi.stubGlobal('document', win.document)
    win.document.body.innerHTML = `<div id="test">${srcHtml}</div>`
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    win.close()
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

  describe('options snapshot', () => {
    const createOptions = (): TypesettingOptions => ({
      wrapChars: [{ char: 'あ', label: 'a' }, { char: ['か', 'き'], label: 'k' }],
      kerningRules: [{ between: ['あ', 'い'], value: 100 }],
    })
    const mutate = (options: TypesettingOptions) => {
      options.wrapChars![0].char = 'い'
      options.wrapChars![1].char = ['く']
      ;(options.wrapChars![1].char as string[]).push('け')
      options.kerningRules![0].value = 900
      options.kerningRules![0].between[1] = 'う'
      options.wrapChars!.push({ char: 'う' })
      options.kerningRules!.push({ between: ['い', 'う'], value: 500 })
    }
    const input = 'あいうかきくけ'

    test('does not modify the options passed by the caller', () => {
      const options = { ...createOptions(), kerningRules: [{ between: ['ab', 'c'], value: 1 }] } as TypesettingOptions
      const snapshot = structuredClone(options)
      new Typesetter(options)
      expect(options).toEqual(snapshot)
    })

    test('ignores changes made to the rules after construction and before the first render', () => {
      const expected = new Typesetter(createOptions()).render(input)
      const options = createOptions()
      const typesetter = new Typesetter(options)
      mutate(options)
      expect(typesetter.render(input)).toBe(expected)
    })

    test('ignores changes made to the rules after the first render', () => {
      const options = createOptions()
      const typesetter = new Typesetter(options)
      const expected = typesetter.render(input)
      mutate(options)
      expect(typesetter.render(input)).toBe(expected)
    })
  })

  test('render should restore protected blocks containing replacement patterns verbatim', () => {
    const script = '<script>const s = "$&" + "$`" + "$\'" + "$1" + "$$";</script>'
    const generated = '<span class="typesetting-latin">$& $$ $1</span>'
    const output = typeset.render(`日本語${script}${generated}English`)

    expect(output).toContain(script)
    expect(output).toContain(generated)
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
