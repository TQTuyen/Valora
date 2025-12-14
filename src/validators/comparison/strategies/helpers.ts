/**
 * Comparison Helpers
 * @module validators/comparison/strategies/helpers
 */

import type { ValidationContext } from '#types/index';

/** Reference to another field in the context */
export interface FieldRef {
  $ref: string;
}

/** Check if value is a field reference */
export function isFieldRef(value: unknown): value is FieldRef {
  return (
    typeof value === 'object' &&
    value !== null &&
    '$ref' in value &&
    typeof (value as FieldRef).$ref === 'string'
  );
}

/** Get referenced field value from context */
export function getRefValue(ref: FieldRef, context: ValidationContext): unknown {
  const data = context.data as Record<string, unknown>;
  const path = ref.$ref.split('.');
  let value: unknown = data;

  for (const key of path) {
    if (value === null || value === undefined) {
      return undefined;
    }
    value = (value as Record<string, unknown>)[key];
  }

  return value;
}
