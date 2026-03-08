import { Component, ElementRef, ViewChild } from '@angular/core';
import { ICellEditorParams } from 'ag-grid-community';

import { type DataGridColumnAlignment } from '../datagrid-schema';

export interface IntEditorParams<TData extends object = Record<string, unknown>>
  extends ICellEditorParams<TData, number> {
  disabled?: boolean;
  readOnly?: boolean;
  alignment?: DataGridColumnAlignment;
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-int-editor',
  standalone: true,
  template: `
    <input
      #editorInput
      class="int-editor__input"
      [value]="value"
      [disabled]="isDisabled"
      [readOnly]="isDisabled"
      [style.text-align]="textAlign"
      (input)="onInput($event)"
      inputmode="numeric"
      spellcheck="false"
      aria-label="Integer editor"
    />
  `,
  styleUrl: './int-editor.component.scss',
})
export class IntEditorComponent<TData extends object = Record<string, unknown>> {
  @ViewChild('editorInput') private readonly editorInput?: ElementRef<HTMLInputElement>;

  public value = '';
  public isDisabled = false;
  public textAlign: DataGridColumnAlignment = 'right';

  private initialValue = 0;
  private min: number | undefined;
  private max: number | undefined;

  public agInit(params: IntEditorParams<TData>): void {
    this.initialValue = this.toNumber(params.value, 0);
    this.value = this.initialValue.toString();
    this.isDisabled = Boolean(params.disabled || params.readOnly);
    this.textAlign = params.alignment ?? 'right';
    this.min = params.min;
    this.max = params.max;
  }

  public getValue(): number {
    const parsed = this.toNumber(this.value, this.initialValue);
    return this.clamp(parsed);
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
    const nextValue = this.sanitizeInt(input?.value);
    this.value = nextValue;

    if (input) {
      input.value = nextValue;
    }
  }

  private sanitizeInt(value: unknown): string {
    const raw = String(value ?? '').replace(/[^0-9-]/g, '');

    if (raw.startsWith('-')) {
      return `-${raw.slice(1).replace(/-/g, '')}`;
    }

    return raw.replace(/-/g, '');
  }

  private toNumber(value: unknown, fallback: number): number {
    const parsed = Number.parseInt(String(value ?? ''), 10);
    return Number.isNaN(parsed) ? fallback : parsed;
  }

  private clamp(value: number): number {
    let result = value;

    if (this.min !== undefined && result < this.min) {
      result = this.min;
    }

    if (this.max !== undefined && result > this.max) {
      result = this.max;
    }

    return result;
  }
}
