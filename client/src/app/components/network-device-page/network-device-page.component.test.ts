import { Component, input, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DataGridColumnSchema } from '../../generic-datagrid/datagrid-schema';
import { util } from './network-device-data';
import { NetworkDeviceRow, NETWORK_DEVICE_SCHEMA } from './network-device-schema';
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
}

class NetworkDeviceStoreStub {
  public readonly schema = signal<readonly DataGridColumnSchema<NetworkDeviceRow>[]>(
    NETWORK_DEVICE_SCHEMA,
  );

  public readonly rows = signal<readonly NetworkDeviceRow[]>(util.generate(8));
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
  });
});
