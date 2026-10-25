import { afterEach, describe, expect, test, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import Typesetter from '../src/index'

const windows: JSDOM['window'][] = []
const createDocument = () => {
  const { window } = new JSDOM('<main><p>日本語ABC</p></main><p>対象外DEF</p>')
  windows.push(window)
  return window.document
}

afterEach(() => {
  vi.unstubAllGlobals()
  windows.splice(0).forEach(window => window.close())
})

describe('optional DOM integration', () => {
  test('renders strings and allows selector calls without a global DOM', () => {
    vi.stubGlobal('document', undefined)
    vi.stubGlobal('window', undefined)
    const typesetter = new Typesetter()
    expect(typesetter.render('日本語ABC')).toContain('typesetting-latin')
    expect(() => typesetter.renderToSelector('p')).not.toThrow()
    expect(() => typesetter.renderToSelector(null)).not.toThrow()
  })

  test('uses a document provided after the Typesetter was created', () => {
    vi.stubGlobal('document', undefined)
    const typesetter = new Typesetter()
    const doc = createDocument()
    vi.stubGlobal('document', doc)
    typesetter.renderToSelector('main p')
    expect(doc.querySelector('main p')?.innerHTML).toContain('typesetting-latin')
    expect(doc.querySelector('body > p')?.innerHTML).toBe('対象外DEF')
  })

  test('accepts an explicit document without installing DOM globals', () => {
    vi.stubGlobal('document', undefined)
    const doc = createDocument()
    new Typesetter().renderToSelector('main p', doc)
    expect(doc.querySelector('main p')?.innerHTML).toContain('typesetting-latin')
  })

  test('scopes selection to an explicit element rather than the global document', () => {
    const doc = createDocument()
    const other = createDocument()
    vi.stubGlobal('document', other)
    new Typesetter().renderToSelector('p', doc.querySelector('main'))
    expect(doc.querySelector('main p')?.innerHTML).toContain('typesetting-latin')
    expect(doc.querySelector('body > p')?.innerHTML).toBe('対象外DEF')
    expect(other.querySelector('main p')?.innerHTML).toBe('日本語ABC')
  })

  test('renderToElements works with caller-owned elements without a global DOM', () => {
    vi.stubGlobal('document', undefined)
    const doc = createDocument()
    const element = doc.querySelector('main p')!
    new Typesetter().renderToElements(element)
    expect(element.innerHTML).toContain('typesetting-latin')
  })

  test('retains invalid-selector errors when a DOM is available', () => {
    expect(() => new Typesetter().renderToSelector('[', createDocument())).toThrow()
  })
})
