import { Component, inject, signal, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PostService } from '../../services/post.service';
import { WebSocketService } from '../../services/websocket.service';
import { Post } from '../../models';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';
import { APP_ROUTES } from '../../app.routes.constants';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit {
  private readonly postService = inject(PostService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  posts = signal<Post[]>([]);
  loading = signal(false);
  
  /** Set of post IDs that should be highlighted as new */
  newPostIds = signal<Set<string>>(new Set());

  ngOnInit(): void {
    this.loadPosts();
    
    // Subscribe to WebSocket updates with automatic cleanup
    this.webSocketService.onPostsUpdated()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.snackBar.open('Posts updated! Refreshing...', 'Close', {
          duration: 2000,
        });
        this.loadPostsWithHighlight();
      });
  }

  loadPosts(): void {
    this.loading.set(true);
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts.set(posts);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.snackBar.open('Error loading posts. Make sure the server is running.', 'Close', {
          duration: 5000,
        });
        this.loading.set(false);
      },
    });
  }

  /** Load posts and highlight any new ones that weren't in the previous list */
  private loadPostsWithHighlight(): void {
    const currentIds = new Set(this.posts().map(p => p.id));
    
    this.loading.set(true);
    this.postService.getPosts().subscribe({
      next: (posts) => {
        // Find new post IDs that weren't in the previous list
        const newIds = new Set<string>();
        for (const post of posts) {
          if (!currentIds.has(post.id)) {
            newIds.add(post.id);
          }
        }
        
        this.posts.set(posts);
        this.loading.set(false);
        
        // Highlight new posts
        if (newIds.size > 0) {
          this.newPostIds.set(newIds);
          
          // Remove highlight after animation completes
          setTimeout(() => {
            this.newPostIds.set(new Set());
          }, 2000);
        }
      },
      error: (error) => {
        console.error('Error loading posts:', error);
        this.snackBar.open('Error loading posts. Make sure the server is running.', 'Close', {
          duration: 5000,
        });
        this.loading.set(false);
      },
    });
  }

  isNewPost(postId: string): boolean {
    return this.newPostIds().has(postId);
  }

  openNewPostDialog(): void {
    const dialogRef = this.dialog.open(PostDialogComponent, {
      width: '500px',
      data: { mode: 'create' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loading.set(true);
        this.postService.createPost(result).subscribe({
          next: () => {
            this.snackBar.open('Post created successfully!', 'Close', {
              duration: 3000,
            });
            this.loadPosts();
          },
          error: (error) => {
            console.error('Error creating post:', error);
            this.snackBar.open('Error creating post', 'Close', {
              duration: 3000,
            });
            this.loading.set(false);
          },
        });
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goToConfig(): void {
    this.router.navigate([APP_ROUTES.CONFIG]);
  }
}
