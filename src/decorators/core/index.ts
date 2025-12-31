/**
 * Core Decorator Infrastructure
 * @module decorators/core
 *
 * Core utilities for the decorator system.
 */

// Metadata storage
export {
  addPropertyValidator,
  clearPropertyMetadata,
  getCombinedValidator,
  getPropertyMetadata,
  hasPropertyValidators,
  markNested,
  type PropertyValidatorMetadata,
  propertyValidatorsStorage,
} from './metadata';

// Decorator factories
export {
  createOptionalDecorator,
  createPropertyDecorator,
  createTypeDecorator,
  type ValidatorFactory,
} from './factory';
