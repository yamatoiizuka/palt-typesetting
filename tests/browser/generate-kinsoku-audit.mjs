// Run after npm run build. Node performs the typesetting, just as in SSG.
import Typesetter from '../../dist/index.js'
import { writeFile } from 'node:fs/promises'

const cases = []
function add(group, fragment, left, right = left + 1) {
  cases.push({ group, fragment, left, right })
}

// Expectations are curated independently of Palt's canBreakBetween implementation.
const pairs = [
  '（）', '［］', '｛｝', '〔〕', '〈〉', '《》', '「」', '『』', '【】',
  '〘〙', '〖〗', '“”', '‘’', '()', '[]', '{}', '｟｠', '〝〟', '〝〞',
  '｢｣', '〚〛', '«»', '‹›',
]
for (const [opening, closing] of pairs) {
  add('opening', `${opening}未来予測${closing}`, 0)
  add('closing', `未来${closing}`, 1)
}
for (const c of '、。，．,.') add('comma-period', `未来${c}予測`, 1)
for (const c of '！？!?‼⁇⁈⁉') add('question-exclamation', `未来${c}予測`, 1)
for (const c of '・：；･') add('middle-dot', `未来${c}予測`, 1)
for (const c of '々〻ゝゞヽヾ') add('iteration', `人${c}の話`, 0)
for (const pair of ['が', 'ぱ', 'ｶﾞ', 'ﾊﾟ']) add('combining', `${pair}の話`, 0)
for (const c of 'ーｰ') add('prolonged', `カ${c}ド`, 0)
const smallKana = 'ぁぃぅぇぉっゃゅょゎゕゖァィゥェォッャュョヮヵヶ' +
  'ㇰㇱㇲㇳㇴㇵㇶㇷㇸㇹㇺㇻㇼㇽㇾㇿｧｨｩｪｫｯｬｭｮ𛄲𛅐𛅑𛅒𛅕𛅤𛅥𛅦'
for (const c of smallKana) add('small-kana', `カ${c}の話`, 0)
for (const c of '‐–〜゠') add('hyphen', `朝${c}夜`, 0)
for (const text of ['……', '‥‥', '——', '──', '＿＿', '━━']) add('inseparable', `話${text}続く`, 1)
for (const c of '％‰℃°') add('suffix', `三${c}です`, 0)
for (const c of '￥＄£€') add('prefix', `${c}三百円`, 0)

// Word-integrity control and a deliberately breakable boundary after a full stop.
add('word-control', '図書館の話', 0)
add('word-control', '図書館の話', 1)
add('break-control', '朝。夜', 1)

const typesetter = new Typesetter({ thinSpaceWidth: '0.15em' })
const prefix = '今日は静かな朝です。最近の興味は'
const rows = []
for (const c of cases) {
  for (const variant of ['plain', 'inline', 'kerning']) {
    // The current public kerning validator accepts only BMP characters.
    if (variant === 'kerning' && c.fragment.codePointAt(c.right) > 0xffff) continue
    const fragment = variant === 'inline'
      ? `${c.fragment.slice(0, c.right)}<em>${c.fragment.slice(c.right)}</em>`
      : c.fragment
    const source = `${prefix}${fragment}の話です。`
    const renderer = variant === 'kerning'
      ? new Typesetter({
        thinSpaceWidth: '0.15em',
        kerningRules: [{
          between: [[...c.fragment.slice(c.left)][0], [...c.fragment.slice(c.right)][0]],
          value: -50,
        }],
      })
      : typesetter
    rows.push({
      ...c, label: c.fragment, variant, source,
      raw: `${prefix}${c.fragment}の話です。`,
      left: prefix.length + c.left,
      right: prefix.length + c.right,
      html: renderer.render(source),
    })
  }
}
await writeFile(new URL('./kinsoku-audit.data.json', import.meta.url), JSON.stringify(rows))
console.log(`${cases.length} targets; ${rows.length} markup variants`)
