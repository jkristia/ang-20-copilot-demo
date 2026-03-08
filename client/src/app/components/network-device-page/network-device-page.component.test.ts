import { Component, input, output, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CellChange } from '../../generic-datagrid/data-grid/data-grid.component';
import { DataGridColumnSchema } from '../../generic-datagrid/datagrid-schema';
import { util } from './network-device-data';
import {
  NetworkDeviceRow,
  NETWORK_DEVICE_SCHEMA,
} from './network-device-schema';
import {
  GenericDatagridComponent,
  GenericDatagridOptions,
} from '../../generic-datagrid/generic-datagrid.component';
import { NetworkDeviceStore } from './network-device.store';
import { NetworkDevicePageComponent } from './network-device-page.component';

@Component({
  selector: 'app-generic-datagrid',
  standalone: true,
  template: '',
})
class GenericDatagridStubComponent {
  public readonly schema = input.required<readonly DataGridColumnSchema<NetworkDeviceRow>[]>();
  public readonly rows = input.required<readonly NetworkDeviceRow[]>();
  public readonly rowCountLabel = input<string>('Rows');
  public readonly options = input<GenericDatagridOptions>({});
  public readonly getRowId = input<((row: NetworkDeviceRow) => string | number) | undefined>(
    undefined,
  );
  public readonly cellValueChanged = output<CellChange<NetworkDeviceRow>>();
}

class NetworkDeviceStoreStub {
  public readonly schema = signal<readonly DataGridColumnSchema<NetworkDeviceRow>[]>(
    NETWORK_DEVICE_SCHEMA,
  );

  public readonly rows = signal<readonly NetworkDeviceRow[]>(util.generate(8));

  public readonly updateField = jest.fn(
    (rowId: string, field: string, value: unknown) => {
      this.rows.update((rows) =>
        rows.map((row) =>
          row.rowId === rowId && field in row
            ? {
                ...row,
                [field]: value,
              }
            : row,
        ),
      );
    },
  );
}

describe('NetworkDevicePageComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetworkDevicePageComponent],
      providers: [
        {
          provide: NetworkDeviceStore,
          useClass: NetworkDeviceStoreStub,
        },
      ],
    })
      .overrideComponent(NetworkDevicePageComponent, {
        remove: { imports: [GenericDatagridComponent] },
        add: { imports: [GenericDatagridStubComponent] },
      })
      .compileComponents();
  });

  it('binds store data to two generic-datagrid instances', () => {
    const fixture = TestBed.createComponent(NetworkDevicePageComponent);
    fixture.detectChanges();

    const gridStubs = fixture.debugElement.queryAll(By.directive(GenericDatagridStubComponent));
    expect(gridStubs).toHaveLength(2);

    const allRowsGrid = gridStubs[0]?.componentInstance as GenericDatagridStubComponent;
    const previewRowsGrid = gridStubs[1]?.componentInstance as GenericDatagridStubComponent;

    expect(allRowsGrid.schema()).toEqual(NETWORK_DEVICE_SCHEMA);
    expect(previewRowsGrid.schema()).toEqual(NETWORK_DEVICE_SCHEMA);

    expect(allRowsGrid.rows().length).toBe(8);
    expect(previewRowsGrid.rows().length).toBe(5);

    expect(allRowsGrid.rowCountLabel()).toBe('All Rows');
    expect(previewRowsGrid.rowCountLabel()).toBe('Preview Rows');

    expect(allRowsGrid.options()).toEqual({
      verticalGridLines: false,
      horizontalGridLines: false,
    });
    expect(previewRowsGrid.options()).toEqual({
      verticalGridLines: false,
      horizontalGridLines: false,
    });

    const firstPreviewRow = previewRowsGrid.rows()[0] as NetworkDeviceRow;
    expect(allRowsGrid.getRowId()?.(firstPreviewRow)).toBe(firstPreviewRow.rowId);
    expect(previewRowsGrid.getRowId()?.(firstPreviewRow)).toBe(firstPreviewRow.rowId);
  });

  it('propagates edits through store updates and reflects changes in both grids', () => {
    const fixture = TestBed.createComponent(NetworkDevicePageComponent);
    fixture.detectChanges();

    const store = TestBed.inject(NetworkDeviceStore) as unknown as NetworkDeviceStoreStub;
    const gridStubs = fixture.debugElement.queryAll(By.directive(GenericDatagridStubComponent));
    const allRowsGrid = gridStubs[0]?.componentInstance as GenericDatagridStubComponent;
    const previewRowsGrid = gridStubs[1]?.componentInstance as GenericDatagridStubComponent;

    const editedRow = previewRowsGrid.rows()[0] as NetworkDeviceRow;
    const updatedIp = '10.10.10.10';

    previewRowsGrid.cellValueChanged.emit({
      data: editedRow,
      field: 'ip',
      oldValue: editedRow.ip,
      newValue: updatedIp,
    });
    fixture.detectChanges();

    expect(store.updateField).toHaveBeenCalledWith(editedRow.rowId, 'ip', updatedIp);

    const updatedAllRows = allRowsGrid.rows();
    const updatedPreviewRows = previewRowsGrid.rows();

    expect(updatedAllRows.find((row) => row.rowId === editedRow.rowId)?.ip).toBe(updatedIp);
    expect(updatedPreviewRows.find((row) => row.rowId === editedRow.rowId)?.ip).toBe(updatedIp);
  });

  it('propagates mask edits as numeric values', () => {
    const fixture = TestBed.createComponent(NetworkDevicePageComponent);
    fixture.detectChanges();

    const store = TestBed.inject(NetworkDeviceStore) as unknown as NetworkDeviceStoreStub;
    const gridStubs = fixture.debugElement.queryAll(By.directive(GenericDatagridStubComponent));
    const previewRowsGrid = gridStubs[1]?.componentInstance as GenericDatagridStubComponent;

    const editedRow = previewRowsGrid.rows()[0] as NetworkDeviceRow;

    previewRowsGrid.cellValueChanged.emit({
      data: editedRow,
      field: 'mask',
      oldValue: editedRow.mask,
      newValue: 31,
    });
    fixture.detectChanges();

    expect(store.updateField).toHaveBeenCalledWith(editedRow.rowId, 'mask', 31);
  });

  it('still updates store when oldValue equals newValue', () => {
    const fixture = TestBed.createComponent(NetworkDevicePageComponent);
    fixture.detectChanges();

    const store = TestBed.inject(NetworkDeviceStore) as unknown as NetworkDeviceStoreStub;
    const gridStubs = fixture.debugElement.queryAll(By.directive(GenericDatagridStubComponent));
    const previewRowsGrid = gridStubs[1]?.componentInstance as GenericDatagridStubComponent;

    const editedRow = previewRowsGrid.rows()[0] as NetworkDeviceRow;
    const updatedIp = '1.2.3.4';
    editedRow.ip = updatedIp;

    previewRowsGrid.cellValueChanged.emit({
      data: editedRow,
      field: 'ip',
      oldValue: updatedIp,
      newValue: updatedIp,
    });
    fixture.detectChanges();

    expect(store.updateField).toHaveBeenCalledWith(editedRow.rowId, 'ip', updatedIp);
  });

  it('propagates mac edits as string values', () => {
    const fixture = TestBed.createComponent(NetworkDevicePageComponent);
    fixture.detectChanges();

    const store = TestBed.inject(NetworkDeviceStore) as unknown as NetworkDeviceStoreStub;
    const gridStubs = fixture.debugElement.queryAll(By.directive(GenericDatagridStubComponent));
    const previewRowsGrid = gridStubs[1]?.componentInstance as GenericDatagridStubComponent;

    const editedRow = previewRowsGrid.rows()[0] as NetworkDeviceRow;
    const updatedMac = '00aa000000ff';

    previewRowsGrid.cellValueChanged.emit({
      data: editedRow,
      field: 'mac',
      oldValue: editedRow.mac,
      newValue: updatedMac,
    });
    fixture.detectChanges();

    expect(store.updateField).toHaveBeenCalledWith(editedRow.rowId, 'mac', updatedMac);
  });
});
