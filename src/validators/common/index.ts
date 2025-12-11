/**
 * Common Validators and Base Classes
 * Provides the foundation for all type-specific validators
 * @module validators/common
 */

// Base validator
export { BaseValidator } from './base-validator';

// Common strategies
export {
  ArrayTypeStrategy,
  BooleanTypeStrategy,
  CustomStrategy,
  DateTypeStrategy,
  NumberTypeStrategy,
  ObjectTypeStrategy,
  RequiredStrategy,
  StringTypeStrategy,
  TypeCheckStrategy,
} from './strategies/index';
