/**
 * Array Validators
 * @module validators/array
 */

// Re-export validator and factory
export { array, ArrayValidator } from './validator';

// Re-export strategies for advanced use
export {
  ContainsStrategy,
  EveryStrategy,
  ExactLengthArrayStrategy,
  ItemValidatorStrategy,
  MaxLengthArrayStrategy,
  MinLengthArrayStrategy,
  NonEmptyArrayStrategy,
  SomeStrategy,
  UniqueArrayStrategy,
} from './strategies/index';
