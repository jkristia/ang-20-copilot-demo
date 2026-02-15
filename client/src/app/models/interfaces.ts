/**
 * Re-export interfaces from shared source
 * Import directly from source to avoid build dependency on dist
 */
export type {
  IDemoConfig,
  IRunningState,
  INetworkSettings,
  IDisplaySettings,
} from '../../../../shared/src/model.interfaces';

export type {
  Post,
  CreatePostDto,
  UpdatePostDto,
} from '../../../../shared/src/post.interface';

export {
  SelectEnum,
  DemoConfigValidation,
  RunningStateEnum,
  RunningStateValidation,
  ConnectionModeEnum,
  ThemeEnum,
} from '../../../../shared/src/model.interfaces';

/**
 * Re-export socket event constants and interfaces from shared source
 */
export {
  ConfigSocketEvents,
  PostsSocketEvents,
  RunningStateSocketEvents,
  EmployeeSocketEvents,
} from '../../../../shared/src/socket-events';

export type {
  ConfigServerToClientEvents,
  ConfigClientToServerEvents,
  PostsServerToClientEvents,
  PostsClientToServerEvents,
  RunningStateServerToClientEvents,
  RunningStateClientToServerEvents,
  EmployeeServerToClientEvents,
  EmployeeClientToServerEvents,
} from '../../../../shared/src/socket-events';

/**
 * Re-export employee interfaces from shared source
 */
export type {
  Employee,
  EmployeeDetail,
} from '../../../../shared/src/employee.interface';
