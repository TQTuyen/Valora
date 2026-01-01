# Decorators Guide

Complete reference for Valora's class-validator style decorators.

## Table of Contents

- [Overview](#overview)
- [Class Decorators](#class-decorators)
- [Common Decorators](#common-decorators)
- [String Decorators](#string-decorators)
- [Number Decorators](#number-decorators)
- [Boolean Decorators](#boolean-decorators)
- [Date Decorators](#date-decorators)
- [Array Decorators](#array-decorators)
- [Object Decorators](#object-decorators)
- [Decorator Chaining](#decorator-chaining)
- [Custom Error Messages](#custom-error-messages)

## Overview

Valora's decorator system provides a clean, declarative way to add validation to your classes.

```typescript
import { Validate, IsString, IsEmail } from '@tqtos/valora/decorators';

@Validate()
class User {
  @IsString()
  name: string;

  @IsEmail()
  email: string;
}
```

## Class Decorators

### `@Validate(options?)`

Marks a class for validation. Must be applied to use property decorators.

**Options:**

- `validateOnCreate` (boolean, default: `true`) - Auto-validate on instantiation
- `throwOnError` (boolean, default: `true`) - Throw error on validation failure

```typescript
// Auto-validate with error throwing
@Validate()
class User {
  @IsString()
  name: string;
}

// Validate but don't throw
@Validate({ throwOnError: false })
class OptionalUser {
  @IsString()
  name: string;
}

// Don't auto-validate
@Validate({ validateOnCreate: false })
class ManualUser {
  @IsString()
  name: string;
}
```

**Manual Validation:**

```typescript
import { validateClassInstance } from '@tqtos/valora/decorators';

const user = new ManualUser({ name: 'John' });
const result = validateClassInstance(user);

if (result.success) {
  console.log('Valid:', result.data);
} else {
  console.log('Errors:', result.errors);
}
```

## Common Decorators

### `@IsOptional()`

Marks a property as optional (allows `undefined`).

```typescript
@Validate()
class User {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  middleName?: string; // Can be undefined
}
```

### `@IsRequired()`

Explicitly marks a property as required (rejects `null` and `undefined`).

```typescript
@Validate()
class User {
  @IsRequired()
  @IsString()
  name: string; // Must be present
}
```

## String Decorators

### Type Validators

#### `@IsString()`

Validates that value is a string.

```typescript
@IsString()
name: string;
```

#### `@IsEmail()`

Validates email format.

```typescript
@IsEmail()
email: string;
```

#### `@IsUrl()`

Validates URL format.

```typescript
@IsUrl()
website: string;
```

#### `@IsUuid()`

Validates UUID v4 format.

```typescript
@IsUuid()
id: string;
```

### Length Validators

#### `@MinLength(min: number)`

Validates minimum string length.

```typescript
@IsString()
@MinLength(2)
name: string;
```

#### `@MaxLength(max: number)`

Validates maximum string length.

```typescript
@IsString()
@MaxLength(100)
bio: string;
```

#### `@Length(exact: number)`

Validates exact string length.

```typescript
@IsString()
@Length(6)
verificationCode: string;
```

### Pattern Validators

#### `@Matches(pattern: RegExp, message?: string)`

Validates against regex pattern.

```typescript
@IsString()
@Matches(/^[a-z0-9_]+$/, 'Username must be lowercase alphanumeric')
username: string;
```

#### `@StartsWith(prefix: string)`

Validates string starts with prefix.

```typescript
@IsString()
@StartsWith('https://')
secureUrl: string;
```

#### `@EndsWith(suffix: string)`

Validates string ends with suffix.

```typescript
@IsString()
@EndsWith('.pdf')
filename: string;
```

#### `@Contains(substring: string)`

Validates string contains substring.

```typescript
@IsString()
@Contains('@')
email: string;
```

### Character Set Validators

#### `@IsAlpha()`

Validates only letters (a-z, A-Z).

```typescript
@IsString()
@IsAlpha()
firstName: string;
```

#### `@IsAlphanumeric()`

Validates only letters and numbers.

```typescript
@IsString()
@IsAlphanumeric()
username: string;
```

#### `@IsNumeric()`

Validates only numeric characters.

```typescript
@IsString()
@IsNumeric()
orderNumber: string;
```

### Case Validators

#### `@IsLowercase()`

Validates all lowercase.

```typescript
@IsString()
@IsLowercase()
username: string;
```

#### `@IsUppercase()`

Validates all uppercase.

```typescript
@IsString()
@IsUppercase()
countryCode: string;
```

### Empty Validators

#### `@NotEmpty()`

Validates string is not empty or whitespace.

```typescript
@IsString()
@NotEmpty()
title: string;
```

## Number Decorators

### Type Validators

#### `@IsNumber()`

Validates that value is a number.

```typescript
@IsNumber()
age: number;
```

#### `@IsInt()`

Validates that number is an integer.

```typescript
@IsNumber()
@IsInt()
count: number;
```

#### `@IsFinite()`

Validates that number is finite (not Infinity or -Infinity).

```typescript
@IsNumber()
@IsFinite()
result: number;
```

#### `@IsSafeInt()`

Validates safe integer (between MIN_SAFE_INTEGER and MAX_SAFE_INTEGER).

```typescript
@IsNumber()
@IsSafeInt()
timestamp: number;
```

### Range Validators

#### `@Min(min: number)`

Validates minimum value (inclusive).

```typescript
@IsNumber()
@Min(0)
age: number;
```

#### `@Max(max: number)`

Validates maximum value (inclusive).

```typescript
@IsNumber()
@Max(150)
age: number;
```

#### `@Range(min: number, max: number)`

Validates value is within range (inclusive).

```typescript
@IsNumber()
@Range(0, 100)
percentage: number;
```

### Sign Validators

#### `@IsPositive()`

Validates number is positive (> 0).

```typescript
@IsNumber()
@IsPositive()
price: number;
```

#### `@IsNegative()`

Validates number is negative (< 0).

```typescript
@IsNumber()
@IsNegative()
debt: number;
```

### Divisibility Validators

#### `@IsMultipleOf(factor: number)`

Validates number is divisible by factor.

```typescript
@IsNumber()
@IsMultipleOf(5)
spacing: number;  // Must be divisible by 5
```

## Boolean Decorators

### `@IsBoolean()`

Validates that value is a boolean.

```typescript
@IsBoolean()
isActive: boolean;
```

### `@IsTrue()`

Validates that value is `true`.

```typescript
@IsBoolean()
@IsTrue()
termsAccepted: boolean;
```

### `@IsFalse()`

Validates that value is `false`.

```typescript
@IsBoolean()
@IsFalse()
disabled: boolean;
```

## Date Decorators

### Type Validator

#### `@IsDate()`

Validates that value is a Date.

```typescript
@IsDate()
createdAt: Date;
```

### Range Validators

#### `@MinDate(minDate: Date | string)`

Validates minimum date (inclusive).

```typescript
@IsDate()
@MinDate(new Date('2024-01-01'))
startDate: Date;
```

#### `@MaxDate(maxDate: Date | string)`

Validates maximum date (inclusive).

```typescript
@IsDate()
@MaxDate(new Date('2025-12-31'))
endDate: Date;
```

### Temporal Validators

#### `@IsPast()`

Validates date is in the past.

```typescript
@IsDate()
@IsPast()
birthDate: Date;
```

#### `@IsFuture()`

Validates date is in the future.

```typescript
@IsDate()
@IsFuture()
expiryDate: Date;
```

#### `@IsToday()`

Validates date is today.

```typescript
@IsDate()
@IsToday()
checkInDate: Date;
```

### Comparison Validators

#### `@IsBefore(date: Date | string)`

Validates date is before given date (exclusive).

```typescript
@IsDate()
@IsBefore(new Date('2025-12-31'))
deadline: Date;
```

#### `@IsAfter(date: Date | string)`

Validates date is after given date (exclusive).

```typescript
@IsDate()
@IsAfter(new Date('2024-01-01'))
startDate: Date;
```

### Day of Week Validators

#### `@IsWeekday()`

Validates date is Monday-Friday.

```typescript
@IsDate()
@IsWeekday()
workDate: Date;
```

#### `@IsWeekend()`

Validates date is Saturday-Sunday.

```typescript
@IsDate()
@IsWeekend()
partyDate: Date;
```

### Age Validators

#### `@MinAge(years: number)`

Validates minimum age in years (for birthdates).

```typescript
@IsDate()
@MinAge(18)
birthDate: Date;
```

#### `@MaxAge(years: number)`

Validates maximum age in years.

```typescript
@IsDate()
@MaxAge(120)
birthDate: Date;
```

## Array Decorators

### Type Validator

#### `@IsArray()`

Validates that value is an array.

```typescript
@IsArray()
tags: string[];
```

### Length Validators

#### `@ArrayMinSize(min: number)`

Validates minimum array length.

```typescript
@IsArray()
@ArrayMinSize(1)
tags: string[];
```

#### `@ArrayMaxSize(max: number)`

Validates maximum array length.

```typescript
@IsArray()
@ArrayMaxSize(10)
tags: string[];
```

#### `@ArrayLength(length: number)`

Validates exact array length.

```typescript
@IsArray()
@ArrayLength(2)
coordinates: number[];  // [x, y]
```

### Content Validators

#### `@ArrayNotEmpty()`

Validates array is not empty.

```typescript
@IsArray()
@ArrayNotEmpty()
items: string[];
```

#### `@ArrayUnique()`

Validates all array items are unique.

```typescript
@IsArray()
@ArrayUnique()
emails: string[];
```

#### `@ArrayContains(value: T)`

Validates array contains specific value.

```typescript
@IsArray()
@ArrayContains('production')
environments: string[];
```

## Object Decorators

### `@IsObject()`

Validates that value is an object.

```typescript
@IsObject()
metadata: Record<string, unknown>;
```

### `@ValidateNested(options?)`

Enables nested validation. The nested class must have its own decorators.

**Options:**

- `each` (boolean, default: `false`) - If true, validates each item in an array

```typescript
@Validate()
class Address {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

@Validate()
class User {
  @IsString()
  name: string;

  @ValidateNested()
  address: Address;

  @ValidateNested({ each: true })
  previousAddresses: Address[];
}
```

## Decorator Chaining

Multiple decorators on one property are combined with **AND** logic:

```typescript
@Validate()
class Product {
  @IsString() // Must be string
  @MinLength(3) // AND minimum 3 characters
  @MaxLength(100) // AND maximum 100 characters
  @NotEmpty() // AND not empty
  name: string;

  @IsNumber() // Must be number
  @IsPositive() // AND positive
  @Min(0.01) // AND at least 0.01
  @Max(999999.99) // AND at most 999999.99
  price: number;
}
```

## Custom Error Messages

Most decorators accept custom error messages:

```typescript
@Validate()
class User {
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;

  @IsEmail({ message: 'Please provide a valid email address' })
  email: string;

  @Min(18, { message: 'You must be at least 18 years old' })
  age: number;
}
```

## Best Practices

1. **Always use `@Validate()` on the class** - Required for decorators to work
2. **Order decorators logically** - Type validators first, then constraints
3. **Combine with `@IsOptional()`** - For optional fields
4. **Use `@ValidateNested()` for complex objects** - Enable deep validation
5. **Provide custom messages** - Better user experience
6. **Keep validation logic simple** - Complex logic belongs in business layer

## Next Steps

- Learn about [Nested Validation](./nested-validation.md)
- Explore [Advanced Usage](./advanced-usage.md)
- See [Examples](./examples.md) for real-world patterns
- Check [API Reference](./api-reference.md) for complete details
