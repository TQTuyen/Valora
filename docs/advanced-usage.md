# Advanced Usage

Advanced patterns, customization, and integration techniques for Valora.

## Table of Contents

- [Custom Validators](#custom-validators)
- [Error Handling](#error-handling)
- [Internationalization (i18n)](#internationalization-i18n)
- [Async Validation](#async-validation)
- [Transformations & Coercion](#transformations--coercion)
- [Cross-Field Validation](#cross-field-validation)
- [Performance Optimization](#performance-optimization)
- [Testing Validators](#testing-validators)
- [Integration Patterns](#integration-patterns)

## Custom Validators

### Custom Decorator

Create reusable custom decorators for domain-specific validation:

```typescript
import { createPropertyDecorator } from '@tqtos/valora/decorators';
import { CustomStrategy } from '@tqtos/valora';

// Custom validator function
function isDivisibleBy(divisor: number): IValidator {
  return {
    validate: (value: unknown, context: ValidationContext) => {
      if (typeof value !== 'number' || value % divisor !== 0) {
        return {
          success: false,
          errors: [
            {
              path: context.path.join('.'),
              message: `Must be divisible by ${divisor}`,
              code: 'custom.divisibleBy',
              value,
            },
          ],
        };
      }
      return { success: true, data: value };
    },
  };
}

// Create decorator
export function IsDivisibleBy(divisor: number): PropertyDecorator {
  return createPropertyDecorator((div: number) => isDivisibleBy(div))(divisor);
}

// Usage
@Validate()
class Product {
  @IsNumber()
  @IsDivisibleBy(10)
  price: number; // Must be divisible by 10
}
```

### Custom Fluent Validator

Extend BaseValidator for custom fluent validators:

```typescript
import { BaseValidator } from '@tqtos/valora';
import type { ValidationContext, ValidationResult } from '@tqtos/valora/types';

class IPAddressValidator extends BaseValidator<unknown, string> {
  readonly _type = 'ipaddress';

  protected clone(): IPAddressValidator {
    const cloned = new IPAddressValidator();
    cloned.strategies = [...this.strategies];
    cloned.isRequired = this.isRequired;
    return cloned;
  }

  protected checkType(value: unknown, context: ValidationContext): ValidationResult<string> {
    if (typeof value !== 'string') {
      return this.fail('ipaddress.type', context);
    }
    return this.succeed(value, context);
  }

  v4(): this {
    return this.addStrategy(new IPv4Strategy());
  }

  v6(): this {
    return this.addStrategy(new IPv6Strategy());
  }
}

// Custom strategy
class IPv4Strategy extends BaseValidationStrategy<string, string> {
  readonly name = 'ipv4';

  validate(value: string, context: ValidationContext): ValidationResult<string> {
    const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipv4Regex.test(value)) {
      return this.failure(createError('ipaddress.v4', 'Invalid IPv4 address', context.path));
    }

    const parts = value.split('.').map(Number);
    if (parts.some((part) => part > 255)) {
      return this.failure(createError('ipaddress.v4', 'IPv4 octets must be 0-255', context.path));
    }

    return this.success(value, context);
  }
}

// Factory function
export function ipAddress(): IPAddressValidator {
  return new IPAddressValidator();
}

// Usage
const schema = v.object({
  serverIP: ipAddress().v4(),
});
```

### Custom Validation Logic

Use the custom() method for inline validation:

```typescript
import { v } from '@tqtos/valora';

const passwordSchema = v
  .string()
  .minLength(8)
  .custom((value) => {
    // Custom logic
    const hasUpper = /[A-Z]/.test(value);
    const hasLower = /[a-z]/.test(value);
    const hasDigit = /\d/.test(value);
    return hasUpper && hasLower && hasDigit;
  }, 'Password must contain uppercase, lowercase, and number');
```

## Error Handling

### Structured Error Handling

```typescript
import { ValoraValidationError } from '@tqtos/valora/decorators';

try {
  const user = new CreateUserDto(req.body);
} catch (error) {
  if (error instanceof ValoraValidationError) {
    // Group errors by field
    const errorsByField = error.errors.reduce(
      (acc, err) => {
        const field = err.path || 'root';
        if (!acc[field]) acc[field] = [];
        acc[field].push(err.message);
        return acc;
      },
      {} as Record<string, string[]>,
    );

    return res.status(400).json({
      error: 'Validation failed',
      fields: errorsByField,
    });
  }

  // Other errors
  return res.status(500).json({ error: 'Internal server error' });
}
```

### Custom Error Formatting

```typescript
function formatValidationErrors(errors: ValidationError[]): string[] {
  return errors.map((error) => {
    // Customize error messages
    if (error.code === 'string.email') {
      return `The email address "${error.value}" is not valid`;
    }
    if (error.code === 'number.min') {
      return `${error.path} must be at least ${error.context?.min}`;
    }
    return error.message;
  });
}
```

### Error Aggregation

```typescript
const result = schema.validate(data);

if (!result.success) {
  // Get all error paths
  const errorPaths = result.errors.map((e) => e.path);

  // Get errors for specific field
  const emailErrors = result.errors.filter((e) => e.path === 'email');

  // Count errors
  const errorCount = result.errors.length;

  // Get unique error codes
  const errorCodes = [...new Set(result.errors.map((e) => e.code))];
}
```

## Internationalization (i18n)

### Built-in Locales

Valora comes with English (en) and Vietnamese (vi) locales:

```typescript
import { I18nPlugin } from '@tqtos/valora/plugins';

const i18n = new I18nPlugin({ defaultLocale: 'en' });

// English
i18n.t('string.minLength', { min: 5 });
// "Must be at least 5 characters"

// Switch to Vietnamese
i18n.setLocale('vi');
i18n.t('string.minLength', { min: 5 });
// "Phải có ít nhất 5 ký tự"
```

### Custom Locale

Add your own locale:

```typescript
const i18n = new I18nPlugin({ defaultLocale: 'en' });

// Load French locale
i18n.loadLocale('fr', {
  string: {
    required: 'Ce champ est obligatoire',
    minLength: 'Doit contenir au moins {min} caractères',
    email: 'Adresse email invalide',
  },
  number: {
    min: 'Doit être au moins {min}',
    max: 'Ne peut pas dépasser {max}',
  },
});

i18n.setLocale('fr');
```

### Custom Error Messages with i18n

```typescript
import { globalI18n } from '@tqtos/valora/plugins';

// Set global locale
globalI18n.setLocale('vi');

// Validators will use the current locale
@Validate()
class User {
  @IsString()
  @MinLength(2) // Error message will be in Vietnamese
  name: string;
}
```

### Namespaced Translation

```typescript
const i18n = new I18nPlugin();

// Create namespace function
const ts = i18n.namespace('string');

// Use without prefix
ts('minLength', { min: 5 }); // string.minLength
ts('email'); // string.email
```

### Custom Interpolation

```typescript
i18n.loadLocale('en', {
  custom: {
    between: 'Value must be between {min} and {max}',
    arrayLength: 'Array must contain exactly {count} item(s)',
  },
});

i18n.t('custom.between', { min: 10, max: 100 });
// "Value must be between 10 and 100"
```

## Async Validation

### Async Validators

Create validators that perform async operations:

```typescript
import { AsyncValidator } from '@tqtos/valora/validators';

// Check if email exists in database
const emailExistsValidator = new AsyncValidator(async (email: string) => {
  const exists = await db.users.findOne({ email });
  if (exists) {
    throw new Error('Email already registered');
  }
  return email;
});

// Usage
const result = await emailExistsValidator.validate('user@example.com');
```

### Debounced Validation

Useful for real-time form validation:

```typescript
import { debounce } from '@tqtos/valora/validators/async';

const usernameValidator = v
  .string()
  .minLength(3)
  .async(async (username) => {
    // This will be debounced
    const available = await api.checkUsername(username);
    if (!available) {
      throw new Error('Username taken');
    }
    return username;
  });

// Apply debounce
const debouncedValidator = debounce(usernameValidator, 500);
```

### Timeout for Async Validation

```typescript
import { timeout } from '@tqtos/valora/validators/async';

const apiValidator = timeout(
  async (value) => {
    const result = await fetch(`/api/validate?value=${value}`);
    return result.json();
  },
  3000, // 3 second timeout
);
```

### Retry on Failure

```typescript
import { retry } from '@tqtos/valora/validators/async';

const unreliableValidator = retry(
  async (value) => {
    const result = await flaky API.call(value);
    return result;
  },
  {
    attempts: 3,
    delay: 1000,
  }
);
```

## Transformations & Coercion

### Data Transformation

Transform values during validation:

```typescript
const schema = v.object({
  email: v.string().trim().toLowerCase().email(),
  price: v.number().transform((n) => Math.round(n * 100) / 100), // Round to 2 decimals
  tags: v.array().transform((arr) => [...new Set(arr)]), // Remove duplicates
});

const result = schema.validate({
  email: '  USER@EXAMPLE.COM  ',
  price: 19.999,
  tags: ['a', 'b', 'a', 'c'],
});

// result.data:
// {
//   email: 'user@example.com',
//   price: 20.00,
//   tags: ['a', 'b', 'c']
// }
```

### Type Coercion

Convert types automatically:

```typescript
import { coerce } from '@tqtos/valora';

// String to number
const ageSchema = coerce.number().min(0);
ageSchema.validate('25'); // ✅ → 25

// String to boolean
const activeSchema = coerce.boolean();
activeSchema.validate('true'); // ✅ → true
activeSchema.validate('false'); // ✅ → false
activeSchema.validate('1'); // ✅ → true
activeSchema.validate('0'); // ✅ → false

// String to date
const dateSchema = coerce.date();
dateSchema.validate('2024-01-01'); // ✅ → Date object
```

### Preprocessing

Transform before validation:

```typescript
const schema = v
  .string()
  .preprocess((value) => {
    // Normalize phone number
    if (typeof value === 'string') {
      return value.replace(/\D/g, ''); // Remove non-digits
    }
    return value;
  })
  .matches(/^\d{10}$/);

schema.validate('(555) 123-4567'); // ✅ → '5551234567'
```

## Cross-Field Validation

### Compare Fields

```typescript
const schema = v
  .object({
    password: v.string().minLength(8),
    confirmPassword: v.string(),
  })
  .custom((data) => data.password === data.confirmPassword, 'Passwords must match');
```

### Conditional Validation

```typescript
const orderSchema = v
  .object({
    type: v.string().oneOf(['pickup', 'delivery']),
    address: v.string().optional(),
  })
  .custom((data) => {
    if (data.type === 'delivery' && !data.address) {
      throw new Error('Address required for delivery orders');
    }
    return true;
  }, 'Invalid order data');
```

### Dependent Fields

```typescript
import { ifThenElse } from '@tqtos/valora';

const schema = v.object({
  hasDiscount: v.boolean(),
  discountCode: ifThenElse(
    (data) => data.hasDiscount,
    v.string().required(), // If hasDiscount is true
    v.string().optional(), // Otherwise
  ),
});
```

## Performance Optimization

### Lazy Validation

Defer validation until needed:

```typescript
import { Validate, validateClassInstance } from '@tqtos/valora/decorators';

@Validate({ validateOnCreate: false }) // Don't validate on construction
class HeavyData {
  @ValidateNested({ each: true })
  items: Item[]; // Large array
}

// Create without validation
const data = new HeavyData(rawData);

// Validate when ready
const result = validateClassInstance(data);
```

### Caching Results

Cache validation results for repeated checks:

```typescript
const cache = new Map();

function cachedValidate<T>(
  schema: IValidator<unknown, T>,
  key: string,
  data: unknown,
): ValidationResult<T> {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const result = schema.validate(data);
  cache.set(key, result);
  return result;
}
```

### Partial Validation

Validate only changed fields:

```typescript
const updateSchema = v
  .object({
    name: v.string().optional(),
    email: v.string().email().optional(),
    age: v.number().min(0).optional(),
  })
  .partial();

// Only validate provided fields
updateSchema.validate({ email: 'new@example.com' });
```

## Testing Validators

### Unit Testing Decorators

```typescript
import { describe, it, expect } from 'vitest';
import { Validate, IsString, MinLength } from '@tqtos/valora/decorators';

describe('User validation', () => {
  @Validate({ throwOnError: false })
  class User {
    @IsString()
    @MinLength(2)
    name: string;
  }

  it('should validate valid user', () => {
    const user = new User({ name: 'John' });
    expect(user.name).toBe('John');
  });

  it('should reject short name', () => {
    expect(() => new User({ name: 'J' })).toThrow();
  });
});
```

### Unit Testing Schemas

```typescript
import { v } from '@tqtos/valora';

describe('Email schema', () => {
  const emailSchema = v.string().email();

  it('should accept valid email', () => {
    const result = emailSchema.validate('user@example.com');
    expect(result.success).toBe(true);
  });

  it('should reject invalid email', () => {
    const result = emailSchema.validate('not-an-email');
    expect(result.success).toBe(false);
    expect(result.errors[0].code).toBe('string.email');
  });
});
```

### Integration Testing

```typescript
import request from 'supertest';
import { app } from './app';

describe('POST /api/users', () => {
  it('should create user with valid data', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    });

    expect(response.status).toBe(201);
  });

  it('should reject invalid email', async () => {
    const response = await request(app).post('/api/users').send({
      name: 'John Doe',
      email: 'invalid-email',
      age: 25,
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('email');
  });
});
```

## Integration Patterns

### Express Middleware

```typescript
import { ValoraValidationError } from '@tqtos/valora/decorators';

function validateBody<T>(DtoClass: new (data: unknown) => T) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = new DtoClass(req.body);
      next();
    } catch (error) {
      if (error instanceof ValoraValidationError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors,
        });
      }
      next(error);
    }
  };
}

// Usage
app.post('/users', validateBody(CreateUserDto), (req, res) => {
  // req.body is validated and typed!
  const user = await userService.create(req.body);
  res.json(user);
});
```

### GraphQL Resolvers

```typescript
const resolvers = {
  Mutation: {
    createUser: async (_, { input }) => {
      const validated = new CreateUserInput(input);
      return await createUser(validated);
    },
  },
};
```

### React Hook Form

```typescript
import { useForm } from 'react-hook-form';
import { v } from '@tqtos/valora';

const schema = v.object({
  email: v.string().email(),
  password: v.string().minLength(8),
});

function LoginForm() {
  const { register, handleSubmit, setError } = useForm();

  const onSubmit = (data: unknown) => {
    const result = schema.validate(data);

    if (!result.success) {
      result.errors.forEach(error => {
        setError(error.path as any, {
          message: error.message,
        });
      });
      return;
    }

    // Submit result.data
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* form fields */}
    </form>
  );
}
```

### TypeORM Entity Validation

```typescript
import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Validate, IsString, IsEmail, validateClassInstance } from '@tqtos/valora/decorators';

@Entity()
@Validate({ validateOnCreate: false })
export class User {
  @Column()
  @IsString()
  @MinLength(2)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const result = validateClassInstance(this);
    if (!result.success) {
      throw new Error('Validation failed');
    }
  }
}
```

## Next Steps

- Review [Examples](./examples.md) for real-world use cases
- Check [API Reference](./api-reference.md) for complete API documentation
- Read [Migration Guide](./migration-guide.md) if upgrading
