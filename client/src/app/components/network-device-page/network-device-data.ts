import { NetworkDeviceLinkState, NetworkDeviceRow } from './network-device-schema';

export const DEFAULT_NETWORK_DEVICE_ROW_COUNT = 20;
const MAX_NETWORK_DEVICE_ROW_COUNT = 255;

class NetworkDeviceDataUtil {
  private readonly linkStates: readonly NetworkDeviceLinkState[] = [
    'link-up',
    'link-down',
    'link-error',
  ];

  public generate(rowCount = DEFAULT_NETWORK_DEVICE_ROW_COUNT): NetworkDeviceRow[] {
    this.validateRowCount(rowCount);

    return Array.from({ length: rowCount }, (_, index) => ({
      device: `device.${index}`,
      linkState: this.toLinkState(index),
      ip: this.toNetworkIp(index, 2),
      mask: 24,
      gateway: this.toNetworkIp(index, 1),
      mac: this.toMacAddress(index + 1),
    }));
  }

  private toLinkState(index: number): NetworkDeviceLinkState {
    return this.linkStates[index % this.linkStates.length];
  }

  private toNetworkIp(thirdOctet: number, lastOctet: number): string {
    return `192.168.${thirdOctet}.${lastOctet}`;
  }

  private toMacAddress(lastByte: number): string {
    return `00:aa:00:00:00:${lastByte.toString(16).padStart(2, '0')}`;
  }

  private validateRowCount(rowCount: number): void {
    if (!Number.isInteger(rowCount) || rowCount < 0) {
      throw new Error('Row count must be a non-negative integer.');
    }

    if (rowCount > MAX_NETWORK_DEVICE_ROW_COUNT) {
      throw new Error(
        `Row count cannot exceed ${MAX_NETWORK_DEVICE_ROW_COUNT} for the current deterministic IPv4 and MAC format.`,
      );
    }
  }
}

export const util = new NetworkDeviceDataUtil();

export const NETWORK_DEVICE_ROWS: readonly NetworkDeviceRow[] =
  util.generate();
