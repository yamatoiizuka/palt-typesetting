import { CharClass, LanguageClass } from '../src/util-text-classes'
import { describe, it, expect } from 'vitest'

describe('CharClass.shouldAddThinSpace', () => {
  const tests = [
    { current: '─', next: '─', expected: false },
    { current: '─', next: '「', expected: true },
    { current: '「', next: 'こんにちは', expected: false },
    { current: 'こんにちは', next: '。', expected: false },
    { current: '。', next: '」', expected: false },
    { current: '」', next: '日本語', expected: true },
    { current: '日本語', next: 'と', expected: false },
    { current: 'と', next: 'English', expected: false },
    { current: 'English', next: '、', expected: false },
    { current: '、', next: '晴れ', expected: true },
    { current: '晴れ', next: '・', expected: true },
    { current: '・', next: '28', expected: true },
    { current: '28', next: '度', expected: false },
    { current: '度', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns ${expected} for adding thin space between '${current}' and '${next}'`, () => {
      expect(CharClass.shouldAddThinSpace(current, next)).toEqual(expected)
    })
  })
})

describe('LanguageClass.shouldAddThinSpace', () => {
  const tests = [
    { current: '─', next: '─', expected: false },
    { current: '─', next: '「', expected: false },
    { current: '「', next: 'こんにちは', expected: false },
    { current: 'こんにちは', next: '。', expected: false },
    { current: '。', next: '」', expected: false },
    { current: '」', next: '日本語', expected: false },
    { current: '日本語', next: 'と', expected: false },
    { current: 'と', next: 'English', expected: true },
    { current: 'English', next: '、', expected: true },
    { current: '、', next: '晴れ', expected: false },
    { current: '晴れ', next: '・', expected: false },
    { current: '・', next: '28', expected: true },
    { current: '28', next: '度', expected: true },
    { current: '度', next: '。', expected: false },
  ]

  tests.forEach(({ current, next, expected }) => {
    it(`returns true or false for adding thin space based on language features between '${current}' and '${next}'`, () => {
      expect(LanguageClass.shouldAddThinSpace(current, next)).toEqual(expected)
    })
  })
})
