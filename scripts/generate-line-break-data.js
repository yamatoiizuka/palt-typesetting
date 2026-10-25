import fs from 'fs'
import { loadLineBreakReference } from './linebreak-reference.js'

// Unicode 15.0.0 の Line_Break プロパティから src/line-break-data.ts を生成します。
// 使い方: node scripts/generate-line-break-data.js [LineBreak.txt のパス]
// パスを省略すると unicode.org から取得します。

const UNICODE_VERSION = '15.0.0'
const SOURCE_URL = `https://www.unicode.org/Public/${UNICODE_VERSION}/ucd/LineBreak.txt`
const OUT_FILE = './src/line-break-data.ts'
const MAX_CODE_POINT = 0x10ffff

// linebreak（@yamatoiizuka/linebreak）と同じクラス番号。pairTable の添字と一致させる。
const CLASS_NAMES = [
  'OP', 'CL', 'CP', 'QU', 'GL', 'NS', 'EX', 'SY', 'IS', 'PR', 'PO', 'NU', 'AL', 'HL', 'ID', 'IN', 'HY',
  'BA', 'BB', 'B2', 'ZW', 'CM', 'WJ', 'H2', 'H3', 'JL', 'JV', 'JT', 'RI', 'EB', 'EM', 'ZWJ', 'CB',
  'AI', 'BK', 'CJ', 'CR', 'LF', 'NL', 'SA', 'SG', 'SP', 'XX',
]
const classId = name => {
  const id = CLASS_NAMES.indexOf(name)
  if (id < 0) throw new Error(`Unknown Line_Break class: ${name}`)
  return id
}

// linebreak の mapClass と同じ解決を生成時に済ませ、区間数を減らす（UAX #14 LB1）。
const RESOLVED = { AI: 'AL', SA: 'AL', SG: 'AL', XX: 'AL', CJ: 'NS' }
const resolveClass = id => classId(RESOLVED[CLASS_NAMES[id]] ?? CLASS_NAMES[id])
const XX = classId('XX')

const readSource = async () => {
  const file = process.argv[2]
  if (file) return fs.readFileSync(file, 'utf8')
  const res = await fetch(SOURCE_URL)
  if (!res.ok) throw new Error(`Failed to fetch ${SOURCE_URL}: ${res.status}`)
  return res.text()
}

const parseLineBreak = text => {
  if (!text.startsWith(`# LineBreak-${UNICODE_VERSION}.txt`)) {
    throw new Error(`Expected LineBreak-${UNICODE_VERSION}.txt`)
  }
  const classes = new Uint8Array(MAX_CODE_POINT + 1)

  // @missing 行（既定値）を先に適用し、その上に明示的な値を重ねる。
  const missing = [...text.matchAll(/^# @missing: ([0-9A-F]+)\.\.([0-9A-F]+); (\w+)/gm)]
  const entries = [...text.matchAll(/^([0-9A-F]+)(?:\.\.([0-9A-F]+))?\s*;\s*(\w+)/gm)]
  for (const [, start, end, name] of [...missing, ...entries]) {
    classes.fill(classId(name), parseInt(start, 16), parseInt(end ?? start, 16) + 1)
  }

  fillEnclosedGaps(classes)
  return classes.map(resolveClass)
}

/**
 * linebreak の trie 互換にするための補完。
 * 一覧にない（XX の）区間の前後が同じクラスなら、その区間をそのクラスで埋める。
 * 例: U+09C5（ベンガル文字ブロックの未割り当て）は前後の CM に合わせて CM になる。
 */
const fillEnclosedGaps = classes => {
  for (let start = 1; start <= MAX_CODE_POINT; start++) {
    if (classes[start] !== XX || classes[start - 1] === XX) continue
    let end = start
    while (end < MAX_CODE_POINT && classes[end + 1] === XX) end++
    if (end < MAX_CODE_POINT && classes[start - 1] === classes[end + 1]) {
      classes.fill(classes[start - 1], start, end + 1)
    }
    start = end
  }
}

/**
 * 同じクラスが続く区間を「開始位置の差分（a-z の 26 進数）+ クラス（'0' + クラス番号）」で連結します。
 * クラス番号は最大で SP = 41（'Y'）なので、2 種類の文字が重なることはありません。
 */
const encodeRanges = classes => {
  let encoded = ''
  let rangeCount = 0
  let lastStart = 0
  for (let cp = 0; cp <= MAX_CODE_POINT; cp++) {
    if (cp > 0 && classes[cp] === classes[cp - 1]) continue
    let delta = cp - lastStart
    let digits = ''
    while (delta > 0) {
      digits = String.fromCharCode(97 + (delta % 26)) + digits
      delta = Math.floor(delta / 26)
    }
    encoded += digits + String.fromCharCode(48 + classes[cp])
    lastStart = cp
    rangeCount++
  }
  return { encoded, rangeCount }
}

const verifyAgainstReference = async classes => {
  const { classOf } = await loadLineBreakReference()
  let mismatches = 0
  for (let cp = 0; cp <= MAX_CODE_POINT; cp++) {
    if (classOf(cp) !== classes[cp]) {
      if (mismatches < 10) {
        console.error(`U+${cp.toString(16).toUpperCase()}: data=${CLASS_NAMES[classes[cp]]} linebreak=${CLASS_NAMES[classOf(cp)]}`)
      }
      mismatches++
    }
  }
  if (mismatches > 0) throw new Error(`${mismatches} code points differ from @yamatoiizuka/linebreak`)
}

const classes = parseLineBreak(await readSource())
await verifyAgainstReference(classes)
const { encoded, rangeCount } = encodeRanges(classes)

const output = `// このファイルは scripts/generate-line-break-data.js で生成されています。直接編集しないでください。
// Source: ${SOURCE_URL}
// Line_Break クラスの区間表（${rangeCount} 区間）。形式は scripts/generate-line-break-data.js の encodeRanges を参照。

export const LINE_BREAK_UNICODE_VERSION = '${UNICODE_VERSION}'

export const LINE_BREAK_RANGES =
  '${encoded}'
`
fs.writeFileSync(OUT_FILE, output)
console.log(`Wrote ${OUT_FILE}: ${rangeCount} ranges, ${encoded.length} chars`)
