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
export interface DemoConfig {
  enabled: boolean;
  float_value: number;
  int_value: number;
  string_value: string;
  select_value: SelectEnum;
}

/**
 * Default configuration values
 */
export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  enabled: false,
  float_value: 0.0,
  int_value: 0,
  string_value: '',
  select_value: SelectEnum.value1,
};
