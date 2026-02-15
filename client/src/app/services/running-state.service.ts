import { Injectable, inject, DestroyRef, signal, computed } from '@angular/core';
import { IRunningState, DEFAULT_RUNNING_STATE, RunningStateEnum } from '../models';
import { WebSocketService } from './websocket.service';

@Injectable({
  providedIn: 'root',
})
export class RunningStateService {
  private websocketService = inject(WebSocketService);
  private destroyRef = inject(DestroyRef);

  state = signal<IRunningState>(DEFAULT_RUNNING_STATE);
  
  /** Whether the system is in IDLE state (not running) */
  isIdle = computed(() => this.state().state === RunningStateEnum.IDLE);

  constructor() {
    const currentSub = this.websocketService.onRunningStateCurrent().subscribe((state) => {
      this.state.set(state);
    });

    const updatedSub = this.websocketService.onRunningStateUpdated().subscribe((state) => {
      this.state.set(state);
    });

    this.destroyRef.onDestroy(() => {
      currentSub.unsubscribe();
      updatedSub.unsubscribe();
    });
  }

  getState(): void {
    this.websocketService.getRunningState();
  }

  setDuration(duration: number): void {
    this.websocketService.setRunningStateDuration(duration);
  }

  start(): void {
    this.websocketService.startRunningState();
  }
}
