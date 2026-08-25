# spyschology_map

An interactive, multilingual map of modern psychology: schools, lineages, people, theories, relationships, and reading paths from 1880 to the present.

The project uses a Musicmap-inspired visual grammar, while its content model, contribution indices, and historical relationships are specific to psychology.

## Open the map

The application is intentionally dependency-free. Open `index.html` directly in a modern browser, or serve the repository locally:

```powershell
python -m http.server 4311
```

Then visit `http://localhost:4311/`.

## Repository structure

```text
spyschology_map/
├─ index.html                    # Current production prototype
├─ assets/                       # Required visual assets
├─ docs/
│  ├─ DATA_MODEL.md              # Data entities and current index formulas
│  ├─ DESIGN_SYSTEM.md           # Visual language and interaction rules
│  ├─ PROJECT_SCOPE.md           # Audience, boundaries, and working conventions
│  └─ TODO.md                    # Open research and engineering decisions
└─ archive/                      # Earlier concepts and design explorations
```

## Current capabilities

- Three overview modes: chronology, four-lineage genealogy, and people chronology.
- Chinese, English, and Japanese interface and overview labels.
- Continuous mountain-ridge columns with literature contribution and structural breadth encodings.
- Chronological people constellation with contribution-sized nodes.
- Pan, zoom, search, semantic zoom, detail panels, and locked relationship networks.
- Reading entries and methodological notes embedded in the map.

## Data status

The current canonical dataset is embedded in the JavaScript section of `index.html`. This preserves a single-file prototype and makes offline review easy. The intended next engineering step is to move the same entities into versioned JSON files without changing the visual behavior. See `docs/DATA_MODEL.md` and `docs/TODO.md`.

## Working convention

New work about this website belongs in this repository. Treat `index.html` as the active implementation and `archive/` as read-only design history unless a task explicitly concerns an earlier prototype.

