# Changelog

## 0.10.0 (unreleased)

### Breaking changes

- Remove the internal `dist/win.js` and `dist/win-browser.js` modules and the corresponding `browser` mapping. Consumers importing these files directly must create their own DOM and pass its document to `renderToSelector(selector, root)`. See the [Node.js and DOM migration guide](README.md#nodejs-と-dom).

### Changes

- Remove jsdom from runtime dependencies. HTML-string rendering remains available without a DOM.
- Resolve the default document when `renderToSelector` is called, and support an explicit `Document`, `Element`, or `DocumentFragment` root. Calls without an available document remain a no-op.
- Existing public API calls remain supported.
- Replace the runtime `linebreak` dependency with a built-in two-character line break check based on UAX #14 (Unicode 15.0). Pair decisions keep the two-character behavior of `linebreak@1.1.0`, while Line_Break classes now follow Unicode 15.0, so characters whose class changed since the data in `linebreak@1.1.0` (for example U+2057 and the Kawi script) and unassigned code points (now always AL) may break differently. Classes and two-character results are tested against Unicode's `LineBreak.txt` and `LineBreakTest.txt`. The package now has no runtime dependencies.
- Build the UMD bundle and `dist/` as ES2020 without Babel. The bundle shrinks from 24.8 KB to 15.3 KB (gzip 8.7 KB to 6.2 KB). Browsers without ES2020 syntax support are no longer supported; they also lack `Intl.Segmenter`, so only the reduced fallback ran there.
- Render about twice as fast by reusing one `Intl.Segmenter`, precompiling regular expressions, and tokenizing HTML once per pass.
- Report invalid `wrapChars` rules once per `Typesetter` instead of once per text node.
- Do not mutate the options object passed to the `Typesetter` constructor. `kerningRules` and `wrapChars` (including each rule) are copied at construction, so later changes to them no longer affect an existing instance.

### Fixes

- Treat the vertical bar `|` (U+007C) as Latin instead of Japanese. Thin spaces are no longer inserted between `|` and adjacent Latin letters (e.g. `a|b`), and are now inserted between `|` and adjacent Japanese characters (e.g. `日本語|English`).
- Accept `kerningRules` containing characters represented by surrogate pairs (e.g. `𠮷` or emoji), and apply them across segment and text node boundaries.
- Keep `$&`, `` $` ``, `$'` and `$$` inside protected blocks (`script`, `style`, `pre`, already generated spans, etc.) intact when restoring them.
