import { MacEditorComponent } from './mac-editor.component';

describe('MacEditorComponent', () => {
  it('sanitizes values to hex and colon characters only', () => {
    const component = new MacEditorComponent();

    component.agInit({
      value: '00:aa:GG:11',
      disabled: false,
      readOnly: false,
    } as never);

    expect(component.getValue()).toBe('00:aa::11');

    component.onInput({
      target: {
        value: 'a1:b2-c3??Z',
      },
    } as unknown as Event);

    expect(component.getValue()).toBe('a1:b2c3');
  });

  it('marks editor as disabled when disabled or readonly params are set', () => {
    const disabledComponent = new MacEditorComponent();
    disabledComponent.agInit({
      value: '00aa11',
      disabled: true,
      readOnly: false,
    } as never);
    expect(disabledComponent.isDisabled).toBe(true);

    const readonlyComponent = new MacEditorComponent();
    readonlyComponent.agInit({
      value: '00aa11',
      disabled: false,
      readOnly: true,
    } as never);
    expect(readonlyComponent.isDisabled).toBe(true);
  });

  it('applies the provided alignment to editor text', () => {
    const component = new MacEditorComponent();

    component.agInit({
      value: '00aa11',
      alignment: 'right',
    } as never);
    expect(component.textAlign).toBe('right');

    component.agInit({
      value: '00aa11',
      alignment: 'center',
    } as never);
    expect(component.textAlign).toBe('center');
  });
});
