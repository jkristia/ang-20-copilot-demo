import { ColDef } from 'ag-grid-community';

import { DataGridFieldType } from '../datagrid-schema';

export interface DataGridFieldTypeColDefMapper {
  toColDef<TRow extends object>(fieldType: DataGridFieldType): Partial<ColDef<TRow>>;
}

export class FieldTypeColDefUtil implements DataGridFieldTypeColDefMapper {
  public toColDef<TRow extends object>(fieldType: DataGridFieldType): Partial<ColDef<TRow>> {
    switch (fieldType) {
      case 'bool':
        return { cellDataType: 'boolean' };
      case 'int':
      case 'float':
        return {
          cellDataType: 'number',
          type: 'numericColumn',
        };
      case 'enum':
        return {
          cellDataType: 'text',
        };
      case 'ipv4':
      case 'mac':
      case 'string':
      default:
        return { cellDataType: 'text' };
    }
  }
}
