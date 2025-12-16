/**
 * Logic Combinators
 * @module validators/logic
 */

// Re-export validator class
export { LogicValidator } from './validator';

// Re-export boolean logic combinators
export { allOf, and, anyOf, negate, not, oneOf, or, xor } from './combinators';

// Re-export conditional logic
export { ifThenElse, when } from './conditional';

// Re-export type combinators
export { intersection, union } from './types';

// Re-export recursive support
export { lazy } from './recursive';

// Re-export nullability validators
export { nullable, nullish, optional } from './nullability';

// Re-export strategies for advanced use
export {
  AndStrategy,
  IfThenElseStrategy,
  IntersectionStrategy,
  LazyStrategy,
  NotStrategy,
  OrStrategy,
  UnionStrategy,
  XorStrategy,
} from './strategies';
