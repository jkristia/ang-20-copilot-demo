/**
 * WebSocket event names for type-safe socket communication
 */

import type { IDemoConfig, IRunningState } from './model.interfaces';
import type { EmployeeDetail, Employee } from './employee.interface';

/** Config-related socket events */
export const ConfigSocketEvents = {
  /** Server broadcasts config update to all clients */
  UPDATED: 'config:updated',
} as const;

/** Posts-related socket events */
export const PostsSocketEvents = {
  /** Server broadcasts that posts have been updated */
  UPDATED: 'posts:updated',
} as const;

/** RunningState-related socket events */
export const RunningStateSocketEvents = {
  /** Server broadcasts state update to all clients */
  UPDATED: 'running-state:updated',
} as const;

/** Employee-related socket events */
export const EmployeeSocketEvents = {
  /** Server broadcasts that an employee detail was updated */
  DETAIL_UPDATED: 'employee:detail-updated',
  /** Server broadcasts that an employee was updated */
  EMPLOYEE_UPDATED: 'employee:updated',
} as const;

/** Type for ConfigSocketEvents values */
export type ConfigSocketEvent = typeof ConfigSocketEvents[keyof typeof ConfigSocketEvents];

/** Type for PostsSocketEvents values */
export type PostsSocketEvent = typeof PostsSocketEvents[keyof typeof PostsSocketEvents];

/** Type for RunningStateSocketEvents values */
export type RunningStateSocketEvent = typeof RunningStateSocketEvents[keyof typeof RunningStateSocketEvents];

/** Type for EmployeeSocketEvents values */
export type EmployeeSocketEvent = typeof EmployeeSocketEvents[keyof typeof EmployeeSocketEvents];

// =============================================================================
// Socket.IO typed interfaces for Server<T> and Socket<T> generics
// =============================================================================

/** Config: Events emitted from server to client */
export interface ConfigServerToClientEvents {
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
}

/** Config: Events emitted from client to server */
export interface ConfigClientToServerEvents {
  // Data operations go through REST API, not WebSocket
}

/** Posts: Events emitted from server to client */
export interface PostsServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
}

/** Posts: Events emitted from client to server */
export interface PostsClientToServerEvents {
  // No client-to-server events for posts currently
}

/** RunningState: Events emitted from server to client */
export interface RunningStateServerToClientEvents {
  [RunningStateSocketEvents.UPDATED]: (state: IRunningState) => void;
}

/** RunningState: Events emitted from client to server */
export interface RunningStateClientToServerEvents {
  // Data operations go through REST API, not WebSocket
}

/** Employee: Events emitted from server to client */
export interface EmployeeServerToClientEvents {
  [EmployeeSocketEvents.DETAIL_UPDATED]: (detail: EmployeeDetail) => void;
  [EmployeeSocketEvents.EMPLOYEE_UPDATED]: (employee: Employee) => void;
}

/** Employee: Events emitted from client to server */
export interface EmployeeClientToServerEvents {
  // Update requests go through REST API, not WebSocket
}
