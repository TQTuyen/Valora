/**
 * Transform Plugin - Number Precision Transforms
 * @module plugins/transform/transforms/number/precision
 */

import type { Transformer } from '../../types';

/**
 * Format to fixed decimal places
 */
export function toFixed(decimals: number): Transformer<number, string> {
  return (value: number) => value.toFixed(decimals);
}

/**
 * Format to precision
 */
export function toPrecision(precision: number): Transformer<number, string> {
  return (value: number) => value.toPrecision(precision);
}
