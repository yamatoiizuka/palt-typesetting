import { describe, it, expect, beforeAll } from 'vitest'
import { getLineBreakClass, canBreakBetween } from '../src/line-break'
import { loadLineBreakReference } from '../scripts/linebreak-reference.js'

// src/line-break.ts が @yamatoiizuka/linebreak と同じ結果を返すことを全数で確認する。
// 2 文字の判定は 2 文字のクラスだけで決まるため、
// 全コードポイントのクラス一致と、クラスが同じ区間の代表同士の全ペア一致で、全ペアの一致が保証される。

const MAX_CODE_POINT = 0x10ffff

let reference: Awaited<ReturnType<typeof loadLineBreakReference>>

beforeAll(async () => {
  reference = await loadLineBreakReference()
})

const referenceBreakable = (before: string, after: string): boolean => {
  const breakOpportunity = new reference.LineBreaker(before + after).nextBreak()
  return !!breakOpportunity && breakOpportunity.position === before.length
}

describe('line-break', () => {
  it('classifies every code point like linebreak', () => {
    let mismatches = 0
    for (let cp = 0; cp <= MAX_CODE_POINT; cp++) {
      if (getLineBreakClass(cp) !== reference.classOf(cp)) mismatches++
    }
    expect(mismatches).toBe(0)
  })

  it('decides breaks like linebreak for every pair of class ranges', () => {
    // 区間の先頭に加え、単独のサロゲートの境界も代表に含める。
    const representatives = new Set([0xd800, 0xdbff, 0xdc00, 0xdfff])
    for (let cp = 0; cp <= MAX_CODE_POINT; cp++) {
      if (cp === 0 || reference.classOf(cp - 1) !== reference.classOf(cp)) representatives.add(cp)
    }
    const chars = Array.from(representatives, cp => String.fromCodePoint(cp))

    const mismatches: string[] = []
    for (const before of chars) {
      for (const after of chars) {
        if (canBreakBetween(before, after) !== referenceBreakable(before, after)) {
          mismatches.push(`U+${before.codePointAt(0)?.toString(16)} U+${after.codePointAt(0)?.toString(16)}`)
        }
      }
    }
    expect(chars.length).toBeGreaterThan(2000)
    expect(mismatches.slice(0, 10)).toEqual([])
  })

  it('does not break inside a surrogate pair split across text nodes', () => {
    expect(canBreakBetween('\uD83D', '\uDE00')).toBe(false)
    expect(referenceBreakable('\uD83D', '\uDE00')).toBe(false)
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
