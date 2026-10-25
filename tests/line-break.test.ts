import { describe, it, expect } from 'vitest'
import { getLineBreakClass, canBreakBetween } from '../src/line-break'
import { MAX_CODE_POINT, readLineBreakClasses, readLineBreakPairTests } from '../scripts/line-break-ucd.js'

// src/line-break.ts を Unicode 15.0.0 の公式データ（scripts/ucd/）と照合する。

// 2 文字のペア表では表せない、前後の文脈や East_Asian_Width に依存する規則による既知の差異。
// 従来 linebreak に 2 文字だけを渡していた挙動との互換のため、そのままにしている。
const KNOWN_DIFFERENCES = new Set([
  // LB25: 数値の前後（PR/PO と OP、CL/CP と PR/PO、IS/SY と NU）は数値の文脈があるときだけ改行しない。
  '0025 0028',
  '0024 0028',
  '007D 0025',
  '007D 0024',
  '0029 0025',
  '0029 0024',
  '002C 0030',
  '002F 0030',
  // LB30: East_Asian_Width が F, W, H の OP の前では改行できる。
  '0023 2329',
  '05D0 2329',
  '0030 2329',
  '0025 2329',
  '0024 2329',
  '0001 2329',
  '00A7 2329',
  '50005 2329',
  '0E01 2329',
  // LB30b: 未割り当ての Extended_Pictographic と EM の間では改行しない。
  '1F02C 1F3FF',
])

const hex = (char: string) => (char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')

describe('line-break', () => {
  it('classifies every code point like LineBreak.txt', () => {
    const classes = readLineBreakClasses()
    let mismatches = 0
    for (let cp = 0; cp <= MAX_CODE_POINT; cp++) {
      if (getLineBreakClass(cp) !== classes[cp]) mismatches++
    }
    expect(mismatches).toBe(0)
  })

  it('decides breaks like the two-code-point cases of LineBreakTest.txt', () => {
    const cases = readLineBreakPairTests()
    const differences = cases
      .filter(({ before, after, breakable }) => canBreakBetween(before, after) !== breakable)
      .map(({ before, after }) => `${hex(before)} ${hex(after)}`)
    expect(cases.length).toBeGreaterThan(1800)
    expect(differences.sort()).toEqual([...KNOWN_DIFFERENCES].sort())
  })

  it('does not break inside a surrogate pair split across text nodes', () => {
    expect(canBreakBetween('\uD83D', '\uDE00')).toBe(false)
  })

  it('handles typical Japanese and Latin boundaries', () => {
    expect(canBreakBetween('日', '本')).toBe(true)
    expect(canBreakBetween('日', '。')).toBe(false)
    expect(canBreakBetween('「', '日')).toBe(false)
    expect(canBreakBetween('a', 'b')).toBe(false)
    expect(canBreakBetween(' ', 'a')).toBe(true)
    expect(canBreakBetween('\n', 'a')).toBe(true)
  })
})
