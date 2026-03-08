export interface GenericDatagridOptions {
  verticalGridLines?: boolean;
  horizontalGridLines?: boolean;
  defaultColDef?: GenericDatagridDefaultColDefOptions;
}

export interface GenericDatagridDefaultColDefOptions {
  sortable?: boolean;
  filter?: boolean;
  resizable?: boolean;
  filterMode?: GenericDatagridFilterMode;
}

export type GenericDatagridFilterMode = 'contains-only' | 'ag-grid-default';

export interface ResolvedGenericDatagridDefaultColDefOptions {
  sortable: boolean;
  filter: boolean;
  resizable: boolean;
  filterMode: GenericDatagridFilterMode;
}

export interface ResolvedGenericDatagridOptions {
  verticalGridLines: boolean;
  horizontalGridLines: boolean;
  defaultColDef: ResolvedGenericDatagridDefaultColDefOptions;
}

export type GenericDatagridThemeVariables = Readonly<Record<string, string>>;

const DEFAULT_GENERIC_DATAGRID_OPTIONS: ResolvedGenericDatagridOptions = {
  verticalGridLines: true,
  horizontalGridLines: true,
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
    filterMode: 'contains-only',
  },
};

export function resolveGenericDatagridOptions(
  options: GenericDatagridOptions = {},
): ResolvedGenericDatagridOptions {
  return {
    verticalGridLines:
      options.verticalGridLines ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.verticalGridLines,
    horizontalGridLines:
      options.horizontalGridLines ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.horizontalGridLines,
    defaultColDef: {
      sortable:
        options.defaultColDef?.sortable ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.defaultColDef.sortable,
      filter: options.defaultColDef?.filter ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.defaultColDef.filter,
      resizable:
        options.defaultColDef?.resizable ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.defaultColDef.resizable,
      filterMode:
        options.defaultColDef?.filterMode ??
        DEFAULT_GENERIC_DATAGRID_OPTIONS.defaultColDef.filterMode,
    },
  };
}

export function toGenericDatagridThemeVariables(
  options: ResolvedGenericDatagridOptions,
): GenericDatagridThemeVariables {
  return {
    '--ag-cell-horizontal-border': options.verticalGridLines
      ? 'solid 1px var(--ag-border-color, #d0d7de)'
      : 'solid 1px transparent',
    '--ag-header-column-separator-display': options.verticalGridLines ? 'block' : 'none',
    '--ag-header-column-separator-color': 'var(--ag-border-color, #d0d7de)',
    '--ag-row-border-style': 'solid',
    '--ag-row-border-width': options.horizontalGridLines ? '1px' : '0',
    '--ag-row-border-color': options.horizontalGridLines
      ? 'var(--ag-border-color, #d0d7de)'
      : 'transparent',
  };
}
