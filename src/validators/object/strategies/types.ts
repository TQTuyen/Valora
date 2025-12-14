/**
 * Object Validation Types
 * @module validators/object/strategies/types
 */

import type { IValidator } from '#types/index';

/** Schema definition type */
export type ObjectSchema<T extends Record<string, unknown>> = {
  [K in keyof T]: IValidator<unknown, T[K]>;
};
