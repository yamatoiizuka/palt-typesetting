# SSG kinsoku audit — 2026-10-25

This is a broader audit of the opening-punctuation fix, **not a claim that all
kinsoku issues are fixed**. The production transform/CSS is unchanged by this
audit commit.

## Reproduce

```sh
npm run build
node tests/browser/generate-kinsoku-audit.mjs
python3 -m http.server 4184 --bind 127.0.0.1
```

Open `/tests/browser/kinsoku-audit.html` in Safari and Chromium. Node generates
the Palt markup once; the page only measures layout. No browser-side Palt call
is involved. The generated JSON is ignored by Git.

Recorded environment: Node 24.3.0, Safari 27.0 on macOS, Chromium 156 on macOS.
Inputs: 154 target boundaries, plain/inline/custom-kerning variants, 81 widths
from 160 through 480px, 24px sans-serif, `palt`, `.13em` tracking, `.25px` text
stroke. Eight non-BMP kana cases omit the kerning variant because the current
public kerning validator rejects those characters. This leaves 454 samples,
or 36,774 boundary observations per mode and browser.

Modes restore the original markup, use the PR markup, add `line-break: strict`,
disable `overflow-wrap: anywhere`, and finally use raw text with native strict
line breaking. The fixture checks text preservation and measures adjacent glyph
positions across generated/author inline boundaries. Its expected boundaries
are curated independently of the library's line-breaking implementation.

## Findings

Counts below are split boundary observations with the PR markup and default
`line-break: auto`, not counts of different characters.

| Category | Safari | Chromium | Interpretation |
| --- | ---: | ---: | --- |
| Openings | 72 / 5,589 | 0 / 5,589 | Unhandled `〝`, `｢`, `〚` still fail in Safari. |
| Closings | 0 / 5,589 | 0 / 5,589 | No failure observed. |
| Commas / periods | 0 / 1,458 | 0 / 1,458 | No failure observed. |
| Questions / exclamations | 0 / 1,944 | 0 / 1,944 | No failure observed. |
| Middle dots / colons / semicolons | 0 / 972 | 0 / 972 | No failure observed. |
| Iteration marks | 0 / 1,458 | 0 / 1,458 | No failure observed. |
| Combining / halfwidth voiced marks | 0 / 972 | 0 / 972 | No failure observed. |
| Prolonged sound marks | 0 / 486 | 0 / 486 | No failure observed. |
| Small kana | 0 / 13,203 | 112 / 13,203 | Chromium permits breaks before eight supplementary-plane kana under `auto`; `strict` removes them. |
| Hyphens | 0 / 972 | 0 / 972 | No failure observed; some hyphens permit breaks in less strict modes. |
| Repeated inseparable symbols | 21 / 1,458 | 21 / 1,458 | Different failures; see below. |
| Prefix / suffix symbols | 0 / 1,944 | 0 / 1,944 | No failure observed. |
| Word-integrity controls | 22 / 486 | 22 / 486 | Author inline boundaries can cause extra generated `wbr`. |
| Allowed-break controls | 33 / 243 | 33 / 243 | Expected breaks after `。`; confirms wrapping is exercised. |

No horizontal overflow occurred in these five broad-audit modes.

### Additional opening characters

The original-markup control has 259 opening failures; the PR reduces this to
72, all outside its current 13-character set. `〝` is tested with two different
closing marks, so it contributes two sample strings. These failures remain
under `strict` and with `overflow-wrap: normal`. Native strict text has none.
The existing 13-opening fixture remains useful, but does not cover these
additional characters.

Follow-up: `〝`, `｢` and `〚` were added to the opening set afterwards, and
`opening-punctuation.html` now covers them too. The numbers in this report
were measured before that change and have not been re-run in Safari.

### Ellipses: another Safari-specific failure

Safari splits both `……` and `‥‥` inside an existing
`span.typesetting-no-breaks`, at seven widths each: 164, 168, 172, 468, 472,
476, and 480px. There is no `wbr` between the symbols. `strict` and disabling
the overflow fallback do not help. Chromium and Safari native strict text do
not split these pairs. This establishes a problem in the generated markup/CSS
combination, without identifying a particular internal WebKit bug.

A separate CSS experiment with `white-space: nowrap` on the existing
`.typesetting-no-breaks` fixes the ordinary two-symbol cases without adding
characters, spans, or client JS. In adjacency checks at the same 81 widths,
`「……」`, `「——」`, `「──」`, and following `。`, `、`, `！` retained their
tested prohibitions. However, 40 repeated ellipses, em dashes, or box-drawing
characters overflowed at every tested width (243 / 243 long-run cases).
Thus a blanket `nowrap` rule changes the current emergency-wrapping behavior.
This experiment is not applied to production CSS. `inline-block` is not proposed.

### Other findings, shared across browsers

- `＿＿`: Safari only splits the author-inline variant; Chromium splits plain,
  inline, and kerned variants. The inline version includes an explicit generated
  `wbr` between the underscores. The library groups underscores as no-break
  symbols, but that class currently only removes tracking. Raw native text also
  allows underscore breaks; this is not inherently a browser conformance bug.
- `図<em>書館…</em>` and `図書<em>館…</em>` produce a `wbr` at the author
  element boundary because segmentation is performed per text node. Both
  browsers break there. Uninterrupted `図書館` stays intact. This is a
  segmentation issue, separate from punctuation kinsoku or the opening fix.
- Chromium's supplementary small-kana breaks disappear under `strict`.
  `auto` permits browser-dependent strictness, so this observation is not by
  itself a browser bug.

## Interpretation and limits

[CSS Text's line-break rules](https://www.w3.org/TR/css-text-3/#line-break-property)
distinguish `auto`, `normal`, and `strict`; not every observed break is forbidden
under every setting. The category selection also draws on
[JLREQ's line-head prohibition rules](https://www.w3.org/TR/jlreq/#characters_not_starting_a_line).
The underscore and word-integrity cases additionally test library behavior,
rather than asserting Unicode/JLREQ mandates.

This covers these horizontal Japanese samples and widths on the tested desktop
engines. It is not exhaustive Unicode conformance, an iOS/older-Safari test, a
vertical-writing audit, or a guarantee for every font/author stylesheet.
