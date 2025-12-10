/**
 * Schema Types
 * @module types/schema
 */

import type { IValidator } from './validators';

/**
 * Schema definition as a record of validators
 */
export type SchemaDefinition = Record<string, IValidator>;

/**
 * Infer the output type from a schema definition
 * @template T - Schema definition type
 */
export type InferSchema<T extends SchemaDefinition> = {
  [K in keyof T]: T[K] extends IValidator<unknown, infer O> ? O : never;
};

/**
 * Infer the output type from a validator
 * @template T - Validator type
 */
export type Infer<T> = T extends IValidator<unknown, infer O> ? O : never;

/**
 * Infer the input type from a validator
 * @template T - Validator type
 */
export type InferInput<T> = T extends IValidator<infer I, unknown> ? I : never;
