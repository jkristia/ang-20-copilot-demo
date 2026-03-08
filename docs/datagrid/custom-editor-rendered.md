# Custom Editors and Renderers

This note explains where to add custom AG Grid editors and renderers in this repository and how to wire them into the generic datagrid flow.

## Where To Add Components
- Reusable editors for multiple pages: `client/src/app/generic-datagrid/editors/`
- Feature-specific renderers/editors: `client/src/app/components/<feature>/editors/`
- Example feature-specific renderer: `client/src/app/components/network-device-page/editors/link-state-cell-renderer.component.ts`

## Add A Custom Editor
1. Create a standalone Angular component and implement `ICellEditorAngularComp`.
2. Implement editor lifecycle methods used by AG Grid:
   - `agInit(params)` to receive editor params.
   - `getValue()` to return the committed value.
   - `afterGuiAttached()` when you need focus/select behavior.
3. Add the component in one of these ways:
   - Explicit per-column binding in schema via `cellEditor`.
   - Default-by-fieldType mapping in `client/src/app/generic-datagrid/utils/schema-column-to-col-def.util.ts`.
4. Pass extra editor options through `cellEditorParams` in schema.

## Add A Custom Renderer
1. Create a standalone Angular component and implement `ICellRendererAngularComp`.
2. Implement AG Grid renderer methods:
   - `agInit(params)` for initial value/setup.
   - `refresh(params)` for updates.
3. Bind it in schema using `cellRenderer` and optional `cellRendererParams`.

## Current Wiring Path In This Repo
1. Feature schema defines field metadata in `client/src/app/components/.../...-schema.ts`.
2. Schema maps to AG Grid `ColDef` in `client/src/app/generic-datagrid/utils/schema-column-to-col-def.util.ts`.
3. Column defs are assembled in `client/src/app/generic-datagrid/utils/schema-to-column-defs.util.ts`.
4. Generic datagrid passes config into AG Grid through:
   - `client/src/app/generic-datagrid/generic-datagrid.component.ts`
   - `client/src/app/generic-datagrid/data-grid/data-grid.component.ts`
5. AG Grid instantiates renderer components for display mode and editor components when a cell enters edit mode.

## AG Grid Documentation
- Cell Editors (Angular): https://www.ag-grid.com/angular-data-grid/cell-editors/
- Cell Renderers (Angular): https://www.ag-grid.com/angular-data-grid/component-cell-renderer/
- Components Overview (Angular): https://www.ag-grid.com/angular-data-grid/components/
