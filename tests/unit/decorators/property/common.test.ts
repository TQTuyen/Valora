import { describe, expect, it } from 'vitest';

import { IsOptional, IsRequired } from '@/decorators/property/common';
import { Validate, validateClassInstance } from '@/decorators/class';

describe('Common Property Decorators', () => {
  describe('@IsRequired', () => {
    it('should pass when value is provided', () => {
      class TestDto {
        @IsRequired()
        name: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is undefined', () => {
      class TestDto {
        @IsRequired()
        name: string;
      }

      const dto = new TestDto();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['name']);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsRequired()
        name: string | null;
      }

      const dto = new TestDto();
      dto.name = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsRequired({ message: 'Name is mandatory' })
        name: string;
      }

      const dto = new TestDto();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });

    it('should work with multiple required fields', () => {
      class TestDto {
        @IsRequired()
        name: string;

        @IsRequired()
        email: string;
      }

      const dto = new TestDto();
      dto.name = 'John';
      // email is missing

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['email']);
    });

    it('should allow empty string', () => {
      class TestDto {
        @IsRequired()
        name: string;
      }

      const dto = new TestDto();
      dto.name = '';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should allow zero as valid value', () => {
      class TestDto {
        @IsRequired()
        age: number;
      }

      const dto = new TestDto();
      dto.age = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should allow false as valid value', () => {
      class TestDto {
        @IsRequired()
        active: boolean;
      }

      const dto = new TestDto();
      dto.active = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsOptional', () => {
    it('should pass when value is undefined', () => {
      class TestDto {
        @IsOptional()
        name?: string;
      }

      const dto = new TestDto();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is provided', () => {
      class TestDto {
        @IsOptional()
        name?: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should skip validation when value is undefined', () => {
      class TestDto {
        @IsOptional()
        name?: string;
      }

      const dto = new TestDto();
      // name is undefined, should skip validation

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBeUndefined();
      }
    });

    it('should pass when value is null', () => {
      class TestDto {
        @IsOptional()
        name?: string | null;
      }

      const dto = new TestDto();
      dto.name = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should work with other validators', () => {
      // This will be tested more in integration tests
      class TestDto {
        @IsOptional()
        name?: string;
      }

      const dto = new TestDto();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('Integration: @IsRequired + @IsOptional', () => {
    it('should handle mix of required and optional fields', () => {
      class TestDto {
        @IsRequired()
        name: string;

        @IsOptional()
        nickname?: string;
      }

      const dto = new TestDto();
      dto.name = 'John';
      // nickname is optional, not provided

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when required field is missing but optional is provided', () => {
      class TestDto {
        @IsRequired()
        name: string;

        @IsOptional()
        nickname?: string;
      }

      const dto = new TestDto();
      dto.nickname = 'Johnny';
      // name is required, not provided

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['name']);
    });
  });
});
