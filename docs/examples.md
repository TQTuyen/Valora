# Examples

Real-world examples and common use cases for Valora.

## Table of Contents

- [API Request Validation](#api-request-validation)
- [Form Validation](#form-validation)
- [E-commerce](#e-commerce)
- [User Management](#user-management)
- [Configuration Validation](#configuration-validation)
- [File Upload Validation](#file-upload-validation)
- [Database Models](#database-models)

## API Request Validation

### REST API DTOs

```typescript
import { Validate, IsString, IsEmail, MinLength, IsOptional } from '@tqtos/valora/decorators';

// POST /api/users - Create user
@Validate()
class CreateUserDto {
  @IsString()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  name: string;

  @IsEmail({ message: 'Invalid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'Password must contain uppercase, lowercase, and number',
  })
  password: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

// PATCH /api/users/:id - Update user
@Validate()
class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;
}

// Usage in Express
import express from 'express';

const app = express();

app.post('/api/users', async (req, res) => {
  try {
    const userData = new CreateUserDto(req.body);
    // userData is validated!

    const user = await db.users.create(userData);
    res.status(201).json(user);
  } catch (error) {
    if (error instanceof ValoraValidationError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors.map((e) => ({
          field: e.path,
          message: e.message,
        })),
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

app.patch('/api/users/:id', async (req, res) => {
  try {
    const updateData = new UpdateUserDto(req.body);
    const user = await db.users.update(req.params.id, updateData);
    res.json(user);
  } catch (error) {
    // ... error handling
  }
});
```

### GraphQL Inputs

```typescript
import { Validate, IsString, IsInt, Min, IsOptional } from '@tqtos/valora/decorators';

@Validate()
class CreatePostInput {
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  title: string;

  @IsString()
  @MinLength(20)
  content: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(5)
  tags: TagInput[];

  @IsOptional()
  @IsString()
  coverImageUrl?: string;
}

@Validate()
class TagInput {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  name: string;
}

// Usage in GraphQL resolver
const resolvers = {
  Mutation: {
    createPost: async (_, { input }) => {
      const validatedInput = new CreatePostInput(input);
      return await createPost(validatedInput);
    },
  },
};
```

## Form Validation

### Registration Form

```typescript
import { Validate, IsString, IsEmail, IsDate, MinAge, IsBoolean, IsTrue } from '@tqtos/valora/decorators';

@Validate()
class RegistrationForm {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character'
  })
  password: string;

  @IsDate()
  @IsPast()
  @MinAge(18)
  birthDate: Date;

  @IsBoolean()
  @IsTrue({ message: 'You must accept the terms and conditions' })
  acceptedTerms: boolean;

  @IsOptional()
  @IsString()
  referralCode?: string;
}

// React usage
function RegistrationPage() {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const validData = new RegistrationForm(formData);
      await api.register(validData);
      navigate('/welcome');
    } catch (error) {
      if (error instanceof ValoraValidationError) {
        setErrors(error.errors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      {errors.map(err => (
        <div key={err.path} className="error">
          {err.message}
        </div>
      ))}
    </form>
  );
}
```

### Multi-Step Form

```typescript
// Step 1: Personal Info
@Validate({ validateOnCreate: false })
class PersonalInfoStep {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsDate()
  birthDate: Date;
}

// Step 2: Address
@Validate({ validateOnCreate: false })
class AddressStep {
  @IsString()
  street: string;

  @IsString()
  city: string;

  @IsString()
  @Length(5)
  zipCode: string;
}

// Step 3: Preferences
@Validate({ validateOnCreate: false })
class PreferencesStep {
  @IsBoolean()
  newsletter: boolean;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  interests: Interest[];
}

// Complete form
@Validate()
class CompleteRegistration {
  @ValidateNested()
  personalInfo: PersonalInfoStep;

  @ValidateNested()
  address: AddressStep;

  @ValidateNested()
  preferences: PreferencesStep;
}

// Usage
function MultiStepForm() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});

  const validateStep = (stepData, StepClass) => {
    const stepInstance = new StepClass(stepData);
    const result = validateClassInstance(stepInstance);
    if (!result.success) {
      throw result.errors;
    }
  };

  const handleStepSubmit = (stepData) => {
    const steps = [PersonalInfoStep, AddressStep, PreferencesStep];
    validateStep(stepData, steps[step - 1]);
    setData({ ...data, ...stepData });
    setStep(step + 1);
  };

  const handleFinalSubmit = () => {
    const complete = new CompleteRegistration(data);
    // All steps validated together
    api.submitRegistration(complete);
  };
}
```

## E-commerce

### Product and Order Management

```typescript
@Validate()
class Money {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @Length(3)
  @IsUppercase()
  currency: string; // 'USD', 'EUR', etc.
}

@Validate()
class Product {
  @IsString()
  @IsUuid()
  id: string;

  @IsString()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @IsString()
  @MinLength(20)
  description: string;

  @ValidateNested()
  price: Money;

  @IsNumber()
  @IsInt()
  @Min(0)
  stockQuantity: number;

  @ValidateNested({ each: true })
  @ArrayMaxSize(10)
  images: ProductImage[];

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  categories: Category[];
}

@Validate()
class ProductImage {
  @IsString()
  @IsUrl()
  url: string;

  @IsString()
  @IsOptional()
  alt?: string;

  @IsBoolean()
  isPrimary: boolean;
}

@Validate()
class OrderItem {
  @IsString()
  @IsUuid()
  productId: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(100)
  quantity: number;

  @ValidateNested()
  price: Money; // Price at time of order
}

@Validate()
class ShippingAddress {
  @IsString()
  @NotEmpty()
  fullName: string;

  @IsString()
  @NotEmpty()
  street: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  @Matches(/^\d{5}(-\d{4})?$/)
  zipCode: string;

  @IsString()
  @Length(2)
  country: string;
}

@Validate()
class Order {
  @IsString()
  @IsUuid()
  id: string;

  @IsString()
  @IsUuid()
  userId: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @ArrayMaxSize(50)
  items: OrderItem[];

  @ValidateNested()
  shippingAddress: ShippingAddress;

  @IsDate()
  @IsFuture()
  @IsOptional()
  estimatedDelivery?: Date;

  @IsString()
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}
```

### Shopping Cart

```typescript
@Validate()
class CartItem {
  @IsString()
  @IsUuid()
  productId: string;

  @IsNumber()
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;

  @IsOptional()
  @ValidateNested()
  customization?: ProductCustomization;
}

@Validate()
class ShoppingCart {
  @IsString()
  @IsUuid()
  userId: string;

  @ValidateNested({ each: true })
  @ArrayMaxSize(100)
  items: CartItem[];

  @IsOptional()
  @IsString()
  couponCode?: string;

  @IsDate()
  lastUpdated: Date;
}

// Usage
class CartService {
  addItem(cart: ShoppingCart, product: Product, quantity: number) {
    const newItem = new CartItem({
      productId: product.id,
      quantity,
    });

    cart.items.push(newItem);
    cart.lastUpdated = new Date();

    // Revalidate cart
    const result = validateClassInstance(cart);
    if (!result.success) {
      throw new Error('Cart validation failed');
    }

    return cart;
  }
}
```

## User Management

### Complete User Profile

```typescript
@Validate()
class SocialLinks {
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @IsOptional()
  @IsUrl()
  linkedin?: string;

  @IsOptional()
  @IsUrl()
  github?: string;

  @IsOptional()
  @IsUrl()
  website?: string;
}

@Validate()
class UserProfile {
  @IsString()
  @IsUuid()
  id: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsOptional()
  @IsUrl()
  avatarUrl?: string;

  @ValidateNested()
  address: Address;

  @IsOptional()
  @ValidateNested()
  socialLinks?: SocialLinks;

  @ValidateNested({ each: true })
  @IsOptional()
  phoneNumbers?: PhoneNumber[];

  @IsDate()
  @IsPast()
  @MinAge(13)
  birthDate: Date;

  @IsBoolean()
  emailVerified: boolean;

  @IsDate()
  createdAt: Date;

  @IsDate()
  lastLoginAt: Date;
}
```

## Configuration Validation

### Application Config

```typescript
import { v } from '@tqtos/valora';

const databaseConfig = v.object({
  host: v.string().notEmpty(),
  port: v.number().min(1).max(65535),
  database: v.string().notEmpty(),
  username: v.string().notEmpty(),
  password: v.string().minLength(8),
  ssl: v.boolean().default(true),
  poolSize: v.number().min(1).max(100).default(10),
});

const serverConfig = v.object({
  port: v.number().min(1024).max(65535).default(3000),
  host: v.string().default('localhost'),
  corsOrigins: v.array().of(v.string().url()),
  rateLimit: v
    .object({
      windowMs: v.number().min(1000),
      maxRequests: v.number().min(1),
    })
    .optional(),
});

const appConfig = v.object({
  environment: v.string().oneOf(['development', 'staging', 'production']),
  database: databaseConfig,
  server: serverConfig,
  jwt: v.object({
    secret: v.string().minLength(32),
    expiresIn: v.string().default('7d'),
  }),
  logging: v.object({
    level: v.string().oneOf(['error', 'warn', 'info', 'debug']).default('info'),
    format: v.string().oneOf(['json', 'pretty']).default('json'),
  }),
});

// Load and validate config
const result = appConfig.validate({
  environment: process.env.NODE_ENV,
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
  server: {
    port: parseInt(process.env.PORT || '3000'),
    corsOrigins: process.env.CORS_ORIGINS?.split(',') || [],
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  logging: {
    level: process.env.LOG_LEVEL,
  },
});

if (!result.success) {
  console.error('Configuration validation failed:');
  result.errors.forEach((err) => {
    console.error(`  ${err.path}: ${err.message}`);
  });
  process.exit(1);
}

export const config = result.data;
```

## File Upload Validation

### File Metadata Validation

```typescript
@Validate()
class UploadedFile {
  @IsString()
  filename: string;

  @IsString()
  mimetype: string;

  @IsNumber()
  @Min(1)
  @Max(10 * 1024 * 1024) // 10MB max
  size: number;

  @IsString()
  @IsUrl()
  url: string;

  @IsDate()
  uploadedAt: Date;
}

@Validate()
class ImageUpload extends UploadedFile {
  @IsString()
  @Matches(/^image\/(jpeg|png|gif|webp)$/)
  mimetype: string;

  @IsNumber()
  @Min(100)
  @Max(4096)
  width: number;

  @IsNumber()
  @Min(100)
  @Max(4096)
  height: number;
}

// Usage in upload handler
async function handleImageUpload(file: Express.Multer.File) {
  const imageData = new ImageUpload({
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    url: await uploadToS3(file),
    uploadedAt: new Date(),
    width: await getImageWidth(file),
    height: await getImageHeight(file),
  });

  return imageData;
}
```

## Database Models

### ORM Integration

```typescript
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Validate, IsString, IsEmail, MinLength } from '@tqtos/valora/decorators';

@Entity()
@Validate({ validateOnCreate: false }) // Don't auto-validate
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsString()
  @MinLength(2)
  name: string;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  @IsString()
  @MinLength(8)
  passwordHash: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsDate()
  lastLoginAt?: Date;

  // Validate before save
  async save() {
    const result = validateClassInstance(this);
    if (!result.success) {
      throw new ValidationError('User validation failed', result.errors);
    }
    return await getRepository(User).save(this);
  }
}
```

## Next Steps

- See [Advanced Usage](./advanced-usage.md) for custom validators and advanced patterns
- Check [API Reference](./api-reference.md) for complete documentation
- Read [Migration Guide](./migration-guide.md) if upgrading from legacy decorators
