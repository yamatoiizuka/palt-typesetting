import esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

// トランスパイルしたいファイルが含まれるディレクトリ
const srcDir = './src'
// 出力先ディレクトリ
const outDir = './dist'

// TypeScriptコンパイラを使用して型定義ファイルを生成
execSync('tsc --declaration --emitDeclarationOnly --outDir ' + outDir)

// 指定ディレクトリ内のすべてのファイルを取得
const files = fs.readdirSync(srcDir).filter(file => file.endsWith('.ts'))

// 各ファイルに対してトランスパイルを実行
files.forEach(file => {
  esbuild
    .build({
      entryPoints: [path.join(srcDir, file)],
      outfile: path.join(outDir, file.replace('.ts', '.js')),
      bundle: false,
      format: 'esm',
      platform: 'browser',
    })
    .catch(() => process.exit(1))
})
