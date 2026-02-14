import {
  IDemoConfig,
  SelectEnum,
  DemoConfigValidation,
} from '../../../shared/src/model.interfaces';

/**
 * DemoConfig class with validation and get/set properties
 * Server-side implementation with validation logic
 */
export class DemoConfig implements IDemoConfig {
  private _enabled: boolean = false;
  private _float_value: number = DemoConfigValidation.FLOAT_DEFAULT;
  private _int_value: number = DemoConfigValidation.INT_DEFAULT;
  private _string_value: string = '';
  private _select_value: SelectEnum = SelectEnum.value1;
  private _last_changed: string = new Date().toISOString();

  get enabled(): boolean {
    return this._enabled;
  }

  set enabled(value: boolean) {
    this._enabled = value;
    this.updateLastChanged();
  }

  get float_value(): number {
    return this._float_value;
  }

  set float_value(value: number) {
    this._float_value = this.clamp(
      value,
      DemoConfigValidation.FLOAT_MIN,
      DemoConfigValidation.FLOAT_MAX
    );
    this.updateLastChanged();
  }

  get int_value(): number {
    return this._int_value;
  }

  set int_value(value: number) {
    this._int_value = Math.round(
      this.clamp(value, DemoConfigValidation.INT_MIN, DemoConfigValidation.INT_MAX)
    );
    this.updateLastChanged();
  }

  get string_value(): string {
    return this._string_value;
  }

  set string_value(value: string) {
    this._string_value = value.slice(0, DemoConfigValidation.STRING_MAX_LENGTH);
    this.updateLastChanged();
  }

  get select_value(): SelectEnum {
    return this._select_value;
  }

  set select_value(value: SelectEnum) {
    this._select_value = value;
    this.updateLastChanged();
  }

  get last_changed(): string {
    return this._last_changed;
  }

  private updateLastChanged(): void {
    this._last_changed = new Date().toISOString();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Converts to plain object (IDemoConfig)
   */
  toJSON(): IDemoConfig {
    return {
      enabled: this._enabled,
      float_value: this._float_value,
      int_value: this._int_value,
      string_value: this._string_value,
      select_value: this._select_value,
      last_changed: this._last_changed,
    };
  }

  /**
   * Updates config from partial data with validation
   */
  updateFrom(updates: Partial<IDemoConfig>): void {
    if (updates.enabled !== undefined) {
      this.enabled = updates.enabled;
    }
    if (updates.float_value !== undefined) {
      this.float_value = updates.float_value;
    }
    if (updates.int_value !== undefined) {
      this.int_value = updates.int_value;
    }
    if (updates.string_value !== undefined) {
      this.string_value = updates.string_value;
    }
    if (updates.select_value !== undefined) {
      this.select_value = updates.select_value;
    }
  }

  /**
   * Creates a DemoConfig from plain object data
   */
  static fromJSON(data: Partial<IDemoConfig>): DemoConfig {
    const config = new DemoConfig();
    config.updateFrom(data);
    return config;
  }
}
