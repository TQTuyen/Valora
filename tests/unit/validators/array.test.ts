/**
 * Array Validator Tests
 */

import { describe, expect, it } from 'vitest';

import { array } from '@validators/array';
import { number } from '@validators/number';
import { string } from '@validators/string';
import { createContext, expectFailure, expectSuccess } from '../../helpers/test-utils';

describe('Array Validator', () => {
  const ctx = createContext();

  describe('Basic Array Validation', () => {
    it('should validate arrays', () => {
      const validator = array();

      expectSuccess(validator.validate([], ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectSuccess(validator.validate(['a', 'b', 'c'], ctx));
    });

    it('should reject non-array values', () => {
      const validator = array();

      expectFailure(validator.validate('not an array', ctx));
      expectFailure(validator.validate(123, ctx));
      expectFailure(validator.validate({}, ctx));
      expectFailure(validator.validate(null, ctx));
      expectFailure(validator.validate(undefined, ctx));
    });
  });

  describe('Item Validation', () => {
    it('should validate array items with of()', () => {
      const validator = array().of(number());

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1, 'two', 3], ctx));
      expectFailure(validator.validate(['one', 'two'], ctx));
    });

    it('should validate array items with items() alias', () => {
      const validator = array().items(string());

      expectSuccess(validator.validate(['a', 'b', 'c'], ctx));
      expectFailure(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate(['a', 1, 'c'], ctx));
    });

    it('should validate empty arrays when using of()', () => {
      const validator = array().of(number());

      expectSuccess(validator.validate([], ctx));
    });

    it('should chain item validation with other validations', () => {
      const validator = array().of(number().positive()).min(1).max(5);

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1, -2, 3], ctx)); // Negative number
      expectFailure(validator.validate([], ctx)); // Too short
      expectFailure(validator.validate([1, 2, 3, 4, 5, 6], ctx)); // Too long
    });
  });

  describe('Length Validation', () => {
    it('should validate minimum length', () => {
      const validator = array().min(2);

      expectSuccess(validator.validate([1, 2], ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1], ctx));
      expectFailure(validator.validate([], ctx));
    });

    it('should validate minimum length with minLength() alias', () => {
      const validator = array().minLength(3);

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectSuccess(validator.validate([1, 2, 3, 4], ctx));
      expectFailure(validator.validate([1, 2], ctx));
    });

    it('should validate maximum length', () => {
      const validator = array().max(3);

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectSuccess(validator.validate([1, 2], ctx));
      expectSuccess(validator.validate([], ctx));
      expectFailure(validator.validate([1, 2, 3, 4], ctx));
    });

    it('should validate maximum length with maxLength() alias', () => {
      const validator = array().maxLength(2);

      expectSuccess(validator.validate([1, 2], ctx));
      expectSuccess(validator.validate([1], ctx));
      expectFailure(validator.validate([1, 2, 3], ctx));
    });

    it('should validate exact length', () => {
      const validator = array().length(3);

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1, 2], ctx));
      expectFailure(validator.validate([1, 2, 3, 4], ctx));
      expectFailure(validator.validate([], ctx));
    });

    it('should validate length range', () => {
      const validator = array().range(2, 4);

      expectSuccess(validator.validate([1, 2], ctx)); // Min boundary
      expectSuccess(validator.validate([1, 2, 3], ctx)); // Within range
      expectSuccess(validator.validate([1, 2, 3, 4], ctx)); // Max boundary
      expectFailure(validator.validate([1], ctx)); // Too short
      expectFailure(validator.validate([1, 2, 3, 4, 5], ctx)); // Too long
    });

    it('should validate length range with between() alias', () => {
      const validator = array().between(1, 3);

      expectSuccess(validator.validate([1], ctx));
      expectSuccess(validator.validate([1, 2], ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([], ctx));
      expectFailure(validator.validate([1, 2, 3, 4], ctx));
    });
  });

  describe('Content Validation', () => {
    it('should validate non-empty arrays', () => {
      const validator = array().nonEmpty();

      expectSuccess(validator.validate([1], ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([], ctx));
    });

    it('should validate non-empty arrays with notEmpty() alias', () => {
      const validator = array().notEmpty();

      expectSuccess(validator.validate(['a'], ctx));
      expectFailure(validator.validate([], ctx));
    });

    it('should validate unique arrays', () => {
      const validator = array().unique();

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectSuccess(validator.validate(['a', 'b', 'c'], ctx));
      expectSuccess(validator.validate([], ctx));
      expectFailure(validator.validate([1, 2, 2, 3], ctx)); // Duplicate 2
      expectFailure(validator.validate(['a', 'b', 'a'], ctx)); // Duplicate 'a'
    });

    it('should validate unique arrays with distinct() alias', () => {
      const validator = array().distinct();

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1, 1, 2], ctx));
    });

    it('should validate arrays containing a specific value', () => {
      const validator = array<number>().contains(42);

      expectSuccess(validator.validate([1, 42, 3], ctx));
      expectSuccess(validator.validate([42], ctx));
      expectFailure(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([], ctx));
    });

    it('should validate arrays containing a specific value with includes() alias', () => {
      const validator = array<string>().includes('target');

      expectSuccess(validator.validate(['a', 'target', 'b'], ctx));
      expectFailure(validator.validate(['a', 'b', 'c'], ctx));
    });
  });

  describe('Predicate Validation', () => {
    it('should validate that every item satisfies a predicate', () => {
      const validator = array<number>().every((item) => item > 0);

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectSuccess(validator.validate([10, 20, 30], ctx));
      expectFailure(validator.validate([1, -2, 3], ctx)); // Contains negative
      expectFailure(validator.validate([0, 1, 2], ctx)); // Contains zero
    });

    it('should validate with index in every predicate', () => {
      const validator = array<number>().every((item, index) => item === index);

      expectSuccess(validator.validate([0, 1, 2], ctx));
      expectFailure(validator.validate([1, 2, 3], ctx));
    });

    it('should validate that some item satisfies a predicate', () => {
      const validator = array<number>().some((item) => item > 10);

      expectSuccess(validator.validate([1, 15, 3], ctx)); // 15 > 10
      expectSuccess(validator.validate([100, 2], ctx)); // 100 > 10
      expectFailure(validator.validate([1, 2, 3], ctx)); // None > 10
      expectFailure(validator.validate([], ctx)); // Empty
    });

    it('should validate with index in some predicate', () => {
      const validator = array<number>().some((item, index) => item === index);

      expectSuccess(validator.validate([1, 1, 2], ctx)); // item[2] === 2
      expectFailure(validator.validate([1, 2, 0], ctx)); // No match
    });

    it('should validate that none of the items satisfy a predicate', () => {
      const validator = array<number>().none((item) => item < 0);

      expectSuccess(validator.validate([1, 2, 3], ctx)); // No negatives
      expectSuccess(validator.validate([0, 5, 10], ctx)); // No negatives
      expectFailure(validator.validate([1, -2, 3], ctx)); // Contains negative
    });
  });

  describe('Optional and Nullable', () => {
    it('should handle optional arrays', () => {
      const validator = array().optional();

      expectSuccess(validator.validate(undefined, ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate(null, ctx));
    });

    it('should handle nullable arrays', () => {
      const validator = array().nullable();

      expectSuccess(validator.validate(null, ctx));
      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate(undefined, ctx));
    });
  });

  describe('Transform', () => {
    it('should transform array values', () => {
      const validator = array<number>().transform((arr) => arr.length);

      const result = validator.validate([1, 2, 3], ctx);

      expectSuccess(result);
      expect(result.success && result.data).toBe(3);
    });

    it('should transform after validation', () => {
      const validator = array<number>()
        .of(number())
        .min(2)
        .transform((arr) => arr.join(','));

      const result = validator.validate([1, 2, 3], ctx);

      expectSuccess(result);
      expect(result.success && result.data).toBe('1,2,3');
    });
  });

  describe('Default Values', () => {
    it('should provide default value for undefined', () => {
      const defaultArray = [1, 2, 3];
      const validator = array().default(defaultArray);

      expectSuccess(validator.validate(undefined, ctx), defaultArray);
      expectSuccess(validator.validate(null, ctx), defaultArray);

      const customArray = [4, 5, 6];
      expectSuccess(validator.validate(customArray, ctx), customArray);
    });
  });

  describe('Chaining Validations', () => {
    it('should chain multiple array validations', () => {
      const validator = array<number>().of(number().positive()).min(2).max(5).unique();

      expectSuccess(validator.validate([1, 2, 3], ctx));
      expectFailure(validator.validate([1], ctx)); // Too short
      expectFailure(validator.validate([1, 2, 3, 4, 5, 6], ctx)); // Too long
      expectFailure(validator.validate([1, 2, 2], ctx)); // Not unique
      expectFailure(validator.validate([1, -2, 3], ctx)); // Negative number
    });

    it('should chain with predicates', () => {
      const validator = array<number>()
        .nonEmpty()
        .every((item) => item > 0)
        .some((item) => item > 10);

      expectSuccess(validator.validate([5, 15, 8], ctx)); // All positive, one > 10
      expectFailure(validator.validate([], ctx)); // Empty
      expectFailure(validator.validate([1, -2, 15], ctx)); // Contains negative
      expectFailure(validator.validate([1, 2, 3], ctx)); // None > 10
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate tags array', () => {
      const tagsValidator = array<string>()
        .of(string().minLength(2).maxLength(20))
        .min(1)
        .max(10)
        .unique();

      expectSuccess(tagsValidator.validate(['javascript', 'typescript', 'node'], ctx));
      expectFailure(tagsValidator.validate([], ctx)); // No tags
      expectFailure(tagsValidator.validate(['js', 'js', 'node'], ctx)); // Duplicate
      expectFailure(tagsValidator.validate(['a'], ctx)); // Tag too short
      expectFailure(
        tagsValidator.validate(['very-long-tag-name-that-exceeds-maximum-length'], ctx),
      ); // Tag too long
    });

    it('should validate ratings array', () => {
      const ratingsValidator = array<number>()
        .of(number().min(1).max(5))
        .nonEmpty()
        .every((rating) => Number.isInteger(rating));

      expectSuccess(ratingsValidator.validate([4, 5, 3, 5], ctx));
      expectFailure(ratingsValidator.validate([], ctx)); // Empty
      expectFailure(ratingsValidator.validate([1, 6, 3], ctx)); // 6 out of range
      expectFailure(ratingsValidator.validate([4.5, 3], ctx)); // Not integers
    });

    it('should validate coordinates array', () => {
      const coordinatesValidator = array<number>()
        .of(number())
        .length(2)
        .every((coord) => coord >= -180 && coord <= 180);

      expectSuccess(coordinatesValidator.validate([45.5, -122.6], ctx));
      expectSuccess(coordinatesValidator.validate([0, 0], ctx));
      expectFailure(coordinatesValidator.validate([45.5], ctx)); // Only one coordinate
      expectFailure(coordinatesValidator.validate([45.5, -122.6, 100], ctx)); // Three coordinates
      expectFailure(coordinatesValidator.validate([45.5, -200], ctx)); // Out of range
    });

    it('should validate selected items array', () => {
      const allowedValues = ['option1', 'option2', 'option3'];
      const selectionValidator = array<string>()
        .of(string())
        .min(1)
        .unique()
        .every((item) => allowedValues.includes(item));

      expectSuccess(selectionValidator.validate(['option1', 'option2'], ctx));
      expectSuccess(selectionValidator.validate(['option3'], ctx));
      expectFailure(selectionValidator.validate([], ctx)); // No selection
      expectFailure(selectionValidator.validate(['option1', 'option1'], ctx)); // Duplicate
      expectFailure(selectionValidator.validate(['option1', 'invalid'], ctx)); // Invalid option
    });

    it('should validate pagination results', () => {
      const paginationValidator = array()
        .of(number())
        .max(100)
        .some((item) => item > 0);

      expectSuccess(paginationValidator.validate([1, 2, 3], ctx));
      expectSuccess(paginationValidator.validate([0, 5], ctx)); // Some > 0
      expectFailure(paginationValidator.validate([0, 0, 0], ctx)); // None > 0
      expectFailure(paginationValidator.validate(Array(101).fill(1), ctx)); // Too many items
    });
  });
});
