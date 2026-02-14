/**
 * Local model interfaces for the Angular client
 * Duplicated from @blog/shared to avoid CommonJS/ESM compatibility issues
 */

export interface Post {
  id: string;
  date: string;
  topic: string;
  message: string;
}

export interface CreatePostDto {
  topic: string;
  message: string;
  date?: string;
}

export interface UpdatePostDto {
  topic?: string;
  message?: string;
  date?: string;
}

export enum SelectEnum {
  value1 = 'value_1',
  value2 = 'value_2',
  value3 = 'value_3',
}

export const SelectEnumDescriptions: Record<SelectEnum, string> = {
  [SelectEnum.value1]: 'Selected Value 1',
  [SelectEnum.value2]: 'Selected Value 2',
  [SelectEnum.value3]: 'Selected Value 3',
};

export interface DemoConfig {
  enabled: boolean;
  float_value: number;
  int_value: number;
  string_value: string;
  select_value: SelectEnum;
}

export const DEFAULT_DEMO_CONFIG: DemoConfig = {
  enabled: false,
  float_value: 0.0,
  int_value: 0,
  string_value: '',
  select_value: SelectEnum.value1,
};
