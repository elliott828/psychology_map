# Data

The current canonical dataset is embedded in `../index.html` so the prototype remains portable and can be opened without a build step.

Relevant collections include:

- `domains`: the 15 major psychological systems;
- `domainGroups`: the four top-level lineages;
- `people`: people associated with domains in the framework layer;
- `books` and `pmSupplementalBooks`: reading entries;
- `pmDomainYears`: first significant appearance used for chronology;
- `pmStreams`: theories, people, provisional importance, breadth, evidence, and notes;
- `links` and `pmStreamLinks`: domain and stream relationships;
- `pmPersonNames`: localized Chinese and Japanese names used in the people overview.

Do not edit a duplicate data copy here while the application still reads embedded data. The planned migration to JSON is documented in `../docs/DATA_MODEL.md` and `../docs/TODO.md`.

