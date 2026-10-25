import { describe, it, expect } from 'vitest'
import HTMLProcessor from '../src/html-processor'
import Typesetter from '../src/index'
import type { TransformFunction } from '../types'

describe('HTMLProcessor', () => {
  it('calls transform functions from the first text to the last, passing the untransformed next text', () => {
    const calls: [string, string][] = []
    let count = 0
    const transform: TransformFunction = (current, next) => {
      calls.push([current, next])
      return `${++count}:${current}`
    }

    const output = new HTMLProcessor([transform], {}).processHtmlWithFunctions('<b>A</b> <i>B</i>C')

    expect(output).toBe('<b>1:A</b> <i>2:B</i>3:C')
    expect(calls).toEqual([
      ['A', ' '],
      ['B', 'C'],
      ['C', ''],
    ])
  })

  it('does not replace comments in the input that look like protection placeholders', () => {
    const typesetter = new Typesetter()
    for (const html of [
      '<pre>X</pre><!--__TYPESETTING_PROTECTED_BLOCK__0-->',
      '<span class="typesetting-latin">A</span><!--__TYPESETTING_PROTECTED_GENERATED__0-->',
    ]) {
      expect(typesetter.render(html)).toBe(html)
    }
  })
})
