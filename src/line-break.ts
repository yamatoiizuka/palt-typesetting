import { LINE_BREAK_RANGES } from './line-break-data.js'

/**
 * UAX #14 に基づく、2 文字間の改行可否の判定です。
 * linebreak（foliojs/linebreak）の LineBreaker を、2 コードポイントの入力に特化させたものです。
 * クラス番号と PAIR_TABLE は linebreak と同じ並びです。
 */

const WJ = 22
const ZWJ = 31
const BK = 34
const CR = 36
const LF = 37
const NL = 38
const SP = 41

const DI_BRK = 0 // 直接の改行機会
const IN_BRK = 1 // 間接の改行機会（間に空白があれば改行可）
const CI_BRK = 2 // 結合文字が続く場合の間接の改行機会

// linebreak の pairTable。行が直前、列が直後のクラス（OP から CB まで）。
// 値は 0: DI_BRK, 1: IN_BRK, 2: CI_BRK, 3: CP_BRK, 4: PR_BRK。
// prettier-ignore
const PAIR_TABLE = [
  '444444444444444444444344444444444', // OP
  '044114444110000111004240000000010', // CL
  '044114444111110111004240000000010', // CP
  '444111444111111111114241111111111', // QU
  '144111444111111111114241111111111', // GL
  '044111444000000111004240000000010', // NS
  '044111444000000111004240000000010', // EX
  '044111444001010111004240000000010', // SY
  '044111444001110111004240000000010', // IS
  '144111444001111111004241111101110', // PR
  '144111444001110111004240000000010', // PO
  '144111444111110111004240000000010', // NU
  '144111444111110111004240000000010', // AL
  '144111444111110111004240000000010', // HL
  '044111444010000111004240000000010', // ID
  '044111444000000111004240000000010', // IN
  '044101444001000111004240000000010', // HY
  '044101444000000111004240000000010', // BA
  '144111444111111111114241111111110', // BB
  '044111444000000111044240000000010', // B2
  '000000000000000000004000000000000', // ZW
  '144111444111110111004240000000010', // CM
  '144111444111111111114241111111111', // WJ
  '044111444010000111004240001100010', // H2
  '044111444010000111004240000100010', // H3
  '044111444010000111004241111000010', // JL
  '044111444010000111004240001100010', // JV
  '044111444010000111004240000100010', // JT
  '044111444000000111004240000010010', // RI
  '044111444010000111004240000000110', // EB
  '044111444010000111004240000000010', // EM
  '144111444111110111004240000000010', // ZWJ
  '044110444000000000004240000000010', // CB
]

const rangeStarts: number[] = []
const rangeClasses: number[] = []

// 区間表を展開する。形式は scripts/generate-line-break-data.js の encodeRanges を参照。
{
  let start = 0
  let delta = 0
  for (let i = 0; i < LINE_BREAK_RANGES.length; i++) {
    const code = LINE_BREAK_RANGES.charCodeAt(i)
    if (code >= 97) {
      delta = delta * 26 + (code - 97)
    } else {
      start += delta
      rangeStarts.push(start)
      rangeClasses.push(code - 48)
      delta = 0
    }
  }
}

/**
 * コードポイントの Line_Break クラスを返します（AI, SA, SG, XX は AL、CJ は NS に解決済み）。
 * @param codePoint - コードポイント
 * @return クラス番号
 */
const getLineBreakClass = (codePoint: number): number => {
  let low = 0
  let high = rangeStarts.length - 1
  while (low < high) {
    const mid = (low + high + 1) >> 1
    if (rangeStarts[mid] <= codePoint) {
      low = mid
    } else {
      high = mid - 1
    }
  }
  return rangeClasses[low]
}

/**
 * 2 文字の間で改行できるかを判定します。
 * それぞれ 1 コードポイントの文字列を渡します。連結した結果が 2 コードポイントにならない場合
 * （分かれたサロゲートペアが結合する場合など）は、改行しないものとして false を返します。
 * @param before - 前の文字
 * @param after - 後の文字
 * @return 改行可能かどうか
 */
const canBreakBetween = (before: string, after: string): boolean => {
  const codePoints = Array.from(before + after)
  if (codePoints.length !== 2) return false

  const first = getLineBreakClass(codePoints[0].codePointAt(0) ?? 0)
  const second = getLineBreakClass(codePoints[1].codePointAt(0) ?? 0)

  // LB4, LB5: 強制改行の後は改行する。
  if (first === BK || first === LF || first === NL) return true
  if (first === CR) return second !== LF

  // LB6, LB7: 改行文字と空白の前では改行しない。
  if (second === SP || second === BK || second === LF || second === NL || second === CR) return false

  // LB8a: ZWJ の後では改行しない。
  if (first === ZWJ) return false

  // linebreak は先頭の空白を WJ として扱い（mapFirst）、間接の改行機会は直前が空白のときだけ有効にする。
  const pair = PAIR_TABLE[first === SP ? WJ : first].charCodeAt(second) - 48
  if (pair === DI_BRK) return true
  return first === SP && (pair === IN_BRK || pair === CI_BRK)
}

export { getLineBreakClass, canBreakBetween }
