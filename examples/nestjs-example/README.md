# NestJS + Valora Example

This example demonstrates comprehensive **Valora** integration with **NestJS**, showcasing advanced validation features including **nested objects**, **arrays**, **dates**, and **custom validators** through a single, focused endpoint.

## 🎯 Features Demonstrated

### Core Validation
- ✅ **Basic Validators**: String, Number, Boolean, Date
- ✅ **Range Validators**: Min, Max, MinLength, MaxLength
- ✅ **String Patterns**: Email, URL, Contains, Matches (regex)
- ✅ **Array Validation**: ArrayMinSize, ArrayMaxSize, item validation
- ✅ **Date Validation**: MinAge, MaxAge based on birth date
- ✅ **Nested Object Validation**: @ValidateNested for complex objects
- ✅ **Optional Fields**: @IsOptional for partial data
- ✅ **Custom Error Messages**: Field-level error message customization

### Advanced Features
- 🔄 **Nested Validation**: Address and SocialLinks DTOs with full validation
- 📊 **Array of Strings**: Validate each item with min/max size constraints
- 📅 **Date Range Checks**: Age validation (18-120 years) based on birth date
- 🔗 **URL Validation**: Validate URLs with HTTPS requirements
- 🎨 **Multiple DTOs**: Modular DTO structure with nested validation

## 📁 Project Structure

```
src/
├── dtos/
│   ├── create-user.dto.ts      # Main DTO with all validators
│   ├── address.dto.ts          # Nested address validation
│   ├── social-links.dto.ts     # Optional nested social links
│   └── index.ts                # DTO exports
├── pipes/
│   └── valora-validation.pipe.ts  # Custom NestJS validation pipe
├── users.controller.ts         # Single endpoint showcasing all features
├── app.module.ts               # Application module
└── main.ts                     # Application entry point
```

## 🚀 Setup

### 1. Install Dependencies

From the **root directory**:

```bash
npm install
# or
bun install
```

### 2. Navigate to Example

```bash
cd examples/nestjs-example
```

### 3. Run the Application

```bash
npm run start
# or for development with auto-reload
npm run start:dev
```

The server will start on `http://localhost:3000`.

## 🧪 Testing the API

### Endpoint: POST /users

This single endpoint demonstrates all Valora validation features through various test scenarios.

---

### ✅ Scenario 1: Valid Request - All Fields

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "birthDate": "1995-06-15T00:00:00.000Z",
    "tags": ["developer", "nodejs", "typescript"],
    "hobbies": ["reading", "gaming", "hiking"],
    "address": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "California",
      "zipCode": "94102",
      "country": "USA"
    },
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "portfolio": "https://johndoe.dev"
    },
    "bio": "Full-stack developer passionate about TypeScript and Node.js",
    "avatarUrl": "https://example.com/avatar.jpg",
    "username": "johndoe123",
    "expectedSalary": 120000
  }'
```

**Response (201 Created):**

```json
{
  "message": "User created successfully",
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "age": 28,
    "birthDate": "1995-06-15T00:00:00.000Z",
    "tags": ["developer", "nodejs", "typescript"],
    "hobbies": ["reading", "gaming", "hiking"],
    "address": {
      "street": "123 Main Street",
      "city": "San Francisco",
      "state": "California",
      "zipCode": "94102",
      "country": "USA"
    },
    "socialLinks": {
      "github": "https://github.com/johndoe",
      "linkedin": "https://linkedin.com/in/johndoe",
      "portfolio": "https://johndoe.dev"
    },
    "bio": "Full-stack developer passionate about TypeScript and Node.js",
    "avatarUrl": "https://example.com/avatar.jpg",
    "username": "johndoe123",
    "expectedSalary": 120000
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

### ✅ Scenario 2: Valid Request - Required Fields Only

Shows that optional fields can be omitted.

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "birthDate": "1998-03-20T00:00:00.000Z",
    "tags": ["designer"],
    "address": {
      "street": "456 Oak Avenue",
      "city": "Austin",
      "state": "Texas",
      "zipCode": "78701",
      "country": "USA"
    }
  }'
```

**Response (201 Created):**

```json
{
  "message": "User created successfully",
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "age": 25,
    "birthDate": "1998-03-20T00:00:00.000Z",
    "tags": ["designer"],
    "address": {
      "street": "456 Oak Avenue",
      "city": "Austin",
      "state": "Texas",
      "zipCode": "78701",
      "country": "USA"
    }
  },
  "timestamp": "2024-01-15T10:32:00.000Z"
}
```

---

### ❌ Scenario 3: Invalid Request - Multiple Validation Errors

Demonstrates comprehensive error reporting with nested field paths.

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jo",
    "email": "invalid-email",
    "age": 16,
    "birthDate": "2010-01-01T00:00:00.000Z",
    "tags": [],
    "hobbies": ["a"],
    "address": {
      "street": "123",
      "city": "SF",
      "state": "CA",
      "zipCode": "invalid",
      "country": "US"
    },
    "socialLinks": {
      "github": "not-a-url",
      "linkedin": "also-not-a-url"
    },
    "avatarUrl": "http://example.com/avatar.jpg",
    "username": "joe",
    "expectedSalary": 500
  }'
```

**Response (400 Bad Request):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "name",
      "message": "Name must be at least 3 characters long",
      "code": "string.minLength",
      "path": ["name"]
    },
    {
      "field": "email",
      "message": "Please provide a valid email address",
      "code": "string.email",
      "path": ["email"]
    },
    {
      "field": "age",
      "message": "You must be at least 18 years old",
      "code": "number.min",
      "path": ["age"]
    },
    {
      "field": "birthDate",
      "message": "You must be at least 18 years old based on birth date",
      "code": "date.minAge",
      "path": ["birthDate"]
    },
    {
      "field": "tags",
      "message": "At least 1 tag is required",
      "code": "array.minSize",
      "path": ["tags"]
    },
    {
      "field": "hobbies[0]",
      "message": "Each hobby must be at least 2 characters",
      "code": "string.minLength",
      "path": ["hobbies", 0]
    },
    {
      "field": "address.street",
      "message": "Street must be at least 5 characters",
      "code": "string.minLength",
      "path": ["address", "street"]
    },
    {
      "field": "address.zipCode",
      "message": "Invalid ZIP code format (e.g., 12345 or 12345-6789)",
      "code": "string.pattern",
      "path": ["address", "zipCode"]
    },
    {
      "field": "socialLinks.github",
      "message": "GitHub must be a valid URL",
      "code": "string.url",
      "path": ["socialLinks", "github"]
    },
    {
      "field": "socialLinks.linkedin",
      "message": "LinkedIn must be a valid URL",
      "code": "string.url",
      "path": ["socialLinks", "linkedin"]
    },
    {
      "field": "avatarUrl",
      "message": "Avatar URL must use HTTPS protocol",
      "code": "string.contains",
      "path": ["avatarUrl"]
    },
    {
      "field": "username",
      "message": "Username must be at least 8 characters",
      "code": "string.minLength",
      "path": ["username"]
    },
    {
      "field": "expectedSalary",
      "message": "Salary must be at least 1000",
      "code": "number.min",
      "path": ["expectedSalary"]
    }
  ]
}
```

---

### ❌ Scenario 4: Invalid Request - Missing Required Fields

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com"
  }'
```

**Response (400 Bad Request):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "age",
      "message": "Age is required",
      "code": "common.required",
      "path": ["age"]
    },
    {
      "field": "birthDate",
      "message": "Birth date is required",
      "code": "common.required",
      "path": ["birthDate"]
    },
    {
      "field": "tags",
      "message": "Tags are required",
      "code": "common.required",
      "path": ["tags"]
    },
    {
      "field": "address",
      "message": "Address is required",
      "code": "common.required",
      "path": ["address"]
    }
  ]
}
```

---

### ❌ Scenario 5: Invalid Request - Nested Validation Errors Only

Focus on nested object validation errors.

**Request:**

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Valid Name",
    "email": "valid@example.com",
    "age": 25,
    "birthDate": "1998-01-01T00:00:00.000Z",
    "tags": ["developer"],
    "address": {
      "street": "St",
      "city": "SF",
      "state": "California",
      "zipCode": "12345-678",
      "country": "USA"
    }
  }'
```

**Response (400 Bad Request):**

```json
{
  "message": "Validation failed",
  "errors": [
    {
      "field": "address.street",
      "message": "Street must be at least 5 characters",
      "code": "string.minLength",
      "path": ["address", "street"]
    },
    {
      "field": "address.zipCode",
      "message": "Invalid ZIP code format (e.g., 12345 or 12345-6789)",
      "code": "string.pattern",
      "path": ["address", "zipCode"]
    }
  ]
}
```

---

## 🎓 Key Validation Concepts

### 1. Nested Object Validation

The main power of this example is showing how to validate nested objects:

```typescript
// Parent DTO
export class CreateUserDto {
  @ValidateNested()
  address: AddressDto;

  @IsOptional()
  @ValidateNested()
  socialLinks?: SocialLinksDto;
}

// Nested DTO
export class AddressDto {
  @IsString()
  @MinLength(5, { message: 'Street must be at least 5 characters' })
  street: string;

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format' })
  zipCode: string;

  // ... other fields
}
```

**Error paths for nested validation:**
- `address.street` - Path to nested field
- `address.zipCode` - Another nested field
- `socialLinks.github` - Optional nested field

---

### 2. Array Validation

Validate arrays with size constraints and item-level validation:

```typescript
export class CreateUserDto {
  // Required array with constraints
  @IsArray({ message: 'Tags must be an array' })
  @ArrayMinSize(1, { message: 'At least 1 tag is required' })
  @ArrayMaxSize(10, { message: 'Cannot have more than 10 tags' })
  @IsString({ message: 'Each tag must be a string' })
  tags: string[];

  // Optional array with item validation
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(15)
  @IsString()
  @MinLength(2, { message: 'Each hobby must be at least 2 characters' })
  hobbies?: string[];
}
```

**Error paths for arrays:**
- `tags` - Array-level error (e.g., size constraint)
- `hobbies[0]` - Item-level error with index

---

### 3. Date Validation with Age Checks

Validate dates and calculate age automatically:

```typescript
export class CreateUserDto {
  @IsDate({ message: 'Birth date must be a valid date' })
  @MinAge(18, { message: 'You must be at least 18 years old based on birth date' })
  @MaxAge(120, { message: 'Age cannot exceed 120 years' })
  birthDate: Date;
}
```

---

### 4. Optional Fields

Use `@IsOptional()` for fields that can be omitted:

```typescript
export class CreateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(10)
  bio?: string;

  @IsOptional()
  @ValidateNested()
  socialLinks?: SocialLinksDto;
}
```

---

### 5. String Pattern Validation

Validate string formats with built-in validators:

```typescript
export class CreateUserDto {
  @IsEmail({ message: 'Please provide a valid email address' })
  email: string;

  @IsOptional()
  @IsUrl({ message: 'Avatar URL must be a valid URL' })
  @Contains('https://', { message: 'Avatar URL must use HTTPS protocol' })
  avatarUrl?: string;
}

export class AddressDto {
  @Matches(/^\d{5}(-\d{4})?$/, { message: 'Invalid ZIP code format (e.g., 12345 or 12345-6789)' })
  zipCode: string;
}
```

---

## 📚 Available Decorators

### String Validators
- `@IsString()` - Validates string type
- `@IsEmail()` - Validates email format
- `@IsUrl()` - Validates URL format
- `@MinLength(n)` - Minimum string length
- `@MaxLength(n)` - Maximum string length
- `@Matches(pattern)` - Regex pattern matching
- `@Contains(substring)` - String contains check

### Number Validators
- `@IsNumber()` - Validates number type
- `@Min(n)` - Minimum value
- `@Max(n)` - Maximum value

### Date Validators
- `@IsDate()` - Validates date type
- `@MinAge(years)` - Minimum age based on date
- `@MaxAge(years)` - Maximum age based on date

### Array Validators
- `@IsArray()` - Validates array type
- `@ArrayMinSize(n)` - Minimum array length
- `@ArrayMaxSize(n)` - Maximum array length

### Object Validators
- `@IsObject()` - Validates object type
- `@ValidateNested()` - Validate nested object (most important!)

### Common Validators
- `@IsRequired()` - Field is required (implicit without @IsOptional)
- `@IsOptional()` - Field is optional

---

## 🔧 Custom Validation Pipe

The `ValoraValidationPipe` automatically:
- **Recursively transforms** plain objects to class instances (including nested objects)
- Validates using Valora decorators
- Formats errors for NestJS response
- Supports nested validation via `@ValidateNested`
- Handles optional fields
- Provides detailed error paths (e.g., `address.street`, `socialLinks.github`)

### How Nested Validation Works

When a request comes in with nested data like:
```json
{
  "name": "John",
  "address": { "street": "123 Main St", "city": "NYC" }
}
```

The pipe must convert **both** the top-level object **and** nested objects to class instances:

```typescript
@Injectable()
export class ValoraValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    // Recursively convert plain objects to class instances
    // This ensures @ValidateNested works correctly
    const object = this.plainToInstance(metatype, value);

    // Validate with Valora
    const result = validate(object);

    if (!result.success) {
      throw new BadRequestException({
        message: 'Validation failed',
        errors: result.errors,
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

    // Get metadata for properties marked with @ValidateNested
    const metadata = getPropertyMetadata(metatype.prototype);
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
          // Handle single nested object - RECURSIVELY convert to class instance
          instance[key] = this.plainToInstance(nestedType, val);
        } else {
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
```

**Key Implementation Details:**

1. **`plainToInstance()` method** - Recursively converts plain objects to class instances
2. **Reads metadata** using `getPropertyMetadata()` to find properties marked with `@ValidateNested`
3. **Recursive instantiation** - For nested objects, calls `plainToInstance()` recursively
4. **Array support** - Handles arrays of nested objects (e.g., `addresses: AddressDto[]`)
5. **Type information** - Uses TypeScript's `emitDecoratorMetadata` via `Reflect.getMetadata('design:type')`

**Why this is necessary:**

Without recursive instantiation, nested objects like `{ street: "123 Main St", city: "NYC" }` remain as plain JavaScript objects (`{}`). Plain objects don't have the prototype chain needed for decorators to work. The `validateClassInstance()` function expects class instances with metadata, so without `plainToInstance()`, nested validation would fail silently.

---

## 🌟 Benefits of Using Valora with NestJS

1. **Type Safety**: Full TypeScript support with type inference
2. **Decorator-Based**: Clean, declarative validation syntax
3. **Nested Validation**: Validate complex nested objects with clear error paths
4. **Rich Validators**: 50+ built-in validators
5. **Custom Messages**: Field-level error message customization
6. **Zero Dependencies**: No need for class-validator or class-transformer
7. **Better DX**: Clearer error messages with detailed paths (e.g., `address.zipCode`)
8. **Performance**: Optimized validation pipeline

---

## 📖 Further Reading

- [Valora Documentation](../../docs/README.md)
- [Decorators Guide](../../docs/decorators-guide.md)
- [Nested Validation Guide](../../docs/nested-validation.md)
- [API Reference](../../docs/api-reference.md)
- [NestJS Documentation](https://docs.nestjs.com)

---

## 🐛 Troubleshooting

### Issue: Validation not working

**Solution**: Make sure `ValoraValidationPipe` is applied:
```typescript
@UsePipes(new ValoraValidationPipe())
// or globally in main.ts
app.useGlobalPipes(new ValoraValidationPipe());
```

### Issue: Nested validation not working

**Solution**: Ensure all of the following requirements are met:

1. **Use `@ValidateNested()` decorator** on the parent property:
   ```typescript
   @ValidateNested()
   address: AddressDto;
   ```

2. **Enable TypeScript metadata emission** in `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "emitDecoratorMetadata": true,
       "experimentalDecorators": true
     }
   }
   ```

3. **Install and import `reflect-metadata`**:
   ```bash
   npm install reflect-metadata
   # or
   bun add reflect-metadata
   ```

   Then import it **first** in `main.ts`:
   ```typescript
   import 'reflect-metadata';
   import { NestFactory } from '@nestjs/core';
   ```

4. **The nested class has validation decorators**:
   ```typescript
   export class AddressDto {
     @IsString()
     @MinLength(2)
     street: string;
   }
   ```

5. **The pipe recursively instantiates nested objects** - the `ValoraValidationPipe` must use `plainToInstance()` method to convert nested plain objects to class instances, not just `Object.assign()`

Without these requirements, nested objects will remain as plain JavaScript objects without decorator metadata, and validation will fail silently.

### Issue: Date validation errors

**Solution**: Send dates as ISO 8601 strings: `"2024-01-15T00:00:00.000Z"`

### Issue: Array item validation not working

**Solution**: Apply both `@IsArray()` and item validators (e.g., `@IsString()`, `@MinLength()`) on the same property.

---

## 🤝 Contributing

Feel free to submit issues or pull requests to improve this example!

---

## 📝 Summary

This example demonstrates a **single, comprehensive endpoint** that showcases all major Valora features:

✅ Nested object validation (`address`, `socialLinks`)
✅ Array validation with size and item constraints (`tags`, `hobbies`)
✅ Date validation with age calculations (`birthDate`)
✅ String patterns (email, URL, regex for ZIP codes)
✅ Number ranges (age, salary)
✅ Optional vs required fields
✅ Custom error messages
✅ Clear error paths for debugging

Perfect for learning how to integrate Valora with NestJS! 🚀
