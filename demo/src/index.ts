import Typesetter from 'palt-typesetting'

interface KerningRule {
  between: [string, string]
  value: number
}

interface Options {
  useWordBreak: boolean
  insertThinSpaces: boolean
  noSpaceBetweenNoBreaks: boolean
  wrapLatin: boolean
  kerningRules: KerningRule[]
}

const toggleButton = document.getElementById('toggleButton') as HTMLInputElement

let options = getDefaultOptions()
const target = document.getElementById('target') as HTMLElement
const srcHtml = target.innerHTML
let renderedHtml = ''
let isTypeset = true

// オプションのDOM要素をキャッシュ
const useWordBreakToggle = document.getElementById('useWordBreakToggle') as HTMLInputElement
const insertThinSpacesToggle = document.getElementById('insertThinSpacesToggle') as HTMLInputElement
const wrapLatinToggle = document.getElementById('wrapLatinToggle') as HTMLInputElement
const noSpaceBetweenNoBreaksToggle = document.getElementById('noSpaceBetweenNoBreaksToggle') as HTMLInputElement
const kerningRulesToggle = document.getElementById('kerningRulesToggle') as HTMLInputElement

document.addEventListener('DOMContentLoaded', init)

function init() {
  toggleButton.addEventListener('click', () => {
    toggleTypesetting()
    toggleInputElements(toggleButton.checked)
  })

  updateTypesetting()
  setupEmailLink()
  setupOptionEventListeners()
  setupTargetEventListeners()
}

function setupEmailLink() {
  const emailElement = document.getElementById('email') as HTMLAnchorElement
  if (emailElement) {
    const emailHtml = emailElement.innerHTML.replace('[-]', '@')
    emailElement.innerHTML = emailHtml
    const emailText = emailElement.textContent || ''
    emailElement.href = 'mailto:' + emailText
  }
}

function toggleInputElements(enable: boolean) {
  const inputElements = document.querySelectorAll('#options input[type="checkbox"], #target input[type="checkbox"]')
  inputElements.forEach(element => {
    const input = element as HTMLInputElement
    input.disabled = !enable
  })
}

function getDefaultOptions(): Options {
  return {
    useWordBreak: true,
    insertThinSpaces: true,
    noSpaceBetweenNoBreaks: true,
    wrapLatin: true,
    kerningRules: getKerningRules(true),
  }
}

function setupOptionEventListeners() {
  document.querySelectorAll('#options input[type="checkbox"]').forEach(button => {
    button.addEventListener('change', handleOptionChange)
  })
}

function setupTargetEventListeners() {
  target.addEventListener('change', event => {
    const target = event.target as HTMLInputElement
    if (target.matches('input[type="checkbox"]')) {
      handleTargetCheckboxChange(event)
    }
  })
}

function toggleTypesetting() {
  target.innerHTML = isTypeset ? srcHtml : renderedHtml
  isTypeset = !isTypeset
  setupEmailLink()

  if (isTypeset) {
    synchronizeAndSetupTargetCheckboxes()
  }
}

function handleOptionChange() {
  updateOptions()
  updateTypesetting()
  synchronizeAndSetupTargetCheckboxes()
}

function synchronizeAndSetupTargetCheckboxes() {
  document.querySelectorAll('#target input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleTargetCheckboxChange)

    const checkboxInput = checkbox as HTMLInputElement
    const optionCheckbox = document.getElementById(checkboxInput.dataset.id) as HTMLInputElement
    if (optionCheckbox && optionCheckbox.checked !== checkboxInput.checked) {
      checkboxInput.checked = optionCheckbox.checked
    }
  })
}

function updateOptions() {
  options = {
    useWordBreak: useWordBreakToggle.checked,
    insertThinSpaces: insertThinSpacesToggle.checked,
    wrapLatin: wrapLatinToggle.checked,
    noSpaceBetweenNoBreaks: noSpaceBetweenNoBreaksToggle.checked,
    kerningRules: getKerningRules(kerningRulesToggle.checked),
  }
}

function updateTypesetting() {
  const typesetter = new Typesetter(options)
  renderedHtml = typesetter.render(srcHtml)
  if (isTypeset) {
    target.innerHTML = renderedHtml
  }
}

function handleTargetCheckboxChange(event: Event) {
  const checkbox = event.target as HTMLInputElement
  const optionCheckboxId = checkbox.dataset.id
  if (optionCheckboxId) {
    const optionCheckbox = document.getElementById(optionCheckboxId) as HTMLInputElement
    if (optionCheckbox) {
      optionCheckbox.checked = checkbox.checked
      handleOptionChange()
    }
  }
}

function getKerningRules(isEnabled: boolean): KerningRule[] {
  return isEnabled
    ? [
        { between: ['美', 'し'], value: 60 },
        { between: ['ス', 'ト'], value: 140 },
        { between: ['ブ', 'ラ'], value: -30 },
        { between: ['て', '、'], value: -60 },
        { between: ['す', '。'], value: -120 },
        { between: ['よ', 'う'], value: 60 },
        { between: ['う', 'な'], value: 40 },
        { between: ['さ', 'れ'], value: 20 },
        { between: ['れ', 'た'], value: -60 },
        { between: ['供', 'し'], value: 40 },
        { between: ['し', 'ま'], value: 70 },
      ]
    : []
}
