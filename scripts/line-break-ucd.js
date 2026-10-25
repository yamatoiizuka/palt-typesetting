import fs from 'fs'
import { fileURLToPath } from 'url'

/**
 * scripts/ucd/ に置いた Unicode 公式データ（LineBreak.txt, LineBreakTest.txt）を読み込みます。
 * 区間表の生成（scripts/generate-line-break-data.js）とテスト（tests/line-break.test.ts）で共有します。
 * 開発時専用で、ライブラリ本体からは使用しません。
 */

export const UNICODE_VERSION = '15.0.0'
export const SOURCE_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}/ucd/LineBreak.txt`
export const MAX_CODE_POINT = 0x10ffff

const ucdPath = name => fileURLToPath(new URL(`./ucd/${name}-${UNICODE_VERSION}.txt`, import.meta.url))

// src/line-break.ts のクラス番号と PAIR_TABLE の並び（OP から CB まで）に一致させる。
export const CLASS_NAMES = [
  'OP', 'CL', 'CP', 'QU', 'GL', 'NS', 'EX', 'SY', 'IS', 'PR', 'PO', 'NU', 'AL', 'HL', 'ID', 'IN', 'HY',
  'BA', 'BB', 'B2', 'ZW', 'CM', 'WJ', 'H2', 'H3', 'JL', 'JV', 'JT', 'RI', 'EB', 'EM', 'ZWJ', 'CB',
  'AI', 'BK', 'CJ', 'CR', 'LF', 'NL', 'SA', 'SG', 'SP', 'XX',
]
const classId = name => {
  const id = CLASS_NAMES.indexOf(name)
  if (id < 0) throw new Error(`Unknown Line_Break class: ${name}`)
  return id
}

// UAX #14 LB1 の解決を済ませる。
const RESOLVED = { AI: 'AL', SA: 'AL', SG: 'AL', XX: 'AL', CJ: 'NS' }

const readUcd = name => {
  const text = fs.readFileSync(ucdPath(name), 'utf8')
  if (!text.startsWith(`# ${name}-${UNICODE_VERSION}.txt`)) {
    throw new Error(`Expected ${name}-${UNICODE_VERSION}.txt`)
  }
  return text
}

/**
 * LineBreak.txt から、全コードポイントの Line_Break クラス（LB1 で解決済み）を読み込みます。
 * @return コードポイントを添字とするクラス番号の配列
 */
export const readLineBreakClasses = () => {
  const text = readUcd('LineBreak')
  const classes = new Uint8Array(MAX_CODE_POINT + 1)

  // @missing 行（既定値）を先に適用し、その上に明示的な値を重ねる。
  const missing = [...text.matchAll(/^# @missing: ([0-9A-F]+)\.\.([0-9A-F]+); (\w+)/gm)]
  const entries = [...text.matchAll(/^([0-9A-F]+)(?:\.\.([0-9A-F]+))?\s*;\s*(\w+)/gm)]
  for (const [, start, end, name] of [...missing, ...entries]) {
    classes.fill(classId(RESOLVED[name] ?? name), parseInt(start, 16), parseInt(end ?? start, 16) + 1)
  }
  return classes
}

/**
 * LineBreakTest.txt から、2 コードポイントだけのテストケースを読み込みます。
 * @return { before, after, breakable, comment } の配列
 */
export const readLineBreakPairTests = () => {
  const cases = []
  for (const line of readUcd('LineBreakTest').split('\n')) {
    const [body, comment = ''] = line.split('#')
    const tokens = body.trim().split(/\s+/)
    // 例: "× 0023 ÷ 2329 ÷"
    if (tokens.length !== 5) continue
    cases.push({
      before: String.fromCodePoint(parseInt(tokens[1], 16)),
      after: String.fromCodePoint(parseInt(tokens[3], 16)),
      breakable: tokens[2] === '÷',
      comment: comment.trim(),
    })
  }
  return cases
}
