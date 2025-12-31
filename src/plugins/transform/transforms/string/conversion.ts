/**
 * Transform Plugin - String Conversion Transforms
 * @module plugins/transform/transforms/string/conversion
 */

import type { Transformer } from '../../types';

/**
 * Convert to number
 */
export const toNumber: Transformer<string, number> = (value: string) => {
  const num = Number(value);
  if (isNaN(num)) {
    throw new Error(`Cannot convert "${value}" to number`);
  }
  return num;
};

/**
 * Parse as integer
 */
export function parseInt(radix = 10): Transformer<string, number> {
  return (value: string) => {
    const num = Number.parseInt(value, radix);
    if (isNaN(num)) {
      throw new Error(`Cannot parse "${value}" as integer`);
    }
    return num;
  };
}

/**
 * Parse as float
 */
export const parseFloat: Transformer<string, number> = (value: string) => {
  const num = Number.parseFloat(value);
  if (isNaN(num)) {
    throw new Error(`Cannot parse "${value}" as float`);
  }
  return num;
};
