import fs from 'fs'
import os from 'os'
import path from 'path'
import { createRequire } from 'module'
import { pathToFileURL } from 'url'

/**
 * 比較用に @yamatoiizuka/linebreak の内部（classTrie, mapClass, pairTable）を読み込みます。
 * パッケージはこれらを export していないため、ESM ビルドの export 文だけを書き換えた一時ファイルを import します。
 * 開発時の検証専用で、ライブラリ本体からは使用しません。
 *
 * @return { LineBreaker, classOf, pairTable }
 */
export const loadLineBreakReference = async () => {
  const require = createRequire(import.meta.url)
  const cjsPath = require.resolve('@yamatoiizuka/linebreak')
  const modulePath = path.join(path.dirname(cjsPath), 'module.mjs')
  const source = fs.readFileSync(modulePath, 'utf8')

  const exportPattern = /export\s*\{\s*linebreaker_default as default\s*\};?\s*$/
  if (!exportPattern.test(source)) {
    throw new Error(`Unexpected export statement in ${modulePath}`)
  }
  const patched = source.replace(
    exportPattern,
    'export { linebreaker_default as default, classTrie, mapClass, pairTable };\n'
  )

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'palt-linebreak-'))
  const tmpPath = path.join(tmpDir, 'linebreak-reference.mjs')
  fs.writeFileSync(tmpPath, patched)
  try {
    const mod = await import(pathToFileURL(tmpPath).href)
    return {
      LineBreaker: mod.default,
      classOf: codePoint => mod.mapClass(mod.classTrie.get(codePoint)),
      pairTable: mod.pairTable,
    }
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }
}
