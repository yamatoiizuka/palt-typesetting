import Typesetter from '../src'
import { applyStyleToSegment } from '../src/apply-style'
import { TypesettingOptions } from '../src/types'
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
    const expected = '<span class="typeset-no-breaks" style="letter-spacing: 0">──</span>'
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
    const expected = '<span class="typeset-latin">English</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to half-width numbers '28'", () => {
    const current = '28'
    const next = ''
    const expected = '<span class="typeset-latin">28</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("applies 'latin' class to half-width symbol ':'", () => {
    const current = ':'
    const next = ''
    const expected = '<span class="typeset-latin">:</span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("adds kerning tag after 'で'", () => {
    const current = 'す'
    const next = '。'
    const expected =
      'す<span class="typeset-kerning" style="margin: -0.04em; user-select:none;" aria-hidden="true" data-nosnippet=""></span>'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })

  it("adds kerning tag after 'で'", () => {
    const current = 'です。'
    const next = 'その'
    const expected =
      'です<span class="typeset-kerning" style="margin: -0.04em; user-select:none;" aria-hidden="true" data-nosnippet=""></span>。'
    expect(applyStyleToSegment(current, next, options)).toEqual(expected)
  })
})
