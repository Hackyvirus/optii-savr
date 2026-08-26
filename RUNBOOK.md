# Optii-Savr — Deployment Runbook

Developer-facing only. Never upload this file, `src/`, `node_modules/`,
`package.json`, `package-lock.json`, `build.mjs`, or any `preview-*.html`
file to WordPress — only the specific files listed in step 3 below.

## 1. Prerequisites

- Node.js and npm (confirmed working with Node v24 / npm v11; anything
  reasonably recent should be fine).
- One-time setup after cloning/pulling: `npm install`.

## 2. Build

```
npm run build
```

Bundles everything under `src/` into the four files the PHP pages actually
load: `scripts/optii-savr.js`, `scripts/optii-savr-calculator.js`,
`scripts/optii-savr-usermanual.js`, `scripts/main.js`. Re-run this after
*any* change under `src/` — the `scripts/*.js` files are build output, not
source; hand-editing them directly will be overwritten next build.

`css/home.css` and `css/style.css` are plain files, not build output —
edit them directly.

Run the test suite for the pure calculation functions before shipping
anything that touches `src/calc/`:

```
npm test
```

## 3. What to upload, and where

Everything lives under one WordPress theme folder on the server:

```
wp-content/themes/optitaxtheme/tools/optii-savr/
```

Upload only the files that actually changed, matched 1:1 into that folder:

| Local path | Uploads to |
|---|---|
| `optii-savr.php` | `.../optii-savr/optii-savr.php` (or wherever the "Optii-Savr Home" template lives in the theme) |
| `optii-savr-calculator.php` | `.../optii-savr/optii-savr-calculator.php` |
| `optii-savr-usermanual.php` | `.../optii-savr/optii-savr-usermanual.php` |
| `viewer.php` | `.../optii-savr/viewer.php` |
| `css/home.css` | `.../optii-savr/css/home.css` |
| `css/style.css` | `.../optii-savr/css/style.css` |
| `scripts/*.js` (built output) | `.../optii-savr/scripts/*.js` |
| `reports/*.pdf` | `.../optii-savr/reports/*.pdf` (only if the templates themselves changed — rare) |

Never upload: `src/`, `node_modules/`, `package.json`, `package-lock.json`,
`build.mjs`, `.gitignore`, `RUNBOOK.md`, `preview-*.html`, `.claude/`.

## 4. Verify locally before uploading

Don't guess whether a change works — check it against the real files first.
There's a lightweight local-preview technique used throughout this
project's rebuild:

1. Copy the PHP page you want to check, e.g.:
   ```
   cp optii-savr-calculator.php preview-calculator.html
   ```
2. In the copy, replace the two absolute production URLs with local
   relative ones (the only lines that need touching):
   ```
   sed -i 's#https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/css/style.css#/css/style.css#' preview-calculator.html
   sed -i 's#https://optitaxs.com/wp-content/themes/optitaxtheme/tools/optii-savr/scripts/optii-savr-calculator.js#/scripts/optii-savr-calculator.js#' preview-calculator.html
   ```
   (Swap in `css/home.css` / `scripts/optii-savr.js` for the home page,
   or just `css/style.css` for `viewer.php`, which has no external JS.)
3. Serve the project root as a static file server (any port; example uses
   Node since it's already a dependency here) and open
   `http://localhost:PORT/preview-calculator.html` in a browser. This
   loads the real local CSS/JS — including whatever you just edited and
   rebuilt — so the wizard, FAQ accordion, terms modal, and viewer
   loading/error states all actually work, not just look right.
4. For `viewer.php` specifically, since it reads `localStorage["sharedPDF"]`
   which nothing populates outside the real Calculate flow, you can
   exercise its three states directly from the browser console:
   - Loading (default): just load the page with an empty localStorage.
   - Error: `localStorage.setItem('sharedPDF_error', JSON.stringify({code:'X', message:'test'})); location.reload();`
   - Success: `localStorage.setItem('sharedPDF', JSON.stringify([...pdfByteArray])); location.reload();`
5. Delete the `preview-*.html` copies when done — they're scratch files,
   never committed, never uploaded.

This catches real bugs before they reach production — e.g. this is how a
dangling event listener that would have broken the Calculate button, and
a tooltip icon that broke on narrow screens, were both caught pre-deploy.

## 5. Post-deploy smoke test (~5 minutes)

Run through this on the live site after every upload:

- [ ] Home page loads; terms modal opens on "Next", checkbox required,
      "Buy the book" link opens the correct external page in a new tab.
- [ ] All 3 "learn more" popups on the home page open and close (via both
      their own × and clicking outside).
- [ ] Calculator wizard: fill Capital Goods CIF, leave "Disposal of
      capital goods" on "Choose", click Next — the inline red validation
      message should appear (not a native `alert()` popup, not nothing).
      Select a valid option, confirm the message clears.
- [ ] FAQ sidebar: open one category, confirm any other open category
      auto-closes; open one question, confirm any other open question
      (in the same category) auto-closes.
- [ ] Complete the wizard and click Calculate — the viewer tab should show
      "Generating your report…" then the actual PDF, not a blank tab.
- [ ] If you can construct an input set with no valid scheme match (or
      just watch for it happening naturally), confirm the viewer shows
      the red error message + "Retry" button instead of hanging forever.
- [ ] Resize the browser narrow (or use a phone) and spot-check: the
      hero title stays centered, tooltip icons don't drop to their own
      line when a label wraps, and the "Next"/"Calculate" buttons are
      full-width and centered, not stuck at the left edge.

## 6. The actual root cause of the incident that started this rebuild

None of the above is a substitute for this check — it's a WordPress admin
issue, not something any of this code can prevent:

**After any WordPress core, theme, or plugin update — or any edit made to
the `/viewer/` page directly in wp-admin — go to Pages → All Pages →
Viewer → Edit, and check the "Template" dropdown in the Page Attributes
panel.** It must read **"Optii-Savr Viewer"**. If it has silently reverted
to "Default Template" (which is exactly what caused the original outage:
the page rendered with the theme's generic empty template and no report
ever appeared), re-select "Optii-Savr Viewer" and Update immediately.

The viewer's loading-state + 20-second timeout (Phase 1 of the rebuild)
means that if this regression recurs, a user will at least see "something
went wrong" instead of an indefinitely blank page — but that's a
mitigation, not a fix. Only this manual check actually prevents it.

## 7. Rollback

Deployment is manual file copy, so rollback is: re-upload the previous
version of whatever changed. Git history (initialized during this rebuild)
is the source of truth for "previous version" — e.g.:

```
git log --oneline
git show <commit>:scripts/main.js > main.js.rollback
```

then upload `main.js.rollback` in place of the current file. Never force-
push or rewrite history to "undo" a bad deploy — just check out or extract
the older content and re-upload it forward as a new change.
