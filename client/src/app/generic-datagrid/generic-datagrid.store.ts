import { Injectable, signal } from '@angular/core';

import { DataGridColumnSchema } from './datagrid-schema';
import { NetworkDeviceRow, NETWORK_DEVICE_SCHEMA } from './network-device-schema';
import {
  DEFAULT_NETWORK_DEVICE_ROW_COUNT,
  util,
} from './network-device-data';

@Injectable({
  providedIn: 'root',
})
export class GenericDatagridStore {
  private readonly _schema = signal<readonly DataGridColumnSchema<NetworkDeviceRow>[]>(NETWORK_DEVICE_SCHEMA);
  private readonly _rows = signal<readonly NetworkDeviceRow[]>(util.generate());

  public readonly schema = this._schema.asReadonly();
  public readonly rows = this._rows.asReadonly();

  public resetRows(rowCount = DEFAULT_NETWORK_DEVICE_ROW_COUNT): void {
    this._rows.set(util.generate(rowCount));
  }
}
