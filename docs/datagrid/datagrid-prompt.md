# Generic Data Grid Prompt Index

This document is the index for the generic datagrid prompt set. It covers what the prompt set includes, the execution order of the steps, and where to find design notes.

## Prompt Sequence
1. [Step 1 - Foundation](./step-1.prompt.md)
2. [Step 2 - Render Generic Data Grid](./step-2.prompt.md)
3. [Step 2.1 - Tweaks](./step-2.1.prompt.md)
4. [Step 3 - Custom Renderers and Editors](./step-3.prompt.md)

## What This Covers
- Step 1: schema and type foundations, deterministic dummy data, and store setup.
- Step 2: rendering the reusable grid, route/container wiring, utility-based mapping logic, and tests.
- Step 2.1: incremental post-Step-2 tweaks and refinement requirements.
- Step 3: custom read-only renderers, custom editors, read-only/disabled behavior, and edit-to-store updates.

## Related Docs
- Design notes: `docs/datagrid/datagrid-project-notes.md`