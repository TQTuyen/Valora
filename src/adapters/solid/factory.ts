/**
 * Solid Adapter Factory
 * @module adapters/solid/factory
 */

import { SolidAdapter } from './solid-adapter';

import type { ValidatorMap } from '../types';
import type { FormStateOptions } from '@notification/types';

/**
 * Create a Solid adapter instance
 */
export function createSolidAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): SolidAdapter<T> {
  return new SolidAdapter(validators, options);
}
