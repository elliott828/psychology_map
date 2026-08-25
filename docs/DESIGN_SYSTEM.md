# Design system

## Visual direction

The map should feel like a designed cultural atlas rather than an isolated academic chart. It uses a dark atmospheric field, crisp high-contrast typography, continuous skyline geometry, and restrained luminous details.

The mountain photograph remains quiet background texture. Information geometry, labels, and relationships are always the foreground.

## Overview modes

### Chronology

- Domains run left to right by first major historical appearance.
- Column height represents the provisional Literature Contribution Index.
- Column width represents constrained structural breadth.
- Adjacent columns use a consistent 2pt perceived gap.
- Sloped tops connect visually into one mountain ridge.

### Genealogy

- Domains are grouped into four top-level lineages.
- Every domain inside a lineage uses the same solid color.
- No gradients or decorative borders are used to distinguish individual columns.
- Color never overrides the height and width encodings.

### People

- People are connected in chronological order using a serpentine constellation path.
- Circle size represents the provisional people contribution index.
- Stars, rays, and orbit marks add atmosphere without obscuring the historical chain.
- Localized names and years must remain legible at the default fitted scale.

## Interaction rules

- Clicking a node opens its detail and locks the selected relationship network.
- Locked relationships survive panning and zooming until explicitly unlocked.
- Hover is supplementary; no essential information may depend on hover alone.
- Language switching lives behind a globe icon to keep attention on the map.
- Semantic zoom progressively reveals domains, theories, and reading entries.

## Color tokens

The active overview palette uses one harmonious solid color per lineage:

- Traditions: teal
- Sciences: periwinkle blue
- Clinical: muted rose
- Applied/contextual: ochre

Exact values remain implementation tokens in `pmOverviewBaseColors` inside `index.html`.

## Typography

The interface uses system fonts for fast loading and broad CJK coverage. Labels should be assessed at their actual fitted browser scale, not only by their SVG font-size value. Chinese, English, and Japanese names require language-specific length checks.

