/**
 * Re-export interfaces from shared source
 * Import directly from source to avoid build dependency on dist
 */
export type {
  Post,
  CreatePostDto,
  UpdatePostDto,
  IDemoConfig,
} from '../../../../shared/src/model.interfaces';

export { SelectEnum, DemoConfigValidation } from '../../../../shared/src/model.interfaces';

/**
 * Re-export socket event constants and interfaces from shared source
 */
export {
  ConfigSocketEvents,
  PostsSocketEvents,
} from '../../../../shared/src/socket-events';

export type {
  ConfigServerToClientEvents,
  ConfigClientToServerEvents,
  PostsServerToClientEvents,
  PostsClientToServerEvents,
} from '../../../../shared/src/socket-events';
