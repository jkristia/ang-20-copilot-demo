# Data Grid Project Notes

## 2026-03-08 - Step 2.1 Tweaks
- Added optional `alignment` to `DataGridColumnSchema` with supported values: `left | center | right`.
- Added `AlignmentColDefUtil` to keep alignment logic isolated and unit-testable.
- Implemented default alignment rule:
	- `string` -> `left`
	- non-`string` types -> `right`
- Implemented explicit alignment override when `alignment` is set in schema.
- Added `GenericDatagridComponent` line options:
	- `verticalGridLines` on/off
	- `horizontalGridLines` on/off
- Refactored grid-line styling to use AG Grid theme variables (`--ag-cell-horizontal-border`, `--ag-row-border-*`, `--ag-header-column-separator-*`) instead of `::ng-deep` border overrides.
- Moved line-option theme-variable mapping out of component source into `generic-datagrid.theme.ts`.
- Added `themeVariables` input on `DataGridComponent` and apply variables at the `ag-grid-angular` theme root to ensure AG Grid variables resolve correctly.
- Bound line options in `NetworkDevicePageComponent`; current page configuration sets both toggles to `false` for both grid instances.
- Moved network-device-specific schema/data/store files from `client/src/app/generic-datagrid/` to `client/src/app/components/network-device-page/` to keep generic datagrid code domain-agnostic.

## 2026-03-08 - Step 2 Rendering
- Added route constant `NETWORK_DEVICE` and route entry for `#/network-device`.
- Added `NetworkDevicePageComponent` as the Step 2 container/page component.
- Added `GenericDatagridComponent` as a thin presentational wrapper.
- Kept mapping and transformation logic out of the component by adding focused utility classes:
	- `FieldTypeColDefUtil`
	- `SchemaColumnToColDefUtil`
	- `SchemaToColumnDefsUtil`
- Updated Step 2 grid column behavior so data columns use fixed schema widths and a trailing filler column (`__filler__`) consumes remaining horizontal space.
- Implemented two `app-generic-datagrid` instances on the network-device page:
	- all rows from `NetworkDeviceStore`
	- preview rows (first 5 rows) derived from store data
- Added `.test.ts` coverage for:
	- utility classes (field-type mapping, single-column mapping, schema-array mapping)
	- generic datagrid presentational component input/config behavior
	- network-device page container-to-store binding behavior

## 2026-03-07 - Step 1 Foundation
- Added all Step 1 source files under `client/src/app/generic-datagrid/`.
- Implemented `DataGridColumnSchema` with `fieldName`, `fieldType`, `caption`, and `width` (`number | 'auto'`).
- Split schema declarations into generic and domain files:
	- `datagrid-schema.ts` for shared datagrid schema types
	- `network-device-schema.ts` for network-device row and schema constants
- Added the required network-device schema (`device`, `linkState`, `ip`, `mask`, `gateway`, `mac`).
- Implemented deterministic dummy data generation with default `20` rows and fixed increment rules.
- Implemented a signal-based store split:
	- `GenericDatagridStore<TRow>` is an abstract generic base store
	- `NetworkDeviceStore` is the concrete store for network-device schema and row generation
- Kept default row generation behavior in derived stores (no default-count hook in the generic base).
- Added `.test.ts` unit tests for both generic store behavior and network-device store behavior.
- Chose to enforce a generator limit of `255` rows for the current deterministic IPv4/MAC format.
