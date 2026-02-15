import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Service for persisting application data to JSON files
 */
@Injectable()
export class PersistenceService implements OnModuleInit {
  private readonly logger = new Logger(PersistenceService.name);
  private readonly dataDir: string;
  private readonly configFilePath: string;
  private readonly postsFilePath: string;

  constructor() {
    // Store data files in a 'data' directory at project root
    this.dataDir = path.join(process.cwd(), 'data');
    this.configFilePath = path.join(this.dataDir, 'config.json');
    this.postsFilePath = path.join(this.dataDir, 'posts.json');
  }

  public onModuleInit(): void {
    this.ensureDataDirectory();
  }

  private ensureDataDirectory(): void {
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
      this.logger.log(`Created data directory: ${this.dataDir}`);
    }
  }

  /**
   * Save config to JSON file
   */
  public saveConfig<T>(config: T): void {
    try {
      fs.writeFileSync(this.configFilePath, JSON.stringify(config, null, 2));
      this.logger.debug('Config saved successfully');
    } catch (error) {
      this.logger.error('Failed to save config', error);
    }
  }

  /**
   * Load config from JSON file
   */
  public loadConfig<T>(): T | null {
    try {
      if (fs.existsSync(this.configFilePath)) {
        const data = fs.readFileSync(this.configFilePath, 'utf-8');
        this.logger.log('Config loaded successfully');
        return JSON.parse(data) as T;
      }
    } catch (error) {
      this.logger.error('Failed to load config', error);
    }
    return null;
  }

  /**
   * Save posts to JSON file
   */
  public savePosts<T>(posts: T[]): void {
    try {
      fs.writeFileSync(this.postsFilePath, JSON.stringify(posts, null, 2));
      this.logger.debug('Posts saved successfully');
    } catch (error) {
      this.logger.error('Failed to save posts', error);
    }
  }

  /**
   * Load posts from JSON file
   */
  public loadPosts<T>(): T[] | null {
    try {
      if (fs.existsSync(this.postsFilePath)) {
        const data = fs.readFileSync(this.postsFilePath, 'utf-8');
        this.logger.log('Posts loaded successfully');
        return JSON.parse(data) as T[];
      }
    } catch (error) {
      this.logger.error('Failed to load posts', error);
    }
    return null;
  }
}
