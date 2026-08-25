# Data model

## Current source of truth

The application is currently a self-contained HTML prototype. Its content and display logic live in the main JavaScript block of `index.html`. Search for the constants and builders named below when tracing the model.

## Core entities

### Domain groups

Four top-level lineages provide the stable color code:

1. Traditions and schools
2. Scientific foundations
3. Clinical and problem-focused systems
4. Applied, wellbeing, and contextual systems

They are represented by `domainGroups`. A domain belongs to exactly one top-level group for overview coloring.

### Domains

`domains` and `byId` define the major systems displayed as columns and large nodes. Each domain includes multilingual titles, questions, relationships, ideas, and a visual identity.

### Theory streams

`pmStreams` defines a theory or sub-school with:

- stable identifier;
- parent domain;
- first significant year;
- theory name;
- associated people;
- provisional importance, breadth, and evidence values;
- explanatory note.

### Relationships

`links`, `pmStreamLinks`, and `pmEdgesData` describe domain- and stream-level relationships. Current relationship types are primary influence, secondary or bridge influence, and reaction or debate.

### Reading entries

`books` and `pmSupplementalBooks` contain multilingual titles, authors, notes, source identifiers, reading roles, and difficulty levels.

### People

People are derived from the names attached to theory streams rather than maintained as a separate canonical table. `pmPersonNames` supplies Chinese and Japanese display names for the current overview selection.

This derived approach is suitable for the prototype but should eventually become an explicit people dataset with stable IDs, localized names, life dates, sources, and aliases.

## Provisional indices

### Domain literature contribution index (LCI v0)

`pmOverviewStats()` combines four provisional components:

- average stream importance: 45%;
- number of represented streams, log-scaled: 25%;
- average structural breadth: 20%;
- number of canonical ideas: 10%.

The raw score is normalized to approximately 42–98. The Jungian domain currently has a temporary floor of 82 pending a better evidence-based model.

### Column width

Width represents structural breadth using a constrained three-step scale based on represented stream count. The narrow range prevents extreme visual differences and preserves the continuous ridge.

### People contribution index v0

People are aggregated from their theory-stream appearances. Each appearance contributes a provisional weight based on stream importance and breadth. The result is normalized to approximately 40–98 and controls circle size.

This is explicitly a prototype metric, not a bibliometric conclusion.

## Planned JSON split

A future extraction should preserve stable IDs and create at least:

```text
data/
├─ domain-groups.json
├─ domains.json
├─ streams.json
├─ people.json
├─ relationships.json
├─ books.json
└─ translations.json
```

The migration should include a schema validator and a regression check proving that rendered node counts, years, and relationships remain unchanged.

