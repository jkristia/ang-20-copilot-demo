import { DataGrid2LinkState, DataGrid2Row } from './datagrid-2-schema';

export const DEFAULT_DATAGRID_2_ROW_COUNT = 20;

class DataGrid2DataUtil {
  private readonly linkStates: readonly DataGrid2LinkState[] = [
    'Connected',
    'Disconnected',
    'Unknown',
  ];

  public generate(rowCount = DEFAULT_DATAGRID_2_ROW_COUNT): DataGrid2Row[] {
    return Array.from({ length: rowCount }, (_, index) => ({
      rowId: `row-${index}`,
      device: `device.${index}`,
      linkState: this.toLinkState(index),
      ip: `192.168.${index}.2`,
      mask: 24,
      gateway: `192.168.${index}.1`,
      mac: `00:aa:00:00:00:${(index + 1).toString(16).padStart(2, '0')}`,
      dhcpEnabled: index % 3 !== 0,
      txPackets: 1000 + index * 347,
      signalStrength: parseFloat((-40 - index * 1.7).toFixed(1)),
      dnsServer: `8.8.${index % 4}.${index % 8}`,
    }));
  }

  private toLinkState(index: number): DataGrid2LinkState {
    return this.linkStates[index % this.linkStates.length];
  }
}

export const dataGrid2DataUtil = new DataGrid2DataUtil();
