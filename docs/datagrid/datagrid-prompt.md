# Generic Data Grid Prompt (Step 1)

Example of creating a component using prompt-driven coding.
The steps below were created by rewriting my initial Step 1 requirements with Copilot to remove ambiguity.

## Context
We are building a generic data grid feature in an Angular 20 app using AG Grid Community edition.
This is Step 1 of a multi-step implementation.

## Step 1 Goal
Create the foundational schema model, dummy row data, and a store layer that exposes both.
Do not implement grid rendering in this step.

## Constraints
- Keep data ownership in a store, not in the grid component.
- Keep field behavior read-only for now.
- Record design decisions in `docs/datagrid/datagrid-project-notes.md`.
- If complexity grows, add a dedicated instructions file for future steps.
- Create all Step 1 source files under `client/src/app/generic-datagrid/` (do not place files elsewhere).

## Required Types
Create a column schema interface with:
- `fieldName`: property name in row JSON data
- `fieldType`: one of `'bool' | 'int' | 'float' | 'string' | 'enum' | 'ipv4' | 'mac'`
- `caption`: column header text
- `width`: `number | 'auto'`

## Required Schema
Create a schema with columns:
- `device`: `string`
- `linkState`: `enum` with values `'link-up' | 'link-down' | 'link-error'`
- `ip`: `ipv4`
- `mask`: `int`
- `gateway`: `ipv4`
- `mac`: `mac`

## Dummy Data Requirements
Generate deterministic dummy rows (default: 20 rows):
- `device`: `device.0`, `device.1`, `device.2`, ...
- `linkState`: cycle values in this order per row: `link-up`, `link-down`, `link-error`
- `ip`: start `192.168.0.2`, increment third octet by 1 per row (`192.168.1.2`, `192.168.2.2`, ...)
- `mask`: `24` for all rows
- `gateway`: start `192.168.0.1`, increment third octet by 1 per row
- `mac`: start `00:aa:00:00:00:01`, increment last byte by 1 per row

## Store Requirements
Create a store layer that exposes:
- the schema
- the generated data rows

Use two stores:
- an abstract generic store for shared read-only state and row reset behavior
- a concrete `NetworkDeviceStore` that defines how row data is generated (including the default row count)

Use the existing project store pattern and keep exposed state read-only to consumers.

## Deliverables
Implement:
1. Schema interface/type definitions.
2. Step-1 schema constant for the network-device columns.
3. Dummy data generator and initial dataset.
4. Abstract generic datagrid store.
5. Network-device store exposing schema + data.

## Acceptance Criteria
- Types compile without `any`.
- Schema and rows are exported and consumable by future grid component work.
- Data generation follows the exact increment rules above.
- Design decision notes are updated in `docs/datagrid/datagrid-project-notes.md`.
- Add `.test.ts` unit tests for both generic store behavior and network-device store behavior (not `.spec.ts`).