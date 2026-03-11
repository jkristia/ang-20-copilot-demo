import {
  CellClassParams,
  ColDef,
  EditableCallbackParams,
  ICellEditorParams,
} from 'ag-grid-community';

import { DataGridColumnSchema, DataGridColumnStateResolver } from '../datagrid-schema';
import { IntEditorComponent } from '../editors/int-editor.component';
import { MacEditorComponent } from '../editors/mac-editor.component';
import { IPv4EditorComponent } from '../editors/ipv4-editor.component';
import {
  AlignmentColDefUtil,
  DataGridAlignmentColDefMapper,
} from './alignment-col-def.util';
import {
  DataGridFieldTypeColDefMapper,
  FieldTypeColDefUtil,
} from './field-type-col-def.util';

export interface DataGridColumnColDefMapper<TRow extends object> {
  toColDef(column: DataGridColumnSchema<TRow>): ColDef<TRow>;
}

export class SchemaColumnToColDefUtil<TRow extends object>
  implements DataGridColumnColDefMapper<TRow>
{
  public constructor(
    private readonly fieldTypeMapper: DataGridFieldTypeColDefMapper = new FieldTypeColDefUtil(),
    private readonly alignmentMapper: DataGridAlignmentColDefMapper = new AlignmentColDefUtil(),
  ) {}

  public toColDef(column: DataGridColumnSchema<TRow>): ColDef<TRow> {
    const cellEditor = this.toCellEditor(column);

    return {
      field: column.fieldName as unknown as ColDef<TRow>['field'],
      headerName: column.caption,
      ...this.toWidthDefinition(column.width),
      ...this.fieldTypeMapper.toColDef<TRow>(column.fieldType),
      ...this.alignmentMapper.toColDef<TRow>(column.fieldType, column.alignment),
      // AG Grid custom component docs:
      // Cell Renderers: https://www.ag-grid.com/angular-data-grid/component-cell-renderer/
      // Cell Editors: https://www.ag-grid.com/angular-data-grid/cell-editors/
      cellRenderer: column.cellRenderer,
      cellRendererParams: column.cellRendererParams,
      cellEditor,
      cellEditorParams: this.toCellEditorParams(column),
      editable: this.toEditable(column, Boolean(cellEditor)),
      cellClass: this.toCellClass(column),
    };
  }

  private toCellEditor(column: DataGridColumnSchema<TRow>): ColDef<TRow>['cellEditor'] {
    if (column.cellEditor) {
      return column.cellEditor;
    }

    if (column.fieldType === 'int') {
      return IntEditorComponent;
    }

    if (column.fieldType === 'mac') {
      return MacEditorComponent;
    }

    if (column.fieldType === 'ipv4') {
      return IPv4EditorComponent;
    }

    return undefined;
  }

  private toCellEditorParams(column: DataGridColumnSchema<TRow>): ColDef<TRow>['cellEditorParams'] {
    const cellEditor = this.toCellEditor(column);
    if (!cellEditor) {
      return column.cellEditorParams;
    }

    return (params: ICellEditorParams<TRow>) => {
      const row = params.data;
      const disabled = row ? this.resolveColumnState(column.disabled, row) : false;
      const readOnly = row ? this.resolveColumnState(column.readOnly, row) : false;
      const alignment = this.resolveAlignment(column);

      const customParams =
        typeof column.cellEditorParams === 'function'
          ? column.cellEditorParams(params)
          : (column.cellEditorParams ?? {});

      return {
        ...customParams,
        disabled,
        readOnly,
        alignment,
        min: column.min,
        max: column.max,
      };
    };
  }

  private toEditable(
    column: DataGridColumnSchema<TRow>,
    hasEditor: boolean,
  ): ColDef<TRow>['editable'] {
    return (params: EditableCallbackParams<TRow>) => {
      if (!hasEditor || !params.data) {
        return false;
      }

      const isReadOnly = this.resolveColumnState(column.readOnly, params.data);
      const isDisabled = this.resolveColumnState(column.disabled, params.data);
      return !(isReadOnly || isDisabled);
    };
  }

  private toCellClass(column: DataGridColumnSchema<TRow>): ColDef<TRow>['cellClass'] {
    const alignmentClass = this.getAlignmentClass(column);
    
    return (params: CellClassParams<TRow>): string[] => {
      const classes: string[] = [alignmentClass];
      
      if (!params.data) {
        return classes;
      }

      if (this.resolveColumnState(column.readOnly, params.data)) {
        classes.push('gd-cell-readonly');
      }

      if (this.resolveColumnState(column.disabled, params.data)) {
        classes.push('gd-cell-disabled');
      }

      return classes;
    };
  }

  private getAlignmentClass(column: DataGridColumnSchema<TRow>): string {
    const alignment = column.alignment ?? (column.fieldType === 'string' ? 'left' : 'right');
    switch (alignment) {
      case 'center':
        return 'gd-cell-center';
      case 'right':
        return 'gd-cell-right';
      case 'left':
      default:
        return 'gd-cell-left';
    }
  }

  private resolveColumnState(
    state: DataGridColumnStateResolver<TRow> | undefined,
    row: TRow,
  ): boolean {
    if (typeof state === 'function') {
      return state(row);
    }

    return Boolean(state);
  }

  private resolveAlignment(column: DataGridColumnSchema<TRow>): 'left' | 'center' | 'right' {
    return column.alignment ?? (column.fieldType === 'string' ? 'left' : 'right');
  }

  private toWidthDefinition(
    width: number | 'auto',
  ): Pick<ColDef<TRow>, 'width' | 'flex' | 'minWidth' | 'suppressSizeToFit'> {
    if (width === 'auto') {
      return {
        flex: 1,
        minWidth: 120,
      };
    }

    return {
      width,
      flex: 0,
      suppressSizeToFit: true,
    };
  }
}
