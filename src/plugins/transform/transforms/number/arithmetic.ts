/**
 * Transform Plugin - Number Arithmetic Transforms
 * @module plugins/transform/transforms/number/arithmetic
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Add a number
 */
export function add(n: number): SameTypeTransformer<number> {
  return (value: number) => value + n;
}

/**
 * Subtract a number
 */
export function subtract(n: number): SameTypeTransformer<number> {
  return (value: number) => value - n;
}

/**
 * Multiply by a number
 */
export function multiply(n: number): SameTypeTransformer<number> {
  return (value: number) => value * n;
}

/**
 * Divide by a number
 */
export function divide(n: number): SameTypeTransformer<number> {
  return (value: number) => {
    if (n === 0) {
      throw new Error('Division by zero');
    }
    return value / n;
  };
}

/**
 * Modulo operation
 */
export function mod(n: number): SameTypeTransformer<number> {
  return (value: number) => value % n;
}

/**
 * Power operation
 */
export function pow(exponent: number): SameTypeTransformer<number> {
  return (value: number) => Math.pow(value, exponent);
}
