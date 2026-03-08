import { DataGridColumnSchema } from '../datagrid-schema';
import { SchemaColumnToColDefUtil } from './schema-column-to-col-def.util';

interface DemoRow {
  device: string;
  mask: number;
  centerMetric: number;
}

describe('SchemaColumnToColDefUtil', () => {
  const util = new SchemaColumnToColDefUtil<DemoRow>();

  it('maps fixed-width schema columns to AG Grid column definitions', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'device',
      fieldType: 'string',
      caption: 'Device',
      width: 180,
    };

    const colDef = util.toColDef(column);

    expect(colDef).toMatchObject({
      field: 'device',
      headerName: 'Device',
      width: 180,
      flex: 0,
      suppressSizeToFit: true,
      cellDataType: 'text',
      cellStyle: {
        textAlign: 'left',
        justifyContent: 'flex-start',
      },
    });
  });

  it('maps auto-width schema columns to flexible AG Grid column definitions', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'mask',
      fieldType: 'int',
      caption: 'Mask',
      width: 'auto',
    };

    const colDef = util.toColDef(column);

    expect(colDef).toMatchObject({
      field: 'mask',
      headerName: 'Mask',
      flex: 1,
      minWidth: 120,
      cellDataType: 'number',
      type: 'numericColumn',
      cellStyle: {
        textAlign: 'right',
        justifyContent: 'flex-end',
      },
    });
    expect(colDef.width).toBeUndefined();
  });

  it('applies explicit alignment when configured in schema', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'centerMetric',
      fieldType: 'int',
      caption: 'Center Metric',
      width: 140,
      alignment: 'center',
    };

    const colDef = util.toColDef(column);

    expect(colDef).toMatchObject({
      field: 'centerMetric',
      width: 140,
      cellStyle: {
        textAlign: 'center',
        justifyContent: 'center',
      },
    });
  });
});
