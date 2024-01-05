import { parseFromString, getTextNodes } from '../src/html-processor'

describe('getTextNodes', () => {
  it('should return only valid text nodes from a given HTMLElement', () => {
    const htmlString = `
      <div>
        <p>──「こんにちは。」日本語とEnglish、晴れ・28度。</p>
        <p>「合成フォント」の見本。</p>
      </div>
    `
    const expectedTexts = ['──「こんにちは。」日本語とEnglish、晴れ・28度。', '「合成フォント」の見本。']

    const doc = parseFromString(htmlString)
    const textNodes = getTextNodes(doc.body)

    expect(textNodes.length).toEqual(expectedTexts.length)
    textNodes.forEach((node, index) => {
      expect(node.textContent).toEqual(expectedTexts[index])
    })
  })
})
