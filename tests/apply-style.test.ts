import Typesetter, { TypesettingOptions } from '../src'
import { applyStyleToSegment, applyKerningToSegment } from '../src/apply-style'
import { describe, it, expect } from 'vitest'

describe('applyStyleToSegment', () => {
  const options: TypesettingOptions = {
    ...Typesetter.getDefaultOptions(),
    kerningRules: [
      {
        between: ['す', '。'],
        value: '-80',
      },
    ],
  }

  it("applies letter-spacing style to separation prohibited characters '──'", () => {
    const current = '──'
    const next = ''
    const expected = '<span class="typesetting-no-breaks">──</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("does not change styling for full-width symbol '「'", () => {
    const current = '「'
    const next = ''
    const expected = '「'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("does not change styling for hiragana 'こんにちは'", () => {
    const current = 'こんにちは'
    const next = ''
    const expected = 'こんにちは'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("does not change styling for kanji '日本語'", () => {
    const current = '日本語'
    const next = ''
    const expected = '日本語'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to English words 'English'", () => {
    const current = 'English'
    const next = ''
    const expected = '<span class="typesetting-latin">English</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to half-width numbers '28'", () => {
    const current = '28'
    const next = ''
    const expected = '<span class="typesetting-latin">28</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to half-width symbol ':'", () => {
    const current = ':'
    const next = ''
    const expected = '<span class="typesetting-latin">:</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to currency symbols", () => {
    const current = '¥1,400'
    const next = ''
    const expected = '<span class="typesetting-latin">¥1,400</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to subscript numbers", () => {
    const current = 'CO₂'
    const next = ''
    const expected = '<span class="typesetting-latin">CO₂</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to superscript numbers", () => {
    const current = '¹³⁷Cs'
    const next = ''
    const expected = '<span class="typesetting-latin">¹³⁷Cs</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("adds kerning tag after 'で'", () => {
    const current = 'す'
    const next = '。'
    const expected = 'す<span class="typesetting-kerning" style="margin: -0.04em;"></span>'
    expect(applyKerningToSegment(current, next, options)).toEqual(expected)
  })

  it("adds kerning tag after 'で'", () => {
    const current = 'です。'
    const next = 'その'
    const expected = 'です<span class="typesetting-kerning" style="margin: -0.04em;"></span>。'
    expect(applyKerningToSegment(current, next, options)).toEqual(expected)
  })
})

// `useWordBreak` が false の場合は、禁則処理に基づきカーニングタグのスペースを出し分けます。
describe('applyStyleToSegment without useWordBreak option', () => {
  const options: TypesettingOptions = {
    ...Typesetter.getDefaultOptions(),
    useWordBreak: false,
    kerningRules: [
      {
        between: ['し', 'ま'],
        value: '60',
      },
      {
        between: ['す', '。'],
        value: '20',
      },
      {
        between: ['a', 'S'],
        value: '20',
      },
    ],
  }

  it("adds breakable kerning tag after 'し'", () => {
    const space = ' '
    const current = 'し'
    const next = 'ます。'
    const expected = `し<span class="typesetting-kerning" style="letter-spacing: 0.06em;" data-content="${space}"></span>`
    expect(applyKerningToSegment(current, next, options)).toEqual(expected)
  })

  it("adds unbreakable kerning tag after 'す'", () => {
    const space = '&nbsp;'
    const current = 'です'
    const next = '。'
    const expected = `です<span class="typesetting-kerning" style="letter-spacing: 0.02em;" data-content="${space}"></span>`
    expect(applyKerningToSegment(current, next, options)).toEqual(expected)
  })

  it("adds unbreakable kerning tag after 'Java'", () => {
    const space = '&nbsp;'
    const current = 'Java'
    const next = 'Script'
    const expected = `Java<span class="typesetting-kerning" style="letter-spacing: 0.02em;" data-content="${space}"></span>`
    expect(applyKerningToSegment(current, next, options)).toEqual(expected)
  })
})
