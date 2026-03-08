import { DataGridColumnSchema } from '../datagrid-schema';
import { IntEditorComponent } from '../editors/int-editor.component';
import { MacEditorComponent } from '../editors/mac-editor.component';
import { IPv4EditorComponent } from '../editors/ipv4-editor.component';
import { SchemaColumnToColDefUtil } from './schema-column-to-col-def.util';

class DemoReadonlyRendererComponent {}

interface DemoRow {
  device: string;
  mac?: string;
  linkState: 'link-up' | 'link-down' | 'link-error';
  ip: string;
  mask: number;
  centerMetric: number;
  disabled: boolean;
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

  it('maps custom read-only renderer and dimmed readonly class', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'linkState',
      fieldType: 'enum',
      caption: 'Link State',
      width: 140,
      readOnly: true,
      cellRenderer: DemoReadonlyRendererComponent,
    };

    const colDef = util.toColDef(column);

    expect(colDef.cellRenderer).toBe(DemoReadonlyRendererComponent);
    expect(colDef.editable).toEqual(expect.any(Function));
    expect(colDef.cellClass).toEqual(expect.any(Function));

    const editable = colDef.editable as (params: { data: DemoRow }) => boolean;
    expect(
      editable({
        data: {
          device: 'device.1',
          linkState: 'link-up',
          ip: '192.168.1.2',
          mask: 24,
          centerMetric: 10,
          disabled: false,
        },
      }),
    ).toBe(false);

    const cellClass = colDef.cellClass as (params: { data: DemoRow }) => string[];
    expect(
      cellClass({
        data: {
          device: 'device.1',
          linkState: 'link-up',
          ip: '192.168.1.2',
          mask: 24,
          centerMetric: 10,
          disabled: false,
        },
      }),
    ).toContain('gd-cell-readonly');
  });

  it('auto-wires IPv4 editor and respects disabled state', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'ip',
      fieldType: 'ipv4',
      caption: 'IP',
      width: 170,
      disabled: (row) => row.disabled,
    };

    const colDef = util.toColDef(column);

    expect(colDef.cellEditor).toBe(IPv4EditorComponent);
    expect(colDef.editable).toEqual(expect.any(Function));
    expect(colDef.cellEditorParams).toEqual(expect.any(Function));

    const editable = colDef.editable as (params: { data: DemoRow }) => boolean;
    const disabledRow: DemoRow = {
      device: 'device.2',
      linkState: 'link-down',
      ip: '192.168.2.2',
      mask: 24,
      centerMetric: 10,
      disabled: true,
    };
    const enabledRow: DemoRow = {
      ...disabledRow,
      disabled: false,
    };

    expect(editable({ data: disabledRow })).toBe(false);
    expect(editable({ data: enabledRow })).toBe(true);

    const editorParams = colDef.cellEditorParams as (params: { data: DemoRow }) => {
      disabled: boolean;
      readOnly: boolean;
      alignment: 'left' | 'center' | 'right';
    };

    expect(editorParams({ data: disabledRow })).toEqual(
      expect.objectContaining({
        disabled: true,
        readOnly: false,
        alignment: 'right',
      }),
    );
  });

  it('passes explicit column alignment into IPv4 editor params', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'ip',
      fieldType: 'ipv4',
      caption: 'IP',
      width: 170,
      alignment: 'center',
    };

    const colDef = util.toColDef(column);
    const editorParams = colDef.cellEditorParams as (params: { data: DemoRow }) => {
      alignment: 'left' | 'center' | 'right';
    };

    expect(
      editorParams({
        data: {
          device: 'device.3',
          linkState: 'link-up',
          ip: '192.168.3.2',
          mask: 24,
          centerMetric: 10,
          disabled: false,
        },
      }),
    ).toEqual(
      expect.objectContaining({
        alignment: 'center',
      }),
    );
  });

  it('auto-wires IntEditor and passes min/max constraints to editor params', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'mask',
      fieldType: 'int',
      caption: 'Mask',
      width: 100,
      min: 8,
      max: 31,
    };

    const colDef = util.toColDef(column);
    expect(colDef.cellEditor).toBe(IntEditorComponent);

    const editorParams = colDef.cellEditorParams as (params: { data: DemoRow }) => {
      min: number;
      max: number;
      alignment: 'left' | 'center' | 'right';
    };

    expect(
      editorParams({
        data: {
          device: 'device.4',
          linkState: 'link-up',
          ip: '192.168.4.2',
          mask: 24,
          centerMetric: 10,
          disabled: false,
        },
      }),
    ).toEqual(
      expect.objectContaining({
        min: 8,
        max: 31,
        alignment: 'right',
      }),
    );
  });

  it('auto-wires MacEditor and passes alignment into editor params', () => {
    const column: DataGridColumnSchema<DemoRow> = {
      fieldName: 'mac',
      fieldType: 'mac',
      caption: 'MAC',
      width: 180,
      alignment: 'left',
    };

    const colDef = util.toColDef(column);
    expect(colDef.cellEditor).toBe(MacEditorComponent);

    const editorParams = colDef.cellEditorParams as (params: { data: DemoRow }) => {
      alignment: 'left' | 'center' | 'right';
    };

    expect(
      editorParams({
        data: {
          device: 'device.5',
          mac: '00aa11',
          linkState: 'link-up',
          ip: '192.168.5.2',
          mask: 24,
          centerMetric: 10,
          disabled: false,
        },
      }),
    ).toEqual(
      expect.objectContaining({
        alignment: 'left',
      }),
    );
  });
});
