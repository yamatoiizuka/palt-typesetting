import Typesetter, { TypesettingOptions } from '../src'
import insertSeparatorsToText, {
  createSegments,
  addSeparatorsToSegment,
  isBreakable,
  shouldAddThinSpace,
} from '../src/insert-separators'
import { createWbr, createThinSpace } from '../src/util-tags'
import { describe, it, expect } from 'vitest'

const options = Typesetter.getDefaultOptions()
const wbr = createWbr()
const space = createThinSpace(options.thinSpaceWidth, true)
const nbsp = createThinSpace(options.thinSpaceWidth, false)

describe('insertSeparators', () => {
  it('inserts separators (thin spaces, <wbr>) into HTML text nodes', () => {
    const currentText = '──「こんにちは。」日本語とEnglish、晴れ・28度à vous。'
    const nextText = '「合成フォント」の見本。'
    const expected = `──${nbsp}「こんにちは。」${space}日本語${wbr}と${space}English、${space}晴れ${nbsp}・${space}28${space}度${space}à ${wbr}vous。${space}`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space before a space', () => {
    const currentText = 'です。'
    const nextText = ' '
    const expected = 'です。'
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space after a space', () => {
    const currentText = ' '
    const nextText = '「こんにちは」'
    const expected = ' <wbr>'
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space before a latin comma', () => {
    const currentText = '文字'
    const nextText = ','
    const expected = '文字'
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space before a latin period', () => {
    const currentText = '言語'
    const nextText = '.'
    const expected = '言語'
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space before a line fead', () => {
    const currentText = 'です。'
    const nextText = '\n'
    const expected = 'です。'
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('inserts a thin space between Japanese–Cyrillic', () => {
    const currentText = 'こんにちはДобрий день'
    const nextText = ''
    const expected = `こんにちは${space}Добрий ${wbr}день`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('inserts a thin space between Japanese–Greek', () => {
    const currentText = 'こんにちはΚαλησπέρα σας'
    const nextText = ''
    const expected = `こんにちは${space}Καλησπέρα ${wbr}σας`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('inserts a thin space between Japanese–Korean', () => {
    const currentText = 'こんにちは안녕하세요'
    const nextText = ''
    const expected = `こんにちは${space}안녕하세요`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })

  it('does not insert a thin space between Japanese–Chinese', () => {
    const currentText = 'こんにちは下午好'
    const nextText = ''
    const expected = `こんにちは<wbr>下午<wbr>好`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })
})

describe('createSegments', () => {
  it('generates an array of text segments from a sentence, using word granularity', () => {
    const src = '──「こんにちは。」日本語とEnglish、晴れ・28度à vous。'
    const expected = [
      '─',
      '─',
      '「',
      'こんにちは',
      '。',
      '」',
      '日本語',
      'と',
      'English',
      '、',
      '晴れ',
      '・',
      '28',
      '度',
      'à',
      ' ',
      'vous',
      '。',
    ]
    expect(createSegments(src)).toEqual(expected)
  })
})

describe('addSeparatorsToSegment', () => {
  const tests = [
    { current: '─', next: '─', expected: '─' },
    {
      current: '─',
      next: '「',
      expected: '─' + nbsp,
    },
    {
      current: '「',
      next: 'こんにちは',
      expected: '「',
    },
    {
      current: 'こんにちは',
      next: '。',
      expected: 'こんにちは',
    },
    {
      current: '。',
      next: '」',
      expected: '。',
    },
    {
      current: '」',
      next: '日本語',
      expected: '」' + space,
    },
    {
      current: '日本語',
      next: 'と',
      expected: '日本語' + wbr,
    },
    {
      current: 'と',
      next: 'English',
      expected: 'と' + space,
    },
    {
      current: 'English',
      next: '、',
      expected: 'English',
    },
    {
      current: '、',
      next: '晴れ',
      expected: '、' + space,
    },
    {
      current: '晴れ',
      next: '・',
      expected: '晴れ' + nbsp,
    },
    {
      current: '・',
      next: '28',
      expected: '・' + space,
    },
    {
      current: '28',
      next: '度',
      expected: '28' + space,
    },
    {
      current: '度',
      next: 'à',
      expected: '度' + space,
    },
    {
      current: 'à',
      next: ' ',
      expected: 'à',
    },
    {
      current: ' ',
      next: 'vous',
      expected: ' ' + wbr,
    },
    {
      current: 'vous',
      next: '。',
      expected: 'vous',
    },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`adds separators to '${current}' considering '${next}', resulting in '${expected}'`, () => {
      expect(addSeparatorsToSegment(current, next, options)).toEqual(expected)
    })
  })
})

describe('addSeparatorsToSegment without useWordBreak', () => {
  const customOptions: TypesettingOptions = {
    ...options,
    useWordBreak: false,
  }

  const tests = [
    { current: '─', next: '─', expected: '─' },
    {
      current: '─',
      next: '「',
      expected: '─' + nbsp,
    },
    {
      current: '「',
      next: 'こんにちは',
      expected: '「',
    },
    {
      current: 'こんにちは',
      next: '。',
      expected: 'こんにちは',
    },
    {
      current: '。',
      next: '」',
      expected: '。',
    },
    {
      current: '」',
      next: '日本語',
      expected: '」' + space,
    },
    {
      current: '日本語',
      next: 'と',
      expected: '日本語',
    },
    {
      current: 'と',
      next: 'English',
      expected: 'と' + space,
    },
    {
      current: 'English',
      next: '、',
      expected: 'English',
    },
    {
      current: '、',
      next: '晴れ',
      expected: '、' + space,
    },
    {
      current: '晴れ',
      next: '・',
      expected: '晴れ' + nbsp,
    },
    {
      current: '・',
      next: '28',
      expected: '・' + space,
    },
    {
      current: '28',
      next: '度',
      expected: '28' + space,
    },
    {
      current: '度',
      next: 'à',
      expected: '度' + space,
    },
    {
      current: 'à',
      next: ' ',
      expected: 'à',
    },
    {
      current: ' ',
      next: 'vous',
      expected: ' ',
    },
    {
      current: 'vous',
      next: '。',
      expected: 'vous',
    },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`adds separators to '${current}' considering '${next}', resulting in '${expected}'`, () => {
      expect(addSeparatorsToSegment(current, next, customOptions)).toEqual(expected)
    })
  })
})

describe('isBreakable', () => {
  const tests = [
    { current: '─', next: '─', expected: false },
    { current: '─', next: '「', expected: false },
    { current: '「', next: 'こんにちは', expected: false },
    { current: 'こんにちは', next: '。', expected: false },
    { current: '。', next: '」', expected: false },
    { current: '」', next: '日本語', expected: true },
    { current: '日本語', next: 'と', expected: true },
    { current: 'と', next: 'English', expected: true },
    { current: 'English', next: '、', expected: false },
    { current: '、', next: '晴れ', expected: true },
    { current: '晴れ', next: '・', expected: false },
    { current: '・', next: '28', expected: true },
    { current: '28', next: '度', expected: true },
    { current: '度', next: 'à', expected: true },
    { current: 'à', next: ' ', expected: false },
    { current: ' ', next: 'vous', expected: true },
    { current: 'vous', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns ${expected} for adding <wbr> between '${current}' and '${next}'`, () => {
      expect(isBreakable(current, next)).toEqual(expected)
    })
  })
})

describe('shouldAddThinSpace', () => {
  const tests = [
    { current: '─', next: '─', expected: false },
    { current: '─', next: '「', expected: true },
    { current: '「', next: 'こんにちは', expected: false },
    { current: 'こんにちは', next: '。', expected: false },
    { current: '。', next: '」', expected: false },
    { current: '」', next: '日本語', expected: true },
    { current: '日本語', next: 'と', expected: false },
    { current: 'と', next: 'English', expected: true },
    { current: 'English', next: '、', expected: false },
    { current: '、', next: '晴れ', expected: true },
    { current: '晴れ', next: '・', expected: true },
    { current: '・', next: '28', expected: true },
    { current: '28', next: '度', expected: true },
    { current: '度', next: 'à', expected: true },
    { current: 'à', next: ' ', expected: false },
    { current: ' ', next: 'vous', expected: false },
    { current: 'vous', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns ${expected} for adding thin space between '${current}' and '${next}'`, () => {
      expect(shouldAddThinSpace(current, next)).toEqual(expected)
    })
  })
})
