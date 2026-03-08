# Generic Data Grid Prompt - Step 2

This document covers Step 2 of the generic datagrid implementation: route integration, reusable grid rendering, and utility-first column/data mapping logic.

Follow-up refinements after Step 2 are tracked in `docs/datagrid/step-2.1.prompt.md`.

## Goal
Add a new route `network-device` (reachable as `#/network-device` because hash routing is enabled) that renders a container page with two instances of the same reusable `generic-datagrid` component.

The container page injects `NetworkDeviceStore` and passes schema/row data into each grid instance via inputs. The grid component itself remains presentational and does not inject store services.

## Scope
In scope:
- Create one reusable `generic-datagrid` presentational component.
- Create one container/page component for the `network-device` route.
- Map datagrid schema to AG Grid column definitions.
- Bind row data from `NetworkDeviceStore`.

Out of scope:
- Editing
- Validation
- Server persistence

## Inputs
- `DataGridColumnSchema` and related Step 1 schema types.
- `NetworkDeviceStore` exposing schema + rows.

## Implementation Requirements
- Use AG Grid Community.
- Keep data ownership and generation logic in stores.
- Keep `generic-datagrid` presentational (inputs/outputs only).
- Keep `generic-datagrid` thin: rendering, input binding, and event forwarding only.
- Move schema/data transformation logic into small, focused utility classes.
- Prefer multiple cohesive utility classes over one large helper class.
- Add route constant and route entry for `network-device`.
- Add `.test.ts` unit tests for:
  - schema-to-column mapping
  - grid component input rendering behavior
  - container-to-store binding behavior
  - each utility class

## Deliverables
1. `generic-datagrid` component files.
2. Schema-to-AG-Grid mapping utilities implemented as dedicated, single-responsibility classes (outside the component), each with focused `.test.ts` unit tests.
3. `network-device` container/page component using two grid instances.
4. Route constant + route registration updates.
5. New/updated `.test.ts` files.

## Acceptance Criteria
- `#/network-device` renders successfully.
- Two grid instances are visible on the page.
- Grid columns match Step 1 schema fields and order.
- Row count in each grid matches bound store data.
- `generic-datagrid` contains no schema/data transformation logic beyond delegating to utilities.
- Utility classes are independently unit-tested with `.test.ts` files.
- Types compile without `any`.
- Notes updated in `docs/datagrid/datagrid-project-notes.md`.
