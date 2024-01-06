import { JSDOM } from 'jsdom'

/**
 * Node.js環境で使用するためにJSDOMライブラリを利用してwindowオブジェクトを提供します。
 * これにより、Node.js環境でのDOM操作が可能となります。
 *
 * @return JSDOMにより生成されたWindowオブジェクト。
 */
const win = new JSDOM().window

export default win
