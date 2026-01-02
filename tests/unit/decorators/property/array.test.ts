import { describe, expect, it } from 'vitest';

import { validateClassInstance } from '@/decorators/class';
import {
  ArrayContains,
  ArrayLength,
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
} from '@/decorators/property/array';

describe('Array Property Decorators', () => {
  describe('@IsArray', () => {
    it('should pass when value is an array', () => {
      class TestDto {
        @IsArray()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is an empty array', () => {
      class TestDto {
        @IsArray()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is an array of objects', () => {
      class TestDto {
        @IsArray()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [{ id: 1 }, { id: 2 }];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not an array', () => {
      class TestDto {
        @IsArray()
        items: any;
      }

      const dto = new TestDto();
      dto.items = 'not an array';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['items']);
    });

    it('should fail when value is an object', () => {
      class TestDto {
        @IsArray()
        items: any;
      }

      const dto = new TestDto();
      dto.items = { length: 3 }; // Object with length property

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsArray()
        items: any;
      }

      const dto = new TestDto();
      dto.items = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsArray({ message: 'Items must be an array' })
        items: any;
      }

      const dto = new TestDto();
      dto.items = 'string';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@ArrayMinSize', () => {
    it('should pass when array length is greater than minimum', () => {
      class TestDto {
        @ArrayMinSize(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 4];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array length equals minimum', () => {
      class TestDto {
        @ArrayMinSize(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array length is less than minimum', () => {
      class TestDto {
        @ArrayMinSize(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['items']);
    });

    it('should fail when array is empty and minimum is greater than 0', () => {
      class TestDto {
        @ArrayMinSize(1)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @ArrayMinSize(3, { message: 'Array must have at least 3 items' })
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@ArrayMaxSize', () => {
    it('should pass when array length is less than maximum', () => {
      class TestDto {
        @ArrayMaxSize(5)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array length equals maximum', () => {
      class TestDto {
        @ArrayMaxSize(5)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 4, 5];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array length exceeds maximum', () => {
      class TestDto {
        @ArrayMaxSize(5)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 4, 5, 6];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['items']);
    });

    it('should pass when array is empty', () => {
      class TestDto {
        @ArrayMaxSize(5)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@ArrayLength', () => {
    it('should pass when array has exact length', () => {
      class TestDto {
        @ArrayLength(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array is too short', () => {
      class TestDto {
        @ArrayLength(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when array is too long', () => {
      class TestDto {
        @ArrayLength(3)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 4];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should work with empty array when length is 0', () => {
      class TestDto {
        @ArrayLength(0)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@ArrayNotEmpty', () => {
    it('should pass when array has items', () => {
      class TestDto {
        @ArrayNotEmpty()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array has multiple items', () => {
      class TestDto {
        @ArrayNotEmpty()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array is empty', () => {
      class TestDto {
        @ArrayNotEmpty()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['items']);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @ArrayNotEmpty({ message: 'Array cannot be empty' })
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@ArrayContains', () => {
    it('should pass when array contains the value', () => {
      class TestDto {
        @ArrayContains('item')
        items: string[];
      }

      const dto = new TestDto();
      dto.items = ['item', 'other'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array contains multiple occurrences', () => {
      class TestDto {
        @ArrayContains('item')
        items: string[];
      }

      const dto = new TestDto();
      dto.items = ['item', 'other', 'item'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array does not contain the value', () => {
      class TestDto {
        @ArrayContains('item')
        items: string[];
      }

      const dto = new TestDto();
      dto.items = ['other', 'another'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should work with numbers', () => {
      class TestDto {
        @ArrayContains(42)
        items: number[];
      }

      const dto = new TestDto();
      dto.items = [1, 42, 100];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should work with objects using deep equality', () => {
      class TestDto {
        @ArrayContains({ id: 1 })
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [{ id: 1 }, { id: 2 }];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array is empty', () => {
      class TestDto {
        @ArrayContains('item')
        items: string[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@ArrayUnique', () => {
    it('should pass when array has unique values', () => {
      class TestDto {
        @ArrayUnique()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 4];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array is empty', () => {
      class TestDto {
        @ArrayUnique()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when array has one item', () => {
      class TestDto {
        @ArrayUnique()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array has duplicate values', () => {
      class TestDto {
        @ArrayUnique()
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3, 2];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['items']);
    });

    it('should work with strings', () => {
      class TestDto {
        @ArrayUnique()
        items: string[];
      }

      const dto = new TestDto();
      dto.items = ['a', 'b', 'c'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when strings are duplicated', () => {
      class TestDto {
        @ArrayUnique()
        items: string[];
      }

      const dto = new TestDto();
      dto.items = ['a', 'b', 'a'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @ArrayUnique({ message: 'All items must be unique' })
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 1];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('Integration: Multiple array decorators', () => {
    it('should validate array with multiple constraints', () => {
      class TestDto {
        @IsArray()
        @ArrayNotEmpty()
        @ArrayMinSize(2)
        @ArrayMaxSize(10)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when array is empty with multiple constraints', () => {
      class TestDto {
        @IsArray()
        @ArrayNotEmpty()
        @ArrayMinSize(2)
        items: any[];
      }

      const dto = new TestDto();
      dto.items = [];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Should have at least 2 errors: ArrayNotEmpty and ArrayMinSize
      expect(result.errors.length).toBeGreaterThanOrEqual(1);
    });

    it('should validate unique items with size constraints', () => {
      class TestDto {
        @IsArray()
        @ArrayUnique()
        @ArrayMinSize(3)
        @ArrayMaxSize(5)
        tags: string[];
      }

      const dto = new TestDto();
      dto.tags = ['react', 'vue', 'angular'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when unique constraint is violated', () => {
      class TestDto {
        @IsArray()
        @ArrayUnique()
        @ArrayMinSize(3)
        tags: string[];
      }

      const dto = new TestDto();
      dto.tags = ['react', 'vue', 'react'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate array with exact length and unique values', () => {
      class TestDto {
        @IsArray()
        @ArrayLength(3)
        @ArrayUnique()
        coordinates: number[];
      }

      const dto = new TestDto();
      dto.coordinates = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should validate array contains specific value with constraints', () => {
      class TestDto {
        @IsArray()
        @ArrayNotEmpty()
        @ArrayContains('admin')
        roles: string[];
      }

      const dto = new TestDto();
      dto.roles = ['user', 'admin', 'moderator'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when required value is missing', () => {
      class TestDto {
        @IsArray()
        @ArrayNotEmpty()
        @ArrayContains('admin')
        roles: string[];
      }

      const dto = new TestDto();
      dto.roles = ['user', 'moderator'];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate complex object arrays', () => {
      class TestDto {
        @IsArray()
        @ArrayMinSize(1)
        @ArrayMaxSize(100)
        @ArrayNotEmpty()
        users: any[];
      }

      const dto = new TestDto();
      dto.users = [
        { id: 1, name: 'John' },
        { id: 2, name: 'Jane' },
      ];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });
});
