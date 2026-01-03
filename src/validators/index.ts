/**
 * Validators Layer (Tree-shakeable)
 * @module validators
 */

// -------------------------------------------------------------------------
// Common / Base Validators
// -------------------------------------------------------------------------
export {
  ArrayTypeStrategy,
  BaseValidator,
  BooleanTypeStrategy,
  CustomStrategy,
  NumberTypeStrategy,
  ObjectTypeStrategy,
  RequiredStrategy,
  StringTypeStrategy,
  TypeCheckStrategy,
} from './common/index';

// -------------------------------------------------------------------------
// String Validators
// -------------------------------------------------------------------------
export { string, StringValidator } from './string/index';
export {
  AlphanumericStrategy,
  AlphaStrategy,
  ContainsStrategy as ContainsStringStrategy,
  EmailStrategy,
  EndsWithStrategy,
  LengthStrategy,
  LowercaseStrategy,
  MaxLengthStrategy,
  MinLengthStrategy,
  NumericStrategy,
  PatternStrategy,
  StartsWithStrategy,
  NotEmptyStrategy as TrimmedStrategy,
  UppercaseStrategy,
  UrlStrategy,
  UuidStrategy,
} from './string/index';

// -------------------------------------------------------------------------
// Number Validators
// -------------------------------------------------------------------------
export { number, NumberValidator } from './number/index';
export {
  FiniteStrategy,
  IntegerStrategy,
  MultipleOfStrategy,
  NegativeStrategy,
  NonNegativeStrategy,
  NonPositiveStrategy,
  MaxStrategy as NumberMaxStrategy,
  MinStrategy as NumberMinStrategy,
  PositiveStrategy,
  SafeIntegerStrategy,
} from './number/index';

// -------------------------------------------------------------------------
// Boolean Validators
// -------------------------------------------------------------------------
export { boolean, BooleanValidator } from './boolean/index';
export { IsFalseStrategy, IsTrueStrategy } from './boolean/index';

// -------------------------------------------------------------------------
// Date Validators
// -------------------------------------------------------------------------
export { date, DateValidator } from './date/index';
export {
  IsAfterStrategy,
  IsBeforeStrategy,
  IsFutureStrategy,
  IsPastStrategy,
  IsTodayStrategy,
  IsWeekdayStrategy,
  IsWeekendStrategy,
  MaxAgeStrategy,
  MaxDateStrategy,
  MinAgeStrategy,
  MinDateStrategy,
} from './date/index';

// -------------------------------------------------------------------------
// Array Validators
// -------------------------------------------------------------------------
export { array, ArrayValidator } from './array/index';
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
} from './array/index';

// -------------------------------------------------------------------------
// Object Validators
// -------------------------------------------------------------------------
export { object, ObjectValidator } from './object/index';
export {
  ExtendStrategy,
  MaxKeysStrategy,
  MinKeysStrategy,
  type ObjectSchema,
  OmitStrategy,
  PartialStrategy,
  PassthroughStrategy,
  PickStrategy,
  ShapeStrategy,
  StrictStrategy,
  StripStrategy,
} from './object/index';

// -------------------------------------------------------------------------
// Logic Combinators
// -------------------------------------------------------------------------
export {
  allOf,
  and,
  anyOf,
  ifThenElse,
  intersection,
  lazy,
  LogicValidator,
  negate,
  not,
  nullable,
  nullish,
  oneOf,
  optional,
  or,
  union,
  when,
  xor,
} from './logic/index';
export {
  AndStrategy,
  IfThenElseStrategy,
  IntersectionStrategy,
  LazyStrategy,
  NotStrategy,
  OrStrategy,
  UnionStrategy,
  XorStrategy,
} from './logic/index';

// -------------------------------------------------------------------------
// Comparison Validators
// -------------------------------------------------------------------------
export { compare, ComparisonValidator, literal, nativeEnum, ref } from './comparison/index';
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
} from './comparison/index';

// -------------------------------------------------------------------------
// Async Validators
// -------------------------------------------------------------------------
export type { AsyncValidationFn, RetryConfig } from './async/index';
export {
  async,
  AsyncStrategy,
  AsyncValidator,
  DebounceStrategy,
  RetryStrategy,
  TimeoutStrategy,
} from './async/index';

// -------------------------------------------------------------------------
// Business Validators
// -------------------------------------------------------------------------
export type {
  CreditCardStrategy,
  IBANStrategy,
  PhoneStrategy,
  SSNStrategy,
  UrlSlugStrategy,
} from './business/index';
export { business, BusinessValidator } from './business/index';
export { CreditCardType, slugify } from './business/index';

// -------------------------------------------------------------------------
// File Validators
// -------------------------------------------------------------------------
export type {
  DimensionConstraints,
  FileExtensionStrategy,
  ImageDimensionsStrategy,
  ImageFile,
  MaxFileSizeStrategy,
  MimeTypeStrategy,
  MinFileSizeStrategy,
  ValidatableFile,
} from './file/index';
export { file, FileValidator } from './file/index';
export { FILE_SIZE_UNITS, MIME_TYPES } from './file/index';
