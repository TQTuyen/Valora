/**
 * Transform Plugin - Number Transforms
 * @module plugins/transform/transforms/number
 */

export * from './arithmetic';
export * from './clamping';
export * from './conversion';
export * from './math';
export * from './precision';
export * from './rounding';
export * from './sign';

// Re-export as collection for backwards compatibility
import { add, divide, mod, multiply, pow, subtract } from './arithmetic';
import { clamp, max, min } from './clamping';
import { toBase, toExponential, toInt, toString } from './conversion';
import { exp, log, log10, sqrt } from './math';
import { toFixed, toPrecision } from './precision';
import { ceil, floor, round, trunc } from './rounding';
import { abs, negate, sign } from './sign';

export const numberTransforms = {
  // Rounding
  round,
  floor,
  ceil,
  trunc,

  // Precision
  toFixed,
  toPrecision,

  // Clamping
  clamp,
  min,
  max,

  // Arithmetic
  add,
  subtract,
  multiply,
  divide,
  mod,
  pow,

  // Absolute/Sign
  abs,
  negate,
  sign,

  // Conversion
  toString,
  toInt,
  toBase,
  toExponential,

  // Advanced Math
  sqrt,
  log,
  log10,
  exp,
};
