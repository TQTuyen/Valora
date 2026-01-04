/**
 * Svelte Adapter Factory
 * @module adapters/svelte/factory
 */

import { SvelteAdapter } from './svelte-adapter';

import type { ValidatorMap } from '../types';
import type { FormStateOptions } from '@notification/types';

/**
 * Create a Svelte adapter instance
 */
export function createSvelteAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): SvelteAdapter<T> {
  return new SvelteAdapter(validators, options);
}
