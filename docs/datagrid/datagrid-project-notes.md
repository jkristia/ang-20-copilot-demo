# Data Grid Project Notes

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
