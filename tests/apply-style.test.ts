import { applyStyleToSegment } from '../src/apply-style'

describe('applyStyleToSegment', () => {
  it("applies letter-spacing style to separation prohibited characters '──'", () => {
    const segment = '──'
    const expected = '<span class="typeset-no-breaks" style="letter-spacing: 0">──</span>'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("does not change styling for full-width symbol '「'", () => {
    const segment = '「'
    const expected = '「'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("does not change styling for hiragana 'こんにちは'", () => {
    const segment = 'こんにちは'
    const expected = 'こんにちは'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("does not change styling for kanji '日本語'", () => {
    const segment = '日本語'
    const expected = '日本語'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("applies 'latin' class to English words 'English'", () => {
    const segment = 'English'
    const expected = '<span class="typeset-latin">English</span>'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("applies 'latin' class to half-width numbers '28'", () => {
    const segment = '28'
    const expected = '<span class="typeset-latin">28</span>'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })

  it("applies 'latin' class to half-width symbol ':'", () => {
    const segment = ':'
    const expected = '<span class="typeset-latin">:</span>'
    expect(applyStyleToSegment(segment)).toEqual(expected)
  })
})
