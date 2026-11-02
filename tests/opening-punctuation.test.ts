import { describe, expect, it } from 'vitest'
import { JSDOM } from 'jsdom'
import Typesetter from '../src'

const openings = Array.from('（［｛〔〈《「『【〘〖“‘〝｢〚')

describe('opening punctuation with word-based wrapping', () => {
  it.each(openings)('protects %s without wrapping the following word', opening => {
    const output = new Typesetter().render(`${opening}未来予測`)
    const document = new JSDOM(output).window.document
    const protectedOpening = document.querySelector('.typesetting-opening')
    expect(protectedOpening?.textContent).toBe(opening)
    expect(document.body.textContent).toBe(`${opening}未来予測`)
    expect(document.querySelector('.typesetting-word-break')).not.toBeNull()
    expect(document.querySelector('wbr')).not.toBeNull()
  })

  it('leaves native wrapping unchanged when useWordBreak is disabled', () => {
    const output = new Typesetter({ useWordBreak: false }).render('「未来予測」')
    expect(output).not.toContain('typesetting-opening')
    expect(output).not.toContain('typesetting-word-break')
  })

  it('preserves custom character wrappers, kerning, and markup across the opening', () => {
    const typesetter = new Typesetter({
      wrapChars: [{ char: '「', label: 'quote' }],
      kerningRules: [{ between: ['「', '未'], value: -50 }],
    })
    const output = typesetter.render('「<em>未来</em>予測」')
    const document = new JSDOM(output).window.document
    expect(document.querySelector('.typesetting-char-quote .typesetting-opening')?.textContent).toBe('「')
    expect(document.querySelector('.typesetting-kerning')?.getAttribute('style')).toBe('margin: -0.025em;')
    expect(document.querySelector('em')?.textContent).toBe('未来')
    expect(document.body.textContent).toBe('「未来予測」')
    expect(typesetter.render(output)).toBe(output)
  })

  it('does not transform an already generated opening span a second time', () => {
    const span = '<span class="typesetting-opening">「</span>'
    expect(new Typesetter().render(span)).toBe(span)
  })

  it('preserves nested openings and protected code', () => {
    const output = new Typesetter().render('「『未来』」<code>「未処理」</code>')
    const document = new JSDOM(output).window.document
    expect([...document.querySelectorAll('.typesetting-opening')].map(el => el.textContent)).toEqual(['「', '『'])
    expect(document.querySelector('code')?.innerHTML).toBe('「未処理」')
  })
})
