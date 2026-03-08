import { DataGridColumnSchema } from './datagrid-schema';

export type NetworkDeviceLinkState = 'link-up' | 'link-down' | 'link-error';

export interface NetworkDeviceRow {
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
  },
  {
    fieldName: 'linkState',
    fieldType: 'enum',
    caption: 'Link State',
    width: 140,
  },
  {
    fieldName: 'ip',
    fieldType: 'ipv4',
    caption: 'IP',
    width: 'auto',
  },
  {
    fieldName: 'mask',
    fieldType: 'int',
    caption: 'Mask',
    width: 100,
  },
  {
    fieldName: 'gateway',
    fieldType: 'ipv4',
    caption: 'Gateway',
    width: 'auto',
  },
  {
    fieldName: 'mac',
    fieldType: 'mac',
    caption: 'MAC',
    width: 180,
  },
] as const;
