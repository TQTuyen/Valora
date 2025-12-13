/**
 * Number Validators
 * @module validators/number
 */

// Re-export validator and factory
export { number, NumberValidator } from './validator';

// Re-export strategies for advanced use
export {
  FiniteStrategy,
  IntegerStrategy,
  MaxStrategy,
  MinStrategy,
  MultipleOfStrategy,
  NegativeStrategy,
  NonNegativeStrategy,
  NonPositiveStrategy,
  PositiveStrategy,
  SafeIntegerStrategy,
} from './strategies';
