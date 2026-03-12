import { DataGridColumnSchema } from '../../generic-datagrid/datagrid-schema';
import { DataGrid2LinkStateRendererComponent } from './editors/link-state-cell-renderer.component';

export type DataGrid2LinkState = 'Connected' | 'Disconnected' | 'Unknown';

export interface DataGrid2Row {
  rowId: string;
  device: string;
  linkState: DataGrid2LinkState;
  ip: string;
  mask: number;
  gateway: string;
  mac: string;
}

export const DATAGRID_2_SCHEMA: readonly DataGridColumnSchema<DataGrid2Row>[] = [
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
    cellRenderer: DataGrid2LinkStateRendererComponent,
  },
  {
    fieldName: 'ip',
    fieldType: 'ipv4',
    caption: 'IP',
    width: 170,
    alignment: 'center',
  },
  {
    fieldName: 'mask',
    fieldType: 'int',
    caption: 'Mask',
    width: 100,
    readOnly: true,
    alignment: 'right',
    min: 8,
    max: 31,
  },
  {
    fieldName: 'gateway',
    fieldType: 'ipv4',
    caption: 'Gateway',
    width: 170,
    alignment: 'right',
  },
  {
    fieldName: 'mac',
    fieldType: 'mac',
    caption: 'MAC',
    width: 180,
    alignment: 'right',
  },
] as const;
