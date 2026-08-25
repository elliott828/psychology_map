# TODO

## Research and scoring

- Replace LCI v0 with a documented literature contribution model.
- Decide which bibliographic sources and citation windows are appropriate across historical periods.
- Separate scholarly influence, public influence, clinical adoption, and curricular presence where needed.
- Remove the temporary Jungian score floor once the evidence-based model is ready.
- Design a people contribution model that does not over-reward repeated mentions in the current dataset.
- Record confidence and source provenance for dates, relationships, and translated names.

## Data engineering

- Extract embedded entities into versioned JSON files.
- Give every person a stable ID and explicit multilingual name record.
- Add JSON schema validation and duplicate-ID checks.
- Add automated tests for chronological order, domain membership, relationship targets, and translation coverage.

## Product and accessibility

- Test default label sizes on common laptop and tablet viewports.
- Add reduced-motion handling if future animation is introduced.
- Review keyboard focus order and screen-reader descriptions for the full relationship graph.
- Consider a compact mobile overview without reducing labels below a readable size.

## Publishing

- Configure GitHub Pages or another static host after the repository is available remotely.
- Add a lightweight release checklist for data, language, interaction, and visual regression checks.

