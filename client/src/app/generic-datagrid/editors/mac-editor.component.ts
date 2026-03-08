import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { ICellEditorParams } from 'ag-grid-community';

import { type DataGridColumnAlignment } from '../datagrid-schema';

export interface MacEditorParams<TData extends object = Record<string, unknown>>
  extends ICellEditorParams<TData, string> {
  disabled?: boolean;
  readOnly?: boolean;
  alignment?: DataGridColumnAlignment;
}

@Component({
  selector: 'app-mac-editor',
  standalone: true,
  template: `
    <input
      #editorInput
      class="mac-editor__input"
      [value]="value"
      [disabled]="isDisabled"
      [readOnly]="isDisabled"
      [style.text-align]="textAlign"
      (input)="onInput($event)"
      spellcheck="false"
      aria-label="MAC editor"
    />
  `,
  styleUrl: './mac-editor.component.scss',
})
export class MacEditorComponent<TData extends object = Record<string, unknown>>
  implements ICellEditorAngularComp
{
  @ViewChild('editorInput') private readonly editorInput?: ElementRef<HTMLInputElement>;

  public value = '';
  public isDisabled = false;
  public textAlign: DataGridColumnAlignment = 'left';

  public agInit(params: MacEditorParams<TData>): void {
    this.value = this.sanitize(params.value);
    this.isDisabled = Boolean(params.disabled || params.readOnly);
    this.textAlign = params.alignment ?? 'left';
  }

  public getValue(): string {
    return this.sanitize(this.value);
  }

  public afterGuiAttached(): void {
    if (this.isDisabled) {
      return;
    }

    const input = this.editorInput?.nativeElement;
    input?.focus();
    input?.select();
  }

  public onInput(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const nextValue = this.sanitize(input?.value);
    this.value = nextValue;

    if (input) {
      input.value = nextValue;
    }
  }

  private sanitize(value: unknown): string {
    return String(value ?? '').replace(/[^0-9a-fA-F:]/g, '');
  }
}
