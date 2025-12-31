/**
 * Transform Plugin - Object Immutability Transforms
 * @module plugins/transform/transforms/object/immutability
 */

import type { SameTypeTransformer } from '../../types';

/**
 * Freeze object (make immutable)
 */
export const freeze: SameTypeTransformer<Record<string, unknown>> = (
  value: Record<string, unknown>,
) => {
  return Object.freeze({ ...value });
};

/**
 * Seal object (prevent extensions)
 */
export const seal: SameTypeTransformer<Record<string, unknown>> = (
  value: Record<string, unknown>,
) => {
  return Object.seal({ ...value });
};
