import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import {
  PostsSocketEvents,
  PostsServerToClientEvents,
  PostsClientToServerEvents,
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: Socket<PostsServerToClientEvents, PostsClientToServerEvents>;
  private postsUpdated$ = new Subject<void>();

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket', 'polling'],
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on(PostsSocketEvents.UPDATED, () => {
      console.log('Posts updated notification received');
      this.postsUpdated$.next();
    });
  }

  /**
   * Observable that emits when posts have been updated on the server
   */
  onPostsUpdated(): Observable<void> {
    return this.postsUpdated$.asObservable();
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
