import './style.css'
import './module/typekit'
import Typesetter from 'palt-typesetting'
import type { TypesettingOptions, KerningRule } from 'palt-typesetting'

// HTML要素の取得
const toggleButton = document.getElementById('toggleButton') as HTMLInputElement
const target = document.getElementById('target') as HTMLElement
const srcHtml = target.innerHTML
let renderedHtml = ''
let isTypeset = true

// オプション関連のDOM要素をキャッシュ
const useWordBreakToggle = document.getElementById('useWordBreakToggle') as HTMLInputElement
const insertThinSpacesToggle = document.getElementById('insertThinSpacesToggle') as HTMLInputElement
const wrapLatinToggle = document.getElementById('wrapLatinToggle') as HTMLInputElement
const noSpaceBetweenNoBreaksToggle = document.getElementById('noSpaceBetweenNoBreaksToggle') as HTMLInputElement
const kerningRulesToggle = document.getElementById('kerningRulesToggle') as HTMLInputElement

let options: Partial<TypesettingOptions> = {
  kerningRules: getKerningRules(true),
}

/**
 * 初期化処理を行う関数
 */
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

/**
 * メールリンクの設定を行う関数
 */
function setupEmailLink() {
  const emailElement = document.getElementById('email') as HTMLAnchorElement
  if (emailElement) {
    const emailHtml = emailElement.innerHTML.replace('[-]', '@')
    emailElement.innerHTML = emailHtml
    const emailText = emailElement.textContent || ''
    emailElement.href = 'mailto:' + emailText
  }
}

/**
 * インプット要素の有効/無効を切り替える関数
 * @param {boolean} enable - 有効にするかどうか
 */
function toggleInputElements(enable: boolean) {
  const inputElements = document.querySelectorAll('#options input[type="checkbox"], #target input[type="checkbox"]')
  inputElements.forEach(element => {
    const input = element as HTMLInputElement
    input.disabled = !enable
  })
}

/**
 * オプション関連のイベントリスナーを設定する関数
 */
function setupOptionEventListeners() {
  document.querySelectorAll('#options input[type="checkbox"]').forEach(button => {
    button.addEventListener('change', handleOptionChange)
  })
}

/**
 * ターゲット要素のイベントリスナーを設定する関数
 */
function setupTargetEventListeners() {
  target.addEventListener('change', event => {
    const target = event.target as HTMLInputElement
    if (target.matches('input[type="checkbox"]')) {
      handleTargetCheckboxChange(event)
    }
  })
}

/**
 * 組版の切り替えを行う関数
 */
function toggleTypesetting() {
  target.innerHTML = isTypeset ? srcHtml : renderedHtml
  isTypeset = !isTypeset
  setupEmailLink()

  if (isTypeset) {
    synchronizeAndSetupTargetCheckboxes()
  }
}

/**
 * オプション変更時の処理を行う関数
 */
function handleOptionChange() {
  updateOptions()
  updateTypesetting()
  synchronizeAndSetupTargetCheckboxes()
  setupEmailLink()
}

/**
 * ターゲットのチェックボックスの状態を同期し、設定を行う関数
 */
function synchronizeAndSetupTargetCheckboxes() {
  document.querySelectorAll('#target input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('change', handleTargetCheckboxChange)

    const checkboxInput = checkbox as HTMLInputElement
    if (checkboxInput.dataset.id) {
      const optionCheckbox = document.getElementById(checkboxInput.dataset.id) as HTMLInputElement
      if (optionCheckbox && optionCheckbox.checked !== checkboxInput.checked) {
        checkboxInput.checked = optionCheckbox.checked
      }
    }
  })
}

/**
 * オプションを更新する関数
 */
function updateOptions() {
  options = {
    ...options,
    useWordBreak: useWordBreakToggle.checked,
    insertThinSpaces: insertThinSpacesToggle.checked,
    wrapLatin: wrapLatinToggle.checked,
    noSpaceBetweenNoBreaks: noSpaceBetweenNoBreaksToggle.checked,
    kerningRules: getKerningRules(kerningRulesToggle.checked),
  }
}

/**
 * 組版を更新する関数
 */
function updateTypesetting() {
  const typesetter = new Typesetter(options)
  renderedHtml = typesetter.render(srcHtml)
  if (isTypeset) {
    target.innerHTML = renderedHtml
  }
}

/**
 * ターゲットのチェックボックス変更時の処理を行う関数
 * @param {Event} event - 発生したイベント
 */
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

/**
 * カーニングルールを取得する関数
 * @param {boolean} isEnabled - カーニングルールが有効かどうか
 * @returns {KerningRule[]} カーニングルールの配列
 */
function getKerningRules(isEnabled: boolean): KerningRule[] {
  return isEnabled
    ? [
        { between: ['美', 'し'], value: 60 },
        { between: ['ス', 'ト'], value: 120 },
        { between: ['イ', 'ブ'], value: 20 },
        { between: ['ブ', 'ラ'], value: -30 },
        { between: ['ラ', 'リ'], value: 30 },
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

// 初期化処理
document.addEventListener('DOMContentLoaded', init)
