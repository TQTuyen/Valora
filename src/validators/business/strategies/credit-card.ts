/**
 * Credit Card Strategy
 * @module validators/business/strategies/credit-card
 */

import { BaseValidationStrategy } from '@core/index';

import type { ValidationContext, ValidationResult } from '#types/index';

/**
 * Credit card type
 */
export enum CreditCardType {
  VISA = 'visa',
  MASTERCARD = 'mastercard',
  AMEX = 'amex',
  DISCOVER = 'discover',
  DINERS = 'diners',
  JCB = 'jcb',
  UNKNOWN = 'unknown',
}

/**
 * Credit card patterns for type detection
 */
const CARD_PATTERNS: Record<CreditCardType, RegExp> = {
  [CreditCardType.VISA]: /^4[0-9]{12}(?:[0-9]{3})?$/,
  [CreditCardType.MASTERCARD]: /^5[1-5][0-9]{14}$/,
  [CreditCardType.AMEX]: /^3[47][0-9]{13}$/,
  [CreditCardType.DISCOVER]: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
  [CreditCardType.DINERS]: /^3(?:0[0-5]|[68][0-9])[0-9]{11}$/,
  [CreditCardType.JCB]: /^(?:2131|1800|35\d{3})\d{11}$/,
  [CreditCardType.UNKNOWN]: /^[0-9]+$/,
};

/**
 * Credit card validation strategy
 *
 * Validates credit card numbers using the Luhn algorithm and detects card type.
 */
export class CreditCardStrategy extends BaseValidationStrategy<string, string> {
  readonly name = 'creditCard';

  constructor(private readonly allowedTypes?: CreditCardType[]) {
    super();
  }

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    // Remove spaces and hyphens
    const normalized = value.replace(/[\s-]/g, '');

    // Check if it's numeric
    if (!/^\d+$/.test(normalized)) {
      return this.failure('business.creditCard.invalid', context);
    }

    // Validate using Luhn algorithm
    if (!this.luhnCheck(normalized)) {
      return this.failure('business.creditCard.luhn', context);
    }

    // Detect card type
    const cardType = this.detectCardType(normalized);

    // Check if card type is allowed
    if (this.allowedTypes && !this.allowedTypes.includes(cardType)) {
      return this.failure('business.creditCard.type', context, {
        cardType,
        allowedTypes: this.allowedTypes,
      });
    }

    return this.success(value, context);
  }

  /**
   * Luhn algorithm implementation
   * @param cardNumber - Card number to validate
   * @returns true if valid
   */
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    // Loop through values from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber.charAt(i), 10);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Detect credit card type
   * @param cardNumber - Card number
   * @returns Card type
   */
  private detectCardType(cardNumber: string): CreditCardType {
    for (const [type, pattern] of Object.entries(CARD_PATTERNS)) {
      if ((type as CreditCardType) !== CreditCardType.UNKNOWN && pattern.test(cardNumber)) {
        return type as CreditCardType;
      }
    }
    return CreditCardType.UNKNOWN;
  }
}
