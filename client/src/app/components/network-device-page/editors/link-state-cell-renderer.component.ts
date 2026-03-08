import { Component } from '@angular/core';
import { ICellRendererParams } from 'ag-grid-community';

import { NetworkDeviceLinkState, NetworkDeviceRow } from '../network-device-schema';

@Component({
  selector: 'app-link-state-cell-renderer',
  standalone: true,
  template: `
    <span [class]="'link-state-cell ' + dotClass">
      <span [class]="'dot ' + dotClass" [attr.aria-label]="value ?? 'unknown'"></span>
    </span>
  `,
  styleUrl: './link-state-cell-renderer.component.scss',
})
export class LinkStateCellRendererComponent {
  public value: NetworkDeviceLinkState | undefined;
  public dotClass = 'unknown';

  public agInit(params: ICellRendererParams<NetworkDeviceRow, NetworkDeviceLinkState>): void {
    this.value = params.value ?? undefined;
    this.dotClass = this.toDotClass(params.value);
  }

  public refresh(params: ICellRendererParams<NetworkDeviceRow, NetworkDeviceLinkState>): boolean {
    this.agInit(params);
    return true;
  }

  private toDotClass(value: NetworkDeviceLinkState | null | undefined): string {
    return value ?? 'unknown';
  }
}
