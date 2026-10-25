# Changelog

## 0.10.0 (unreleased)

### Breaking changes

- Remove the internal `dist/win.js` and `dist/win-browser.js` modules and the corresponding `browser` mapping. Consumers importing these files directly must create their own DOM and pass its document to `renderToSelector(selector, root)`. See the [Node.js and DOM migration guide](README.md#nodejs-と-dom).

### Changes

- Preserve opening-punctuation line-end rules in Safari when word-based wrapping is enabled. Opening punctuation now receives a `typesetting-opening` span; update the distributed CSS together with JavaScript or server-rendered HTML.

- Remove jsdom from runtime dependencies. HTML-string rendering remains available without a DOM.
- Resolve the default document when `renderToSelector` is called, and support an explicit `Document`, `Element`, or `DocumentFragment` root. Calls without an available document remain a no-op.
- Existing public API calls remain supported.
- Replace the runtime `linebreak` dependency with a built-in two-character line break check based on UAX #14 (Unicode 15.0). Results match `linebreak@1.1.0` for every code point class and every class pair. The package now has no runtime dependencies.
