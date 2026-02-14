import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, fromEvent } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { DemoConfig, DEFAULT_DEMO_CONFIG } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private socket: Socket;
  private destroyRef = inject(DestroyRef);

  private configUpdatedSubject = new Subject<DemoConfig>();
  configUpdated$ = this.configUpdatedSubject.asObservable();

  config = signal<DemoConfig>(DEFAULT_DEMO_CONFIG);

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    fromEvent<DemoConfig>(this.socket, 'config:current')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((config) => {
        this.config.set(config);
        this.configUpdatedSubject.next(config);
      });

    fromEvent<DemoConfig>(this.socket, 'config:updated')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((config) => {
        this.config.set(config);
        this.configUpdatedSubject.next(config);
      });

    this.destroyRef.onDestroy(() => {
      this.socket.disconnect();
    });
  }

  getConfig(): void {
    this.socket.emit('config:get');
  }

  updateConfig(updates: Partial<DemoConfig>): void {
    this.socket.emit('config:update', updates);
  }
}
