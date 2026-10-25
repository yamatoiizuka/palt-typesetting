const rows = await (await fetch('kinsoku-audit.data.json')).json()
document.querySelector('#ua').textContent = navigator.userAgent
const modes = ['before-auto', 'after-auto', 'after-strict', 'after-strict-no-overflow', 'native-strict']
const target = document.querySelector('#samples')
const output = document.querySelector('#result')
output.textContent = ''
const reports = []

function textNodes(element) {
  const nodes = []
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  let offset = 0
  while (walker.nextNode()) {
    nodes.push({ node: walker.currentNode, offset })
    offset += walker.currentNode.length
  }
  return nodes
}

function rangeAt(nodes, index) {
  const entry = nodes.find(({ node, offset }) => index >= offset && index < offset + node.length)
  const offset = index - entry.offset
  const range = document.createRange()
  range.setStart(entry.node, offset)
  range.setEnd(entry.node, offset + String.fromCodePoint(entry.node.data.codePointAt(offset)).length)
  return range
}

function print(text, tag = 'pre', parent = output) {
  const element = document.createElement(tag)
  element.textContent = text
  parent.append(element)
  return element
}

for (const mode of modes) {
  const tests = rows.map(row => {
    const p = document.createElement('p')
    p.className = 'sample'
    p.innerHTML = mode === 'native-strict' ? row.source
      : mode === 'before-auto'
        ? row.html.replace(/<span class="typesetting-opening">([^<]*)<\/span>/gu, '$1')
        : row.html
    if (mode.includes('strict')) p.style.lineBreak = 'strict'
    if (mode.includes('no-overflow')) {
      p.querySelectorAll('.typesetting-word-break').forEach(e => { e.style.overflowWrap = 'normal' })
    }
    target.append(p)
    // Generated pseudo-element spaces do not alter source text offsets.
    if (p.textContent !== row.raw) throw new Error(`Text changed: ${row.label}`)
    const nodes = textNodes(p)
    return {
      ...row, p, a: rangeAt(nodes, row.left), b: rangeAt(nodes, row.right),
      bad: [], wrapped: 0, overflow: 0,
    }
  })
  await document.fonts.ready

  for (let width = 160; width <= 480; width += 4) {
    for (const test of tests) test.p.style.width = `${width}px`
    for (const test of tests) {
      const a = test.a.getBoundingClientRect()
      const b = test.b.getBoundingClientRect()
      // Compare vertical centers across author/generated inline elements.
      if (b.top + b.height / 2 - a.top - a.height / 2 > 24) test.bad.push(width)
      if (test.p.getBoundingClientRect().height > 50) test.wrapped++
      if (test.p.scrollWidth > width + 1) test.overflow++
    }
  }

  const results = tests.map(({ p, a, b, ...result }) => result)
  reports.push({ mode, results })
  print(mode, 'h2')
  for (const group of new Set(tests.map(test => test.group))) {
    const matches = tests.filter(test => test.group === group)
    const bad = matches.reduce((sum, test) => sum + test.bad.length, 0)
    const affected = [...new Set(matches.filter(test => test.bad.length).map(test => test.label))]
    const overflow = matches.reduce((sum, test) => sum + test.overflow, 0)
    print(`${group}: ${bad}/${matches.length * 81} splits; affected: ${affected.join(' ') || 'none'}; overflow ${overflow}`)
  }
  if (mode === 'after-auto') {
    for (const test of tests.filter(test => test.bad.length && test.group !== 'break-control')) {
      print(`DETAIL ${test.group} ${test.label} ${test.variant}: ${test.bad.join(',')}px`)
    }
    for (const group of new Set(tests.map(test => test.group))) {
      if (group === 'break-control') continue
      const test = tests.find(test => test.group === group && test.bad.length)
      if (!test) continue
      const example = document.createElement('div')
      example.className = 'example'
      print(`${group}: ${test.label}, ${test.bad[0]}px, ${test.variant}`, 'pre', example)
      const p = test.p.cloneNode(true)
      p.style.width = `${test.bad[0]}px`
      example.append(p)
      document.querySelector('#examples').append(example)
    }
  }
  target.replaceChildren()
  await new Promise(requestAnimationFrame)
}

const details = document.createElement('details')
print('Full JSON report', 'summary', details)
print(JSON.stringify({ ua: navigator.userAgent, reports }), 'pre', details).id = 'report'
document.body.append(details)
target.remove()
document.title = 'COMPLETE: SSG kinsoku audit'
