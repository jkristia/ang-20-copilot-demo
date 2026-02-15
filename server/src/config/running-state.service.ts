import { Injectable } from '@nestjs/common';
import { IRunningState, RunningStateEnum } from '../../../shared/src/model.interfaces';
import { RunningState } from './running-state';

@Injectable()
export class RunningStateService {
  private runningState: RunningState = new RunningState();
  private updateCallback: ((state: IRunningState) => void) | null = null;

  constructor() {
    this.runningState.setUpdateCallback((state) => {
      if (this.updateCallback) {
        this.updateCallback(state);
      }
    });
  }

  /**
   * Set callback for broadcasting state updates
   */
  setUpdateCallback(callback: (state: IRunningState) => void): void {
    this.updateCallback = callback;
  }

  /**
   * Check if system is in IDLE state
   */
  isIdle(): boolean {
    return this.runningState.state === RunningStateEnum.IDLE;
  }

  getState(): IRunningState {
    return this.runningState.toJSON();
  }

  setDuration(duration: number): IRunningState {
    this.runningState.run_duration = duration;
    return this.runningState.toJSON();
  }

  start(): IRunningState {
    this.runningState.start();
    return this.runningState.toJSON();
  }
}
