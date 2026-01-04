import { createVanillaAdapter } from '../../src/adapters/vanilla';
import { string, number } from '../../src/validators';

// Create adapter with validators
const adapter = createVanillaAdapter({
  username: string().required().minLength(3).maxLength(20),
  email: string().required().email(),
  password: string().required().minLength(6).maxLength(50),
  age: number().required().min(18).max(100),
});

// Get DOM elements
const form = document.getElementById('registrationForm') as HTMLFormElement;
const resultDiv = document.getElementById('result') as HTMLDivElement;

// Bind form with adapter
const cleanup = adapter.bindForm({
  form,
  validateOnChange: true,
  validateOnBlur: true,
  validateOnSubmit: true,
  errorDisplay: {
    errorPlacement: 'after', // Display error right after input field
    errorClass: 'valora-error',
    errorMessageClass: 'valora-error-message',
    invalidInputClass: 'valora-invalid',
  },
  onSubmit: async (values) => {
    console.log('Form submitted with values:', values);

    // Display result
    resultDiv.className = 'result success';
    resultDiv.innerHTML = `
      <h3>✓ Registration successful!</h3>
      <pre>${JSON.stringify(values, null, 2)}</pre>
    `;

    // Reset form after 3 seconds
    setTimeout(() => {
      adapter.resetAll();
      resultDiv.style.display = 'none';
    }, 3000);
  },
});

// Log form state changes for debugging
adapter.subscribeToForm((state) => {
  console.log('Form state changed:', {
    isValid: state.isValid,
    isDirty: state.dirty,
    errors: state.errors,
  });
});

// Cleanup when page is closed
window.addEventListener('beforeunload', () => {
  cleanup();
  adapter.destroy();
});
