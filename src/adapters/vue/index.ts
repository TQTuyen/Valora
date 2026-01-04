/**
 * Vue Adapter
 * @module adapters/vue
 *
 * Vue 3 Composition API adapter for Valora validation framework.
 *
 * @example
 * ```typescript
 * import { createVueAdapter, useFormValidation } from '@tqtos/valora';
 * import { string, number } from '@tqtos/valora';
 *
 * // Using factory
 * const adapter = createVueAdapter({
 *   email: string().email().required(),
 *   age: number().min(18)
 * });
 *
 * // Using composable
 * const { adapter, formState, validateAll } = useFormValidation({
 *   email: string().email().required(),
 *   password: string().minLength(8).required()
 * });
 * ```
 */

// -------------------------------------------------------------------------
// Core Adapter
// -------------------------------------------------------------------------
export { VueAdapter } from './vue-adapter';

// -------------------------------------------------------------------------
// Types
// -------------------------------------------------------------------------
export type { VueFieldBindings, VueFieldState, VueFormState } from './types';

// -------------------------------------------------------------------------
// Composables
// -------------------------------------------------------------------------
export { useFieldValidation, useFormValidation } from './composables';

// -------------------------------------------------------------------------
// Factory
// -------------------------------------------------------------------------
export { createVueAdapter } from './factory';

// -------------------------------------------------------------------------
// Re-export shared types for convenience
// -------------------------------------------------------------------------
export type { ValidatorMap } from '../types';
export type { FormStateOptions } from '@notification/types';
