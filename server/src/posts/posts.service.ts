import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { Post, CreatePostDto, UpdatePostDto } from '../../../shared/src/post.interface';
import { randomUUID } from 'crypto';
import { PersistenceService } from '../persistence/persistence.service';

@Injectable()
export class PostsService implements OnModuleInit {
  private posts: Post[] = [];

  constructor(private readonly persistenceService: PersistenceService) { }

  public onModuleInit(): void {
    this.loadPosts();
  }

  private loadPosts(): void {
    const savedPosts = this.persistenceService.loadPosts<Post>();
    if (savedPosts && savedPosts.length > 0) {
      this.posts = savedPosts;
    } else {
      this.initializeMockPosts();
      this.savePosts();
    }
  }

  private savePosts(): void {
    this.persistenceService.savePosts(this.posts);
  }

  private initializeMockPosts(): void {
    if (this.posts.length === 0) {
      const topics = [
        'Getting Started with Angular',
        'NestJS Best Practices',
        'TypeScript Tips and Tricks',
        'Building RESTful APIs',
        'Frontend Development Trends',
        'State Management Patterns',
        'Testing Strategies',
        'Performance Optimization',
        'Security in Web Apps',
        'DevOps for Developers',
      ];

      const messages = [
        'Angular is a powerful framework for building dynamic web applications. In this post, we explore the basics of getting started with Angular and creating your first component.',
        'NestJS provides a robust architecture for building scalable server-side applications. Learn about modules, controllers, and services in this comprehensive guide.',
        'TypeScript adds static typing to JavaScript, making your code more maintainable. Here are some advanced tips to improve your TypeScript skills.',
        'REST APIs are the backbone of modern web applications. This post covers best practices for designing and implementing RESTful services.',
        'The frontend landscape is constantly evolving. Stay up to date with the latest trends in frontend development and UI/UX design.',
        'Managing state in complex applications can be challenging. Explore different state management patterns and choose the right one for your project.',
        'Writing tests is essential for maintaining code quality. Learn about unit testing, integration testing, and end-to-end testing strategies.',
        'Performance matters for user experience. Discover techniques for optimizing your web application\'s performance and load times.',
        'Security should never be an afterthought. This post covers common security vulnerabilities and how to protect your web applications.',
        'DevOps practices help streamline development workflows. Learn about CI/CD, containerization, and infrastructure as code.',
      ];

      // Create 10 posts with different dates spanning the last 30 days
      for (let i = 0; i < 10; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (i * 3)); // Space posts 3 days apart

        this.posts.push({
          id: randomUUID(),
          date: date.toISOString(),
          topic: topics[i],
          message: messages[i],
        });
      }
    }
  }

  public findAll(): Post[] {
    return this.posts.sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  public findOne(id: string): Post {
    const post = this.posts.find(p => p.id === id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  public create(createPostDto: CreatePostDto): Post {
    const newPost: Post = {
      id: randomUUID(),
      date: createPostDto.date ?? new Date().toISOString(),
      topic: createPostDto.topic,
      message: createPostDto.message,
    };
    this.posts.push(newPost);
    this.savePosts();
    return newPost;
  }

  public update(id: string, updatePostDto: UpdatePostDto): Post {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    this.posts[postIndex] = {
      ...this.posts[postIndex],
      ...updatePostDto,
    };

    this.savePosts();
    return this.posts[postIndex];
  }

  public delete(id: string): void {
    const postIndex = this.posts.findIndex(p => p.id === id);
    if (postIndex === -1) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    this.posts.splice(postIndex, 1);
    this.savePosts();
  }
}
