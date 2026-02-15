import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway.module';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [GatewayModule, PostsModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
