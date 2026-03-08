import { IPv4EditorComponent } from './ipv4-editor.component';

describe('IPv4EditorComponent', () => {
  it('sanitizes values to digits and dots only', () => {
    const component = new IPv4EditorComponent();

    component.agInit({
      value: '10a.20b.30c.40d',
      disabled: false,
      readOnly: false,
    } as never);

    expect(component.getValue()).toBe('10.20.30.40');

    component.onInput({
      target: {
        value: '1x.2y.3z.4q',
      },
    } as unknown as Event);

    expect(component.getValue()).toBe('1.2.3.4');
  });

  it('marks editor as disabled when disabled or readonly params are set', () => {
    const disabledComponent = new IPv4EditorComponent();
    disabledComponent.agInit({
      value: '192.168.0.1',
      disabled: true,
      readOnly: false,
    } as never);
    expect(disabledComponent.isDisabled).toBe(true);

    const readonlyComponent = new IPv4EditorComponent();
    readonlyComponent.agInit({
      value: '192.168.0.1',
      disabled: false,
      readOnly: true,
    } as never);
    expect(readonlyComponent.isDisabled).toBe(true);
  });

  it('applies the provided alignment to editor text', () => {
    const component = new IPv4EditorComponent();

    component.agInit({
      value: '192.168.0.1',
      alignment: 'right',
    } as never);
    expect(component.textAlign).toBe('right');

    component.agInit({
      value: '192.168.0.1',
      alignment: 'center',
    } as never);
    expect(component.textAlign).toBe('center');
  });
});
