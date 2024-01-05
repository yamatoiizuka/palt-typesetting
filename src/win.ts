import { JSDOM } from 'jsdom'

/**
 * 環境に応じて適切なWindowオブジェクトを提供します。
 * ブラウザ環境ではグローバルなwindowオブジェクトを、
 * Node.js環境ではJSDOMにより生成されたwindowオブジェクトを使用します。
 *
 * @return 環境に適したWindowオブジェクト
 */
const win = (() => {
  if (typeof window !== 'undefined') {
    // ブラウザ環境
    return window
  } else {
    // Node.js環境
    return new JSDOM().window
  }
})()

export default win
