import { DataGridColumnSchema } from '../datagrid-schema';
import { SchemaToColumnDefsUtil } from './schema-to-column-defs.util';

interface DemoRow {
  device: string;
  ip: string;
}

describe('SchemaToColumnDefsUtil', () => {
  it('maps schema arrays to AG Grid column definition arrays and appends a filler column', () => {
    const util = new SchemaToColumnDefsUtil<DemoRow>();
    const schema: readonly DataGridColumnSchema<DemoRow>[] = [
      {
        fieldName: 'device',
        fieldType: 'string',
        caption: 'Device',
        width: 180,
      },
      {
        fieldName: 'ip',
        fieldType: 'ipv4',
        caption: 'IP Address',
        width: 170,
      },
    ];

    const columnDefs = util.toColumnDefs(schema);

    expect(columnDefs).toHaveLength(3);
    expect(columnDefs[0]).toMatchObject({
      field: 'device',
      headerName: 'Device',
      width: 180,
    });
    expect(columnDefs[1]).toMatchObject({
      field: 'ip',
      headerName: 'IP Address',
      width: 170,
    });
    expect(columnDefs[2]).toMatchObject({
      colId: '__filler__',
      headerName: '',
      flex: 1,
      minWidth: 24,
      sortable: false,
      filter: false,
      resizable: false,
    });
  });
});
