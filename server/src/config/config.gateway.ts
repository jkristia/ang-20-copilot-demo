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
import type { DemoConfig } from '@blog/shared';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:4200'],
    credentials: true,
  },
})
export class ConfigGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  constructor(private readonly configService: ConfigService) {}

  handleConnection(client: Socket) {
    // Send current config to newly connected client
    client.emit('config:current', this.configService.getConfig());
  }

  @SubscribeMessage('config:update')
  handleConfigUpdate(
    @MessageBody() updates: Partial<DemoConfig>,
    @ConnectedSocket() client: Socket,
  ): void {
    const updatedConfig = this.configService.updateConfig(updates);
    
    // Broadcast to all clients except sender
    client.broadcast.emit('config:updated', updatedConfig);
    
    // Also send back to sender to confirm
    client.emit('config:updated', updatedConfig);
  }

  @SubscribeMessage('config:get')
  handleGetConfig(@ConnectedSocket() client: Socket): void {
    client.emit('config:current', this.configService.getConfig());
  }
}
