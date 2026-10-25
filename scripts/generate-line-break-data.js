import fs from 'fs'
import { MAX_CODE_POINT, SOURCE_URL, UNICODE_VERSION, readLineBreakClasses } from './line-break-ucd.js'

// scripts/ucd/LineBreak-15.0.0.txt（Unicode 15.0.0 の Line_Break プロパティ）から src/line-break-data.ts を生成します。
// 使い方: node scripts/generate-line-break-data.js
// Unicode を更新するときは、scripts/ucd/ のファイルと line-break-ucd.js の UNICODE_VERSION を差し替えます。

const OUT_FILE = './src/line-break-data.ts'

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

const { encoded, rangeCount } = encodeRanges(readLineBreakClasses())

const output = `// このファイルは scripts/generate-line-break-data.js で生成されています。直接編集しないでください。
// Source: ${SOURCE_URL}
// Line_Break クラスの区間表（${rangeCount} 区間）。形式は scripts/generate-line-break-data.js の encodeRanges を参照。

export const LINE_BREAK_UNICODE_VERSION = '${UNICODE_VERSION}'

export const LINE_BREAK_RANGES =
  '${encoded}'
`
fs.writeFileSync(OUT_FILE, output)
console.log(`Wrote ${OUT_FILE}: ${rangeCount} ranges, ${encoded.length} chars`)
