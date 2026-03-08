import { FieldTypeColDefUtil } from './field-type-col-def.util';

describe('FieldTypeColDefUtil', () => {
  const util = new FieldTypeColDefUtil();

  it('maps bool fields to boolean column settings', () => {
    expect(util.toColDef('bool')).toEqual({
      cellDataType: 'boolean',
    });
  });

  it('maps numeric fields to numeric column settings', () => {
    expect(util.toColDef('int')).toEqual({
      cellDataType: 'number',
      type: 'numericColumn',
    });

    expect(util.toColDef('float')).toEqual({
      cellDataType: 'number',
      type: 'numericColumn',
    });
  });

  it('maps enum fields to set-filter column settings', () => {
    expect(util.toColDef('enum')).toEqual({
      cellDataType: 'text',
      filter: 'agSetColumnFilter',
    });
  });

  it('maps string-like fields to text column settings', () => {
    expect(util.toColDef('string')).toEqual({
      cellDataType: 'text',
    });

    expect(util.toColDef('ipv4')).toEqual({
      cellDataType: 'text',
    });

    expect(util.toColDef('mac')).toEqual({
      cellDataType: 'text',
    });
  });
});
