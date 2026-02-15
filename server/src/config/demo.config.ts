import {
  IDemoConfig,
  SelectEnum,
  DemoConfigValidation,
  INetworkSettings,
  IDisplaySettings,
  NetworkSettingsValidation,
  DisplaySettingsValidation,
  ConnectionModeEnum,
  ThemeEnum,
  DEFAULT_NETWORK_SETTINGS,
  DEFAULT_DISPLAY_SETTINGS,
} from '../../../shared/src/model.interfaces';
import { clamp, clampInt, truncateString } from './validation-utils';

/**
 * NetworkSettings class with validation
 */
export class NetworkSettings implements INetworkSettings {
  private _network_enabled: boolean = DEFAULT_NETWORK_SETTINGS.network_enabled;
  private _timeout_seconds: number = DEFAULT_NETWORK_SETTINGS.timeout_seconds;
  private _allow_retry: boolean = DEFAULT_NETWORK_SETTINGS.allow_retry;
  private _retry_count: number = DEFAULT_NETWORK_SETTINGS.retry_count;
  private _connection_mode: ConnectionModeEnum = DEFAULT_NETWORK_SETTINGS.connection_mode;

  public get network_enabled(): boolean {
    return this._network_enabled;
  }

  public set network_enabled(value: boolean) {
    this._network_enabled = value;
  }

  public get timeout_seconds(): number {
    return this._timeout_seconds;
  }

  public set timeout_seconds(value: number) {
    this._timeout_seconds = clamp(
      value,
      NetworkSettingsValidation.TIMEOUT_MIN,
      NetworkSettingsValidation.TIMEOUT_MAX
    );
  }

  public get allow_retry(): boolean {
    return this._allow_retry;
  }

  public set allow_retry(value: boolean) {
    this._allow_retry = value;
  }

  public get retry_count(): number {
    return this._retry_count;
  }

  public set retry_count(value: number) {
    this._retry_count = clampInt(
      value,
      NetworkSettingsValidation.RETRY_MIN,
      NetworkSettingsValidation.RETRY_MAX
    );
  }

  public get connection_mode(): ConnectionModeEnum {
    return this._connection_mode;
  }

  public set connection_mode(value: ConnectionModeEnum) {
    this._connection_mode = value;
  }

  public toJSON(): INetworkSettings {
    return {
      network_enabled: this._network_enabled,
      timeout_seconds: this._timeout_seconds,
      allow_retry: this._allow_retry,
      retry_count: this._retry_count,
      connection_mode: this._connection_mode,
    };
  }

  public updateFrom(updates: Partial<INetworkSettings>): void {
    if (updates.network_enabled !== undefined) {
      this.network_enabled = updates.network_enabled;
    }
    if (updates.timeout_seconds !== undefined) {
      this.timeout_seconds = updates.timeout_seconds;
    }
    if (updates.allow_retry !== undefined) {
      this.allow_retry = updates.allow_retry;
    }
    if (updates.retry_count !== undefined) {
      this.retry_count = updates.retry_count;
    }
    if (updates.connection_mode !== undefined) {
      this.connection_mode = updates.connection_mode;
    }
  }
}

/**
 * DisplaySettings class with validation
 */
export class DisplaySettings implements IDisplaySettings {
  private _dark_mode: boolean = DEFAULT_DISPLAY_SETTINGS.dark_mode;
  private _font_size: number = DEFAULT_DISPLAY_SETTINGS.font_size;
  private _show_animations: boolean = DEFAULT_DISPLAY_SETTINGS.show_animations;
  private _theme: ThemeEnum = DEFAULT_DISPLAY_SETTINGS.theme;

  public get dark_mode(): boolean {
    return this._dark_mode;
  }

  public set dark_mode(value: boolean) {
    this._dark_mode = value;
  }

  public get font_size(): number {
    return this._font_size;
  }

  public set font_size(value: number) {
    this._font_size = clampInt(
      value,
      DisplaySettingsValidation.FONT_SIZE_MIN,
      DisplaySettingsValidation.FONT_SIZE_MAX
    );
  }

  public get show_animations(): boolean {
    return this._show_animations;
  }

  public set show_animations(value: boolean) {
    this._show_animations = value;
  }

  public get theme(): ThemeEnum {
    return this._theme;
  }

  public set theme(value: ThemeEnum) {
    this._theme = value;
  }

  public toJSON(): IDisplaySettings {
    return {
      dark_mode: this._dark_mode,
      font_size: this._font_size,
      show_animations: this._show_animations,
      theme: this._theme,
    };
  }

  public updateFrom(updates: Partial<IDisplaySettings>): void {
    if (updates.dark_mode !== undefined) {
      this.dark_mode = updates.dark_mode;
    }
    if (updates.font_size !== undefined) {
      this.font_size = updates.font_size;
    }
    if (updates.show_animations !== undefined) {
      this.show_animations = updates.show_animations;
    }
    if (updates.theme !== undefined) {
      this.theme = updates.theme;
    }
  }
}

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
  private _network_settings: NetworkSettings = new NetworkSettings();
  private _display_settings: DisplaySettings = new DisplaySettings();

  public get enabled(): boolean {
    return this._enabled;
  }

  public set enabled(value: boolean) {
    this._enabled = value;
    this.updateLastChanged();
  }

  public get float_value(): number {
    return this._float_value;
  }

  public set float_value(value: number) {
    this._float_value = clamp(
      value,
      DemoConfigValidation.FLOAT_MIN,
      DemoConfigValidation.FLOAT_MAX
    );
    this.updateLastChanged();
  }

  public get int_value(): number {
    return this._int_value;
  }

  public set int_value(value: number) {
    this._int_value = clampInt(
      value,
      DemoConfigValidation.INT_MIN,
      DemoConfigValidation.INT_MAX
    );
    this.updateLastChanged();
  }

  public get string_value(): string {
    return this._string_value;
  }

  public set string_value(value: string) {
    this._string_value = truncateString(value, DemoConfigValidation.STRING_MAX_LENGTH);
    this.updateLastChanged();
  }

  public get select_value(): SelectEnum {
    return this._select_value;
  }

  public set select_value(value: SelectEnum) {
    this._select_value = value;
    this.updateLastChanged();
  }

  public get last_changed(): string {
    return this._last_changed;
  }

  public get network_settings(): INetworkSettings {
    return this._network_settings.toJSON();
  }

  public set network_settings(value: Partial<INetworkSettings>) {
    this._network_settings.updateFrom(value);
    this.updateLastChanged();
  }

  public get display_settings(): IDisplaySettings {
    return this._display_settings.toJSON();
  }

  public set display_settings(value: Partial<IDisplaySettings>) {
    this._display_settings.updateFrom(value);
    this.updateLastChanged();
  }

  private updateLastChanged(): void {
    this._last_changed = new Date().toISOString();
  }

  /**
   * Converts to plain object (IDemoConfig)
   */
  public toJSON(): IDemoConfig {
    return {
      enabled: this._enabled,
      float_value: this._float_value,
      int_value: this._int_value,
      string_value: this._string_value,
      select_value: this._select_value,
      last_changed: this._last_changed,
      network_settings: this._network_settings.toJSON(),
      display_settings: this._display_settings.toJSON(),
    };
  }

  /**
   * Updates config from partial data with validation
   */
  public updateFrom(updates: Partial<IDemoConfig>): void {
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
    if (updates.network_settings !== undefined) {
      this.network_settings = updates.network_settings;
    }
    if (updates.display_settings !== undefined) {
      this.display_settings = updates.display_settings;
    }
  }

  /**
   * Creates a DemoConfig from plain object data
   */
  public static fromJSON(data: Partial<IDemoConfig>): DemoConfig {
    const config = new DemoConfig();
    config.updateFrom(data);
    return config;
  }
}
