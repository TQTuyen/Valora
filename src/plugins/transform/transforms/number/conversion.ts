/**
 * Transform Plugin - Number Conversion Transforms
 * @module plugins/transform/transforms/number/conversion
 */

import type { SameTypeTransformer, Transformer } from '../../types';

/**
 * Convert to string
 */
export const toString: Transformer<number, string> = (value: number) => value.toString();

/**
 * Convert to integer
 */
export const toInt: SameTypeTransformer<number> = (value: number) => Math.trunc(value);

/**
 * Convert to base string
 */
export function toBase(radix: number): Transformer<number, string> {
  return (value: number) => value.toString(radix);
}

/**
 * Convert to exponential notation
 */
export function toExponential(fractionDigits?: number): Transformer<number, string> {
  return (value: number) => value.toExponential(fractionDigits);
}
