import { Module, Global } from '@nestjs/common';
import { AppGateway } from './app.gateway';
import { ConfigModule } from './config/config.module';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [AppGateway],
  exports: [AppGateway],
})
export class GatewayModule {}
