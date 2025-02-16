/* prettier-ignore */

/**
 * typekit-cache.js
 * https://github.com/morris/typekit-cache/blob/master/typekit-cache.js
 */
(function (
  // Constants
  document,
  style,
  innerHTML,
  getElementsByTagName,
  // Config
  storage,
  key,
  pattern,
  delay,
  // Vars
  temp,
  next,
  i,
  css
) {
  // If CSS is in cache, append it to <head> in a <style> tag.

  if (storage[key]) {
    temp = document.createElement(style)
    temp[innerHTML] = storage[key]
    document[getElementsByTagName]('head')[0].appendChild(temp)
    document.documentElement.className += ' wf-cached'
  }

  // Find and cache the Typekit CSS.

  (function cache() {
    // Find matching CSS.
    temp = document[getElementsByTagName](style)
    next = ''

    for (i = 0; i < temp.length; i++) {
      css = temp[i][innerHTML]
      if (css && css.match(pattern)) {
        next += css
      }
    }

    // If there's matching CSS, cache it.
    // Prefix cached CSS so it does not match the pattern.
    if (next) storage[key] = '/**/' + next

    // Retry using exponential backoff.
    setTimeout(cache, (delay += delay))
  })()
})(
  // Constants
  document,
  'style',
  'innerHTML',
  'getElementsByTagName',
  // Config
  localStorage,
  'tk',
  /^@font|^\.tk-/,
  100
);

/* prettier-ignore */
(function (d) {
  var config = {
      kitId: 'ysi4rlt',
      scriptTimeout: 3000,
      async: true,
    },
    h = d.documentElement,
    t = setTimeout(function () {
      h.className = h.className.replace(/\bwf-loading\b/g, '') + ' wf-inactive'
    }, config.scriptTimeout),
    tk = d.createElement('script'),
    f = false,
    s = d.getElementsByTagName('script')[0],
    a
  h.className += ' wf-loading'
  tk.src = 'https://use.typekit.net/' + config.kitId + '.js'
  tk.async = true
  tk.onload = tk.onreadystatechange = function () {
    a = this.readyState
    if (f || (a && a != 'complete' && a != 'loaded')) return
    f = true
    clearTimeout(t)
    try {
      /* eslint no-undef: 0 */
      Typekit.load(config)
    /* eslint no-empty: 0 */
    } catch (e) {}
  }
  s.parentNode.insertBefore(tk, s)
})(document)
