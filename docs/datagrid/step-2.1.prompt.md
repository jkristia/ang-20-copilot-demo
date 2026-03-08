# Generic Data Grid Prompt - Step 2.1 Tweaks

This document tracks incremental tweaks applied after Step 2. Add each tweak here as we refine behavior.

## Tweak 1 - Column Alignment

## Goal
Add per-column alignment support to datagrid schema and AG Grid column mapping.

## Requirements
- Add alignment support on schema columns: `left | center | right`.
- Keep alignment optional in schema.
- Apply default alignment when not specified:
  - `string` fields default to `left`
  - all non-`string` field types default to `right`
- Keep mapping logic in small dedicated utility classes.
- Add `.test.ts` coverage for the new alignment behavior.

## Implementation Notes
- Extend `DataGridColumnSchema` with optional `alignment`.
- Add a dedicated alignment utility that maps alignment rules to AG Grid colDef style.
- Use schema alignment when specified; otherwise use type-based defaults.
- Keep existing fixed-width-plus-filler behavior unchanged.

## Deliverables
1. Schema update for optional column alignment.
2. Alignment mapping utility class.
3. Mapper integration so alignment is applied to all generated column defs.
4. Unit tests for default and explicit alignment behavior.
5. Notes update in `docs/datagrid/datagrid-project-notes.md`.

## Acceptance Criteria
- Schema supports optional `alignment` per column.
- `string` columns are left-aligned by default.
- Non-`string` columns are right-aligned by default.
- Explicit `alignment` overrides defaults.
- All related `.test.ts` files pass.

## Tweak 2 - Grid Line Options

## Goal
Add configurable grid-line options to `app-generic-datagrid`.

## Requirements
- Add options on `app-generic-datagrid` for:
  - vertical grid lines: on/off
  - horizontal grid lines: on/off
- Keep options optional with sensible defaults.
- Apply options via AG Grid theme variables (avoid `::ng-deep` selector overrides); keep `app-generic-datagrid` presentational.
- Keep AG Grid theme-variable mapping in a dedicated `generic-datagrid.theme.ts` module (not inline in component source).
- Expose options to page/container level so each page can choose on/off defaults.
- Keep network-device-specific schema/data/store files under `client/src/app/components/network-device-page/` (not under `client/src/app/generic-datagrid/`).
- Add `.test.ts` coverage for:
  - option-to-style behavior in `GenericDatagridComponent`
  - options binding from `NetworkDevicePageComponent`

## Deliverables
1. `GenericDatagridComponent` options interface/input for line toggles.
2. Styling rules that enable/disable vertical/horizontal lines using AG Grid CSS variables.
3. `generic-datagrid.theme.ts` with option-resolution and AG Grid theme-variable mapping helpers.
4. `DataGridComponent` handoff support to apply AG Grid theme variables at the `ag-grid-angular` theme root.
5. Network-device page bindings with explicit line-toggle configuration.
6. Unit test updates for component + page bindings.
7. Notes update in `docs/datagrid/datagrid-project-notes.md`.

## Acceptance Criteria
- `app-generic-datagrid` accepts vertical and horizontal line options.
- Vertical and horizontal line styles can be toggled independently.
- Network-device page binds explicit line-option values for both grids.
- All related `.test.ts` files pass.

## Tweak 3 - Expose Default Column Options

## Goal
Expose AG Grid `defaultColDef` basics through `GenericDatagridOptions`, and make the default filter behavior use `contains` only.

## Requirements
- Add nested options under `GenericDatagridOptions.defaultColDef` for:
  - `sortable`
  - `filter`
  - `resizable`
  - `filterMode` (`contains-only | ag-grid-default`)
- Keep all options optional with sensible defaults.
- Keep default behavior equivalent to current UX (`sortable: true`, `filter: true`, `resizable: true`).
- Default filter behavior should be `contains-only`:
  - use AG text filter
  - expose only the `contains` operator
  - allow only one condition
- Keep option resolution in `generic-datagrid.theme.ts`; keep component logic focused on wiring.
- Add `.test.ts` coverage for:
  - default contains-only behavior
  - override behavior for `defaultColDef` and `filterMode`

## Deliverables
1. `GenericDatagridOptions` update with nested `defaultColDef` options.
2. Resolved options/defaults in `generic-datagrid.theme.ts`.
3. `GenericDatagridComponent` wiring from resolved options into `gridConfig.defaultColDef`.
4. Tests that validate both default and overridden behavior.
5. Notes update in `docs/datagrid/datagrid-project-notes.md`.

## Acceptance Criteria
- `defaultColDef.sortable`, `defaultColDef.filter`, and `defaultColDef.resizable` can be set via `GenericDatagridOptions`.
- Default filter mode is `contains-only`.
- `ag-grid-default` mode preserves AG Grid default filter behavior.
- All related `.test.ts` files pass.
