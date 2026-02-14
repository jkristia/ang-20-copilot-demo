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
