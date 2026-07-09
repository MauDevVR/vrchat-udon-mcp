import { existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import type { RepositoryConfig } from '../types/index.js';

export interface SyncResult {
  success: boolean;
  action: 'clone' | 'pull' | 'none';
  message: string;
}

/**
 * Manages cloning and updating the agent-skills repository.
 */
export class RepositorySync {
  constructor(private readonly config: RepositoryConfig) {}

  /**
   * Ensures repository exists and is up to date.
   */
  sync(): SyncResult {
    if (!existsSync(this.config.path)) {
      return this.clone();
    }
    return this.pull();
  }

  clone(): SyncResult {
    const result = spawnSync(
      'git',
      ['clone', '--branch', this.config.branch, '--depth', '1', this.config.url, this.config.path],
      { encoding: 'utf-8', shell: process.platform === 'win32' },
    );

    if (result.status !== 0) {
      return {
        success: false,
        action: 'clone',
        message: result.stderr || result.stdout || 'Clone failed',
      };
    }

    return { success: true, action: 'clone', message: `Cloned ${this.config.url}` };
  }

  pull(): SyncResult {
    const fetch = spawnSync('git', ['fetch', 'origin', this.config.branch], {
      cwd: this.config.path,
      encoding: 'utf-8',
      shell: process.platform === 'win32',
    });

    if (fetch.status !== 0) {
      return {
        success: false,
        action: 'pull',
        message: fetch.stderr || 'Fetch failed',
      };
    }

    const reset = spawnSync('git', ['reset', '--hard', `origin/${this.config.branch}`], {
      cwd: this.config.path,
      encoding: 'utf-8',
      shell: process.platform === 'win32',
    });

    if (reset.status !== 0) {
      return {
        success: false,
        action: 'pull',
        message: reset.stderr || 'Reset failed',
      };
    }

    return { success: true, action: 'pull', message: `Updated to origin/${this.config.branch}` };
  }
}
