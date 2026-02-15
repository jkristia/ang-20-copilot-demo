import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ConfigService } from './config/config.service';
import { RunningStateService } from './config/running-state.service';
import type { IDemoConfig, IRunningState, RunningStateEnum } from '../../shared/src/model.interfaces';
import {
  ConfigSocketEvents,
  RunningStateSocketEvents,
  PostsSocketEvents,
} from '../../shared/src/socket-events';

/**
 * Combined server-to-client events
 */
interface ServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
  [ConfigSocketEvents.CURRENT]: (config: IDemoConfig) => void;
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
  [RunningStateSocketEvents.CURRENT]: (state: IRunningState) => void;
  [RunningStateSocketEvents.UPDATED]: (state: IRunningState) => void;
}

/**
 * Combined client-to-server events
 */
interface ClientToServerEvents {
  [ConfigSocketEvents.GET]: () => void;
  [ConfigSocketEvents.UPDATE]: (updates: Partial<IDemoConfig>) => void;
  [RunningStateSocketEvents.GET]: () => void;
  [RunningStateSocketEvents.SET_DURATION]: (duration: number) => void;
  [RunningStateSocketEvents.START]: () => void;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
    credentials: true,
  },
})
export class AppGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer()
  server!: Server<ClientToServerEvents, ServerToClientEvents>;

  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => RunningStateService))
    private readonly runningStateService: RunningStateService,
  ) {}

  afterInit() {
    // Set up callback to broadcast running state updates to all clients
    this.runningStateService.setUpdateCallback((state) => {
      this.server.emit(RunningStateSocketEvents.UPDATED, state);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    // Send current state of all services to newly connected client
    client.emit(ConfigSocketEvents.CURRENT, this.configService.getConfig());
    client.emit(RunningStateSocketEvents.CURRENT, this.runningStateService.getState());
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // =========================================================================
  // Posts
  // =========================================================================

  /**
   * Emit a posts update event to all connected clients
   */
  emitPostsUpdate(): void {
    (this.server as any).emit(PostsSocketEvents.UPDATED);
  }

  // =========================================================================
  // Config
  // =========================================================================

  @SubscribeMessage(ConfigSocketEvents.GET)
  handleGetConfig(@ConnectedSocket() client: Socket): void {
    client.emit(ConfigSocketEvents.CURRENT, this.configService.getConfig());
  }

  @SubscribeMessage(ConfigSocketEvents.UPDATE)
  handleConfigUpdate(
    @MessageBody() updates: Partial<IDemoConfig>,
    @ConnectedSocket() client: Socket,
  ): void {
    // Block config updates while running
    if (!this.runningStateService.isIdle()) {
      console.log('Config update rejected: system is running');
      return;
    }
    const updatedConfig = this.configService.updateConfig(updates);
    // Broadcast to all clients
    this.server.emit(ConfigSocketEvents.UPDATED, updatedConfig);
  }

  // =========================================================================
  // RunningState
  // =========================================================================

  @SubscribeMessage(RunningStateSocketEvents.GET)
  handleGetState(@ConnectedSocket() client: Socket): void {
    client.emit(RunningStateSocketEvents.CURRENT, this.runningStateService.getState());
  }

  @SubscribeMessage(RunningStateSocketEvents.SET_DURATION)
  handleSetDuration(
    @MessageBody() duration: number,
  ): void {
    const updatedState = this.runningStateService.setDuration(duration);
    this.server.emit(RunningStateSocketEvents.UPDATED, updatedState);
  }

  @SubscribeMessage(RunningStateSocketEvents.START)
  handleStart(): void {
    this.runningStateService.start();
    // Updates will be broadcast via the callback
  }
}
