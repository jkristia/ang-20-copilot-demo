import { ColDef } from 'ag-grid-community';

import { DataGridColumnSchema } from '../datagrid-schema';
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
    return {
      field: column.fieldName as unknown as ColDef<TRow>['field'],
      headerName: column.caption,
      ...this.toWidthDefinition(column.width),
      ...this.fieldTypeMapper.toColDef<TRow>(column.fieldType),
      ...this.alignmentMapper.toColDef<TRow>(column.fieldType, column.alignment),
    };
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
