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
    expect(schema[3]?.min).toBe(8);
    expect(schema[3]?.max).toBe(31);
    expect(schema[0]?.readOnly).toBe(true);
    expect(schema[1]?.cellRenderer).toBeDefined();
  });

  it('creates deterministic default rows', () => {
    const rows = store.rows();

    expect(rows.length).toBe(DEFAULT_NETWORK_DEVICE_ROW_COUNT);
    expect(rows[0]).toEqual({
      rowId: 'row-0',
      device: 'device.0',
      linkState: 'link-up',
      ip: '192.168.0.2',
      mask: 24,
      gateway: '192.168.0.1',
      mac: '00:aa:00:00:00:01',
    });
    expect(rows[5]).toEqual({
      rowId: 'row-5',
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
      rowId: 'row-2',
      device: 'device.2',
      linkState: 'link-error',
      ip: '192.168.2.2',
      mask: 24,
      gateway: '192.168.2.1',
      mac: '00:aa:00:00:00:03',
    });
  });

  it('updates editable fields in canonical store rows', () => {
    const first = store.rows()[0];
    expect(first).toBeDefined();

    if (!first) {
      return;
    }

    store.updateField(first.rowId, 'ip', '10.0.0.2');
    store.updateField(first.rowId, 'gateway', '10.0.0.1');
    store.updateField(first.rowId, 'mask', 31);
    store.updateField(first.rowId, 'mac', '00aa000000ff');

    const updated = store.rows().find((row) => row.rowId === first.rowId);
    expect(updated).toEqual({
      ...first,
      ip: '10.0.0.2',
      mask: 31,
      gateway: '10.0.0.1',
      mac: '00aa000000ff',
    });
  });

  it('ignores updates for readonly and unknown fields', () => {
    const first = store.rows()[0];
    expect(first).toBeDefined();

    if (!first) {
      return;
    }

    store.updateField(first.rowId, 'device', 'renamed-device');
    store.updateField(first.rowId, 'unknown-field', 'value');

    const unchanged = store.rows().find((row) => row.rowId === first.rowId);
    expect(unchanged).toEqual(first);
  });

  it('emits a new row object when an edited row was already mutated in-place', () => {
    const first = store.rows()[0];
    expect(first).toBeDefined();

    if (!first) {
      return;
    }

    // Simulate AG Grid mutating the row object before app-level update handling.
    first.ip = '1.2.3.4';

    store.updateField(first.rowId, 'ip', '1.2.3.4');

    const updated = store.rows().find((row) => row.rowId === first.rowId);
    expect(updated).toBeDefined();
    expect(updated).not.toBe(first);
    expect(updated?.ip).toBe('1.2.3.4');
  });
});
