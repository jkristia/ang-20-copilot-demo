export interface GenericDatagridOptions {
  verticalGridLines?: boolean;
  horizontalGridLines?: boolean;
}

export type ResolvedGenericDatagridOptions = Readonly<Required<GenericDatagridOptions>>;
export type GenericDatagridThemeVariables = Readonly<Record<string, string>>;

const DEFAULT_GENERIC_DATAGRID_OPTIONS: ResolvedGenericDatagridOptions = {
  verticalGridLines: true,
  horizontalGridLines: true,
};

export function resolveGenericDatagridOptions(
  options: GenericDatagridOptions = {},
): ResolvedGenericDatagridOptions {
  return {
    verticalGridLines:
      options.verticalGridLines ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.verticalGridLines,
    horizontalGridLines:
      options.horizontalGridLines ?? DEFAULT_GENERIC_DATAGRID_OPTIONS.horizontalGridLines,
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
