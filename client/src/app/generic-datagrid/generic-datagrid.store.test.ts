import { GenericDatagridStore } from './generic-datagrid.store';
import { DataGridColumnSchema } from './datagrid-schema';

interface DemoRow {
  id: number;
  name: string;
}

const DEMO_SCHEMA: readonly DataGridColumnSchema<DemoRow>[] = [
  {
    fieldName: 'id',
    fieldType: 'int',
    caption: 'ID',
    width: 120,
  },
  {
    fieldName: 'name',
    fieldType: 'string',
    caption: 'Name',
    width: 'auto',
  },
];

const createDemoRows = (rowCount: number): readonly DemoRow[] =>
  Array.from({ length: rowCount }, (_, index) => ({
    id: index,
    name: `row.${index}`,
  }));

class DemoStore extends GenericDatagridStore<DemoRow> {
  public constructor() {
    super({
      schema: DEMO_SCHEMA,
      rows: createDemoRows(2),
    });
  }

  protected getRowData(rowCount = 2): readonly DemoRow[] {
    return createDemoRows(rowCount);
  }
}

describe('GenericDatagridStore', () => {
  let store: DemoStore;

  beforeEach(() => {
    store = new DemoStore();
  });

  it('exposes schema and initial rows', () => {
    const schema = store.schema();
    const rows = store.rows();

    expect(schema).toEqual(DEMO_SCHEMA);
    expect(rows).toEqual([
      { id: 0, name: 'row.0' },
      { id: 1, name: 'row.1' },
    ]);
  });

  it('replaces rows when setRows is called', () => {
    store.setRows([{ id: 99, name: 'custom' }]);

    expect(store.rows()).toEqual([{ id: 99, name: 'custom' }]);
  });

  it('regenerates rows with default and explicit counts', () => {
    store.resetRows();
    expect(store.rows()).toEqual([
      { id: 0, name: 'row.0' },
      { id: 1, name: 'row.1' },
    ]);

    store.resetRows(3);
    expect(store.rows()).toEqual([
      { id: 0, name: 'row.0' },
      { id: 1, name: 'row.1' },
      { id: 2, name: 'row.2' },
    ]);
  });
});