/**
 * Valora Vanilla JS Example
 * Demonstrates form validation with VanillaAdapter
 */

import { createVanillaAdapter } from '../../src/adapters/vanilla/index.js';
import { v } from '../../src/index.js';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Initializing Valora...');

  // ============================================================================
  // Registration Form
  // ============================================================================

  const registrationAdapter = createVanillaAdapter({
    name: v.string().required().minLength(2, { message: 'Name must be at least 2 characters' }),
    email: v.string().required().email({ message: 'Please enter a valid email address' }),
    password: v
      .string()
      .required()
      .minLength(8, { message: 'Password must be at least 8 characters' })
      .matches(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .matches(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .matches(/[0-9]/, { message: 'Password must contain at least one number' }),
    age: v.number().min(18, { message: 'You must be at least 18 years old' }).optional(),
    website: v.string().url({ message: 'Please enter a valid URL' }).optional(),
    terms: v.boolean().required().isTrue({ message: 'You must agree to the terms and conditions' }),
  });

  // Bind registration form
  const registrationForm = document.getElementById('registration-form');
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
      registrationAdapter.reset();
    },
  });

  // Reset button handler
  document.getElementById('reset-btn').addEventListener('click', () => {
    registrationForm.reset();
    registrationAdapter.reset();
    hideResults();
  });

  // ============================================================================
  // Contact Form
  // ============================================================================

  const contactAdapter = createVanillaAdapter({
    name: v.string().required().minLength(2, { message: 'Name is required (min 2 characters)' }),
    email: v.string().required().email({ message: 'Valid email address is required' }),
    subject: v
      .string()
      .required()
      .minLength(5, { message: 'Subject must be at least 5 characters' }),
    message: v
      .string()
      .required()
      .minLength(10, { message: 'Message must be at least 10 characters' })
      .maxLength(500, { message: 'Message must not exceed 500 characters' }),
  });

  // Bind contact form
  const contactForm = document.getElementById('contact-form');
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
      contactAdapter.reset();
    },
  });

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Display submission results
   */
  function showResults(title, data) {
    const resultsSection = document.getElementById('results');
    const resultData = document.getElementById('result-data');

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
    const resultsSection = document.getElementById('results');
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
  // Real-time Validation Feedback
  // ============================================================================

  // Subscribe to form state changes for registration form
  registrationAdapter.subscribeToForm((state) => {
    console.log('Registration form state:', {
      isValid: state.isValid,
      validating: state.validating,
      touched: state.touched,
      dirty: state.dirty,
      errorCount: state.errors.length,
    });
  });

  // Subscribe to specific field for custom behavior
  registrationAdapter.subscribeToField('password', (fieldState) => {
    const passwordInput = document.getElementById('password');
    const hint = document.getElementById('password-hint');

    if (fieldState.touched && fieldState.errors.length > 0) {
      hint.textContent = fieldState.errors[0].message;
      hint.classList.add('error-hint');
    } else {
      hint.textContent = 'Minimum 8 characters, with uppercase, lowercase, and number';
      hint.classList.remove('error-hint');
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
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║  🎯 Valora Vanilla JS Example                           ║
║                                                          ║
║  Try the following:                                      ║
║  • Fill in the forms and see real-time validation       ║
║  • Check console for validation state logs              ║
║  • Inspect error messages in the DOM                    ║
║  • Try submitting invalid data                          ║
║                                                          ║
║  Adapter APIs available:                                ║
║  • window.registrationAdapter                           ║
║  • window.contactAdapter                                ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
`);

  // Expose adapters for debugging
  window.registrationAdapter = registrationAdapter;
  window.contactAdapter = contactAdapter;

  console.log('✅ Valora initialized successfully!');
}); // End of DOMContentLoaded
