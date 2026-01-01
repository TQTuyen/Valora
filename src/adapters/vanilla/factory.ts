/**
 * Factory Function Helper
 * @module adapters/vanilla/factory
 */

import { VanillaAdapter } from './vanilla-adapter';

import type { ValidatorMap } from '../types';
import type { FormStateOptions } from '@notification/types';

/**
 * Create a VanillaAdapter instance
 *
 * Convenience factory function for creating VanillaAdapter instances.
 *
 * @template T - The form data type
 * @param validators - Validator map for form fields
 * @param options - Optional form state configuration
 * @returns VanillaAdapter instance
 *
 * @example
 * ```typescript
 * const adapter = createVanillaAdapter({
 *   email: string().email(),
 *   password: string().minLength(8),
 * });
 *
 * adapter.bindForm({
 *   form: document.getElementById('login-form'),
 *   onSubmit: async (values) => {
 *     // Handle form submission
 *   },
 * });
 * ```
 */
export function createVanillaAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): VanillaAdapter<T> {
  return new VanillaAdapter(validators, options);
}
