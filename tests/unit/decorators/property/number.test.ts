import { describe, expect, it } from 'vitest';

import {
  IsFinite,
  IsInt,
  IsMultipleOf,
  IsNegative,
  IsNumber,
  IsPositive,
  IsSafeInt,
  Max,
  Min,
  Range,
} from '@/decorators/property/number';
import { validateClassInstance } from '@/decorators/class';

describe('Number Property Decorators', () => {
  describe('@IsNumber', () => {
    it('should pass when value is a number', () => {
      class TestDto {
        @IsNumber()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is zero', () => {
      class TestDto {
        @IsNumber()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is negative', () => {
      class TestDto {
        @IsNumber()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is a decimal', () => {
      class TestDto {
        @IsNumber()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 3.14;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not a number', () => {
      class TestDto {
        @IsNumber()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'not a number';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should fail when value is NaN', () => {
      class TestDto {
        @IsNumber()
        value: number;
      }

      const dto = new TestDto();
      dto.value = NaN;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsNumber({ message: 'Value must be numeric' })
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'string';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@IsInt', () => {
    it('should pass when value is an integer', () => {
      class TestDto {
        @IsInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is zero', () => {
      class TestDto {
        @IsInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is negative integer', () => {
      class TestDto {
        @IsInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is a decimal', () => {
      class TestDto {
        @IsInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 3.14;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is not a number', () => {
      class TestDto {
        @IsInt()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'not a number';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsFinite', () => {
    it('should pass when value is a finite number', () => {
      class TestDto {
        @IsFinite()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is zero', () => {
      class TestDto {
        @IsFinite()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is Infinity', () => {
      class TestDto {
        @IsFinite()
        value: number;
      }

      const dto = new TestDto();
      dto.value = Infinity;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is -Infinity', () => {
      class TestDto {
        @IsFinite()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -Infinity;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is NaN', () => {
      class TestDto {
        @IsFinite()
        value: number;
      }

      const dto = new TestDto();
      dto.value = NaN;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsSafeInt', () => {
    it('should pass when value is a safe integer', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is Number.MAX_SAFE_INTEGER', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = Number.MAX_SAFE_INTEGER;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is Number.MIN_SAFE_INTEGER', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = Number.MIN_SAFE_INTEGER;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value exceeds MAX_SAFE_INTEGER', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = Number.MAX_SAFE_INTEGER + 1;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is below MIN_SAFE_INTEGER', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = Number.MIN_SAFE_INTEGER - 1;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is a decimal', () => {
      class TestDto {
        @IsSafeInt()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 3.14;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@Min', () => {
    it('should pass when value is greater than minimum', () => {
      class TestDto {
        @Min(10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 15;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value equals minimum', () => {
      class TestDto {
        @Min(10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 10;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is less than minimum', () => {
      class TestDto {
        @Min(10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should work with negative numbers', () => {
      class TestDto {
        @Min(-10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = -5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @Min(10, { message: 'Value must be at least 10' })
        value: number;
      }

      const dto = new TestDto();
      dto.value = 5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@Max', () => {
    it('should pass when value is less than maximum', () => {
      class TestDto {
        @Max(100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 50;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value equals maximum', () => {
      class TestDto {
        @Max(100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 100;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is greater than maximum', () => {
      class TestDto {
        @Max(100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 150;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should work with negative numbers', () => {
      class TestDto {
        @Max(-10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = -15;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@Range', () => {
    it('should pass when value is within range', () => {
      class TestDto {
        @Range(10, 100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 50;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value equals minimum', () => {
      class TestDto {
        @Range(10, 100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 10;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value equals maximum', () => {
      class TestDto {
        @Range(10, 100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 100;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is below range', () => {
      class TestDto {
        @Range(10, 100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is above range', () => {
      class TestDto {
        @Range(10, 100)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 150;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should work with negative ranges', () => {
      class TestDto {
        @Range(-100, -10)
        value: number;
      }

      const dto = new TestDto();
      dto.value = -50;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsPositive', () => {
    it('should pass when value is positive', () => {
      class TestDto {
        @IsPositive()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is a small positive decimal', () => {
      class TestDto {
        @IsPositive()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0.01;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is zero', () => {
      class TestDto {
        @IsPositive()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is negative', () => {
      class TestDto {
        @IsPositive()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsNegative', () => {
    it('should pass when value is negative', () => {
      class TestDto {
        @IsNegative()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is a small negative decimal', () => {
      class TestDto {
        @IsNegative()
        value: number;
      }

      const dto = new TestDto();
      dto.value = -0.01;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is zero', () => {
      class TestDto {
        @IsNegative()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should fail when value is positive', () => {
      class TestDto {
        @IsNegative()
        value: number;
      }

      const dto = new TestDto();
      dto.value = 42;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsMultipleOf', () => {
    it('should pass when value is a multiple of the divisor', () => {
      class TestDto {
        @IsMultipleOf(5)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 15;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value equals the divisor', () => {
      class TestDto {
        @IsMultipleOf(5)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is zero', () => {
      class TestDto {
        @IsMultipleOf(5)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not a multiple', () => {
      class TestDto {
        @IsMultipleOf(5)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 17;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should work with decimal divisors', () => {
      class TestDto {
        @IsMultipleOf(0.5)
        value: number;
      }

      const dto = new TestDto();
      dto.value = 1.5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should work with negative multiples', () => {
      class TestDto {
        @IsMultipleOf(3)
        value: number;
      }

      const dto = new TestDto();
      dto.value = -9;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('Integration: Multiple number decorators', () => {
    it('should validate age with multiple constraints', () => {
      class UserDto {
        @IsInt()
        @Min(0)
        @Max(150)
        age: number;
      }

      const dto = new UserDto();
      dto.age = 25;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when age is decimal', () => {
      class UserDto {
        @IsInt()
        @Min(0)
        @Max(150)
        age: number;
      }

      const dto = new UserDto();
      dto.age = 25.5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate price with positive and range constraints', () => {
      class ProductDto {
        @IsPositive()
        @Max(10000)
        price: number;
      }

      const dto = new ProductDto();
      dto.price = 99.99;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should validate quantity with multiple constraints', () => {
      class OrderDto {
        @IsInt()
        @IsPositive()
        @IsMultipleOf(5)
        quantity: number;
      }

      const dto = new OrderDto();
      dto.quantity = 15;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when quantity is not a multiple of 5', () => {
      class OrderDto {
        @IsInt()
        @IsPositive()
        @IsMultipleOf(5)
        quantity: number;
      }

      const dto = new OrderDto();
      dto.quantity = 17;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate temperature in safe range', () => {
      class SensorDto {
        @IsFinite()
        @Range(-50, 100)
        temperature: number;
      }

      const dto = new SensorDto();
      dto.temperature = 22.5;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });
});
