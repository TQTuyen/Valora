/**
 * Transform Plugin - Number Sign Transforms
 * @module plugins/transform/transforms/number/sign
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Absolute value
 */
export const abs: SameTypeTransformer<number> = (value: number) => Math.abs(value);

/**
 * Negate value
 */
export const negate: SameTypeTransformer<number> = (value: number) => -value;

/**
 * Get sign (-1, 0, or 1)
 */
export const sign: SameTypeTransformer<number> = (value: number) => Math.sign(value);
