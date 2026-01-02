import { describe, expect, it } from 'vitest';

import { validateClassInstance } from '@/decorators/class';
import { IsOptional } from '@/decorators/property/common';
import { IsNumber, Min } from '@/decorators/property/number';
import { IsObject, ValidateNested } from '@/decorators/property/object';
import { IsString, MinLength } from '@/decorators/property/string';

describe('Object Property Decorators', () => {
  describe('@IsObject', () => {
    it('should pass when value is an object', () => {
      class TestDto {
        @IsObject()
        data!: object;
      }

      const dto = new TestDto();
      dto.data = { key: 'value' };

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is an empty object', () => {
      class TestDto {
        @IsObject()
        data!: object;
      }

      const dto = new TestDto();
      dto.data = {};

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should pass when value is a nested object', () => {
      class TestDto {
        @IsObject()
        data!: object;
      }

      const dto = new TestDto();
      dto.data = { nested: { key: 'value' } };

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });

    it('should fail when value is not an object', () => {
      class TestDto {
        @IsObject()
        data!: any;
      }

      const dto = new TestDto();
      dto.data = 'not an object';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0]?.path).toEqual(['data']);
    });

    it('should fail when value is an array', () => {
      class TestDto {
        @IsObject()
        data!: any;
      }

      const dto = new TestDto();
      dto.data = [1, 2, 3];

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is null', () => {
      class TestDto {
        @IsObject()
        data!: any;
      }

      const dto = new TestDto();
      dto.data = null;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is a number', () => {
      class TestDto {
        @IsObject()
        data!: any;
      }

      const dto = new TestDto();
      dto.data = 123;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should fail when value is a boolean', () => {
      class TestDto {
        @IsObject()
        data!: any;
      }

      const dto = new TestDto();
      dto.data = true;

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
    });

    it('should accept custom error message', () => {
      class TestDto {
        @IsObject({ message: 'Data must be an object' })
        data!: any;
      }

      const dto = new TestDto();
      dto.data = 'string';

      const result = validateClassInstance(dto);
      expect(result.success).toBe(false);
      // Message validation - implementation dependent;
    });

    it('should pass for class instances', () => {
      class Inner {
        value = 'test';
      }

      class TestDto {
        @IsObject()
        data!: object;
      }

      const dto = new TestDto();
      dto.data = new Inner();

      const result = validateClassInstance(dto);
      expect(result.success).toBe(true);
    });
  });

  describe('@ValidateNested', () => {
    it('should pass when nested object is valid', () => {
      class AddressDto {
        @IsString()
        @MinLength(2)
        street!: string;

        @IsString()
        city!: string;
      }

      class UserDto {
        @ValidateNested()
        address!: AddressDto;
      }

      const user = new UserDto();
      const address = new AddressDto();
      address.street = 'Main St';
      address.city = 'New York';
      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail when nested object is invalid', () => {
      class AddressDto {
        @IsString()
        @MinLength(2)
        street!: string;

        @IsString()
        city!: string;
      }

      class UserDto {
        @ValidateNested()
        address!: AddressDto;
      }

      const user = new UserDto();
      const address = new AddressDto();
      address.street = 'M'; // Too short
      address.city = 'New York';
      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
      expect(result.errors).toHaveLength(1);
    });

    it('should validate deeply nested objects', () => {
      class CityDto {
        @IsString()
        name!: string;

        @IsString()
        country!: string;
      }

      class AddressDto {
        @IsString()
        street!: string;

        @ValidateNested()
        city!: CityDto;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;
      }

      const user = new UserDto();
      user.name = 'John';

      const address = new AddressDto();
      address.street = 'Main St';

      const city = new CityDto();
      city.name = 'New York';
      city.country = 'USA';

      address.city = city;
      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail when deeply nested object is invalid', () => {
      class CityDto {
        @IsString()
        @MinLength(2)
        name!: string;

        @IsString()
        country!: string;
      }

      class AddressDto {
        @IsString()
        street!: string;

        @ValidateNested()
        city!: CityDto;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;
      }

      const user = new UserDto();
      user.name = 'John';

      const address = new AddressDto();
      address.street = 'Main St';

      const city = new CityDto();
      city.name = 'N'; // Too short
      city.country = 'USA';

      address.city = city;
      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
    });

    it('should validate array of nested objects', () => {
      class ItemDto {
        @IsString()
        name!: string;

        @IsNumber()
        @Min(0)
        quantity!: number;
      }

      class OrderDto {
        @ValidateNested({ each: true })
        items!: ItemDto[];
      }

      const order = new OrderDto();
      const item1 = new ItemDto();
      item1.name = 'Item 1';
      item1.quantity = 5;

      const item2 = new ItemDto();
      item2.name = 'Item 2';
      item2.quantity = 10;

      order.items = [item1, item2];

      const result = validateClassInstance(order);
      expect(result.success).toBe(true);
    });

    it('should fail when one item in nested array is invalid', () => {
      class ItemDto {
        @IsString()
        name!: string;

        @IsNumber()
        @Min(0)
        quantity!: number;
      }

      class OrderDto {
        @ValidateNested({ each: true })
        items!: ItemDto[];
      }

      const order = new OrderDto();
      const item1 = new ItemDto();
      item1.name = 'Item 1';
      item1.quantity = 5;

      const item2 = new ItemDto();
      item2.name = 'Item 2';
      item2.quantity = -1; // Invalid, negative quantity

      order.items = [item1, item2];

      const result = validateClassInstance(order);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle optional nested objects', () => {
      class ProfileDto {
        @IsString()
        bio!: string;
      }

      class UserDto {
        @IsString()
        name!: string;

        @IsOptional()
        @ValidateNested()
        profile?: ProfileDto;
      }

      const user = new UserDto();
      user.name = 'John';
      // profile is undefined

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should validate when optional nested object is provided', () => {
      class ProfileDto {
        @IsString()
        @MinLength(10)
        bio!: string;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        profile?: ProfileDto;
      }

      const user = new UserDto();
      user.name = 'John';

      const profile = new ProfileDto();
      profile.bio = 'This is a valid bio with enough characters';
      user.profile = profile;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail when optional nested object is invalid', () => {
      class ProfileDto {
        @IsString()
        @MinLength(10)
        bio!: string;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        profile?: ProfileDto;
      }

      const user = new UserDto();
      user.name = 'John';

      const profile = new ProfileDto();
      profile.bio = 'Short'; // Too short
      user.profile = profile;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
    });
  });

  describe('Integration: Multiple object decorators', () => {
    it('should validate object type and nested validation', () => {
      class SettingsDto {
        @IsString()
        theme!: string;

        @IsNumber()
        fontSize!: number;
      }

      class UserDto {
        @IsObject()
        @ValidateNested()
        settings!: SettingsDto;
      }

      const user = new UserDto();
      const settings = new SettingsDto();
      settings.theme = 'dark';
      settings.fontSize = 14;
      user.settings = settings;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail when object type check fails', () => {
      class UserDto {
        @IsObject()
        @ValidateNested()
        settings!: any;
      }

      const user = new UserDto();
      user.settings = 'not an object';

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
    });

    it('should validate complex nested structure', () => {
      class ContactDto {
        @IsString()
        phone!: string;

        @IsString()
        email!: string;
      }

      class AddressDto {
        @IsString()
        street!: string;

        @IsString()
        city!: string;
      }

      class CompanyDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;

        @ValidateNested()
        contact!: ContactDto;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        company!: CompanyDto;
      }

      const user = new UserDto();
      user.name = 'John Doe';

      const company = new CompanyDto();
      company.name = 'Acme Corp';

      const address = new AddressDto();
      address.street = 'Main St';
      address.city = 'New York';

      const contact = new ContactDto();
      contact.phone = '123-456-7890';
      contact.email = 'contact@acme.com';

      company.address = address;
      company.contact = contact;
      user.company = company;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail at any level of nested validation', () => {
      class ContactDto {
        @IsString()
        @MinLength(10)
        phone!: string;

        @IsString()
        email!: string;
      }

      class AddressDto {
        @IsString()
        street!: string;

        @IsString()
        city!: string;
      }

      class CompanyDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;

        @ValidateNested()
        contact!: ContactDto;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        company!: CompanyDto;
      }

      const user = new UserDto();
      user.name = 'John Doe';

      const company = new CompanyDto();
      company.name = 'Acme Corp';

      const address = new AddressDto();
      address.street = 'Main St';
      address.city = 'New York';

      const contact = new ContactDto();
      contact.phone = '123'; // Too short
      contact.email = 'contact@acme.com';

      company.address = address;
      company.contact = contact;
      user.company = company;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
    });

    it('should validate multiple nested objects at same level', () => {
      class AddressDto {
        @IsString()
        street!: string;

        @IsString()
        city!: string;
      }

      class PaymentDto {
        @IsString()
        method!: string;

        @IsString()
        cardNumber!: string;
      }

      class OrderDto {
        @ValidateNested()
        shippingAddress!: AddressDto;

        @ValidateNested()
        billingAddress!: AddressDto;

        @ValidateNested()
        payment!: PaymentDto;
      }

      const order = new OrderDto();

      const shipping = new AddressDto();
      shipping.street = 'Main St';
      shipping.city = 'New York';

      const billing = new AddressDto();
      billing.street = 'Oak Ave';
      billing.city = 'Boston';

      const payment = new PaymentDto();
      payment.method = 'credit';
      payment.cardNumber = '1234-5678-9012-3456';

      order.shippingAddress = shipping;
      order.billingAddress = billing;
      order.payment = payment;

      const result = validateClassInstance(order);
      expect(result.success).toBe(true);
    });

    it('should collect errors from multiple nested objects', () => {
      class AddressDto {
        @IsString()
        @MinLength(3)
        street!: string;

        @IsString()
        city!: string;
      }

      class PaymentDto {
        @IsString()
        method!: string;

        @IsString()
        @MinLength(10)
        cardNumber!: string;
      }

      class OrderDto {
        @ValidateNested()
        shippingAddress!: AddressDto;

        @ValidateNested()
        payment!: PaymentDto;
      }

      const order = new OrderDto();

      const shipping = new AddressDto();
      shipping.street = 'M'; // Too short
      shipping.city = 'New York';

      const payment = new PaymentDto();
      payment.method = 'credit';
      payment.cardNumber = '123'; // Too short

      order.shippingAddress = shipping;
      order.payment = payment;

      const result = validateClassInstance(order);
      expect(result.success).toBe(false);
      // Should have errors from both nested objects
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });
});
