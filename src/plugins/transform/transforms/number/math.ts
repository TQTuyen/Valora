/**
 * Transform Plugin - Number Advanced Math Transforms
 * @module plugins/transform/transforms/number/math
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Square root
 */
export const sqrt: SameTypeTransformer<number> = (value: number) => {
  if (value < 0) {
    throw new Error('Cannot take square root of negative number');
  }
  return Math.sqrt(value);
};

/**
 * Natural logarithm
 */
export const log: SameTypeTransformer<number> = (value: number) => {
  if (value <= 0) {
    throw new Error('Logarithm undefined for non-positive numbers');
  }
  return Math.log(value);
};

/**
 * Base-10 logarithm
 */
export const log10: SameTypeTransformer<number> = (value: number) => {
  if (value <= 0) {
    throw new Error('Logarithm undefined for non-positive numbers');
  }
  return Math.log10(value);
};

/**
 * Exponential (e^x)
 */
export const exp: SameTypeTransformer<number> = (value: number) => Math.exp(value);
