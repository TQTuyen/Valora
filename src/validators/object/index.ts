/**
 * Object Validators
 * @module validators/object
 */

// Re-export validator and factory
export { object, ObjectValidator } from './validator';

// Re-export strategies for advanced use
export {
  ExtendStrategy,
  MaxKeysStrategy,
  MinKeysStrategy,
  type ObjectSchema,
  OmitStrategy,
  PartialStrategy,
  PassthroughStrategy,
  PickStrategy,
  ShapeStrategy,
  StrictStrategy,
  StripStrategy,
} from './strategies';
