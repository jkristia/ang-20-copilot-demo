import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { RunningStateService } from './config/running-state.service';
import type { IDemoConfig, IRunningState } from '../../shared/src/model.interfaces';
import {
  ConfigSocketEvents,
  RunningStateSocketEvents,
  PostsSocketEvents,
  EmployeeSocketEvents,
} from '../../shared/src/socket-events';
import type { Employee, EmployeeDetail } from '@blog/shared';

/**
 * Combined server-to-client events
 */
interface ServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
  [RunningStateSocketEvents.UPDATED]: (state: IRunningState) => void;
  [EmployeeSocketEvents.DETAIL_UPDATED]: (detail: EmployeeDetail) => void;
  [EmployeeSocketEvents.EMPLOYEE_UPDATED]: (employee: Employee) => void;
}

/**
 * Combined client-to-server events
 */
interface ClientToServerEvents {
  // Data operations go through REST API, not WebSocket
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
    @Inject(forwardRef(() => RunningStateService))
    private readonly runningStateService: RunningStateService,
  ) { }

  afterInit() {
    // Set up callback to broadcast running state updates to all clients
    this.runningStateService.setUpdateCallback((state) => {
      this.server.emit(RunningStateSocketEvents.UPDATED, state);
    });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
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

  /**
   * Emit a config update event to all connected clients
   */
  emitConfigUpdate(config: IDemoConfig): void {
    this.server.emit(ConfigSocketEvents.UPDATED, config);
  }

  // =========================================================================
  // Employees
  // =========================================================================

  /**
   * Emit an employee detail update event to all connected clients
   */
  emitEmployeeDetailUpdate(detail: EmployeeDetail): void {
    this.server.emit(EmployeeSocketEvents.DETAIL_UPDATED, detail);
  }

  /**
   * Emit an employee update event to all connected clients
   */
  emitEmployeeUpdate(employee: Employee): void {
    this.server.emit(EmployeeSocketEvents.EMPLOYEE_UPDATED, employee);
  }
}
