# Valora Vanilla JS Example

Complete example demonstrating Valora's **VanillaAdapter** for progressive enhancement of HTML forms with comprehensive framework features.

## 📋 Features Demonstrated

### Core Validation Features
- ✅ Real-time validation on input/blur
- ✅ Multiple validation rules per field (min/max length, patterns, ranges)
- ✅ Custom error messages
- ✅ Error display with accessibility (ARIA attributes)
- ✅ Form submission handling
- ✅ Form reset functionality

### Advanced Features
- 🔄 **Transform Plugin** - Automatic data transformation (trim, toLowerCase, toUpperCase)
- 🎯 **Field Subscriptions** - React to field state changes
- 📊 **Form State Management** - Track form validity, touched, dirty states
- 💬 **Character Counter** - Real-time character count for textarea
- 🔐 **Password Strength Indicator** - Dynamic hints based on validation
- 🎨 **Custom UI Updates** - Submit button state, hint messages
- 🎭 **Multiple Forms** - Demonstrate different use cases

## 🚀 Running the Example

### Option 1: Using a Local Dev Server

```bash
# Using Python
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Using PHP
php -S localhost:8000

# Using Python 3
python3 -m http.server 8000
```

Then open: `http://localhost:8000/examples/vanilla-example/`

### Option 2: Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 3: Direct File Access

Open `index.html` directly in your browser (may have CORS issues with ES modules).

## 📁 File Structure

```
vanilla-example/
├── index.html          # HTML forms with semantic markup and ARIA
├── app.ts              # TypeScript validation logic with framework features
├── styles.css          # Styling for forms, errors, and hints
└── README.md           # This file
```

## 🎯 Forms Included

### 1. Registration Form

Demonstrates complex validation with transforms:

- **Name**: 2-50 chars, letters/spaces only, auto-trimmed
- **Email**: Valid email format, auto-trimmed & lowercased
- **Password**: 8-100 chars with uppercase, lowercase, number, and special character
- **Age**: Optional, 18-120, must be integer
- **Website**: Optional, valid URL, auto-trimmed
- **Terms**: Must be checked (boolean validation)

**Features showcased**: Transform plugin, pattern matching, range validation, optional fields

### 2. Contact Form

Demonstrates string transformations and character counting:

- **Name**: 2-100 chars, auto-trimmed
- **Email**: Valid email format, auto-trimmed & lowercased
- **Subject**: 5-100 chars, auto-trimmed
- **Message**: 10-500 chars with real-time character counter

**Features showcased**: String transforms, character limits, reactive UI updates

## 🔧 Key Concepts

### Creating an Adapter with Validators

```typescript
import { createVanillaAdapter } from '../../src/adapters/vanilla';
import { string, number, boolean } from '../../src/validators';
import { transform } from '../../src/plugins/transform';
import { trim, toLowerCase } from '../../src/plugins/transform/transforms/string';

const adapter = createVanillaAdapter({
  // Basic validation
  name: string()
    .required({ message: 'Name is required' })
    .minLength(2),

  // With transform plugin
  email: transform(
    string().required().email(),
    trim(),
    toLowerCase()
  ),

  // Complex validation
  password: string()
    .required()
    .minLength(8)
    .matches(/[A-Z]/, { message: 'Must contain uppercase' })
    .matches(/[0-9]/, { message: 'Must contain number' }),

  // Number with range
  age: number()
    .optional()
    .min(18)
    .max(120)
    .integer(),

  // Boolean validation
  terms: boolean()
    .required()
    .isTrue({ message: 'You must agree' }),
});
```

### Binding to a Form

```javascript
const cleanup = adapter.bindForm({
  form: document.getElementById('my-form'),
  validateOnChange: true,
  validateOnBlur: true,
  validateOnSubmit: true,
  onSubmit: async (values) => {
    // Handle valid submission
    console.log(values);
  },
});
```

### Subscribing to State Changes

```typescript
// Watch entire form state
adapter.subscribeToForm((state) => {
  console.log('Form state:', {
    isValid: state.isValid,
    validating: state.validating,
    touched: state.touched,
    dirty: state.dirty,
    errorCount: state.errors.length,
  });

  // Update UI based on form state
  const submitBtn = form.querySelector('button[type="submit"]');
  submitBtn.disabled = state.touched && !state.isValid;
});

// Watch specific field for custom behavior
adapter.subscribeToField('password', (fieldState) => {
  const hint = document.getElementById('password-hint');

  if (fieldState.touched && fieldState.errors.length > 0) {
    hint.textContent = fieldState.errors[0].message;
    hint.classList.add('error-hint');
  } else if (fieldState.touched && fieldState.errors.length === 0) {
    hint.textContent = '✓ Strong password!';
    hint.classList.add('success-hint');
  }
});

// Character counter example
adapter.subscribeToField('message', (fieldState) => {
  const currentLength = fieldState.value?.length || 0;
  const remaining = 500 - currentLength;
  hint.textContent = `${currentLength}/500 characters (${remaining} remaining)`;
});
```

### Cleanup

```javascript
// When component/page unmounts
cleanup();
```

## 🎨 Customizing Error Display

```javascript
adapter.bindForm({
  form: myForm,
  errorDisplay: {
    errorClass: 'my-error',
    errorMessageClass: 'my-error-msg',
    invalidInputClass: 'is-invalid',
    errorPlacement: 'after', // or 'before'
    customRenderer: (field, errors) => {
      // Custom error rendering logic
    },
  },
});
```

## 🔍 Debugging

Open browser console to see:

- Form state changes
- Field validation results
- Submission data

The example exposes adapters globally:

```javascript
window.registrationAdapter.getFormState();
window.contactAdapter.getFieldState('email');
```

## 🌟 Advanced Features

### Manual Field Operations

```javascript
// Set field value programmatically
adapter.setFieldValue('email', 'test@example.com', { validate: true });

// Mark field as touched
adapter.touchField('email');

// Validate specific field
adapter.validateField('email');

// Validate all fields
adapter.validateAll();

// Reset form
adapter.reset();
```

### Getting Form Data

```javascript
// Get all values
const values = adapter.getValues();

// Get form state
const state = adapter.getFormState();
console.log('Valid?', state.isValid);
console.log('Errors:', state.errors);

// Get specific field state
const emailState = adapter.getFieldState('email');
console.log('Email touched?', emailState.touched);
```

## 📚 Related Documentation

- [Vanilla Adapter API](../../docs/api-reference.md#vanilla-adapter)
- [Validators Guide](../../docs/validators-guide.md)
- [Advanced Usage](../../docs/advanced-usage.md)

## 🎨 Transform Plugin

The transform plugin allows you to automatically transform user input before validation:

```typescript
import { transform } from '../../src/plugins/transform';
import { trim, toLowerCase, toUpperCase } from '../../src/plugins/transform/transforms/string';

// Email: trim whitespace and convert to lowercase
email: transform(
  string().required().email(),
  trim(),
  toLowerCase()
)

// Name: trim whitespace
name: transform(
  string().required().minLength(2),
  trim()
)
```

**Available string transforms:**
- `trim()` - Remove leading/trailing whitespace
- `toLowerCase()` - Convert to lowercase
- `toUpperCase()` - Convert to uppercase
- `capitalize()` - Capitalize first letter
- `slugify()` - Convert to URL-friendly slug
- And many more...

## 💡 Tips & Best Practices

1. **Progressive Enhancement**: Forms work without JS, validation enhances UX
2. **Accessibility**: ARIA attributes are automatically added for screen readers
3. **Performance**: Validation only runs when needed (blur/change/submit)
4. **Flexibility**: Customize error display, placement, and styling
5. **Type Safety**: Use TypeScript for better developer experience
6. **Transform First**: Apply transforms before validation for cleaner data
7. **Clear Messages**: Provide specific, helpful error messages
8. **Optional Fields**: Use `.optional()` for fields that aren't required
9. **Subscribe Wisely**: Use field subscriptions for custom UI updates
10. **Cleanup**: Always call cleanup functions to prevent memory leaks

## 🐛 Troubleshooting

### Errors not displaying?

**Check that:**
- Form element has `id` attribute
- Input elements have `name` attributes that match validator keys exactly
- CSS classes for errors are included in `styles.css`
- Browser console shows no JavaScript errors

**Debug with:**
```javascript
console.log(adapter.getFormState());
console.log(adapter.getFieldState('email'));
```

### Validation not triggering?

**Ensure:**
- Adapter is bound to form before user interaction
- `validateOnChange` or `validateOnBlur` are enabled (true by default)
- Field names match validator keys exactly
- Browser console shows no errors during initialization

**Test manually:**
```javascript
adapter.validateField('email');
adapter.validateAll();
```

### Transforms not working?

**Verify:**
- Import transform plugin correctly
- Transform is wrapped around the validator
- Check console logs to see transformed values

**Example:**
```typescript
// ✅ Correct
email: transform(string().email(), trim(), toLowerCase())

// ❌ Incorrect
email: string().email().transform(trim()) // Wrong API
```

### Submit button stays disabled?

**This is intentional!** The submit button is disabled when:
- Form has been touched (`state.touched === true`)
- AND form is invalid (`state.isValid === false`)

This prevents submission of invalid data. Remove this behavior by modifying the subscription in `app.ts`.

### Cleanup not working?

**Make sure to:**
- Call the cleanup function returned by `bindForm()`
- Call `adapter.destroy()` when completely done with the form
- Clean up on page unload or component unmount

```typescript
const cleanup = adapter.bindForm({ form });

// Later...
cleanup(); // Remove event listeners
adapter.destroy(); // Complete cleanup
```

## 🎓 Learning Resources

- **Framework Documentation**: Check `../../docs/` for comprehensive guides
- **API Reference**: See validators, adapters, and plugin APIs
- **Source Code**: Explore `../../src/` to understand implementation
- **Tests**: Look at `../../tests/` for more usage examples

## 🤝 Contributing

Found an issue or want to improve this example? Contributions are welcome!

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This example is part of the Valora project and follows the same license.
