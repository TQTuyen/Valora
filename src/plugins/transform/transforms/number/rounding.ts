/**
 * Transform Plugin - Number Rounding Transforms
 * @module plugins/transform/transforms/number/rounding
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Round to nearest integer
 */
export const round: SameTypeTransformer<number> = (value: number) => Math.round(value);

/**
 * Round down to nearest integer
 */
export const floor: SameTypeTransformer<number> = (value: number) => Math.floor(value);

/**
 * Round up to nearest integer
 */
export const ceil: SameTypeTransformer<number> = (value: number) => Math.ceil(value);

/**
 * Truncate decimal part
 */
export const trunc: SameTypeTransformer<number> = (value: number) => Math.trunc(value);
