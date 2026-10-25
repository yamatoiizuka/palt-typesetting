# Changelog

## 0.10.0 (unreleased)

### Breaking changes

- Remove the internal `dist/win.js` and `dist/win-browser.js` modules and the corresponding `browser` mapping. Consumers importing these files directly must create their own DOM and pass its document to `renderToSelector(selector, root)`. See the [Node.js and DOM migration guide](README.md#nodejs-と-dom).

### Changes

- Remove jsdom from runtime dependencies. HTML-string rendering remains available without a DOM.
- Resolve the default document when `renderToSelector` is called, and support an explicit `Document`, `Element`, or `DocumentFragment` root. Calls without an available document remain a no-op.
- Existing public API calls remain supported.
- Replace the runtime `linebreak` dependency with a built-in two-character line break check based on UAX #14 (Unicode 15.0). Results match `linebreak@1.1.0` for every code point class and every class pair. The package now has no runtime dependencies.
- Build the UMD bundle and `dist/` as ES2020 without Babel. The bundle shrinks from 24.8 KB to 15.1 KB (gzip 8.7 KB to 6.2 KB). Browsers without ES2020 syntax support are no longer supported; they also lack `Intl.Segmenter`, so only the reduced fallback ran there.
- Render about twice as fast by reusing one `Intl.Segmenter`, precompiling regular expressions, and tokenizing HTML once per pass.
- Report invalid `wrapChars` rules once per `Typesetter` instead of once per text node.
- Do not mutate the options object passed to the `Typesetter` constructor. `kerningRules` and `wrapChars` are copied at construction, so later changes to those arrays no longer affect an existing instance.

### Fixes

- Keep `$&`, `` $` ``, `$'` and `$$` inside protected blocks (`script`, `style`, `pre`, already generated spans, etc.) intact when restoring them.
