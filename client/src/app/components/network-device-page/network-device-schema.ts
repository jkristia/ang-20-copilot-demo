import { DataGridColumnSchema } from '../../generic-datagrid/datagrid-schema';
import { LinkStateCellRendererComponent } from './editors/link-state-cell-renderer.component';

export type NetworkDeviceLinkState = 'link-up' | 'link-down' | 'link-error';

export interface NetworkDeviceRow {
  rowId: string;
  device: string;
  linkState: NetworkDeviceLinkState;
  ip: string;
  mask: number;
  gateway: string;
  mac: string;
}

export const NETWORK_DEVICE_SCHEMA: readonly DataGridColumnSchema<NetworkDeviceRow>[] = [
  {
    fieldName: 'device',
    fieldType: 'string',
    caption: 'Device',
    width: 180,
    readOnly: true,
  },
  {
    fieldName: 'linkState',
    fieldType: 'enum',
    caption: 'Link State',
    width: 140,
    readOnly: true,
    alignment: 'center',
    cellRenderer: LinkStateCellRendererComponent,
  },
  {
    fieldName: 'ip',
    fieldType: 'ipv4',
    caption: 'IP',
    width: 170,
  },
  {
    fieldName: 'mask',
    fieldType: 'int',
    caption: 'Mask',
    width: 100,
    min: 8,
    max: 31,
  },
  {
    fieldName: 'gateway',
    fieldType: 'ipv4',
    caption: 'Gateway',
    width: 170,
  },
  {
    fieldName: 'mac',
    fieldType: 'mac',
    caption: 'MAC',
    width: 180,
  },
] as const;
