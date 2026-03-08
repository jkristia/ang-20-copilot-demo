import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorParams } from 'ag-grid-community';

import { type DataGridColumnAlignment } from '../datagrid-schema';

export interface IPv4EditorParams<TData extends object = Record<string, unknown>>
  extends ICellEditorParams<TData, string> {
  disabled?: boolean;
  readOnly?: boolean;
  alignment?: DataGridColumnAlignment;
}

@Component({
  selector: 'app-ipv4-editor',
  standalone: true,
  template: `
    <input
      #editorInput
      class="ipv4-editor__input"
      [value]="value"
      [disabled]="isDisabled"
      [readOnly]="isDisabled"
      [style.text-align]="textAlign"
      (input)="onInput($event)"
      inputmode="numeric"
      spellcheck="false"
      aria-label="IPv4 editor"
    />
  `,
  styleUrl: './ipv4-editor.component.scss',
})
export class IPv4EditorComponent<TData extends object = Record<string, unknown>> {
  @ViewChild('editorInput') private readonly editorInput?: ElementRef<HTMLInputElement>;

  public value = '';
  public isDisabled = false;
  public textAlign: DataGridColumnAlignment = 'left';

  public agInit(params: IPv4EditorParams<TData>): void {
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
    return String(value ?? '').replace(/[^0-9.]/g, '');
  }
}
