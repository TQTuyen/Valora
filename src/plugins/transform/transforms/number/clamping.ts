/**
 * Transform Plugin - Number Clamping Transforms
 * @module plugins/transform/transforms/number/clamping
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Clamp value between min and max
 */
export function clamp(min: number, max: number): SameTypeTransformer<number> {
  return (value: number) => Math.max(min, Math.min(max, value));
}

/**
 * Ensure minimum value
 */
export function min(threshold: number): SameTypeTransformer<number> {
  return (value: number) => Math.max(threshold, value);
}

/**
 * Ensure maximum value
 */
export function max(threshold: number): SameTypeTransformer<number> {
  return (value: number) => Math.min(threshold, value);
}
