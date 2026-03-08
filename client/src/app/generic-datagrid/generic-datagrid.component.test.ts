import { Component, input, output } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  CellChange,
  DataGridComponent,
  DataGridConfig,
} from './data-grid/data-grid.component';
import { DataGridColumnSchema } from './datagrid-schema';
import { GenericDatagridComponent } from './generic-datagrid.component';

interface DemoRow {
  rowId: string;
  device: string;
  mask: number;
}

const DEMO_SCHEMA: readonly DataGridColumnSchema<DemoRow>[] = [
  {
    fieldName: 'device',
    fieldType: 'string',
    caption: 'Device',
    width: 180,
  },
  {
    fieldName: 'mask',
    fieldType: 'int',
    caption: 'Mask',
    width: 100,
  },
];

const DEMO_ROWS: readonly DemoRow[] = [
  {
    rowId: 'row-0',
    device: 'device.0',
    mask: 24,
  },
  {
    rowId: 'row-1',
    device: 'device.1',
    mask: 24,
  },
  {
    rowId: 'row-2',
    device: 'device.2',
    mask: 24,
  },
];

@Component({
  selector: 'app-data-grid',
  standalone: true,
  template: '',
})
class DataGridStubComponent<TRow extends object = Record<string, unknown>> {
  public readonly rowData = input.required<TRow[]>();
  public readonly config = input.required<DataGridConfig<TRow>>();
  public readonly totalRows = input<number>(0);
  public readonly loading = input<boolean>(false);
  public readonly themeVariables = input<Record<string, string>>({});
  public readonly cellValueChanged = output<CellChange<TRow>>();
}

describe('GenericDatagridComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericDatagridComponent],
    })
      .overrideComponent(GenericDatagridComponent, {
        remove: { imports: [DataGridComponent] },
        add: { imports: [DataGridStubComponent] },
      })
      .compileComponents();
  });

  it('maps schema to AG Grid columns and forwards row data', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);
    const rows = DEMO_ROWS;

    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;
    const columnDefs = gridStubComponent.config().columnDefs;

    expect(gridStubComponent.rowData()).toEqual(rows);
    expect(gridStubComponent.totalRows()).toBe(3);
    expect(columnDefs.map((column) => column.field)).toEqual([
      'device',
      'mask',
      undefined,
    ]);
    expect(columnDefs[columnDefs.length - 1]).toMatchObject({
      colId: '__filler__',
      flex: 1,
      minWidth: 24,
    });
  });

  it('renders the configured row-count label', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);
    const rows = DEMO_ROWS.slice(0, 2);

    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('rowCountLabel', 'All Rows');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('All Rows: 2');
  });

  it('applies line-toggle options via AG Grid theme variables', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);
    const rows = DEMO_ROWS.slice(0, 2);

    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', rows);
    fixture.detectChanges();

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;

    expect(gridStubComponent.themeVariables()).toMatchObject({
      '--ag-cell-horizontal-border': 'solid 1px var(--ag-border-color, #d0d7de)',
      '--ag-header-column-separator-display': 'block',
      '--ag-row-border-width': '1px',
    });

    fixture.componentRef.setInput('options', {
      verticalGridLines: false,
      horizontalGridLines: false,
    });
    fixture.detectChanges();

    expect(gridStubComponent.themeVariables()).toMatchObject({
      '--ag-cell-horizontal-border': 'solid 1px transparent',
      '--ag-header-column-separator-display': 'none',
      '--ag-row-border-width': '0',
    });

    fixture.componentRef.setInput('options', {
      verticalGridLines: true,
      horizontalGridLines: true,
    });
    fixture.detectChanges();

    expect(gridStubComponent.themeVariables()).toMatchObject({
      '--ag-cell-horizontal-border': 'solid 1px var(--ag-border-color, #d0d7de)',
      '--ag-header-column-separator-display': 'block',
      '--ag-row-border-width': '1px',
    });
  });

  it('defaults defaultColDef filtering to contains-only mode', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);

    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', DEMO_ROWS);
    fixture.detectChanges();

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;
    const defaultColDef = gridStubComponent.config().defaultColDef;

    expect(defaultColDef).toMatchObject({
      sortable: true,
      filter: 'agTextColumnFilter',
      resizable: true,
      filterParams: {
        filterOptions: ['contains'],
        defaultOption: 'contains',
        maxNumConditions: 1,
        suppressAndOrCondition: true,
      },
    });
  });

  it('allows overriding defaultColDef options and filter mode', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);

    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', DEMO_ROWS);
    fixture.componentRef.setInput('options', {
      defaultColDef: {
        sortable: false,
        filter: true,
        resizable: false,
        filterMode: 'ag-grid-default',
      },
    });
    fixture.detectChanges();

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;
    const defaultColDef = gridStubComponent.config().defaultColDef;

    expect(defaultColDef).toMatchObject({
      sortable: false,
      filter: true,
      resizable: false,
    });
    expect(defaultColDef?.filterParams).toBeUndefined();
  });

  it('forwards cell value changes from inner data grid', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);
    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', DEMO_ROWS);
    fixture.detectChanges();

    const emittedChanges: CellChange<DemoRow>[] = [];
    fixture.componentInstance.cellValueChanged.subscribe((change) => emittedChanges.push(change));

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;

    gridStubComponent.cellValueChanged.emit({
      data: DEMO_ROWS[0] as DemoRow,
      field: 'device',
      oldValue: 'device.0',
      newValue: 'device.0-updated',
    });

    expect(emittedChanges).toEqual([
      {
        data: DEMO_ROWS[0],
        field: 'device',
        oldValue: 'device.0',
        newValue: 'device.0-updated',
      },
    ]);
  });

  it('passes getRowId through to inner data-grid config', () => {
    const fixture = TestBed.createComponent(GenericDatagridComponent<DemoRow>);
    fixture.componentRef.setInput('schema', DEMO_SCHEMA);
    fixture.componentRef.setInput('rows', DEMO_ROWS);
    fixture.componentRef.setInput('getRowId', (row: DemoRow) => row.rowId);
    fixture.detectChanges();

    const gridStub = fixture.debugElement.query(By.directive(DataGridStubComponent));
    const gridStubComponent = gridStub.componentInstance as DataGridStubComponent<DemoRow>;
    const config = gridStubComponent.config();

    expect(config.getRowId).toBeDefined();
    expect(config.getRowId?.(DEMO_ROWS[0] as DemoRow)).toBe('row-0');
  });
});
