/// <reference types="reflect-metadata" />

import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { validate, getPropertyMetadata } from '@tqtos/valora/decorators';

@Injectable()
export class ValoraValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Convert plain object to class instance, including nested objects
    // This ensures @ValidateNested works correctly
    const object = this.plainToInstance(metatype, value);

    // Validate the instance using Valora
    const result = validate(object);

    if (!result.success) {
      // Format Valora errors for the NestJS response
      const messages = result.errors.map((err) => {
        return {
          ...err,
        };
      });

      throw new BadRequestException({
        message: 'Validation failed',
        errors: messages,
      });
    }

    return value;
  }

  /**
   * Recursively convert plain object to class instance
   * Handles nested objects marked with @ValidateNested
   */
  private plainToInstance(metatype: any, plain: any): any {
    if (plain === null || plain === undefined) {
      return plain;
    }

    // Create instance of the class
    const instance = new metatype();

    // Get metadata for nested validation
    const metadata = getPropertyMetadata(metatype.prototype);

    // Map of property keys to their nested type information
    const nestedMap = new Map(
      metadata
        .filter((m) => m.isNested && m.nestedType)
        .map((m) => [m.propertyKey, { type: m.nestedType, isArray: m.isArray }]),
    );

    // Assign properties with recursive nested instantiation
    for (const [key, val] of Object.entries(plain)) {
      const nestedInfo = nestedMap.get(key);

      if (nestedInfo && val !== null && val !== undefined) {
        const nestedType = nestedInfo.type!();

        if (nestedInfo.isArray && Array.isArray(val)) {
          // Handle array of nested objects
          instance[key] = val.map((item) => this.plainToInstance(nestedType, item));
        } else if (!nestedInfo.isArray) {
          // Handle single nested object
          instance[key] = this.plainToInstance(nestedType, val);
        } else {
          // Fallback for type mismatch
          instance[key] = val;
        }
      } else {
        // Simple assignment for non-nested properties
        instance[key] = val;
      }
    }

    return instance;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
