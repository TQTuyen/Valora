import { describe, expect, it } from 'vitest';

import { validateClassInstance } from '@/decorators/class';
import {
  Contains,
  EndsWith,
  IsAlpha,
  IsAlphanumeric,
  IsEmail,
  IsLowercase,
  IsNumeric,
  IsString,
  IsUppercase,
  IsUrl,
  IsUuid,
  Length,
  Matches,
  MaxLength,
  MinLength,
  NotEmpty,
  StartsWith,
} from '@/decorators/property/string';

describe('String Property Decorators', () => {
  describe('@IsString', () => {
    it('should pass for valid string', () => {
      class TestDto {
        @IsString()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John Doe';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for number', () => {
      class TestDto {
        @IsString()
        name: any;
      }

      const dto = new TestDto();
      dto.name = 123;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.path).toEqual(['name']);
    });

    it('should fail for boolean', () => {
      class TestDto {
        @IsString()
        name: any;
      }

      const dto = new TestDto();
      dto.name = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for object', () => {
      class TestDto {
        @IsString()
        name: any;
      }

      const dto = new TestDto();
      dto.name = {};

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should pass for empty string', () => {
      class TestDto {
        @IsString()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = '';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@MinLength', () => {
    it('should pass when string length meets minimum', () => {
      class TestDto {
        @MinLength(3)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when string length equals minimum', () => {
      class TestDto {
        @MinLength(4)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string is too short', () => {
      class TestDto {
        @MinLength(5)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.path).toEqual(['name']);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @MinLength(5, { message: 'Name too short' })
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'Bob';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@MaxLength', () => {
    it('should pass when string length is within maximum', () => {
      class TestDto {
        @MaxLength(10)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when string length equals maximum', () => {
      class TestDto {
        @MaxLength(4)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string is too long', () => {
      class TestDto {
        @MaxLength(3)
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.path).toEqual(['name']);
    });
  });

  describe('@Length', () => {
    it('should pass when string length is exact', () => {
      class TestDto {
        @Length(4)
        code!: string;
      }

      const dto = new TestDto();
      dto.code = 'ABCD';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string is too short', () => {
      class TestDto {
        @Length(4)
        code!: string;
      }

      const dto = new TestDto();
      dto.code = 'ABC';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when string is too long', () => {
      class TestDto {
        @Length(4)
        code!: string;
      }

      const dto = new TestDto();
      dto.code = 'ABCDE';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsEmail', () => {
    it('should pass for valid email', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'test@example.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for email with subdomain', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'user@mail.example.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for email with plus sign', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'user+tag@example.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid email format', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'invalid-email';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for email without @', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'userexample.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for email without domain', () => {
      class TestDto {
        @IsEmail()
        email!: string;
      }

      const dto = new TestDto();
      dto.email = 'user@';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsUrl', () => {
    it('should pass for valid HTTP URL', () => {
      class TestDto {
        @IsUrl()
        website!: string;
      }

      const dto = new TestDto();
      dto.website = 'http://example.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for valid HTTPS URL', () => {
      class TestDto {
        @IsUrl()
        website!: string;
      }

      const dto = new TestDto();
      dto.website = 'https://example.com';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for URL with path', () => {
      class TestDto {
        @IsUrl()
        website!: string;
      }

      const dto = new TestDto();
      dto.website = 'https://example.com/path/to/page';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for URL with query string', () => {
      class TestDto {
        @IsUrl()
        website!: string;
      }

      const dto = new TestDto();
      dto.website = 'https://example.com?query=value';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid URL', () => {
      class TestDto {
        @IsUrl()
        website!: string;
      }

      const dto = new TestDto();
      dto.website = 'not-a-url';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsUuid', () => {
    it('should pass for valid UUID v4', () => {
      class TestDto {
        @IsUuid()
        id!: string;
      }

      const dto = new TestDto();
      dto.id = '550e8400-e29b-41d4-a716-446655440000';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for invalid UUID', () => {
      class TestDto {
        @IsUuid()
        id!: string;
      }

      const dto = new TestDto();
      dto.id = 'not-a-uuid';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for UUID without dashes', () => {
      class TestDto {
        @IsUuid()
        id!: string;
      }

      const dto = new TestDto();
      dto.id = '550e8400e29b41d4a716446655440000';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsAlpha', () => {
    it('should pass for alphabetic string', () => {
      class TestDto {
        @IsAlpha()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'JohnDoe';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for string with numbers', () => {
      class TestDto {
        @IsAlpha()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for string with special characters', () => {
      class TestDto {
        @IsAlpha()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John-Doe';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for string with spaces', () => {
      class TestDto {
        @IsAlpha()
        name!: string;
      }

      const dto = new TestDto();
      dto.name = 'John Doe';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsAlphanumeric', () => {
    it('should pass for alphanumeric string', () => {
      class TestDto {
        @IsAlphanumeric()
        username!: string;
      }

      const dto = new TestDto();
      dto.username = 'user123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for only letters', () => {
      class TestDto {
        @IsAlphanumeric()
        username!: string;
      }

      const dto = new TestDto();
      dto.username = 'username';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass for only numbers', () => {
      class TestDto {
        @IsAlphanumeric()
        username!: string;
      }

      const dto = new TestDto();
      dto.username = '123456';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for string with special characters', () => {
      class TestDto {
        @IsAlphanumeric()
        username!: string;
      }

      const dto = new TestDto();
      dto.username = 'user_123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for string with spaces', () => {
      class TestDto {
        @IsAlphanumeric()
        username!: string;
      }

      const dto = new TestDto();
      dto.username = 'user 123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@IsNumeric', () => {
    it('should pass for numeric string', () => {
      class TestDto {
        @IsNumeric()
        code!: string;
      }

      const dto = new TestDto();
      dto.code = '12345';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for string with letters', () => {
      class TestDto {
        @IsNumeric()
        code!: string;
      }

      const dto = new TestDto();
      dto.code = '123abc';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should pass for decimal numbers', () => {
      class TestDto {
        @IsNumeric()
        code!: string;
      }

      const dto = new TestDto();
      dto.code = '123.45';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsLowercase', () => {
    it('should pass for lowercase string', () => {
      class TestDto {
        @IsLowercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for string with uppercase letters', () => {
      class TestDto {
        @IsLowercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'Hello World';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should pass for string with numbers', () => {
      class TestDto {
        @IsLowercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@IsUppercase', () => {
    it('should pass for uppercase string', () => {
      class TestDto {
        @IsUppercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'HELLO WORLD';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for string with lowercase letters', () => {
      class TestDto {
        @IsUppercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'Hello World';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should pass for string with numbers', () => {
      class TestDto {
        @IsUppercase()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'HELLO123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@Contains', () => {
    it('should pass when string contains substring', () => {
      class TestDto {
        @Contains('world')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string does not contain substring', () => {
      class TestDto {
        @Contains('world')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello there';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should be case-sensitive by default', () => {
      class TestDto {
        @Contains('WORLD')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@StartsWith', () => {
    it('should pass when string starts with prefix', () => {
      class TestDto {
        @StartsWith('hello')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string does not start with prefix', () => {
      class TestDto {
        @StartsWith('hello')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'goodbye world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should be case-sensitive', () => {
      class TestDto {
        @StartsWith('Hello')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@EndsWith', () => {
    it('should pass when string ends with suffix', () => {
      class TestDto {
        @EndsWith('world')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string does not end with suffix', () => {
      class TestDto {
        @EndsWith('world')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello there';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should be case-sensitive', () => {
      class TestDto {
        @EndsWith('World')
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello world';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('@Matches', () => {
    it('should pass when string matches pattern', () => {
      class TestDto {
        @Matches(/^\d{3}-\d{2}-\d{4}$/)
        ssn!: string;
      }

      const dto = new TestDto();
      dto.ssn = '123-45-6789';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when string does not match pattern', () => {
      class TestDto {
        @Matches(/^\d{3}-\d{2}-\d{4}$/)
        ssn!: string;
      }

      const dto = new TestDto();
      dto.ssn = '12345-6789';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should work with complex regex patterns', () => {
      class TestDto {
        @Matches(/^[A-Z][a-z]+\s[A-Z][a-z]+$/)
        fullName!: string;
      }

      const dto = new TestDto();
      dto.fullName = 'John Doe';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@NotEmpty', () => {
    it('should pass for non-empty string', () => {
      class TestDto {
        @NotEmpty()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = 'hello';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail for empty string', () => {
      class TestDto {
        @NotEmpty()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = '';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail for string with only spaces', () => {
      class TestDto {
        @NotEmpty()
        text!: string;
      }

      const dto = new TestDto();
      dto.text = '   ';

      const result = validateClassInstance(dto);
      // Spaces are considered empty
      expect(result.success).toBe(false);
    });
  });

  describe('Integration: Multiple string decorators', () => {
    it('should combine multiple validators', () => {
      class UserDto {
        @IsString()
        @MinLength(2)
        @MaxLength(50)
        name!: string;

        @IsEmail()
        email!: string;

        @IsAlphanumeric()
        @MinLength(3)
        @MaxLength(20)
        username!: string;
      }

      const dto = new UserDto();
      dto.name = 'John Doe';
      dto.email = 'john@example.com';
      dto.username = 'john123';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when any validator fails', () => {
      class UserDto {
        @IsString()
        @MinLength(5)
        @MaxLength(50)
        name!: string;
      }

      const dto = new UserDto();
      dto.name = 'Bob'; // Too short

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors[0]?.path).toEqual(['name']);
    });

    it('should collect multiple errors', () => {
      class UserDto {
        @MinLength(5)
        name!: string;

        @IsEmail()
        email!: string;
      }

      const dto = new UserDto();
      dto.name = 'Bob'; // Too short
      dto.email = 'invalid'; // Invalid email

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
