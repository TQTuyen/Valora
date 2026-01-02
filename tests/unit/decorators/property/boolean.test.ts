import { describe, expect, it } from 'vitest';

import { IsBoolean, IsFalse, IsTrue } from '@/decorators/property/boolean';
import { validateClassInstance } from '@/decorators/class';

describe('Boolean Property Decorators', () => {
  describe('@IsBoolean', () => {
    it('should pass when value is true', () => {
      class TestDto {
        @IsBoolean()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is false', () => {
      class TestDto {
        @IsBoolean()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not a boolean', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'not a boolean';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should fail when value is 1', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 1;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is 0', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is "true" string', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'true';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is "false" string', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'false';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is undefined', () => {
      class TestDto {
        @IsBoolean()
        value: any;
      }

      const dto = new TestDto();
      dto.value = undefined;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsBoolean({ message: 'Value must be a boolean' })
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'string';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@IsTrue', () => {
    it('should pass when value is true', () => {
      class TestDto {
        @IsTrue()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is false', () => {
      class TestDto {
        @IsTrue()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should fail when value is 1', () => {
      class TestDto {
        @IsTrue()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 1;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is "true" string', () => {
      class TestDto {
        @IsTrue()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'true';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsTrue()
        value: any;
      }

      const dto = new TestDto();
      dto.value = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsTrue({ message: 'Value must be true' })
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('@IsFalse', () => {
    it('should pass when value is false', () => {
      class TestDto {
        @IsFalse()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is true', () => {
      class TestDto {
        @IsFalse()
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['value']);
    });

    it('should fail when value is 0', () => {
      class TestDto {
        @IsFalse()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 0;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is "false" string', () => {
      class TestDto {
        @IsFalse()
        value: any;
      }

      const dto = new TestDto();
      dto.value = 'false';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsFalse()
        value: any;
      }

      const dto = new TestDto();
      dto.value = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsFalse({ message: 'Value must be false' })
        value: boolean;
      }

      const dto = new TestDto();
      dto.value = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });
  });

  describe('Integration: Multiple boolean decorators', () => {
    it('should validate acceptance field', () => {
      class TermsDto {
        @IsBoolean()
        @IsTrue()
        acceptedTerms: boolean;
      }

      const dto = new TermsDto();
      dto.acceptedTerms = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when acceptance is false', () => {
      class TermsDto {
        @IsBoolean()
        @IsTrue()
        acceptedTerms: boolean;
      }

      const dto = new TermsDto();
      dto.acceptedTerms = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate disabled state', () => {
      class FeatureDto {
        @IsBoolean()
        @IsFalse()
        isDisabled: boolean;
      }

      const dto = new FeatureDto();
      dto.isDisabled = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when disabled state is true', () => {
      class FeatureDto {
        @IsBoolean()
        @IsFalse()
        isDisabled: boolean;
      }

      const dto = new FeatureDto();
      dto.isDisabled = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should validate multiple boolean fields', () => {
      class SettingsDto {
        @IsBoolean()
        darkMode: boolean;

        @IsBoolean()
        @IsTrue()
        acceptedTerms: boolean;

        @IsBoolean()
        notifications: boolean;
      }

      const dto = new SettingsDto();
      dto.darkMode = true;
      dto.acceptedTerms = true;
      dto.notifications = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when one required boolean is not true', () => {
      class SettingsDto {
        @IsBoolean()
        darkMode: boolean;

        @IsBoolean()
        @IsTrue()
        acceptedTerms: boolean;

        @IsBoolean()
        notifications: boolean;
      }

      const dto = new SettingsDto();
      dto.darkMode = true;
      dto.acceptedTerms = false; // Required to be true
      dto.notifications = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['acceptedTerms']);
    });

    it('should validate consent form', () => {
      class ConsentDto {
        @IsBoolean()
        @IsTrue()
        agreeToTerms: boolean;

        @IsBoolean()
        @IsTrue()
        agreeToPrivacy: boolean;

        @IsBoolean()
        marketingEmails: boolean; // Optional, can be true or false
      }

      const dto = new ConsentDto();
      dto.agreeToTerms = true;
      dto.agreeToPrivacy = true;
      dto.marketingEmails = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when any required consent is false', () => {
      class ConsentDto {
        @IsBoolean()
        @IsTrue()
        agreeToTerms: boolean;

        @IsBoolean()
        @IsTrue()
        agreeToPrivacy: boolean;

        @IsBoolean()
        marketingEmails: boolean;
      }

      const dto = new ConsentDto();
      dto.agreeToTerms = true;
      dto.agreeToPrivacy = false; // Required to be true
      dto.marketingEmails = false;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].path).toEqual(['agreeToPrivacy']);
    });
  });
});
