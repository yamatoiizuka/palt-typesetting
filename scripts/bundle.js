const esbuild = require('esbuild')
const fs = require('fs')
const path = require('path')

const baseDir = './dist/'
const entryPoint = 'bundle-entry-point.js'
const typesDefFile = 'bundle-entry-point.d.ts'
const typesMapFile = 'bundle-entry-point.d.ts.map'

// ファイル削除のヘルパー関数
const deleteFile = filePath => {
  fs.unlink(filePath, err => {
    if (err) {
      console.error(`Failed to delete ${filePath}`, err)
    } else {
      console.log(`${filePath} was deleted successfully`)
    }
  })
}

esbuild
  .build({
    entryPoints: [path.join(baseDir, entryPoint)],
    bundle: true,
    outfile: './bundle/typesetter.min.js',
    minify: true,
    sourcemap: true,
    platform: 'browser',
    target: 'es2016',
    globalName: 'Typesetter',
  })
  .then(() => {
    // ビルド成功後、不要なファイルを削除
    deleteFile(path.join(baseDir, entryPoint))
    deleteFile(path.join(baseDir, typesDefFile))
    deleteFile(path.join(baseDir, typesMapFile))
  })
  .catch(() => {
    console.error('Build failed')
    process.exit(1)
  })
