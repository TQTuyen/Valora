# Valora Vanilla JS Example

Complete example demonstrating Valora's **VanillaAdapter** for progressive enhancement of HTML forms.

## 📋 Features Demonstrated

- ✅ Real-time validation on input/blur
- ✅ Multiple validation rules per field
- ✅ Custom error messages
- ✅ Error display with accessibility (ARIA)
- ✅ Form submission handling
- ✅ Form reset functionality
- ✅ Field state subscriptions
- ✅ Two different form types

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
├── index.html          # HTML forms with semantic markup
├── app.js              # JavaScript validation logic
├── styles.css          # Styling for forms and errors
└── README.md           # This file
```

## 🎯 Forms Included

### 1. Registration Form

Validates:

- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Password**: 8+ chars with uppercase, lowercase, and number
- **Age**: Optional, must be 18+
- **Website**: Optional, must be valid URL
- **Terms**: Must be checked

### 2. Contact Form

Validates:

- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Subject**: Minimum 5 characters
- **Message**: 10-500 characters

## 🔧 Key Concepts

### Creating an Adapter

```javascript
import { createVanillaAdapter } from '@tqtos/valora/adapters/vanilla';
import { v } from '@tqtos/valora';

const adapter = createVanillaAdapter({
  name: v.string().minLength(2),
  email: v.string().email(),
  // ... more fields
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

```javascript
// Watch entire form
adapter.subscribeToForm((state) => {
  console.log('Form is valid:', state.isValid);
});

// Watch specific field
adapter.subscribeToField('email', (fieldState) => {
  console.log('Email errors:', fieldState.errors);
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

## 💡 Tips

1. **Progressive Enhancement**: Forms work without JS, validation enhances UX
2. **Accessibility**: Always included with ARIA attributes
3. **Performance**: Only validates when needed (blur/change/submit)
4. **Flexibility**: Customize error display, placement, and styling
5. **Type Safety**: Use TypeScript for better DX

## 🐛 Troubleshooting

### Errors not displaying?

Check that:

- Form has `id` attribute
- Inputs have `name` attributes matching validator keys
- CSS classes are included

### Validation not triggering?

Ensure:

- Adapter is bound to form before interaction
- `validateOnChange`/`validateOnBlur` are enabled
- Browser console shows no errors

### Cleanup not working?

Make sure to:

- Call the cleanup function returned by `bindForm()`
- Call `adapter.destroy()` when completely done
