/**
 * Comparison Validators
 * @module validators/comparison
 */

// Re-export validator and factory functions
export { compare, ComparisonValidator, literal, nativeEnum, ref } from './validator';

// Re-export strategies for advanced use
export {
  BetweenStrategy,
  DifferentFromStrategy,
  EqualToStrategy,
  type FieldRef,
  getRefValue,
  GreaterThanOrEqualStrategy,
  GreaterThanStrategy,
  isFieldRef,
  LessThanOrEqualStrategy,
  LessThanStrategy,
  NotEqualToStrategy,
  NotOneOfStrategy,
  OneOfValueStrategy,
  SameAsStrategy,
} from './strategies';
