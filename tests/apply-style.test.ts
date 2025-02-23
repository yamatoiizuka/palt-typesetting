import Typesetter, { TypesettingOptions } from '../src'
import { applyStyleToSegment, applyKerningToSegment, applyStyleToChar } from '../src/apply-style'
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

describe('applyStyleToChar', () => {
  it('wraps consecutive occurrences of special characters according to configuration', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: 'あ', label: 'hira-a' }, { char: '」' }],
    }
    const input = '「ああ、そうだね。」と言った。'
    const expected =
      '「<span class="typesetting-char-hira-a">ああ</span>、そうだね。<span class="typesetting-char-」">」</span>と言った。'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual(expected)
  })

  it('returns original text if wrapChar configuration is not provided', () => {
    const options: TypesettingOptions = {}
    const input = 'テスト'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual('テスト')
  })

  it('wraps multiple occurrences correctly', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: 'あ', label: 'hira-a' }],
    }
    const input = 'あいうえおああ'
    // "あ" と "ああ" それぞれをラップする
    const expected =
      '<span class="typesetting-char-hira-a">あ</span>いうえお<span class="typesetting-char-hira-a">ああ</span>'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual(expected)
  })

  // このテストは、wrapChar の設定で char: '"' を指定した場合、
  // デフォルトのラベルが不正な文字を含むため、ラッピング処理がスキップされることを検証します。
  // その結果、期待されるラッピング結果（クラス名に不正な文字が含まれる HTML）は生成されないことを確認します。
  it('should skip wrapping for multiple occurrences of invalid characters when default label is unsafe (e.g. double quotes)', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: '"' }],
    }
    const input = '"hi"'
    const expected = '<span class="typesetting-char-"">"</span>hi<span class="typesetting-char-"">"</span>'
    const output = applyStyleToChar(input, '', options)
    expect(output).not.toEqual(expected)
  })

  it('should skip wrapping when char has more than one character (invalid rule)', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: 'ab', label: 'double' }],
    }
    const input = 'ababab'
    // ルールが無効なため、ラッピング処理は適用されず入力と同じ文字列が返される
    expect(applyStyleToChar(input, '', options)).toEqual(input)
  })

  it('wraps emoji correctly when char is a single emoji (even if represented by surrogate pairs)', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: '😀', label: 'smiley' }],
    }
    const input = '😀😀'
    const expected = '<span class="typesetting-char-smiley">😀😀</span>'
    expect(applyStyleToChar(input, '', options)).toEqual(expected)
  })
})

describe('applyStyleToChar - extended tests for grouped characters', () => {
  it('wraps grouped characters correctly when char is an array with multiple elements and label is provided', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: ['(', ')'], label: 'paren' }],
    }
    const input = 'Hello (world)!'
    const expected =
      'Hello <span class="typesetting-char-paren">(</span>world<span class="typesetting-char-paren">)</span>!'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual(expected)
  })

  it('wraps single element array correctly when label is omitted', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: ['あ'] }],
    }
    const input = 'あいうえおああ'
    const expected = '<span class="typesetting-char-あ">あ</span>いうえお<span class="typesetting-char-あ">ああ</span>'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual(expected)
  })

  it('skips wrapping grouped characters when multiple characters are provided in array but label is omitted', () => {
    const options: TypesettingOptions = {
      wrapChars: [{ char: ['(', ')'] }],
    }
    const input = 'Hello (world)!'
    const output = applyStyleToChar(input, '', options)
    // 無効な設定なので、ラッピング処理は行われず入力と同じ文字列が返る
    expect(output).toEqual(input)
  })

  it('filters out invalid characters in the array and uses only valid ones', () => {
    const options: TypesettingOptions = {
      // 'ab' と '' は無効なため除外され、結果的に ['あ'] となる
      wrapChars: [{ char: ['あ', 'ab', ''], label: 'group' }],
    }
    const input = 'あいうえおああ'
    const expected =
      '<span class="typesetting-char-group">あ</span>いうえお<span class="typesetting-char-group">ああ</span>'
    const output = applyStyleToChar(input, '', options)
    expect(output).toEqual(expected)
  })
})
