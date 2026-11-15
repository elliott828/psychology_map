# psychology_map

An interactive, bilingual (English / 中文) map of psychology as a neutral field: nine development threads, 122 schools, 256 theories, 315 people, 300 books and papers, and reading paths that show what to read before and after any theory.

Live site: https://elliott828.github.io/psychology_map/

## Open the map

`index.html` is a single self-contained file: open it directly in a modern browser. It makes no network requests. Book covers load from the local `covers/` folder next to it, and the only outbound links are to book.douban.com and openlibrary.org.

## Views

- **Threads**: a 3D time hourglass (sources above, 1879 at the neck, nine threads fanning out to the present) and a ridge map whose peaks show where new schools emerged. Labels can switch between schools, people and works.
- **Structure**: the threads as a lineage of schools, with cross-thread relations.
- **People**: a timeline; the pre-1879 era is collapsed by default.
- **Questions**: everyday questions answered through several lenses, plus debates and myths.
- **Reading**: books per thread, and a reading path for any theory or school. The path shows upstream reading, the work itself and downstream reading, each with the best-rated Douban Chinese edition and a recommended English edition.

## Repository structure

```text
psychology_map/
├─ index.html            # Built page (do not edit by hand; run the build)
├─ build.js              # Builds index.html from src/ and data/
├─ src/                  # Page template, styles and app modules (src/app/*.js)
├─ data/
│  ├─ psychologymap-data.js   # Canonical dataset (window.PSYMAP)
│  ├─ en/*.json               # English translation overlay
│  ├─ book-links.json         # Douban / Open Library editions per work (generated)
│  ├─ covers.json             # Cover image index (generated)
│  ├─ validate.js             # Schema and consistency checks
│  └─ verification-log.md     # Fact-check log
├─ covers/               # Book cover thumbnails (Open Library)
├─ tools/                # Book lookup pipeline (see tools/README.md)
├─ test/                 # Smoke test and fixtures
├─ docs/
│  ├─ V2_FRAMEWORK.md    # Knowledge structure and visual framework (v2)
│  ├─ V2_BUILD_SPEC.md   # v2 build specification
│  ├─ V2_1_SPEC.md       # v2.1: bilingual UI, logo, reading paths, book pipeline
│  └─ DATA_MODEL.md, DESIGN_SYSTEM.md, PROJECT_SCOPE.md, TODO.md   # v1 (archived version) documents
└─ archive/              # Earlier prototypes, including the v1 mountain map (psychologymap-expanded.html)
```

## Build and test

Requires Node.js 18+; no dependencies.

```bash
npm run build      # node build.js -> index.html
npm test           # data validator + pipeline self-test + page smoke test
```

## Book pipeline

`tools/` finds the Chinese editions on Douban and the English works on Open Library, asks DeepSeek to judge which candidates are the same work, and picks an edition by rating. It then downloads cover thumbnails from Open Library. The API key lives only in an environment variable or an untracked `.env`. See `tools/README.md`.

## Working convention

New work on this website belongs in this repository. Edit `src/` and `data/`, then rebuild. Treat `archive/` as read-only design history.
