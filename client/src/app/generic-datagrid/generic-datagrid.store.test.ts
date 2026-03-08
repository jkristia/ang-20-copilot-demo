import { GenericDatagridStore } from './generic-datagrid.store';
import { DataGridColumnSchema } from './datagrid-schema';

interface DemoRow {
  id: number;
  name: string;
  mask: number;
  active: boolean;
}

const DEMO_SCHEMA: readonly DataGridColumnSchema<DemoRow>[] = [
  {
    fieldName: 'id',
    fieldType: 'int',
    caption: 'ID',
    width: 120,
    readOnly: true,
  },
  {
    fieldName: 'name',
    fieldType: 'string',
    caption: 'Name',
    width: 'auto',
  },
  {
    fieldName: 'mask',
    fieldType: 'int',
    caption: 'Mask',
    width: 100,
    min: 8,
    max: 31,
    disabled: (row) => row.id === 1,
  },
  {
    fieldName: 'active',
    fieldType: 'bool',
    caption: 'Active',
    width: 100,
  },
];

const createDemoRows = (rowCount: number): readonly DemoRow[] =>
  Array.from({ length: rowCount }, (_, index) => ({
    id: index,
    name: `row.${index}`,
    mask: 24,
    active: index % 2 === 0,
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

  public updateField(id: number, field: string, value: unknown): void {
    const nextRows = this.rows().map((row) =>
      row.id === id
        ? this.withUpdatedField(row, field, value)
        : row,
    );

    this.setRows(nextRows);
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
      { id: 0, name: 'row.0', mask: 24, active: true },
      { id: 1, name: 'row.1', mask: 24, active: false },
    ]);
  });

  it('replaces rows when setRows is called', () => {
    store.setRows([{ id: 99, name: 'custom', mask: 31, active: true }]);

    expect(store.rows()).toEqual([{ id: 99, name: 'custom', mask: 31, active: true }]);
  });

  it('regenerates rows with default and explicit counts', () => {
    store.resetRows();
    expect(store.rows()).toEqual([
      { id: 0, name: 'row.0', mask: 24, active: true },
      { id: 1, name: 'row.1', mask: 24, active: false },
    ]);

    store.resetRows(3);
    expect(store.rows()).toEqual([
      { id: 0, name: 'row.0', mask: 24, active: true },
      { id: 1, name: 'row.1', mask: 24, active: false },
      { id: 2, name: 'row.2', mask: 24, active: true },
    ]);
  });

  it('normalizes and clamps int fields via shared helpers', () => {
    store.updateField(0, 'mask', '31');
    expect(store.rows()[0]).toMatchObject({ id: 0, mask: 31 });

    store.updateField(0, 'mask', '100');
    expect(store.rows()[0]).toMatchObject({ id: 0, mask: 31 });

    store.updateField(0, 'mask', '1');
    expect(store.rows()[0]).toMatchObject({ id: 0, mask: 8 });
  });

  it('ignores readonly, disabled, and unknown field updates via shared helpers', () => {
    store.updateField(0, 'id', 999);
    store.updateField(1, 'mask', 30);
    store.updateField(0, 'doesNotExist', 'value');

    expect(store.rows()[0]).toMatchObject({ id: 0, mask: 24 });
    expect(store.rows()[1]).toMatchObject({ id: 1, mask: 24 });
  });

  it('normalizes string and bool field updates via shared helpers', () => {
    store.updateField(0, 'name', 'renamed');
    store.updateField(0, 'active', false);
    store.updateField(0, 'name', 123);
    store.updateField(0, 'active', 'true');

    expect(store.rows()[0]).toMatchObject({
      id: 0,
      name: 'renamed',
      active: false,
    });
  });
});