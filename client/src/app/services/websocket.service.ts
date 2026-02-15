import { Injectable, OnDestroy } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Subject, Observable } from 'rxjs';
import {
  PostsSocketEvents,
  ConfigSocketEvents,
  RunningStateSocketEvents,
  EmployeeSocketEvents,
  IDemoConfig,
  IRunningState,
  Employee,
  EmployeeDetail,
} from '../models';

/**
 * Combined socket events for all features
 */
interface ServerToClientEvents {
  [PostsSocketEvents.UPDATED]: () => void;
  [ConfigSocketEvents.UPDATED]: (config: IDemoConfig) => void;
  [RunningStateSocketEvents.UPDATED]: (state: IRunningState) => void;
  [EmployeeSocketEvents.DETAIL_UPDATED]: (detail: EmployeeDetail) => void;
  [EmployeeSocketEvents.EMPLOYEE_UPDATED]: (employee: Employee) => void;
}

interface ClientToServerEvents {
  // Data operations go through REST API, not WebSocket
}

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  // Posts events
  private postsUpdated$ = new Subject<void>();

  // Config events
  private configUpdated$ = new Subject<IDemoConfig>();

  // RunningState events
  private runningStateUpdated$ = new Subject<IRunningState>();

  // Employee events
  private employeeDetailUpdated$ = new Subject<EmployeeDetail>();
  private employeeUpdated$ = new Subject<Employee>();

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

    this.socket.on(ConfigSocketEvents.UPDATED, (config) => {
      this.configUpdated$.next(config);
    });

    // RunningState events
    this.socket.on(RunningStateSocketEvents.UPDATED, (state) => {
      this.runningStateUpdated$.next(state);
    });

    // Employee events
    this.socket.on(EmployeeSocketEvents.DETAIL_UPDATED, (detail) => {
      this.employeeDetailUpdated$.next(detail);
    });

    this.socket.on(EmployeeSocketEvents.EMPLOYEE_UPDATED, (employee) => {
      this.employeeUpdated$.next(employee);
    });
  }

  // Posts
  onPostsUpdated(): Observable<void> {
    return this.postsUpdated$.asObservable();
  }

  // Config
  onConfigUpdated(): Observable<IDemoConfig> {
    return this.configUpdated$.asObservable();
  }

  // RunningState
  onRunningStateUpdated(): Observable<IRunningState> {
    return this.runningStateUpdated$.asObservable();
  }

  // Employees
  onEmployeeDetailUpdated(): Observable<EmployeeDetail> {
    return this.employeeDetailUpdated$.asObservable();
  }

  onEmployeeUpdated(): Observable<Employee> {
    return this.employeeUpdated$.asObservable();
  }

  ngOnDestroy(): void {
    this.socket.disconnect();
  }
}
