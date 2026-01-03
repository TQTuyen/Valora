/**
 * Phone Number Strategy
 * @module validators/business/strategies/phone
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationOptions, ValidationResult } from '#types/index';

/**
 * Phone number validation strategy
 *
 * Validates phone numbers in E.164 format and various international formats.
 */
export class PhoneStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'phone';

  constructor(
    private readonly options?: {
      /** Expected country code (e.g., 'US', 'GB', 'VN') */
      countryCode?: string;
      /** Allow extension numbers */
      allowExtension?: boolean;
    },
    validationOptions?: ValidationOptions,
  ) {
    super();
    if (validationOptions?.message) {
      this.withMessage(validationOptions.message);
    }
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    // Remove common separators
    const normalized = value.replace(/[\s\-().]/g, '');

    // Check for extension
    let mainNumber = normalized;

    if (this.options?.allowExtension) {
      const extMatch = normalized.match(/^(.+?)(?:ext?|x)(\d+)$/i);
      if (extMatch) {
        mainNumber = extMatch[1] ?? '';
        // Extension is captured but not currently validated
      }
    }

    // Basic validation: must start with + and contain only digits
    if (!/^\+?\d{7,15}$/.test(mainNumber)) {
      return this.failure('business.phone.invalid', context);
    }

    // E.164 format validation (if starts with +)
    if (mainNumber.startsWith('+')) {
      if (!/^\+\d{1,3}\d{4,14}$/.test(mainNumber)) {
        return this.failure('business.phone.e164', context);
      }
    }

    // Country-specific validation
    if (this.options?.countryCode) {
      if (!this.validateCountryCode(mainNumber, this.options.countryCode)) {
        return this.failure('business.phone.country', context, {
          countryCode: this.options.countryCode,
        });
      }
    }

    return this.success(value, context);
  }

  /**
   * Validate country-specific phone number
   */
  private validateCountryCode(number: string, countryCode: string): boolean {
    const patterns: Record<string, RegExp> = {
      US: /^\+?1\d{10}$/,
      GB: /^\+?44\d{10}$/,
      VN: /^\+?84\d{9,10}$/,
      CN: /^\+?86\d{11}$/,
      JP: /^\+?81\d{10}$/,
      KR: /^\+?82\d{9,10}$/,
      AU: /^\+?61\d{9}$/,
      FR: /^\+?33\d{9}$/,
      DE: /^\+?49\d{10,11}$/,
      IT: /^\+?39\d{9,10}$/,
    };

    const pattern = patterns[countryCode.toUpperCase()];
    return pattern ? pattern.test(number) : true;
  }
}
