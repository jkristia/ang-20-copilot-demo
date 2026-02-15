/**
 * Models barrel export
 */

export * from './interfaces';

// Re-export constants from shared source
export {
  SelectEnumDescriptions,
  DEFAULT_DEMO_CONFIG,
  RunningStateDescriptions,
  DEFAULT_RUNNING_STATE,
  ConnectionModeDescriptions,
  DEFAULT_NETWORK_SETTINGS,
  NetworkSettingsValidation,
  ThemeDescriptions,
  DEFAULT_DISPLAY_SETTINGS,
  DisplaySettingsValidation,
} from '../../../../shared/src/model.interfaces';
