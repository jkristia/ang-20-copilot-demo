import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { PostService } from '../../services/post.service';
import { WebSocketService } from '../../services/websocket.service';
import { Post } from '@blog/shared';
import { PostDialogComponent } from '../post-dialog/post-dialog.component';

@Component({
  selector: 'app-posts-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
  ],
  templateUrl: './posts-list.component.html',
  styleUrl: './posts-list.component.scss',
})
export class PostsListComponent implements OnInit, OnDestroy {
  private readonly postService = inject(PostService);
  private readonly webSocketService = inject(WebSocketService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private wsSubscription?: Subscription;

  posts = signal<Post[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadPosts();
    
    // Subscribe to WebSocket updates
    this.wsSubscription = this.webSocketService.onPostsUpdated().subscribe(() => {
      this.snackBar.open('Posts updated! Refreshing...', 'Close', {
        duration: 2000,
      });
      this.loadPosts();
    });
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
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
}
