/**
 * TypeScript Decorators (Experimental)
 * Uses WeakMap for metadata storage (no reflect-metadata dependency)
 * @module core/decorators
 */

export { field } from './field';
export { validateInstance, ValoraValidationError } from './helpers';
export type { ValidateDecoratorOptions } from './validate';
export { validate } from './validate';
