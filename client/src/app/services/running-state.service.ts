import { Injectable, inject, DestroyRef, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IRunningState, DEFAULT_RUNNING_STATE, RunningStateEnum } from '../models';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class RunningStateService {
  private websocketService = inject(WebSocketService);
  private http = inject(HttpClient);
  private destroyRef = inject(DestroyRef);
  private readonly apiUrl = 'http://localhost:3000/api/running-state';

  state = signal<IRunningState>(DEFAULT_RUNNING_STATE);

  /** Whether the system is in IDLE state (not running) */
  isIdle = computed(() => this.state().state === RunningStateEnum.IDLE);

  constructor() {
    const updatedSub = this.websocketService.onRunningStateUpdated().subscribe((state) => {
      this.state.set(state);
    });

    this.destroyRef.onDestroy(() => {
      updatedSub.unsubscribe();
    });
  }

  getState(): void {
    this.http.get<IRunningState>(this.apiUrl).subscribe((state) => {
      this.state.set(state);
    });
  }

  setDuration(duration: number): void {
    this.http.put<IRunningState>(`${this.apiUrl}/duration`, { run_duration: duration }).subscribe((state) => {
      this.state.set(state);
    });
  }

  start(): void {
    this.http.post<IRunningState>(`${this.apiUrl}/start`, {}).subscribe((state) => {
      this.state.set(state);
    });
  }
}
