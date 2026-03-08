import { IntEditorComponent } from './int-editor.component';

describe('IntEditorComponent', () => {
  it('sanitizes input to integer characters and returns a number', () => {
    const component = new IntEditorComponent();

    component.agInit({
      value: 24,
      disabled: false,
      readOnly: false,
    } as never);

    component.onInput({
      target: {
        value: '3a1',
      },
    } as unknown as Event);

    expect(component.getValue()).toBe(31);
  });

  it('clamps values outside min/max range', () => {
    const component = new IntEditorComponent();

    component.agInit({
      value: 24,
      min: 8,
      max: 31,
    } as never);

    component.onInput({
      target: {
        value: '2',
      },
    } as unknown as Event);
    expect(component.getValue()).toBe(8);

    component.onInput({
      target: {
        value: '99',
      },
    } as unknown as Event);
    expect(component.getValue()).toBe(31);
  });

  it('supports alignment and disabled state', () => {
    const component = new IntEditorComponent();

    component.agInit({
      value: 24,
      alignment: 'center',
      disabled: true,
    } as never);

    expect(component.textAlign).toBe('center');
    expect(component.isDisabled).toBe(true);
  });

  it('defaults to right alignment and readOnly disables input', () => {
    const component = new IntEditorComponent();

    component.agInit({
      value: 24,
      readOnly: true,
    } as never);

    expect(component.textAlign).toBe('right');
    expect(component.isDisabled).toBe(true);
  });
});
