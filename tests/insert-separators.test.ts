import insertSeparatorsToText, {
  generateSegments,
  addSeparatorsToSegment,
  shouldAddWbr,
  shouldAddThinSpace,
} from '../src/insert-separators'
import { wbr, thinSpace } from '../src/utils-tags'

const options = {
  useWordBreak: true,
  wrapLatin: true,
  noSpaceForNoBreaks: true,
  addThinSpaces: true,
  thinSpaceWidth: '50%',
  kerning: [],
}

const space = thinSpace(options.thinSpaceWidth)

describe('insertSeparators', () => {
  it('inserts separators (thin spaces, <wbr>) into HTML text nodes', () => {
    const currentText = '──「こんにちは。」日本語とEnglish、晴れ・28度。'
    const nextText = '「合成フォント」の見本。'
    const expected = `──${space}「こんにちは。」${space}${wbr}日本語${wbr}と${space}${wbr}English${space}、${space}${wbr}晴れ${space}・${space}${wbr}28${space}${wbr}度。${space}${wbr}`
    expect(insertSeparatorsToText(currentText, nextText, options)).toEqual(expected)
  })
})

describe('generateSegments', () => {
  it('generates an array of text segments from a sentence, using word granularity', () => {
    const src = '──「こんにちは。」日本語とEnglish、晴れ・28度。'
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
      '。',
    ]
    expect(generateSegments(src)).toEqual(expected)
  })
})

describe('addSeparatorsToSegment', () => {
  const tests = [
    { current: '─', next: '─', expected: '─' },
    {
      current: '─',
      next: '「',
      expected: '─' + space,
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
      expected: '」' + space + wbr,
    },
    {
      current: '日本語',
      next: 'と',
      expected: '日本語' + wbr,
    },
    {
      current: 'と',
      next: 'English',
      expected: 'と' + space + wbr,
    },
    {
      current: 'English',
      next: '、',
      expected: 'English' + space,
    },
    {
      current: '、',
      next: '晴れ',
      expected: '、' + space + wbr,
    },
    {
      current: '晴れ',
      next: '・',
      expected: '晴れ' + space,
    },
    {
      current: '・',
      next: '28',
      expected: '・' + space + wbr,
    },
    {
      current: '28',
      next: '度',
      expected: '28' + space + wbr,
    },
    {
      current: '度',
      next: '。',
      expected: '度',
    },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`adds separators to '${current}' considering '${next}', resulting in '${expected}'`, () => {
      expect(addSeparatorsToSegment(current, next, options)).toEqual(expected)
    })
  })
})

describe('shouldAddWbr', () => {
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
    { current: '度', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns ${expected} for adding <wbr> between '${current}' and '${next}'`, () => {
      expect(shouldAddWbr(current, next)).toEqual(expected)
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
    { current: 'English', next: '、', expected: true },
    { current: '、', next: '晴れ', expected: true },
    { current: '晴れ', next: '・', expected: true },
    { current: '・', next: '28', expected: true },
    { current: '28', next: '度', expected: true },
    { current: '度', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns ${expected} for adding thin space between '${current}' and '${next}'`, () => {
      expect(shouldAddThinSpace(current, next)).toEqual(expected)
    })
  })
})
