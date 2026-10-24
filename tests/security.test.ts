import { describe, expect, test } from 'vitest'
import { JSDOM } from 'jsdom'
import Typesetter from '../src/index'
import { createThinSpace } from '../src/util-tags'

const unsafeWidths = [
  '0.2em" onmouseover="globalThis.__paltProbe=1',
  '0.2em"><img src=x onerror="globalThis.__paltProbe=1">',
  '0.2em; background-image: url(https://example.invalid/probe)',
  '0.2em&quot; onmouseover=&quot;globalThis.__paltProbe=1',
  '0.2em\\22 onmouseover=probe',
  '0.2em/*',
  '0.2em*/',
  '0.2em\ncolor:red',
  '',
]

describe('generated HTML security', () => {
  test.each(unsafeWidths)('rejects unsafe spacing value %j throughout the rendering pipeline', width => {
    const input = '日本語ABC・日本語'
    const output = new Typesetter({ thinSpaceWidth: width }).render(input)
    expect(output).toBe(new Typesetter().render(input))
    const fragment = JSDOM.fragment(output)
    expect(fragment.querySelector('img, script, [onmouseover], [onerror]')).toBeNull()
    expect(fragment.textContent).toBe(input)
  })

  test.each(['0.2em', '2px', '20%', '0', '-0.1em', 'calc(1em / 2)', 'var(--spacing, 0.2em)', 'clamp(0px, 1vw, 2px)'])(
    'preserves supported spacing expression %s', width => {
      const fragment = JSDOM.fragment(createThinSpace(width))
      expect(fragment.firstElementChild?.getAttribute('style')).toBe(`letter-spacing: ${width};`)
    }
  )

  test('direct spacer generation cannot introduce HTML or additional CSS declarations', () => {
    for (const width of unsafeWidths) {
      expect(createThinSpace(width)).toBe(createThinSpace('0.2em'))
    }
  })

  test('renderToElements does not install an injected event handler', () => {
    const dom = new JSDOM('<div id="target">日本語ABC</div>', { runScripts: 'dangerously' })
    try {
      const target = dom.window.document.getElementById('target')!
      new Typesetter({ thinSpaceWidth: unsafeWidths[0] }).renderToElements(target)
      for (const element of target.querySelectorAll('*')) {
        element.dispatchEvent(new dom.window.Event('mouseover'))
      }
      expect(dom.window.__paltProbe).toBeUndefined()
      expect(target.querySelector('[onmouseover]')).toBeNull()
    } finally {
      dom.window.close()
    }
  })
})
