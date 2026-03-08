import { TestBed } from '@angular/core/testing';

import { DEFAULT_NETWORK_DEVICE_ROW_COUNT } from './network-device-data';
import { NetworkDeviceStore } from './network-device.store';

describe('NetworkDeviceStore', () => {
  let store: NetworkDeviceStore;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    store = TestBed.inject(NetworkDeviceStore);
  });

  it('exposes the Step 1 network device schema', () => {
    const schema = store.schema();

    expect(schema.map((column) => column.fieldName)).toEqual([
      'device',
      'linkState',
      'ip',
      'mask',
      'gateway',
      'mac',
    ]);
    expect(schema[1]?.fieldType).toBe('enum');
    expect(schema[2]?.fieldType).toBe('ipv4');
    expect(schema[3]?.fieldType).toBe('int');
  });

  it('creates deterministic default rows', () => {
    const rows = store.rows();

    expect(rows.length).toBe(DEFAULT_NETWORK_DEVICE_ROW_COUNT);
    expect(rows[0]).toEqual({
      device: 'device.0',
      linkState: 'link-up',
      ip: '192.168.0.2',
      mask: 24,
      gateway: '192.168.0.1',
      mac: '00:aa:00:00:00:01',
    });
    expect(rows[5]).toEqual({
      device: 'device.5',
      linkState: 'link-error',
      ip: '192.168.5.2',
      mask: 24,
      gateway: '192.168.5.1',
      mac: '00:aa:00:00:00:06',
    });
  });

  it('regenerates rows with a custom count', () => {
    store.resetRows(3);

    const rows = store.rows();
    expect(rows.length).toBe(3);
    expect(rows[2]).toEqual({
      device: 'device.2',
      linkState: 'link-error',
      ip: '192.168.2.2',
      mask: 24,
      gateway: '192.168.2.1',
      mac: '00:aa:00:00:00:03',
    });
  });
});
