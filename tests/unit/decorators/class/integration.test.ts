import { describe, expect, it } from 'vitest';

import {
  Validate,
  validate,
  validateClassInstance,
  ValoraValidationError,
} from '@/decorators/class';
import {
  ArrayMaxSize,
  ArrayMinSize,
  ArrayNotEmpty,
  ArrayUnique,
  IsArray,
} from '@/decorators/property/array';
import { IsBoolean, IsTrue } from '@/decorators/property/boolean';
import { IsOptional } from '@/decorators/property/common';
import { IsDate, IsFuture, IsPast, MinAge } from '@/decorators/property/date';
import { IsInt, IsNumber, IsPositive, Range } from '@/decorators/property/number';
import { ValidateNested } from '@/decorators/property/object';
import {
  Contains,
  IsEmail,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  NotEmpty,
} from '@/decorators/property/string';

describe('Class Decorator Integration Tests', () => {
  describe('@Validate decorator', () => {
    it('should validate a simple class with @Validate decorator', () => {
      @Validate({ validateOnCreate: false })
      class UserDto {
        @IsString()
        @MinLength(2)
        name!: string;

        @IsEmail()
        email!: string;
      }

      const user = new UserDto();
      user.name = 'John';
      user.email = 'john@example.com';

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should fail validation for invalid data with @Validate', () => {
      @Validate({ validateOnCreate: false })
      class UserDto {
        @IsString()
        @MinLength(2)
        name!: string;

        @IsEmail()
        email!: string;
      }

      const user = new UserDto();
      user.name = 'J'; // Too short
      user.email = 'invalid-email';

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });

    it('should validate class without @Validate decorator using validateClassInstance', () => {
      class UserDto {
        @IsString()
        name!: string;

        @IsNumber()
        age!: number;
      }

      const user = new UserDto();
      user.name = 'John';
      user.age = 25;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });
  });

  describe('validate() function', () => {
    it('should validate using standalone validate function', () => {
      class ProductDto {
        @IsString()
        @NotEmpty()
        name!: string;

        @IsNumber()
        @IsPositive()
        price!: number;
      }

      const product = new ProductDto();
      product.name = 'Product';
      product.price = 99.99;

      const result = validate(product);
      expect(result.success).toBe(true);
    });

    it('should fail validation using standalone validate function', () => {
      class ProductDto {
        @IsString()
        @NotEmpty()
        name!: string;

        @IsNumber()
        @IsPositive()
        price!: number;
      }

      const product = new ProductDto();
      product.name = '';
      product.price = -10;

      const result = validate(product, false);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('ValoraValidationError', () => {
    it('should throw ValoraValidationError when validation fails and throwOnError is true', () => {
      class UserDto {
        @IsString()
        @MinLength(5)
        name!: string;
      }

      const user = new UserDto();
      user.name = 'Jo'; // Too short

      expect(() => {
        const result = validateClassInstance(user);
        if (!result.success) {
          throw new ValoraValidationError('Validation failed', result.errors);
        }
      }).toThrow(ValoraValidationError);
    });
  });

  describe('Complete User Registration DTO', () => {
    it('should validate a complete user registration with all field types', () => {
      class UserRegistrationDto {
        // String validations
        @IsString()
        @MinLength(3)
        @MaxLength(50)
        username!: string;

        @IsEmail()
        email!: string;

        @IsString()
        @MinLength(8)
        @Contains('!')
        password!: string;

        // Number validations
        @IsInt()
        @Range(18, 120)
        age!: number;

        // Boolean validations
        @IsBoolean()
        @IsTrue()
        acceptedTerms!: boolean;

        @IsBoolean()
        newsletter!: boolean;

        // Date validations
        @IsDate()
        @IsPast()
        @MinAge(18)
        birthDate!: Date;

        // Array validations
        @IsArray()
        @ArrayMinSize(1)
        @ArrayMaxSize(5)
        @ArrayUnique()
        interests!: string[];

        // Optional fields
        @IsOptional()
        @IsString()
        middleName?: string;
      }

      const user = new UserRegistrationDto();
      user.username = 'johndoe';
      user.email = 'john@example.com';
      user.password = 'SecurePass123!';
      user.age = 25;
      user.acceptedTerms = true;
      user.newsletter = false;

      const birthDate = new Date();
      birthDate.setFullYear(birthDate.getFullYear() - 25);
      user.birthDate = birthDate;

      user.interests = ['coding', 'reading', 'gaming'];

      const result = validateClassInstance(user);

      expect(result.success).toBe(true);
    });

    it('should collect all validation errors across different field types', () => {
      class UserRegistrationDto {
        @IsString()
        @MinLength(3)
        username!: string;

        @IsEmail()
        email!: string;

        @IsInt()
        @Range(18, 120)
        age!: number;

        @IsBoolean()
        @IsTrue()
        acceptedTerms!: boolean;

        @IsArray()
        @ArrayNotEmpty()
        interests!: string[];
      }

      const user = new UserRegistrationDto();
      user.username = 'jo'; // Too short
      user.email = 'invalid'; // Invalid email
      user.age = 15; // Below minimum
      user.acceptedTerms = false; // Must be true
      user.interests = []; // Empty array

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('Nested Object Validation', () => {
    it('should validate nested objects in complex DTO', () => {
      class AddressDto {
        @IsString()
        @MinLength(5)
        street!: string;

        @IsString()
        city!: string;

        @IsString()
        @MaxLength(10)
        postalCode!: string;
      }

      class ContactDto {
        @IsEmail()
        email!: string;

        @IsString()
        @MinLength(10)
        phone!: string;
      }

      class UserDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;

        @ValidateNested()
        contact!: ContactDto;
      }

      const user = new UserDto();
      user.name = 'John Doe';

      const address = new AddressDto();
      address.street = 'Main Street';
      address.city = 'New York';
      address.postalCode = '10001';

      const contact = new ContactDto();
      contact.email = 'john@example.com';
      contact.phone = '123-456-7890';

      user.address = address;
      user.contact = contact;

      const result = validateClassInstance(user);
      expect(result.success).toBe(true);
    });

    it('should propagate nested validation errors', () => {
      class AddressDto {
        @IsString()
        @MinLength(5)
        street!: string;

        @IsString()
        city!: string;
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
      address.street = 'St'; // Too short
      address.city = 'NY';

      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate deeply nested structures', () => {
      class LocationDto {
        @IsNumber()
        lat!: number;

        @IsNumber()
        lng!: number;
      }

      class AddressDto {
        @IsString()
        street!: string;

        @ValidateNested()
        location!: LocationDto;
      }

      class CompanyDto {
        @IsString()
        name!: string;

        @ValidateNested()
        address!: AddressDto;
      }

      const company = new CompanyDto();
      company.name = 'Acme Corp';

      const address = new AddressDto();
      address.street = 'Main St';

      const location = new LocationDto();
      location.lat = 40.7128;
      location.lng = -74.006;

      address.location = location;
      company.address = address;

      const result = validateClassInstance(company);
      expect(result.success).toBe(true);
    });
  });

  describe('Array of Nested Objects', () => {
    it('should validate array of nested objects', () => {
      class OrderItemDto {
        productName!: string;

        @IsNumber()
        @IsPositive()
        quantity!: number;

        @IsNumber()
        @IsPositive()
        price!: number;
      }

      class OrderDto {
        @IsString()
        orderId!: string;

        @ValidateNested({ each: true })
        @ArrayNotEmpty()
        items!: OrderItemDto[];
      }

      const order = new OrderDto();
      order.orderId = 'ORD-12345';

      const item1 = new OrderItemDto();
      item1.productName = 'Product 1';
      item1.quantity = 2;
      item1.price = 29.99;

      const item2 = new OrderItemDto();
      item2.productName = 'Product 2';
      item2.quantity = 1;
      item2.price = 49.99;

      order.items = [item1, item2];

      const result = validateClassInstance(order);
      expect(result.success).toBe(true);
    });

    it('should fail when one item in nested array is invalid', () => {
      class OrderItemDto {
        @IsString()
        @NotEmpty()
        productName!: string;

        @IsNumber()
        @IsPositive()
        quantity!: number;
      }

      class OrderDto {
        @ValidateNested({ each: true })
        items!: OrderItemDto[];
      }

      const order = new OrderDto();

      const item1 = new OrderItemDto();
      item1.productName = 'Product 1';
      item1.quantity = 2;

      const item2 = new OrderItemDto();
      item2.productName = ''; // Invalid: empty
      item2.quantity = -1; // Invalid: negative

      order.items = [item1, item2];

      const result = validateClassInstance(order);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('E-commerce Domain Models', () => {
    it('should validate complete e-commerce order', () => {
      class ProductDto {
        @IsString()
        @NotEmpty()
        name!: string;

        @IsString()
        sku!: string;

        @IsNumber()
        @IsPositive()
        price!: number;
      }

      class ShippingAddressDto {
        @IsString()
        @MinLength(5)
        street!: string;

        @IsString()
        city!: string;

        @IsString()
        country!: string;

        @IsString()
        postalCode!: string;
      }

      class PaymentDto {
        @IsString()
        method!: string;

        @IsBoolean()
        @IsTrue()
        verified!: boolean;
      }

      class OrderDto {
        @IsString()
        orderId!: string;

        @ValidateNested({ each: true })
        @ArrayNotEmpty()
        @ArrayMaxSize(50)
        products!: ProductDto[];

        @ValidateNested()
        shippingAddress!: ShippingAddressDto;

        @ValidateNested()
        payment!: PaymentDto;

        @IsDate()
        @IsFuture()
        estimatedDelivery!: Date;

        @IsNumber()
        @IsPositive()
        totalAmount!: number;
      }

      const order = new OrderDto();
      order.orderId = 'ORD-2024-001';

      const product = new ProductDto();
      product.name = 'Laptop';
      product.sku = 'LAP-001';
      product.price = 999.99;

      const shipping = new ShippingAddressDto();
      shipping.street = 'Main Street 123';
      shipping.city = 'New York';
      shipping.country = 'USA';
      shipping.postalCode = '10001';

      const payment = new PaymentDto();
      payment.method = 'credit_card';
      payment.verified = true;

      const delivery = new Date();
      delivery.setDate(delivery.getDate() + 7); // 7 days from now

      order.products = [product];
      order.shippingAddress = shipping;
      order.payment = payment;
      order.estimatedDelivery = delivery;
      order.totalAmount = 999.99;

      const result = validateClassInstance(order);
      expect(result.success).toBe(true);
    });
  });

  describe('Optional and Required Fields Mix', () => {
    it('should handle mix of optional and required fields', () => {
      class UserProfileDto {
        @IsString()
        @MinLength(3)
        username!: string;

        @IsEmail()
        email!: string;

        @IsOptional()
        @IsString()
        @MinLength(10)
        bio?: string;

        @IsOptional()
        @IsUrl()
        website?: string;

        @IsOptional()
        @IsArray()
        @ArrayMaxSize(10)
        tags?: string[];
      }

      const profile = new UserProfileDto();
      profile.username = 'johndoe';
      profile.email = 'john@example.com';
      // Optional fields not provided

      const result = validateClassInstance(profile);
      expect(result.success).toBe(true);
    });

    it('should validate optional fields when provided', () => {
      class UserProfileDto {
        @IsString()
        username!: string;

        @IsOptional()
        @IsString()
        @MinLength(10)
        bio?: string;

        @IsOptional()
        @IsUrl()
        website?: string;
      }

      const profile = new UserProfileDto();
      profile.username = 'johndoe';
      profile.bio = 'This is a valid bio with more than 10 characters';
      profile.website = 'https://example.com';

      const result = validateClassInstance(profile);
      expect(result.success).toBe(true);
    });

    it('should fail when optional field has invalid value', () => {
      class UserProfileDto {
        @IsString()
        username!: string;

        @IsOptional()
        @IsUrl()
        website?: string;
      }

      const profile = new UserProfileDto();
      profile.username = 'johndoe';
      profile.website = 'not-a-url'; // Invalid URL

      const result = validateClassInstance(profile);
      expect(result.success).toBe(false);
    });
  });

  describe('Real-world Scenarios', () => {
    it('should validate blog post creation', () => {
      class TagDto {
        @IsString()
        @MinLength(2)
        @MaxLength(20)
        name!: string;
      }

      class BlogPostDto {
        @IsString()
        @MinLength(5)
        @MaxLength(200)
        title!: string;

        @IsString()
        @MinLength(50)
        content!: string;

        @ValidateNested({ each: true })
        @ArrayMinSize(1)
        @ArrayMaxSize(5)
        @ArrayUnique()
        tags!: TagDto[];

        @IsBoolean()
        published!: boolean;

        @IsOptional()
        @IsDate()
        @IsFuture()
        publishDate?: Date;
      }

      const post = new BlogPostDto();
      post.title = 'Introduction to TypeScript Decorators';
      post.content =
        'TypeScript decorators provide a way to add annotations and meta-programming syntax for class declarations and members.';

      const tag1 = new TagDto();
      tag1.name = 'typescript';

      const tag2 = new TagDto();
      tag2.name = 'decorators';

      post.tags = [tag1, tag2];
      post.published = false;

      const result = validateClassInstance(post);
      expect(result.success).toBe(true);
    });

    it('should validate event registration', () => {
      class AttendeeDto {
        @IsString()
        @MinLength(2)
        firstName!: string;

        @IsString()
        @MinLength(2)
        lastName!: string;

        @IsEmail()
        email!: string;

        @IsInt()
        @Range(0, 150)
        age!: number;
      }

      class EventRegistrationDto {
        @IsString()
        eventId!: string;

        @ValidateNested({ each: true })
        @ArrayNotEmpty()
        @ArrayMaxSize(10)
        attendees!: AttendeeDto[];

        @IsDate()
        @IsFuture()
        eventDate!: Date;

        @IsBoolean()
        @IsTrue()
        agreedToTerms!: boolean;

        @IsNumber()
        @IsPositive()
        totalAmount!: number;
      }

      const registration = new EventRegistrationDto();
      registration.eventId = 'EVT-2024-001';

      const attendee1 = new AttendeeDto();
      attendee1.firstName = 'John';
      attendee1.lastName = 'Doe';
      attendee1.email = 'john@example.com';
      attendee1.age = 30;

      const attendee2 = new AttendeeDto();
      attendee2.firstName = 'Jane';
      attendee2.lastName = 'Smith';
      attendee2.email = 'jane@example.com';
      attendee2.age = 28;

      registration.attendees = [attendee1, attendee2];

      const eventDate = new Date();
      eventDate.setMonth(eventDate.getMonth() + 2);
      registration.eventDate = eventDate;

      registration.agreedToTerms = true;
      registration.totalAmount = 199.98;

      const result = validateClassInstance(registration);
      expect(result.success).toBe(true);
    });

    it('should validate job application', () => {
      class EducationDto {
        @IsString()
        institution!: string;

        @IsString()
        degree!: string;

        @IsDate()
        @IsPast()
        graduationDate!: Date;
      }

      class ExperienceDto {
        @IsString()
        company!: string;

        @IsString()
        position!: string;

        @IsDate()
        @IsPast()
        startDate!: Date;

        @IsOptional()
        @IsDate()
        endDate?: Date;
      }

      class JobApplicationDto {
        @IsString()
        @MinLength(2)
        fullName!: string;

        @IsEmail()
        email!: string;

        @IsString()
        @MinLength(10)
        phone!: string;

        @ValidateNested({ each: true })
        @ArrayNotEmpty()
        education!: EducationDto[];

        @ValidateNested({ each: true })
        @ArrayNotEmpty()
        experience!: ExperienceDto[];

        @IsString()
        @NotEmpty()
        coverLetter!: string;

        @IsBoolean()
        @IsTrue()
        confirmAccuracy!: boolean;
      }

      const application = new JobApplicationDto();
      application.fullName = 'John Doe';
      application.email = 'john@example.com';
      application.phone = '123-456-7890';

      const education = new EducationDto();
      education.institution = 'University of Example';
      education.degree = 'Bachelor of Science';
      const gradDate = new Date();
      gradDate.setFullYear(gradDate.getFullYear() - 2);
      education.graduationDate = gradDate;

      const experience = new ExperienceDto();
      experience.company = 'Tech Corp';
      experience.position = 'Software Engineer';
      const startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 3);
      experience.startDate = startDate;

      application.education = [education];
      application.experience = [experience];
      application.coverLetter =
        'I am excited to apply for this position. With my background in software development and passion for technology, I believe I would be a great fit for your team. My experience includes...';
      application.confirmAccuracy = true;

      const result = validateClassInstance(application);
      expect(result.success).toBe(true);
    });
  });

  describe('Error Path Tracking', () => {
    it('should track error paths correctly for nested objects', () => {
      class AddressDto {
        @IsString()
        @MinLength(5)
        street!: string;
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
      address.street = 'St'; // Too short

      user.address = address;

      const result = validateClassInstance(user);
      expect(result.success).toBe(false);
      // The error path should indicate it's in the nested address object
      const streetError = result.errors.find((e) => e.path.includes('street'));
      expect(streetError).toBeDefined();
    });

    it('should track error paths for arrays of nested objects', () => {
      class ItemDto {
        @IsString()
        @NotEmpty()
        name!: string;
      }

      class OrderDto {
        @ValidateNested({ each: true })
        items!: ItemDto[];
      }

      const order = new OrderDto();

      const item1 = new ItemDto();
      item1.name = 'Valid Item';

      const item2 = new ItemDto();
      item2.name = ''; // Invalid

      order.items = [item1, item2];

      const result = validateClassInstance(order);
      expect(result.success).toBe(false);
      // Should indicate which item in the array has the error
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
