export type DataGrid2LinkState = 'Connected' | 'Disconnected' | 'Unknown';

export interface DataGrid2Row {
  rowId: string;
  device: string;
  linkState: DataGrid2LinkState;
  ip: string;
  mask: number;
  gateway: string;
  mac: string;
  dhcpEnabled: boolean;
  txPackets: number;
  signalStrength: number;
  dnsServer: string;
}
