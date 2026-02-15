/**
 * Shared model interfaces for blog application
 * Import directly from source to avoid build dependency
 */

// =============================================================================
// Post interfaces
// =============================================================================

/**
 * Represents a blog post
 */
export interface Post {
  id: string;
  date: string;
  topic: string;
  message: string;
}

/**
 * DTO for creating a new post
 * Class for NestJS decorator compatibility
 */
export class CreatePostDto {
  date?: string;
  topic!: string;
  message!: string;
}

/**
 * DTO for updating an existing post
 * Class for NestJS decorator compatibility
 */
export class UpdatePostDto {
  date?: string;
  topic?: string;
  message?: string;
}

// =============================================================================
// Shared Enums (declared early for use in multiple interfaces)
// =============================================================================

/**
 * Enum for network connection mode
 */
export enum ConnectionModeEnum {
  AUTO = 'auto',
  MANUAL = 'manual',
  ON_DEMAND = 'on_demand',
}

/**
 * Human-readable descriptions for ConnectionModeEnum values
 */
export const ConnectionModeDescriptions: Record<ConnectionModeEnum, string> = {
  [ConnectionModeEnum.AUTO]: 'Automatic',
  [ConnectionModeEnum.MANUAL]: 'Manual',
  [ConnectionModeEnum.ON_DEMAND]: 'On Demand',
};

/**
 * Enum for display theme
 */
export enum ThemeEnum {
  LIGHT = 'light',
  DARK = 'dark',
  SYSTEM = 'system',
}

/**
 * Human-readable descriptions for ThemeEnum values
 */
export const ThemeDescriptions: Record<ThemeEnum, string> = {
  [ThemeEnum.LIGHT]: 'Light',
  [ThemeEnum.DARK]: 'Dark',
  [ThemeEnum.SYSTEM]: 'System Default',
};

// =============================================================================
// DemoConfig interfaces
// =============================================================================

/**
 * Enum for select options in demo config
 */
export enum SelectEnum {
  value1 = 'value_1',
  value2 = 'value_2',
  value3 = 'value_3',
}

/**
 * Human-readable descriptions for SelectEnum values
 */
export const SelectEnumDescriptions: Record<SelectEnum, string> = {
  [SelectEnum.value1]: 'Selected Value 1',
  [SelectEnum.value2]: 'Selected Value 2',
  [SelectEnum.value3]: 'Selected Value 3',
};

/**
 * Demo configuration interface
 */
export interface IDemoConfig {
  enabled: boolean;
  float_value: number;
  int_value: number;
  string_value: string;
  select_value: SelectEnum;
  last_changed: string;
  network_settings: INetworkSettings;
  display_settings: IDisplaySettings;
}

/**
 * Validation constants for DemoConfig
 */
export const DemoConfigValidation = {
  FLOAT_MIN: -10,
  FLOAT_MAX: 10,
  FLOAT_DEFAULT: 1.01,
  INT_MIN: 0,
  INT_MAX: 100,
  INT_DEFAULT: 10,
  STRING_MAX_LENGTH: 20,
} as const;

/**
 * Default configuration values
 * Note: network_settings and display_settings use inline defaults since their
 * DEFAULT_* constants are defined later. Values match the respective defaults.
 */
export const DEFAULT_DEMO_CONFIG: IDemoConfig = {
  enabled: false,
  float_value: DemoConfigValidation.FLOAT_DEFAULT,
  int_value: DemoConfigValidation.INT_DEFAULT,
  string_value: '',
  select_value: SelectEnum.value1,
  last_changed: new Date().toISOString(),
  network_settings: {
    network_enabled: true,
    timeout_seconds: 30,
    allow_retry: true,
    retry_count: 3,
    connection_mode: ConnectionModeEnum.AUTO,
  },
  display_settings: {
    dark_mode: false,
    font_size: 14,
    show_animations: true,
    theme: ThemeEnum.SYSTEM,
  },
};

// =============================================================================
// RunningState interfaces
// =============================================================================

/**
 * Enum for running state
 */
export enum RunningStateEnum {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
}

/**
 * Human-readable descriptions for RunningStateEnum values
 */
export const RunningStateDescriptions: Record<RunningStateEnum, string> = {
  [RunningStateEnum.IDLE]: 'Idle',
  [RunningStateEnum.RUNNING]: 'Running',
};

/**
 * Running state interface
 */
export interface IRunningState {
  state: RunningStateEnum;
  run_duration: number;
  elapsed_seconds: number;
}

/**
 * Validation constants for RunningState
 */
export const RunningStateValidation = {
  DURATION_MIN: 1,
  DURATION_MAX: 30,
  DURATION_DEFAULT: 5,
} as const;

/**
 * Default running state values
 */
export const DEFAULT_RUNNING_STATE: IRunningState = {
  state: RunningStateEnum.IDLE,
  run_duration: RunningStateValidation.DURATION_DEFAULT,
  elapsed_seconds: 0,
};

// =============================================================================
// NetworkSettings interfaces
// =============================================================================

/**
 * Network settings interface
 */
export interface INetworkSettings {
  network_enabled: boolean;
  timeout_seconds: number;
  allow_retry: boolean;
  retry_count: number;
  connection_mode: ConnectionModeEnum;
}

/**
 * Validation constants for NetworkSettings
 */
export const NetworkSettingsValidation = {
  TIMEOUT_MIN: 1,
  TIMEOUT_MAX: 60,
  TIMEOUT_DEFAULT: 30,
  RETRY_MIN: 0,
  RETRY_MAX: 10,
  RETRY_DEFAULT: 3,
} as const;

/**
 * Default network settings values
 */
export const DEFAULT_NETWORK_SETTINGS: INetworkSettings = {
  network_enabled: true,
  timeout_seconds: NetworkSettingsValidation.TIMEOUT_DEFAULT,
  allow_retry: true,
  retry_count: NetworkSettingsValidation.RETRY_DEFAULT,
  connection_mode: ConnectionModeEnum.AUTO,
};

// =============================================================================
// DisplaySettings interfaces
// =============================================================================

/**
 * Display settings interface
 */
export interface IDisplaySettings {
  dark_mode: boolean;
  font_size: number;
  show_animations: boolean;
  theme: ThemeEnum;
}

/**
 * Validation constants for DisplaySettings
 */
export const DisplaySettingsValidation = {
  FONT_SIZE_MIN: 10,
  FONT_SIZE_MAX: 24,
  FONT_SIZE_DEFAULT: 14,
} as const;

/**
 * Default display settings values
 */
export const DEFAULT_DISPLAY_SETTINGS: IDisplaySettings = {
  dark_mode: false,
  font_size: DisplaySettingsValidation.FONT_SIZE_DEFAULT,
  show_animations: true,
  theme: ThemeEnum.SYSTEM,
};
