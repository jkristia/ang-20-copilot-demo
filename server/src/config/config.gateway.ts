import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ConfigService } from './config.service';
import type { IDemoConfig } from '../../../shared/src/model.interfaces';
import {
  ConfigSocketEvents,
  ConfigServerToClientEvents,
  ConfigClientToServerEvents,
} from '../../../shared/src/socket-events';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
    credentials: true,
  },
})
export class ConfigGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server<ConfigClientToServerEvents, ConfigServerToClientEvents>;

  constructor(private readonly configService: ConfigService) {}

  handleConnection(client: Socket) {
    // Send current config to newly connected client
    client.emit(ConfigSocketEvents.CURRENT, this.configService.getConfig());
  }

  @SubscribeMessage(ConfigSocketEvents.UPDATE)
  handleConfigUpdate(
    @MessageBody() updates: Partial<IDemoConfig>,
    @ConnectedSocket() client: Socket,
  ): void {
    const updatedConfig = this.configService.updateConfig(updates);
    
    // Broadcast to all clients except sender
    client.broadcast.emit(ConfigSocketEvents.UPDATED, updatedConfig);
    
    // Also send back to sender to confirm
    client.emit(ConfigSocketEvents.UPDATED, updatedConfig);
  }

  @SubscribeMessage(ConfigSocketEvents.GET)
  handleGetConfig(@ConnectedSocket() client: Socket): void {
    client.emit(ConfigSocketEvents.CURRENT, this.configService.getConfig());
  }
}
