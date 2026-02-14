import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [PostsModule, ConfigModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
