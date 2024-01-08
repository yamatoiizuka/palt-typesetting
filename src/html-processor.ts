import win from './win'
import type { TransformFunction, TypesettingOptions } from './types'

/**
 * HTMLコンテンツの変換と処理を行うクラスです。
 * このクラスは、HTML文字列を解析し、カスタマイズされた変換関数を適用して、
 * 変換されたコンテンツを生成します。
 */
class HTMLProcessor {
  private transformFunctions: TransformFunction[]
  private options: TypesettingOptions

  constructor(transformFunctions: TransformFunction[], options: TypesettingOptions) {
    this.transformFunctions = transformFunctions
    this.options = options
  }

  /**
   * 与えられたHTML文字列に対して、指定された変換関数の配列を順番に適用し、
   * 変換されたHTMLを生成します。
   *
   * @param srcHtml - 変換を適用する元のHTML文字列。
   * @param functions - 順番に適用する変換関数の配列。
   * @return 変換後のHTML文字列。
   */
  processHtmlWithFunctions(srcHtml: string): string {
    if (srcHtml === '') {
      return srcHtml
    }

    return this.transformFunctions.reduce(
      (currentHtml, transformFunction) => this.processHtml(currentHtml, transformFunction),
      srcHtml
    )
  }

  /**
   * HTML文字列を解析し、特定の変換関数を使用してその内容を変換し、
   * 変換されたHTMLを文字列として返します。
   *
   * @param html - 解析および変換するHTML文字列。
   * @param transformFunction - 各テキストノードに適用される変換関数。
   * @return 変換後のHTML内容を含む文字列。テキストが空の場合は、そのまま返されます。
   */
  private processHtml(html: string, transformFunction: TransformFunction): string {
    if (html === '') {
      return html
    }

    const doc = parseFromString(html)
    const textNodes = getTextNodes(doc.body)

    textNodes.forEach((currentNode, index) => {
      const nextNode = textNodes[index + 1] || null
      const transformedHtml = this.getTransformedHtml(currentNode, nextNode, transformFunction)
      this.replaceNode(currentNode, transformedHtml)
    })

    return doc.body.innerHTML
  }

  /**
   * 与えられたノードと、その次のノードに基づいて変換されたHTMLを生成します。
   *
   * @param currentNode - 現在のノード。
   * @param nextNode - 次のノード、または存在しない場合は null。
   * @param transformFunction - ノードの値を変換するための関数。
   * @return 変換されたHTMLコンテンツを含む文字列。
   */
  private getTransformedHtml(currentNode: Node, nextNode: Node | null, transformFunction: TransformFunction): string {
    const transformedHtml = transformFunction(
      currentNode.nodeValue || '',
      nextNode ? nextNode.nodeValue || '' : '',
      this.options
    )
    return transformedHtml
  }

  /**
   * 指定されたノードを、新しいHTMLコンテンツで置き換えます。
   *
   * @param node - 置き換えるノード。
   * @param transformedHtml - ノードに挿入される変換後のHTMLコンテンツ。
   */
  private replaceNode = (node: Node, transformedHtml: string): void => {
    const range = win.document.createRange()
    range.selectNode(node)
    const fragment = range.createContextualFragment(transformedHtml)

    if (node.parentNode) {
      node.parentNode.insertBefore(fragment, node)
      node.parentNode.removeChild(node)
    }
  }
}

/**
 * 文字列からHTMLドキュメントを解析します。
 *
 * @param html - 解析するHTML文字列。
 * @return 解析されたHTMLドキュメント。
 */
const parseFromString = (html: string) => {
  return new win.DOMParser().parseFromString(html, 'text/html')
}

/**
 * 指定されたHTMLElement内のすべてのテキストノードを取得します。
 *
 * @param element - テキストノードを取得する要素。
 * @return 取得したテキストノードの配列。
 */
const getTextNodes = (element: HTMLElement): Node[] => {
  const walk = win.document.createTreeWalker(element, win.NodeFilter.SHOW_TEXT)
  let textNode = walk.nextNode() as Node | null
  const textNodes: Node[] = []

  while (textNode) {
    if (textNode.nodeValue && textNode.nodeValue.trim() !== '') {
      textNodes.push(textNode)
    }
    textNode = walk.nextNode()
  }

  return textNodes
}

export default HTMLProcessor
export { parseFromString, getTextNodes }
