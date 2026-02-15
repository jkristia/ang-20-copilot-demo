import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import {
  PostsSocketEvents,
  ConfigSocketEvents,
  RunningStateSocketEvents,
  IDemoConfig,
  IRunningState,
} from '../models';

/**
 * Combined socket events for all features
 */
interface ServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
  [ConfigSocketEvents.CURRENT]: (config: IDemoConfig) => void;
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
  [RunningStateSocketEvents.CURRENT]: (state: IRunningState) => void;
  [RunningStateSocketEvents.UPDATED]: (state: IRunningState) => void;
}

interface ClientToServerEvents {
  [ConfigSocketEvents.GET]: () => void;
  [ConfigSocketEvents.UPDATE]: (updates: Partial<IDemoConfig>) => void;
  [RunningStateSocketEvents.GET]: () => void;
  [RunningStateSocketEvents.SET_DURATION]: (duration: number) => void;
  [RunningStateSocketEvents.START]: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  
  // Posts events
  private postsUpdated$ = new Subject<void>();
  
  // Config events
  private configCurrent$ = new Subject<IDemoConfig>();
  private configUpdated$ = new Subject<IDemoConfig>();
  
  // RunningState events
  private runningStateCurrent$ = new Subject<IRunningState>();
  private runningStateUpdated$ = new Subject<IRunningState>();

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

    // Posts events
    this.socket.on(PostsSocketEvents.UPDATED, () => {
      this.postsUpdated$.next();
    });

    // Config events
    this.socket.on(ConfigSocketEvents.CURRENT, (config) => {
      this.configCurrent$.next(config);
    });

    this.socket.on(ConfigSocketEvents.UPDATED, (config) => {
      this.configUpdated$.next(config);
    });

    // RunningState events
    this.socket.on(RunningStateSocketEvents.CURRENT, (state) => {
      this.runningStateCurrent$.next(state);
    });

    this.socket.on(RunningStateSocketEvents.UPDATED, (state) => {
      this.runningStateUpdated$.next(state);
    });
  }

  // Posts
  onPostsUpdated(): Observable<void> {
    return this.postsUpdated$.asObservable();
  }

  // Config
  onConfigCurrent(): Observable<IDemoConfig> {
    return this.configCurrent$.asObservable();
  }

  onConfigUpdated(): Observable<IDemoConfig> {
    return this.configUpdated$.asObservable();
  }

  getConfig(): void {
    this.socket.emit(ConfigSocketEvents.GET);
  }

  updateConfig(updates: Partial<IDemoConfig>): void {
    this.socket.emit(ConfigSocketEvents.UPDATE, updates);
  }

  // RunningState
  onRunningStateCurrent(): Observable<IRunningState> {
    return this.runningStateCurrent$.asObservable();
  }

  onRunningStateUpdated(): Observable<IRunningState> {
    return this.runningStateUpdated$.asObservable();
  }

  getRunningState(): void {
    this.socket.emit(RunningStateSocketEvents.GET);
  }

  setRunningStateDuration(duration: number): void {
    this.socket.emit(RunningStateSocketEvents.SET_DURATION, duration);
  }

  startRunningState(): void {
    this.socket.emit(RunningStateSocketEvents.START);
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
