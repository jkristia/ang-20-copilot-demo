import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { PostsGateway } from './posts.gateway';

@Module({
  controllers: [PostsController],
  providers: [PostsService, PostsGateway],
  exports: [PostsService],
})
export class PostsModule {}
