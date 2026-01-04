/**
 * Vue Adapter Factory
 * @module adapters/vue/factory
 */

import { VueAdapter } from './vue-adapter';

import type { ValidatorMap } from '../types';
import type { FormStateOptions } from '@notification/types';

/**
 * Create a Vue adapter instance
 *
 * Factory function for creating VueAdapter instances with type inference.
 *
 * @template T - The form data type
 * @param validators - Validator map for each field
 * @param options - Optional form state configuration
 * @returns Vue adapter instance
 *
 * @example
 * ```typescript
 * import { createVueAdapter } from '@tqtos/valora';
 * import { string, number } from '@tqtos/valora';
 *
 * const adapter = createVueAdapter({
 *   email: string().email().required(),
 *   age: number().min(18).optional()
 * });
 *
 * // Use in component
 * const emailState = adapter.useField('email');
 * const formState = adapter.useForm();
 * ```
 */
export function createVueAdapter<T extends Record<string, unknown>>(
  validators: ValidatorMap<T>,
  options?: FormStateOptions<T>,
): VueAdapter<T> {
  return new VueAdapter(validators, options);
}
