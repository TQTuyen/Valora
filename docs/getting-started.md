# Getting Started with Valora

This guide will help you get up and running with Valora in minutes.

## Installation

```bash
# Using bun (recommended)
bun add valora

# Using npm
npm install valora

# Using yarn
yarn add valora

# Using pnpm
pnpm add valora
```

## TypeScript Configuration

Valora works best with TypeScript. Ensure your `tsconfig.json` has:

```json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": false
  }
}
```

> **Note:** `emitDecoratorMetadata` is optional. Valora doesn't require it.

## First Steps

Valora offers two APIs: **Decorators** (class-validator style) and **Fluent API** (schema-based). You can use either or both!

### Option 1: Decorators (Recommended for Classes)

Perfect for validating class instances, DTOs, and domain models.

```typescript
import { Validate, IsString, IsEmail, MinLength, IsNumber, Min } from 'valora/decorators';

@Validate()
class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @Min(18)
  age: number;
}

// Usage
try {
  const user = new CreateUserDto({
    name: 'John Doe',
    email: 'john@example.com',
    age: 25
  });
  console.log('Valid user:', user);
} catch (error) {
  console.error('Validation error:', error.message);
}
```

### Option 2: Fluent API (Recommended for Schemas)

Perfect for validating data, API requests, and configuration.

```typescript
import { v, Infer } from 'valora';

// Define schema
const createUserSchema = v.object({
  name: v.string().minLength(2),
  email: v.string().email(),
  age: v.number().min(18),
});

// Infer TypeScript type
type CreateUserDto = Infer<typeof createUserSchema>;

// Usage
const result = createUserSchema.validate({
  name: 'John Doe',
  email: 'john@example.com',
  age: 25
});

if (result.success) {
  console.log('Valid data:', result.data);
  // result.data is fully typed as CreateUserDto
} else {
  console.error('Validation errors:', result.errors);
}
```

## Basic Validation Patterns

### String Validation

```typescript
// Decorators
@IsString()
@MinLength(3)
@MaxLength(50)
@IsEmail()
username: string;

// Fluent API
v.string().minLength(3).maxLength(50).email()
```

### Number Validation

```typescript
// Decorators
@IsNumber()
@Min(0)
@Max(120)
@IsInt()
age: number;

// Fluent API
v.number().min(0).max(120).integer()
```

### Array Validation

```typescript
// Decorators
@IsArray()
@ArrayMinSize(1)
@ArrayMaxSize(10)
tags: string[];

// Fluent API
v.array().minLength(1).maxLength(10)
```

### Optional Fields

```typescript
// Decorators
@IsOptional()
@IsString()
middleName?: string;

// Fluent API
v.string().optional()
```

## Error Handling

### Decorators Approach

```typescript
import { ValoraValidationError } from 'valora/decorators';

try {
  const user = new CreateUserDto(invalidData);
} catch (error) {
  if (error instanceof ValoraValidationError) {
    console.log('Validation failed:');
    error.errors.forEach(err => {
      console.log(`- ${err.path}: ${err.message}`);
    });
  }
}
```

### Fluent API Approach

```typescript
const result = schema.validate(data);

if (!result.success) {
  result.errors.forEach(error => {
    console.log(`Field: ${error.path}`);
    console.log(`Message: ${error.message}`);
    console.log(`Code: ${error.code}`);
  });
}
```

## Validation Without Auto-Throw

Sometimes you want validation without automatic exceptions:

```typescript
import { Validate, validateClassInstance } from 'valora/decorators';

@Validate({ validateOnCreate: false })  // Don't auto-validate
class User {
  @IsString()
  name: string;
}

const user = new User({ name: 123 });  // No error thrown

// Manual validation
const result = validateClassInstance(user);
if (!result.success) {
  console.log('Validation errors:', result.errors);
}
```

## Next Steps

- **Learn Decorators:** Read the [Decorators Guide](./decorators-guide.md)
- **Learn Fluent API:** Read the [Validators Guide](./validators-guide.md)
- **Nested Objects:** Check out [Nested Validation](./nested-validation.md)
- **Advanced Features:** Explore [Advanced Usage](./advanced-usage.md)
- **Real Examples:** Browse [Examples](./examples.md)

## Common Patterns

### API Request Validation

```typescript
import { Validate, IsString, IsEmail } from 'valora/decorators';

@Validate()
class LoginRequest {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// In your API handler
app.post('/login', (req, res) => {
  try {
    const loginData = new LoginRequest(req.body);
    // loginData is validated!
    // ... process login
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

### Configuration Validation

```typescript
import { v } from 'valora';

const configSchema = v.object({
  database: v.object({
    host: v.string().notEmpty(),
    port: v.number().min(1).max(65535),
    name: v.string().notEmpty(),
  }),
  server: v.object({
    port: v.number().min(1024),
    host: v.string().default('localhost'),
  }),
});

const result = configSchema.validate(process.env);
if (!result.success) {
  console.error('Invalid configuration!');
  process.exit(1);
}
```

## Tips & Best Practices

1. **Use Decorators for Classes:** When working with classes, DTOs, and domain models
2. **Use Fluent API for Data:** When validating plain data, API responses, or configs
3. **Combine Both:** You can use both APIs in the same project
4. **Type Safety First:** Always leverage TypeScript's type inference
5. **Explicit Messages:** Provide custom error messages for better UX
6. **Validate Early:** Validate at system boundaries (API, file input, user input)

## Troubleshooting

### "Decorator is not a function"

Make sure `experimentalDecorators: true` is in your `tsconfig.json`.

### "Cannot find module 'valora/decorators'"

Ensure you're using the correct import path and that Valora is installed.

### Type inference not working

Make sure you're using `Infer<typeof schema>` for fluent API schemas.

## Need Help?

- Check the [Examples](./examples.md) for real-world patterns
- Read the [API Reference](./api-reference.md) for detailed docs
- Visit our [GitHub Issues](https://github.com/your-org/valora/issues)
