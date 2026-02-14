import { Injectable, inject, DestroyRef, signal } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import {
  DemoConfig,
  DEFAULT_DEMO_CONFIG,
  ConfigSocketEvents,
  ConfigServerToClientEvents,
  ConfigClientToServerEvents,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private socket: Socket<ConfigServerToClientEvents, ConfigClientToServerEvents>;
  private destroyRef = inject(DestroyRef);

  config = signal<DemoConfig>(DEFAULT_DEMO_CONFIG);

  constructor() {
    this.socket = io('http://localhost:3000', {
      transports: ['websocket'],
    });

    this.socket.on(ConfigSocketEvents.CURRENT, (config) => {
      this.config.set(config);
    });

    this.socket.on(ConfigSocketEvents.UPDATED, (config) => {
      this.config.set(config);
    });

    this.destroyRef.onDestroy(() => {
      this.socket.disconnect();
    });
  }

  getConfig(): void {
    this.socket.emit(ConfigSocketEvents.GET);
  }

  updateConfig(updates: Partial<DemoConfig>): void {
    this.socket.emit(ConfigSocketEvents.UPDATE, updates);
  }
}
