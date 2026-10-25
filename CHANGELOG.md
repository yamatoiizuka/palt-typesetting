# Changelog

## 0.10.0 (unreleased)

### Breaking changes

- Remove the internal `dist/win.js` and `dist/win-browser.js` modules and the corresponding `browser` mapping. Consumers importing these files directly must create their own DOM and pass its document to `renderToSelector(selector, root)`. See the [Node.js and DOM migration guide](README.md#nodejs-と-dom).

### Changes

- Remove jsdom from runtime dependencies. HTML-string rendering remains available without a DOM.
- Resolve the default document when `renderToSelector` is called, and support an explicit `Document`, `Element`, or `DocumentFragment` root. Calls without an available document remain a no-op.
- Existing public API calls remain supported.
