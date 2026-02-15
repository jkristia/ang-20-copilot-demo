/**
 * Represents a blog post
 */
export interface Post {
  id: string;
  date: string;
  topic: string;
  message: string;
}

/**
 * DTO for creating a new post
 */
export class CreatePostDto {
  date?: string;
  topic!: string;
  message!: string;
}

/**
 * DTO for updating an existing post
 */
export class UpdatePostDto {
  date?: string;
  topic?: string;
  message?: string;
}
