/**
 * Valora Decorators
 * @module decorators
 *
 * Class-validator style decorators for Valora validation framework.
 * Provides 65+ decorators for comprehensive type-safe validation.
 *
 * @example
 * ```typescript
 * import { Validate, IsString, IsEmail, MinLength, IsNumber, Min } from 'valora/decorators';
 *
 * @Validate()
 * class User {
 *   @IsString()
 *   @MinLength(2)
 *   name: string;
 *
 *   @IsEmail()
 *   email: string;
 *
 *   @IsNumber()
 *   @Min(0)
 *   age: number;
 * }
 *
 * const user = new User({ name: 'John', email: 'john@example.com', age: 25 });
 * // Throws ValoraValidationError if validation fails
 * ```
 */

// Class decorators
export * from './class';
export type { ValidateOptions } from './class/validate';
export { validate, validateClassInstance,ValoraValidationError } from './class/validate';

// Core utilities
export * from './core';

// Property decorators (all categories)
export * from './property';
