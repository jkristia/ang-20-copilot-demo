/**
 * WebSocket event names for type-safe socket communication
 */

import type { IDemoConfig } from './model.interfaces';

/** Config-related socket events */
export const ConfigSocketEvents = {
  /** Client requests current config */
  GET: 'config:get',
  /** Client sends config update */
  UPDATE: 'config:update',
  /** Server sends current config (response to GET or on connect) */
  CURRENT: 'config:current',
  /** Server broadcasts config update to all clients */
  UPDATED: 'config:updated',
} as const;

/** Posts-related socket events */
export const PostsSocketEvents = {
  /** Server broadcasts that posts have been updated */
  UPDATED: 'posts:updated',
} as const;

/** Type for ConfigSocketEvents values */
export type ConfigSocketEvent = typeof ConfigSocketEvents[keyof typeof ConfigSocketEvents];

/** Type for PostsSocketEvents values */
export type PostsSocketEvent = typeof PostsSocketEvents[keyof typeof PostsSocketEvents];

// =============================================================================
// Socket.IO typed interfaces for Server<T> and Socket<T> generics
// =============================================================================

/** Config: Events emitted from server to client */
export interface ConfigServerToClientEvents {
  [ConfigSocketEvents.CURRENT]: (config: IDemoConfig) => void;
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
}

/** Config: Events emitted from client to server */
export interface ConfigClientToServerEvents {
  [ConfigSocketEvents.GET]: () => void;
  [ConfigSocketEvents.UPDATE]: (updates: Partial<IDemoConfig>) => void;
}

/** Posts: Events emitted from server to client */
export interface PostsServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
}

/** Posts: Events emitted from client to server */
export interface PostsClientToServerEvents {
  // No client-to-server events for posts currently
}
