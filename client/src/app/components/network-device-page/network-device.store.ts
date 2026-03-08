import { Injectable } from '@angular/core';

import { GenericDatagridStore } from '../../generic-datagrid/generic-datagrid.store';
import {
  DEFAULT_NETWORK_DEVICE_ROW_COUNT,
  util,
} from './network-device-data';
import {
  NetworkDeviceRow,
  NETWORK_DEVICE_SCHEMA,
} from './network-device-schema';

@Injectable({
  providedIn: 'root',
})
export class NetworkDeviceStore extends GenericDatagridStore<NetworkDeviceRow> {
  public constructor() {
    super({
      schema: NETWORK_DEVICE_SCHEMA,
      rows: util.generate(DEFAULT_NETWORK_DEVICE_ROW_COUNT),
    });
  }

  protected getRowData(
    rowCount = DEFAULT_NETWORK_DEVICE_ROW_COUNT,
  ): readonly NetworkDeviceRow[] {
    return util.generate(rowCount);
  }

  public updateField(
    rowId: string,
    field: string,
    value: unknown,
  ): void {
    const nextRows = this.rows().map((row) =>
      row.rowId === rowId
        ? this.withUpdatedField(row, field, value)
        : row,
    );

    this.setRows(nextRows);
  }
}
