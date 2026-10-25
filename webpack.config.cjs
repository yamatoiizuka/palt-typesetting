const path = require('path')

module.exports = {
  mode: 'production',
  // dist/ は esbuild で ES2020 に変換済みなので、webpack では変換せずに束ねて圧縮する。
  target: ['web', 'es2020'],
  entry: './dist/index.js',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'typesetter.min.js',
    library: {
      name: 'Typesetter',
      type: 'umd',
      export: 'default',
    },
    globalObject: 'this',
  },
}
