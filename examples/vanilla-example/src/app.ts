/**
 * Valora Vanilla JS Example
 * Demonstrates comprehensive form validation with VanillaAdapter
 *
 * This example showcases:
 * - Basic form validation with various field types
 * - Custom error messages
 * - Transform plugin for data transformation
 * - Real-time validation feedback
 * - Accessibility features (ARIA)
 * - State management and subscriptions
 */

import { createVanillaAdapter } from '@tqtos/valora/adapters/vanilla';
import { boolean, number, string } from '@tqtos/valora/validators';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Valora...');

  // ============================================================================
  // Registration Form - Showcasing Framework Features
  // ============================================================================

  const registrationAdapter = createVanillaAdapter({
    // String validation with transform - automatically trim and convert to title case
    name:
      string()
        .required({ message: 'Name is require' })
        .minLength(2, { message: 'Name must be at least 2 characters' })
        .maxLength(50, { message: 'Name must not exceed 50 characters' })
        .matches(/^[a-zA-Z\s]+$/, { message: 'Name can only contain letters and spaces' }),

    // Email validation with lowercase transform
    email:
      string()
        .required({ message: 'Email is required' })
        .email({ message: 'Please enter a valid email address' }),

    // Complex password validation with multiple rules
    password: string()
      .required({ message: 'Password is required' })
      .minLength(8, { message: 'Password must be at least 8 characters' })
      .maxLength(100, { message: 'Password must not exceed 100 characters' })
      .matches(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .matches(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .matches(/[0-9]/, { message: 'Must contain at least one number' })
      .matches(/[!@#$%^&*]/, { message: 'Must contain at least one special character (!@#$%^&*)' }),

    // Number validation with range
    age: number()
      .min(18, { message: 'You must be at least 18 years old' })
      .max(120, { message: 'Please enter a valid age' })
      .integer({ message: 'Age must be a whole number' })
      .optional(),

    // URL validation with transform
    website: string().url({ message: 'Please enter a valid URL' }).optional(),

    // Boolean validation for checkbox
    terms: boolean()
      .required({ message: 'You must agree to continue' })
      .isTrue({ message: 'You must agree to the terms and conditions' }),
  });

  // Bind registration form
  const registrationForm = document.getElementById('registration-form') as HTMLFormElement;
  const registrationCleanup = registrationAdapter.bindForm({
    form: registrationForm,
    validateOnChange: true,
    validateOnBlur: true,
    validateOnSubmit: true,
    preventDefaultSubmit: true,
    errorDisplay: {
      errorClass: 'valora-error',
      errorMessageClass: 'valora-error-message',
      invalidInputClass: 'valora-invalid',
      errorPlacement: 'after',
    },
    onSubmit: async (values, form) => {
      console.log('Registration form submitted with values:', values);

      // Show success message
      showResults('Registration Successful', values);

      // Simulate API call
      await simulateApiCall();

      // Reset form after successful submission
      form.reset();
      registrationAdapter.resetAll();
    },
  });

  // Reset button handler
  document.getElementById('reset-btn')?.addEventListener('click', () => {
    registrationForm.reset();
    registrationAdapter.resetAll();
    hideResults();
  });

  // ============================================================================
  // Contact Form - Demonstrating String Transformations
  // ============================================================================

  const contactAdapter = createVanillaAdapter({
    // Name with trim transformation
    name:
      string()
        .required({ message: 'Name is required' })
        .minLength(2, { message: 'Name must be at least 2 characters' })
        .maxLength(100, { message: 'Name is too long' }),

    // Email with lowercase and trim
    email:
      string()
        .required({ message: 'Email is required' })
        .email({ message: 'Valid email address is required' }),

    // Subject with trim and uppercase
    subject:
      string()
        .required({ message: 'Subject is required' })
        .minLength(5, { message: 'Subject must be at least 5 characters' })
        .maxLength(100, { message: 'Subject is too long' }),

    // Message with character count validation
    message:
      string()
        .required({ message: 'Message is required' })
        .minLength(10, { message: 'Message must be at least 10 characters' })
        .maxLength(500, { message: 'Message must not exceed 500 characters' }),
  });

  // Bind contact form
  const contactForm = document.getElementById('contact-form') as HTMLFormElement;
  const contactCleanup = contactAdapter.bindForm({
    form: contactForm,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, form) => {
      console.log('Contact form submitted with values:', values);

      // Show success message
      showResults('Message Sent', values);

      // Simulate API call
      await simulateApiCall();

      // Reset form
      form.reset();
      contactAdapter.resetAll();
    },
  });

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Display submission results
   */
  function showResults(title: string, data: any) {
    const resultsSection = document.getElementById('results') as HTMLDivElement;
    const resultData = document.getElementById('result-data') as HTMLDivElement;

    resultData.textContent = JSON.stringify(
      {
        status: 'success',
        title,
        data,
        timestamp: new Date().toISOString(),
      },
      null,
      2,
    );

    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /**
   * Hide results section
   */
  function hideResults() {
    const resultsSection = document.getElementById('results') as HTMLDivElement;
    resultsSection.style.display = 'none';
  }

  /**
   * Simulate API call
   */
  function simulateApiCall() {
    return new Promise((resolve) => {
      setTimeout(resolve, 500);
    });
  }

  // ============================================================================
  // Real-time Validation Feedback & Advanced Features
  // ============================================================================

  // Subscribe to form state changes for registration form
  registrationAdapter.subscribeToForm((state) => {
    console.log('📋 Registration form state:', {
      isValid: state.isValid,
      validating: state.validating,
      touched: state.touched,
      dirty: state.dirty,
      errorCount: state.errors.length,
    });

    // Update submit button state based on form validity
    const submitBtn = registrationForm.querySelector('button[type="submit"]') as HTMLButtonElement;
    if (submitBtn) {
      submitBtn.disabled = state.touched && !state.isValid;
    }
  });

  // Subscribe to password field for custom hint updates
  registrationAdapter.subscribeToField('password', (fieldState) => {
    const hint = document.getElementById('password-hint') as HTMLDivElement;

    if (fieldState.touched && fieldState.errors.length > 0) {
      hint.textContent = fieldState.errors?.[0]?.message ?? null;
      hint.classList.add('error-hint');
    } else if (fieldState.touched && fieldState.errors.length === 0) {
      hint.textContent = '✓ Strong password!';
      hint.classList.remove('error-hint');
      hint.classList.add('success-hint');
    } else {
      hint.textContent =
        'Minimum 8 characters, with uppercase, lowercase, number, and special char';
      hint.classList.remove('error-hint', 'success-hint');
    }
  });

  // Subscribe to email field to show transformation in action
  registrationAdapter.subscribeToField('email', (fieldState) => {
    if (fieldState.value && fieldState.value !== fieldState.value.toLowerCase()) {
      console.log('✨ Email transformed:', fieldState.value);
    }
  });

  // Character counter for contact form message
  contactAdapter.subscribeToField('message', (fieldState) => {
    const messageInput = document.getElementById('message');
    const hint = messageInput?.nextElementSibling;

    if (hint && hint.classList.contains('hint')) {
      const currentLength = fieldState.value?.length || 0;
      const maxLength = 500;
      const remaining = maxLength - currentLength;

      if (currentLength >= 10) {
        hint.textContent = `${currentLength}/500 characters (${remaining} remaining)`;
        hint.classList.remove('error-hint');
        hint.classList.add('success-hint');
      } else if (fieldState.touched) {
        hint.textContent = `${currentLength}/500 characters (minimum 10 required)`;
        hint.classList.add('error-hint');
      } else {
        hint.textContent = '10-500 characters required';
        hint.classList.remove('error-hint', 'success-hint');
      }
    }
  });

  // ============================================================================
  // Cleanup on page unload
  // ============================================================================

  window.addEventListener('beforeunload', () => {
    registrationCleanup();
    contactCleanup();
  });

  // ============================================================================
  // Console welcome message
  // ============================================================================

  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🎯 Valora Vanilla JS Example - Framework Feature Showcase   ║
║                                                               ║
║  ✨ Features Demonstrated:                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Transform Plugin (trim, toLowerCase, toUpperCase)         ║
║  • Complex validation rules with custom messages             ║
║  • Real-time validation on input/blur                        ║
║  • Form state subscriptions & reactive updates               ║
║  • Field-specific subscriptions                              ║
║  • Automatic error display with ARIA support                 ║
║  • Character counter (contact form message)                  ║
║  • Password strength indicator                               ║
║  • Submit button state management                            ║
║                                                               ║
║  🔧 Try These:                                               ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Type email in uppercase → see auto-lowercase              ║
║  • Watch password hints change as you type                   ║
║  • See character counter update in contact form              ║
║  • Submit invalid data → see error messages                  ║
║  • Check console for validation state logs                   ║
║                                                               ║
║  🛠️  Adapter APIs (for debugging):                          ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  window.registrationAdapter.getFormState()                   ║
║  window.registrationAdapter.getFieldState('email')           ║
║  window.registrationAdapter.validateAll()                    ║
║  window.contactAdapter.getValues()                           ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Expose adapters globally for debugging
  window.registrationAdapter = registrationAdapter;
  window.contactAdapter = contactAdapter;

  console.log('✅ Valora initialized successfully!');
  console.log('💡 Tip: Open the console to see validation state updates in real-time');
}); // End of DOMContentLoaded
