import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsGateway } from './posts.gateway';
import type { Post as BlogPost } from '../../../shared/src/model.interfaces';
import { CreatePostDto, UpdatePostDto } from '../../../shared/src/model.interfaces';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsGateway: PostsGateway,
  ) {}

  @Get()
  findAll(): BlogPost[] {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): BlogPost {
    return this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostDto: CreatePostDto): BlogPost {
    const post = this.postsService.create(createPostDto);
    this.postsGateway.emitPostsUpdate();
    return post;
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): BlogPost {
    const post = this.postsService.update(id, updatePostDto);
    this.postsGateway.emitPostsUpdate();
    return post;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): void {
    this.postsService.delete(id);
    this.postsGateway.emitPostsUpdate();
  }
}
