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
import { ApiBody, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { PostsService } from './posts.service';
import { AppGateway } from '../app.gateway';
import type { Post as BlogPost } from '../../../shared/src/post.interface';
import { PostDto } from './dto/post.dto';
import { CreatePostBodyDto } from './dto/create-post.dto';
import { UpdatePostBodyDto } from './dto/update-post.dto';

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
  @ApiBody({ type: CreatePostBodyDto })
  @ApiCreatedResponse({ type: PostDto })
  create(@Body() createPostDto: CreatePostBodyDto): BlogPost {
    const post = this.postsService.create(createPostDto);
    this.appGateway.emitPostsUpdate();
    return post;
  }

  @Put(':id')
  @ApiBody({ type: UpdatePostBodyDto })
  @ApiOkResponse({ type: PostDto })
  update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostBodyDto,
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
