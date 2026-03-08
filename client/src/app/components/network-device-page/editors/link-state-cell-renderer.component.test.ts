import { LinkStateCellRendererComponent } from './link-state-cell-renderer.component';

describe('LinkStateCellRendererComponent', () => {
  it('maps link-up/link-down/link-error to the expected dot classes', () => {
    const component = new LinkStateCellRendererComponent();

    component.agInit({ value: 'link-up' } as never);
    expect(component.dotClass).toBe('link-up');

    component.refresh({ value: 'link-down' } as never);
    expect(component.dotClass).toBe('link-down');

    component.refresh({ value: 'link-error' } as never);
    expect(component.dotClass).toBe('link-error');
  });

  it('falls back to unknown dot class for unexpected values', () => {
    const component = new LinkStateCellRendererComponent();

    component.agInit({ value: undefined } as never);
    expect(component.dotClass).toBe('unknown');
  });
});
