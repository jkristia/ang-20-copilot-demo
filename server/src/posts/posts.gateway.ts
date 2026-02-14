import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  PostsSocketEvents,
  PostsServerToClientEvents,
  PostsClientToServerEvents,
} from '../../../shared/src/socket-events';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
    credentials: true,
  },
})
export class PostsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server<PostsClientToServerEvents, PostsServerToClientEvents>;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  /**
   * Emit a posts update event to all connected clients
   */
  emitPostsUpdate(): void {
    this.server.emit(PostsSocketEvents.UPDATED);
  }
}
