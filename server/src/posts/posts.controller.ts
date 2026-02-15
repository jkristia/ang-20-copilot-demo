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
import { ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { AppGateway } from '../app.gateway';
import type { Post as BlogPost } from '../../../shared/src/post.interface';
import { CreatePostDto, UpdatePostDto } from '../../../shared/src/post.interface';
import { PostDto } from './dto/post.dto';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly appGateway: AppGateway,
  ) { }

  @Get()
  @ApiOkResponse({ type: [PostDto] })
  findAll(): BlogPost[] {
    return this.postsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: PostDto })
  findOne(@Param('id') id: string): BlogPost {
    return this.postsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PostDto })
  create(@Body() createPostDto: CreatePostDto): BlogPost {
    const post = this.postsService.create(createPostDto);
    this.appGateway.emitPostsUpdate();
    return post;
  }

  @Put(':id')
  @ApiOkResponse({ type: PostDto })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): BlogPost {
    const post = this.postsService.update(id, updatePostDto);
    this.appGateway.emitPostsUpdate();
    return post;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse()
  delete(@Param('id') id: string): void {
    this.postsService.delete(id);
    this.appGateway.emitPostsUpdate();
  }
}
