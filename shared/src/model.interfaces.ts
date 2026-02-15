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
 */
export const DEFAULT_DEMO_CONFIG: IDemoConfig = {
  enabled: false,
  float_value: DemoConfigValidation.FLOAT_DEFAULT,
  int_value: DemoConfigValidation.INT_DEFAULT,
  string_value: '',
  select_value: SelectEnum.value1,
  last_changed: new Date().toISOString(),
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
