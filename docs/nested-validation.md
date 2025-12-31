# Nested Validation Guide

Complete guide to validating nested objects and arrays in Valora.

## Table of Contents

- [Overview](#overview)
- [Simple Nested Objects](#simple-nested-objects)
- [Nested Arrays](#nested-arrays)
- [Deep Nesting](#deep-nesting)
- [Circular References](#circular-references)
- [Error Paths](#error-paths)
- [Best Practices](#best-practices)

## Overview

Valora supports recursive validation of nested objects and arrays using the `@ValidateNested()` decorator.

**Key Points:**
- Nested classes must have their own `@Validate()` decorator
- Use `@ValidateNested()` on properties that contain other validated classes
- Use `@ValidateNested({ each: true })` for arrays of validated objects
- Error paths include the full property path (e.g., `address.street`)

## Simple Nested Objects

### Basic Example

```typescript
import { Validate, IsString, ValidateNested } from 'valora/decorators';

@Validate()
class Address {
  @IsString()
  @NotEmpty()
  street: string;

  @IsString()
  @NotEmpty()
  city: string;

  @IsString()
  @Length(5)
  zipCode: string;
}

@Validate()
class User {
  @IsString()
  name: string;

  @ValidateNested()
  address: Address;
}

// Usage
const user = new User({
  name: 'John Doe',
  address: {
    street: '123 Main St',
    city: 'Boston',
    zipCode: '02101'
  }
});
// ✅ Valid - nested object is validated automatically
```

### Error Handling

```typescript
try {
  const user = new User({
    name: 'John',
    address: {
      street: '',           // ❌ Empty
      city: 'Boston',
      zipCode: '123'        // ❌ Wrong length
    }
  });
} catch (error) {
  console.log(error.errors);
  // [
  //   { path: 'address.street', message: 'String cannot be empty', ... },
  //   { path: 'address.zipCode', message: 'String must be exactly 5 characters', ... }
  // ]
}
```

## Nested Arrays

### Validating Arrays of Objects

Use `@ValidateNested({ each: true })` to validate each item in an array:

```typescript
@Validate()
class PhoneNumber {
  @IsString()
  type: string;  // 'home', 'work', 'mobile'

  @IsString()
  @Matches(/^\d{3}-\d{3}-\d{4}$/)
  number: string;
}

@Validate()
class Contact {
  @IsString()
  name: string;

  @ValidateNested({ each: true })
  @ArrayNotEmpty()
  phoneNumbers: PhoneNumber[];
}

// Usage
const contact = new Contact({
  name: 'John Doe',
  phoneNumbers: [
    { type: 'home', number: '555-123-4567' },
    { type: 'work', number: '555-987-6543' }
  ]
});
// ✅ Each phone number is validated
```

### Array with Mixed Validation

Combine array and nested validation:

```typescript
@Validate()
class User {
  @IsString()
  name: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  addresses: Address[];
}

const user = new User({
  name: 'John',
  addresses: [
    { street: '123 Main', city: 'Boston', zipCode: '02101' },
    { street: '456 Oak', city: 'NYC', zipCode: '10001' }
  ]
});
```

## Deep Nesting

### Multiple Levels

You can nest as deep as needed:

```typescript
@Validate()
class Country {
  @IsString()
  name: string;

  @IsString()
  @Length(2)
  code: string;
}

@Validate()
class Address {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @ValidateNested()
  country: Country;
}

@Validate()
class Company {
  @IsString()
  name: string;

  @ValidateNested()
  headquarters: Address;
}

@Validate()
class Employee {
  @IsString()
  name: string;

  @ValidateNested()
  company: Company;

  @ValidateNested()
  homeAddress: Address;
}

// Usage
const employee = new Employee({
  name: 'Jane Doe',
  company: {
    name: 'Acme Corp',
    headquarters: {
      street: '100 Tech Blvd',
      city: 'San Francisco',
      country: {
        name: 'United States',
        code: 'US'
      }
    }
  },
  homeAddress: {
    street: '789 Home St',
    city: 'Oakland',
    country: {
      name: 'United States',
      code: 'US'
    }
  }
});
```

### Error Paths in Deep Nesting

Errors include the full path:

```typescript
try {
  const employee = new Employee({
    name: 'Jane',
    company: {
      name: 'Acme',
      headquarters: {
        street: '100 Tech',
        city: 'SF',
        country: {
          name: 'USA',
          code: 'USA'  // ❌ Wrong length
        }
      }
    },
    homeAddress: { /* ... */ }
  });
} catch (error) {
  console.log(error.errors[0].path);
  // 'company.headquarters.country.code'
}
```

## Circular References

### Self-Referencing Types

Handle tree structures with circular references:

```typescript
@Validate()
class TreeNode {
  @IsString()
  value: string;

  @IsOptional()
  @ValidateNested()
  parent?: TreeNode;

  @IsOptional()
  @ValidateNested({ each: true })
  children?: TreeNode[];
}

// Usage
const root = new TreeNode({
  value: 'root',
  children: [
    {
      value: 'child1',
      children: [
        { value: 'grandchild1' },
        { value: 'grandchild2' }
      ]
    },
    {
      value: 'child2'
    }
  ]
});
```

### Mutual References

```typescript
@Validate()
class Author {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested({ each: true })
  books?: Book[];
}

@Validate()
class Book {
  @IsString()
  title: string;

  @ValidateNested()
  author: Author;
}

// Note: Be careful with circular data to avoid infinite loops
// Always use @IsOptional() on one side of the relationship
```

## Error Paths

### Understanding Error Paths

Error paths help you identify exactly where validation failed:

```typescript
@Validate()
class Item {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;
}

@Validate()
class Order {
  @IsString()
  orderId: string;

  @ValidateNested({ each: true })
  items: Item[];
}

try {
  const order = new Order({
    orderId: 'ORD-123',
    items: [
      { name: 'Widget', price: 10 },
      { name: 'Gadget', price: -5 },  // ❌ Invalid
      { name: '', price: 20 }          // ❌ Invalid
    ]
  });
} catch (error) {
  error.errors.forEach(err => {
    console.log(`${err.path}: ${err.message}`);
  });
  // Output:
  // items[1].price: Number must be at least 0
  // items[2].name: String cannot be empty
}
```

### Array Index Notation

Arrays use bracket notation in error paths:

```typescript
// Error path examples:
// - 'items[0].name'           - First item's name
// - 'items[1].price'          - Second item's price
// - 'users[2].address.city'   - Third user's city
// - 'data[0][1].value'        - Nested array access
```

## Complex Scenarios

### Mixed Nested Types

```typescript
@Validate()
class Tag {
  @IsString()
  name: string;
}

@Validate()
class Comment {
  @IsString()
  text: string;

  @IsDate()
  createdAt: Date;
}

@Validate()
class Post {
  @IsString()
  @NotEmpty()
  title: string;

  @IsString()
  content: string;

  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  tags: Tag[];

  @ValidateNested({ each: true })
  comments: Comment[];
}
```

### Optional Nested Objects

```typescript
@Validate()
class Settings {
  @IsString()
  theme: string;

  @IsNumber()
  fontSize: number;
}

@Validate()
class User {
  @IsString()
  name: string;

  @IsOptional()
  @ValidateNested()
  settings?: Settings;
}

// Both valid
const user1 = new User({ name: 'John' });
const user2 = new User({
  name: 'Jane',
  settings: { theme: 'dark', fontSize: 14 }
});
```

### Conditional Nested Validation

```typescript
@Validate({ validateOnCreate: false })
class ShippingAddress {
  @IsString()
  street: string;

  @IsString()
  city: string;
}

@Validate()
class Order {
  @IsString()
  productId: string;

  @IsBoolean()
  requiresShipping: boolean;

  @IsOptional()
  @ValidateNested()
  shippingAddress?: ShippingAddress;
}

// Validate manually with custom logic
const order = new Order({
  productId: 'PROD-123',
  requiresShipping: true,
  shippingAddress: undefined
});

// Custom validation logic
if (order.requiresShipping && !order.shippingAddress) {
  throw new Error('Shipping address required');
}
```

## Performance Considerations

### Lazy Validation

For deeply nested structures, consider lazy validation:

```typescript
@Validate({ validateOnCreate: false })
class HeavyNestedStructure {
  // ... lots of nested objects
}

// Validate only when needed
const data = new HeavyNestedStructure(rawData);
// ... do some work
const result = validateClassInstance(data);
if (!result.success) {
  // Handle errors
}
```

### Partial Validation

Sometimes you only need to validate part of the structure:

```typescript
import { v } from 'valora';

// For partial updates, use fluent API
const partialSchema = v.object({
  name: v.string().optional(),
  email: v.string().email().optional(),
  address: v.object({
    city: v.string()
  }).optional()
});

const result = partialSchema.validate(partialUpdateData);
```

## Best Practices

1. **Always Add `@Validate()` to Nested Classes**
   ```typescript
   // ✅ Good
   @Validate()
   class Address { }

   // ❌ Bad - won't validate
   class Address { }
   ```

2. **Use `each: true` for Arrays**
   ```typescript
   // ✅ Good
   @ValidateNested({ each: true })
   items: Item[];

   // ❌ Bad - will try to validate array as object
   @ValidateNested()
   items: Item[];
   ```

3. **Make One Side Optional in Circular References**
   ```typescript
   // ✅ Good
   @Validate()
   class Node {
     @IsOptional()
     @ValidateNested()
     parent?: Node;
   }

   // ❌ Bad - can cause infinite loops
   @Validate()
   class Node {
     @ValidateNested()
     parent: Node;
   }
   ```

4. **Use Type Safety**
   ```typescript
   // ✅ Good - TypeScript enforces correct types
   @ValidateNested()
   address: Address;

   // ❌ Bad - loses type safety
   @ValidateNested()
   address: any;
   ```

5. **Handle Errors Gracefully**
   ```typescript
   try {
     const order = new Order(data);
   } catch (error) {
     if (error instanceof ValoraValidationError) {
       // Group errors by path, show user-friendly messages
       const errorsByPath = groupBy(error.errors, 'path');
       // ... display to user
     }
   }
   ```

## Next Steps

- Learn about [Advanced Usage](./advanced-usage.md)
- See [Examples](./examples.md) for real-world patterns
- Check [API Reference](./api-reference.md) for complete details
