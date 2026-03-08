# Generic Data Grid Prompt - Step 3

This document covers Step 3 of the generic datagrid work: custom cell renderers, custom editors, and row-to-store update flow.

## Goal
Add support for custom cell views and custom editors in the datagrid, with concrete Step 3 behavior for network-device data.

Use AG Grid terminology:
- `cell renderer`: custom read-only view
- `cell editor`: editable input UI

## Scope
In scope:
- Add a read-only custom renderer for the `linkState` column.
- Add a reusable generic `IPv4Editor` for `ipv4` columns so it can be used by multiple grids.
- Push edit updates back to the backing data/store.
- Ensure store-driven updates are reflected across all grid instances bound to the same store data.
- Add read-only and disabled UX rules.

Out of scope (for now):
- Advanced IPv4 validation and normalization logic.
- Server persistence.
- Undo/redo history.

## Inputs
- Existing `DataGridColumnSchema` / `NetworkDeviceRow` schema.
- Existing generic datagrid + network-device page/store architecture.

## Implementation Requirements
- Keep `app-generic-datagrid` reusable and presentational.
- Keep network-device-specific components under:
  - `client/src/app/components/network-device-page/editors/`
- Place reusable generic editors under:
  - `client/src/app/generic-datagrid/editors/`
- Support custom renderers/editors through schema-driven column mapping.
- Avoid `any`; keep TypeScript types explicit.
- Add `.test.ts` coverage for renderer/editor integration and data update flow.

### 1. Link State Custom Read-Only Cell Renderer
- Target column: `linkState`.
- Renderer behavior:
  - `link-up` -> green circle indicator
  - `link-down` -> red circle indicator
  - `link-error` -> orange circle indicator
- Keep the cell read-only.
- Implement this as a network-device-specific component in `network-device-page/editors`.

### 2. IPv4 Custom Editor
- Target field type: `ipv4`.
- Add `IPv4Editor` component in `generic-datagrid/editors`.
- Initial editor behavior:
  - plain text input
  - allow only `0-9` and `.` characters during input
- Any accepted modification must be pushed back to row data and store state.
- Keep editor implementation generic and reusable across grid contexts.
- Keep editor code intentionally simple in Step 3; stricter IPv4 logic will be added later.

### 3. Disabled Cell Behavior
- Cells should support a `disabled` state.
- Disabled behavior:
  - appear visually dimmed (grayed text)
  - behave as read-only (no editing)

### 4. Read-Only Schema Support
- Add read-only support in schema so columns can declare non-editable behavior.
- Mark `device` as read-only in `NETWORK_DEVICE_SCHEMA`.
- Read-only text should be slightly dimmed.

### 5. Data/Store Update Flow
- Define a clear edit pipeline from editor -> grid row update -> store update.
- Ensure updates from `IPv4Editor` are reflected in rendered row data.
- Ensure that when one grid pushes an update to the store, other grids bound to the same store reflect the change.
- Keep ownership of canonical data in the store.

## Deliverables
1. Schema updates for read-only and editor/renderer metadata needed by Step 3.
2. Network-device-specific link-state renderer component in `network-device-page/editors`.
3. Reusable generic `IPv4Editor` component in `generic-datagrid/editors`.
4. Generic mapping updates that wire schema to AG Grid renderer/editor bindings.
5. Store/update wiring so editor changes propagate to data/store.
6. Unit tests (`.test.ts`) for renderer/editor behavior and update propagation.
7. Notes update in `docs/datagrid/datagrid-project-notes.md`.

## Acceptance Criteria
- `linkState` shows the correct status dot color for all known values.
- `linkState` is rendered through a custom read-only renderer.
- `ipv4` columns use a custom editor component.
- `IPv4Editor` is implemented once under `generic-datagrid/editors` and reused by grids that need `ipv4` editing.
- IPv4 editor input only accepts `0-9` and `.` in Step 3.
- Editing via IPv4 editor updates row data and the store.
- After a store update from one grid, other grids bound to the same dataset reflect the updated value.
- Disabled cells are grayed out and not editable.
- `device` is marked read-only in schema and renders slightly dimmed.
- All related `.test.ts` files pass.
