import { AlignmentColDefUtil } from './alignment-col-def.util';

describe('AlignmentColDefUtil', () => {
  const util = new AlignmentColDefUtil();

  it('defaults string fields to left alignment', () => {
    expect(util.toColDef('string')).toEqual({
      cellStyle: {
        textAlign: 'left',
        justifyContent: 'flex-start',
      },
    });
  });

  it('defaults non-string fields to right alignment', () => {
    expect(util.toColDef('int')).toEqual({
      cellStyle: {
        textAlign: 'right',
        justifyContent: 'flex-end',
      },
    });

    expect(util.toColDef('enum')).toEqual({
      cellStyle: {
        textAlign: 'right',
        justifyContent: 'flex-end',
      },
    });
  });

  it('uses explicit alignment when provided', () => {
    expect(util.toColDef('float', 'center')).toEqual({
      cellStyle: {
        textAlign: 'center',
        justifyContent: 'center',
      },
    });

    expect(util.toColDef('mac', 'left')).toEqual({
      cellStyle: {
        textAlign: 'left',
        justifyContent: 'flex-start',
      },
    });
  });
});
