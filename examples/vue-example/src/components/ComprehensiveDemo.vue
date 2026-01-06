<template>
  <div class="comprehensive-demo">
    <!-- ===================================================================== -->
    <!-- SECTION 1: User Registration Form                                    -->
    <!-- Demonstrates: Complex validation, subscriptions, state management    -->
    <!-- ===================================================================== -->
    <section class="form-section">
      <h2>User Registration</h2>
      <p class="section-description">
        Showcasing complex validation rules, form state subscriptions, and
        reactive UI updates
      </p>

      <form @submit.prevent="handleSubmit" class="demo-form">
        <!-- USERNAME -->
        <div class="form-group">
          <label for="username">
            Username
            <span class="required">*</span>
          </label>
          <input
            id="username"
            v-model="username.modelValue.value"
            @blur="() => { username.onBlur(); username.validate(); }"
            type="text"
            placeholder="john_doe123"
            :class="{
              error: username.shouldShowError.value,
              success: username.isValid.value && username.touched.value,
            }"
          />
          <small class="hint"
            >Lowercase letters, numbers, and underscores only</small
          >
          <div v-if="username.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in username.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- PASSWORD -->
        <div class="form-group">
          <label for="password">
            Password
            <span class="required">*</span>
          </label>
          <input
            id="password"
            v-model="password.modelValue.value"
            @blur="() => { password.onBlur(); password.validate(); }"
            type="password"
            placeholder="••••••••"
            :class="{
              error: password.shouldShowError.value,
              success: password.isValid.value && password.touched.value,
            }"
          />
          <!-- Password Strength Indicator (using subscriptions) -->
          <div v-if="password.modelValue.value" class="password-strength">
            <div class="strength-bar">
              <div
                class="strength-fill"
                :class="passwordStrength.level"
                :style="{ width: `${passwordStrength.percentage}%` }"
              ></div>
            </div>
            <span class="strength-label" :class="passwordStrength.level">
              {{ passwordStrength.label }}
            </span>
          </div>
          <small id="password-hint" class="hint">{{ passwordHint }}</small>
          <div v-if="password.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in password.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label for="email">
            Email
            <span class="required">*</span>
          </label>
          <input
            id="email"
            v-model="email.modelValue.value"
            @blur="() => { email.onBlur(); email.validate(); }"
            type="email"
            placeholder="example@company.com"
            :class="{
              error: email.shouldShowError.value,
              success: email.isValid.value && email.touched.value,
            }"
          />
          <small class="hint">Must be a valid email address</small>
          <div v-if="email.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in email.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- PHONE NUMBER -->
        <div class="form-group">
          <label for="phoneNumber">
            Phone Number
            <span class="required">*</span>
          </label>
          <input
            id="phoneNumber"
            v-model="phoneNumber.modelValue.value"
            @blur="() => { phoneNumber.onBlur(); phoneNumber.validate(); }"
            type="tel"
            placeholder="0912345678"
            :class="{
              error: phoneNumber.shouldShowError.value,
              success: phoneNumber.isValid.value && phoneNumber.touched.value,
            }"
          />
          <small class="hint"
            >Vietnamese phone number (10 digits, starts with 0)</small
          >
          <div v-if="phoneNumber.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in phoneNumber.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- AGE -->
        <div class="form-group">
          <label for="age">
            Age
            <span class="required">*</span>
          </label>
          <input
            id="age"
            v-model.number="age.modelValue.value"
            @blur="() => { age.onBlur(); age.validate(); }"
            type="number"
            placeholder="25"
            :class="{
              error: age.shouldShowError.value,
              success: age.isValid.value && age.touched.value,
            }"
          />
          <small class="hint">Must be at least 18 years old</small>
          <div v-if="age.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in age.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
          <div
            v-if="age.modelValue.value && age.isValid.value"
            class="age-info"
          >
            <span class="age-badge">{{
              getAgeCategory(age.modelValue.value)
            }}</span>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button type="submit" class="btn-submit" :disabled="!canSubmitForm">
            {{ formState.isSubmitting ? "Submitting..." : "Submit" }}
          </button>
          <button type="button" class="btn-reset" @click="resetForm">
            Reset
          </button>
        </div>

        <!-- Form State Info (using subscriptions) -->
        <div v-if="showFormStateDebug" class="form-state-debug">
          <strong>Form State (Live):</strong>
          <ul>
            <li>Valid: {{ formState.isValid.value ? "✓" : "✗" }}</li>
            <li>Touched: {{ formState.touched.value ? "✓" : "✗" }}</li>
            <li>Dirty: {{ formState.dirty.value ? "✓" : "✗" }}</li>
            <li>Errors: {{ formState.errors.value.length }}</li>
          </ul>
        </div>
      </form>
    </section>

    <!-- ===================================================================== -->
    <!-- SECTION 2: Contact Form                                              -->
    <!-- Demonstrates: Character counter, field subscriptions                 -->
    <!-- ===================================================================== -->
    <section class="form-section">
      <h2>Contact Us</h2>
      <p class="section-description">
        Demonstrating character counter using field subscriptions
      </p>

      <form @submit.prevent="handleContactSubmit" class="demo-form">
        <!-- NAME -->
        <div class="form-group">
          <label for="contact-name">
            Name
            <span class="required">*</span>
          </label>
          <input
            id="contact-name"
            v-model="contactName.modelValue.value"
            @blur="contactName.onBlur"
            type="text"
            placeholder="Your name"
            :class="{
              error: contactName.shouldShowError.value,
              success: contactName.isValid.value && contactName.touched.value,
            }"
          />
          <div v-if="contactName.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in contactName.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- EMAIL -->
        <div class="form-group">
          <label for="contact-email">
            Email
            <span class="required">*</span>
          </label>
          <input
            id="contact-email"
            v-model="contactEmail.modelValue.value"
            @blur="contactEmail.onBlur"
            type="email"
            placeholder="your@email.com"
            :class="{
              error: contactEmail.shouldShowError.value,
              success: contactEmail.isValid.value && contactEmail.touched.value,
            }"
          />
          <div v-if="contactEmail.shouldShowError.value" class="error-messages">
            <p
              v-for="(msg, index) in contactEmail.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- MESSAGE with Character Counter -->
        <div class="form-group">
          <label for="contact-message">
            Message
            <span class="required">*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="contactMessage.modelValue.value"
            @blur="contactMessage.onBlur"
            rows="5"
            placeholder="Your message here..."
            :class="{
              error: contactMessage.shouldShowError.value,
              success:
                contactMessage.isValid.value && contactMessage.touched.value,
            }"
          ></textarea>
          <!-- Character Counter (using field subscription) -->
          <small class="hint" :class="characterCounterClass">{{
            characterCounterText
          }}</small>
          <div
            v-if="contactMessage.shouldShowError.value"
            class="error-messages"
          >
            <p
              v-for="(msg, index) in contactMessage.errorMessages.value"
              :key="index"
              class="error-message"
            >
              {{ msg }}
            </p>
          </div>
        </div>

        <!-- Form Actions -->
        <div class="form-actions">
          <button
            type="submit"
            class="btn-submit"
            :disabled="!canSubmitContactForm"
          >
            Send Message
          </button>
          <button type="button" class="btn-secondary" @click="resetContactForm">
            Clear
          </button>
        </div>
      </form>
    </section>

    <!-- Toast Container -->
    <transition-group name="toast" tag="div" class="toast-container">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </transition-group>

    <!-- Success Modal -->
    <div
      v-if="showSuccessModal"
      class="modal-overlay"
      @click="showSuccessModal = false"
    >
      <div class="modal" @click.stop>
        <h2>{{ successModalTitle }}</h2>
        <p>All data has been validated successfully.</p>
        <pre class="data-preview">{{ successModalData }}</pre>
        <button @click="showSuccessModal = false" class="btn-close">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Valora Vue Example - Comprehensive Demo
 *
 * This component showcases the full capabilities of the Valora validation framework
 * integrated with Vue 3, demonstrating:
 *
 * 1. Complex validation schemas with custom rules
 * 2. Form state management using subscriptions
 * 3. Field-specific subscriptions for reactive UI updates
 * 4. Character counters and password strength indicators
 * 5. Multiple forms with independent validation
 * 6. Toast notifications and success modals
 * 7. Submit button state management based on form validity
 */

import { ref, computed, onMounted } from "vue";
import {
  useFormValidation,
  useFieldValidation,
} from "@tqtos/valora/adapters/vue";
import { string, number } from "@tqtos/valora/validators";
import "./ComprehensiveDemo.css";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface RegistrationForm {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  age: number;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface Toast {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

// ============================================================================
// SECTION 1: REGISTRATION FORM SETUP
// ============================================================================

const registrationSchema = {
  username: string()
    .required({ message: "Username is required" })
    .minLength(3, { message: "Username must have at least 3 characters" })
    .maxLength(20, { message: "Username must be a maximum of 20 characters" })
    .pattern(/^[a-z0-9_]+$/, {
      message: "Only lowercase letters, numbers, and underscores",
    })
    .custom(
      (value) => /^[a-z]/.test(value),
      "Must start with a lowercase letter",
    ),

  password: string()
    .required({ message: "Password is required" })
    .minLength(8, { message: "Password must be at least 8 characters" })
    .custom((value) => /[A-Z]/.test(value), "Must contain uppercase letter")
    .custom((value) => /[a-z]/.test(value), "Must contain lowercase letter")
    .custom((value) => /[0-9]/.test(value), "Must contain a number")
    .custom(
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      "Must contain special character",
    ),

  email: string()
    .required({ message: "Email is required" })
    .email({ message: "Invalid email format" }),

  phoneNumber: string()
    .required({ message: "Phone number is required" })
    .numeric({ message: "Must contain only numbers" })
    .length(10, { message: "Phone number must be 10 digits" })
    .pattern(/^0\d{9}$/, { message: "Must start with 0" })
    .custom((value) => {
      const prefixes = [
        "086",
        "096",
        "097",
        "098",
        "032",
        "033",
        "034",
        "035",
        "036",
        "037",
        "038",
        "039",
        "088",
        "091",
        "094",
        "083",
        "084",
        "085",
        "081",
        "082",
        "089",
        "090",
        "093",
        "070",
        "079",
        "077",
        "076",
        "078",
      ];
      return prefixes.some((prefix) => value.startsWith(prefix));
    }, "Invalid Vietnamese phone number"),

  age: number()
    .required({ message: "Age is required" })
    .integer({ message: "Age must be an integer" })
    .min(18, { message: "Must be at least 18 years old" })
    .max(100, { message: "Age must not exceed 100" }),
};

// Create registration form validation
const { adapter, formState, validateAll, resetAll } =
  useFormValidation<RegistrationForm>(registrationSchema);

// Create field validations
const username = useFieldValidation(adapter, "username");
const password = useFieldValidation(adapter, "password");
const email = useFieldValidation(adapter, "email");
const phoneNumber = useFieldValidation(adapter, "phoneNumber");
const age = useFieldValidation(adapter, "age");

// ============================================================================
// SECTION 2: CONTACT FORM SETUP
// ============================================================================

const contactSchema = {
  name: string()
    .required({ message: "Name is required" })
    .minLength(2, { message: "Name must be at least 2 characters" })
    .maxLength(100, { message: "Name is too long" }),

  email: string()
    .required({ message: "Email is required" })
    .email({ message: "Valid email address is required" }),

  message: string()
    .required({ message: "Message is required" })
    .minLength(10, { message: "Message must be at least 10 characters" })
    .maxLength(500, { message: "Message must not exceed 500 characters" }),
};

// Create contact form validation
const {
  adapter: contactAdapter,
  formState: contactFormState,
  validateAll: validateContact,
  resetAll: resetContact,
} = useFormValidation<ContactForm>(contactSchema);

// Create contact field validations
const contactName = useFieldValidation(contactAdapter, "name");
const contactEmail = useFieldValidation(contactAdapter, "email");
const contactMessage = useFieldValidation(contactAdapter, "message");

// ============================================================================
// FEATURE 1: Password Strength Indicator (using computed + subscriptions)
// ============================================================================

const passwordStrength = computed(() => {
  const pwd = password.modelValue.value || "";
  let strength = 0;

  if (pwd.length >= 8) strength += 25;
  if (pwd.length >= 12) strength += 15;
  if (/[A-Z]/.test(pwd)) strength += 20;
  if (/[a-z]/.test(pwd)) strength += 20;
  if (/[0-9]/.test(pwd)) strength += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 10;

  let level = "weak";
  let label = "Weak";

  if (strength >= 80) {
    level = "strong";
    label = "Strong";
  } else if (strength >= 50) {
    level = "medium";
    label = "Medium";
  }

  return { percentage: strength, level, label };
});

// Password hint - updates using field subscription
const passwordHint = ref(
  "Minimum 8 characters with uppercase, lowercase, number, and special char",
);

// Subscribe to password field for custom hint updates
adapter.subscribeToField("password", (fieldState) => {
  if (fieldState.touched && fieldState.errors.length > 0) {
    passwordHint.value = fieldState.errors[0]?.message || "Invalid password";
  } else if (
    fieldState.touched &&
    fieldState.errors.length === 0 &&
    fieldState.value
  ) {
    passwordHint.value = "✓ Strong password!";
  } else {
    passwordHint.value =
      "Minimum 8 characters with uppercase, lowercase, number, and special char";
  }
});

// ============================================================================
// FEATURE 2: Age Category
// ============================================================================

const getAgeCategory = (ageValue: number): string => {
  if (ageValue < 18) return "Under 18";
  if (ageValue < 30) return "Young Adult";
  if (ageValue < 50) return "Middle Age";
  return "Senior";
};

// ============================================================================
// FEATURE 3: Character Counter (using field subscription)
// ============================================================================

const characterCounterText = ref("10-500 characters required");
const characterCounterClass = ref("");

// Subscribe to message field for character counter
contactAdapter.subscribeToField("message", (fieldState) => {
  const currentLength = fieldState.value?.length || 0;
  const maxLength = 500;
  const remaining = maxLength - currentLength;

  if (currentLength >= 10) {
    characterCounterText.value = `${currentLength}/500 characters (${remaining} remaining)`;
    characterCounterClass.value = "success-hint";
  } else if (fieldState.touched) {
    characterCounterText.value = `${currentLength}/500 characters (minimum 10 required)`;
    characterCounterClass.value = "error-hint";
  } else {
    characterCounterText.value = "10-500 characters required";
    characterCounterClass.value = "";
  }
});

// ============================================================================
// FEATURE 4: Submit Button State Management (using form subscription)
// ============================================================================

const canSubmitForm = ref(false);
const canSubmitContactForm = ref(false);

// Subscribe to registration form state for submit button management
adapter.subscribeToForm((state) => {
  canSubmitForm.value = state.touched && state.isValid && !state.validating;

  // Log form state changes (demonstrates subscription usage)
  console.log("📋 Registration Form State:", {
    isValid: state.isValid,
    validating: state.validating,
    touched: state.touched,
    dirty: state.dirty,
    errorCount: state.errors.length,
  });
});

// Subscribe to contact form state
contactAdapter.subscribeToForm((state) => {
  canSubmitContactForm.value =
    state.touched && state.isValid && !state.validating;

  console.log("📨 Contact Form State:", {
    isValid: state.isValid,
    touched: state.touched,
    errors: state.errors.length,
  });
});

// ============================================================================
// FEATURE 5: Toast Notifications
// ============================================================================

const toasts = ref<Toast[]>([]);
let toastId = 0;

const showToast = (message: string, type: Toast["type"] = "info") => {
  const id = toastId++;
  toasts.value.push({ id, message, type });

  setTimeout(() => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }, 4000);
};

// ============================================================================
// FEATURE 6: Success Modal
// ============================================================================

const showSuccessModal = ref(false);
const successModalTitle = ref("Success!");
const successModalData = ref("");

// ============================================================================
// FORM HANDLERS
// ============================================================================

// Registration form submit
const handleSubmit = () => {
  const result = validateAll();

  if (result.success) {
    const values = adapter.getValues();
    successModalTitle.value = "Registration Successful!";
    successModalData.value = JSON.stringify(values, null, 2);
    showSuccessModal.value = true;
    showToast("Registration submitted successfully!", "success");

    console.log("✅ Registration submitted:", values);
  } else {
    // Touch all fields to show validation errors
    username.onBlur();
    password.onBlur();
    email.onBlur();
    phoneNumber.onBlur();
    age.onBlur();
    showToast(
      `Please fix ${result.errors.length} error(s) before submitting`,
      "error",
    );
  }
};

// Contact form submit
const handleContactSubmit = () => {
  const result = validateContact();

  if (result.success) {
    const values = contactAdapter.getValues();
    successModalTitle.value = "Message Sent!";
    successModalData.value = JSON.stringify(values, null, 2);
    showSuccessModal.value = true;
    showToast("Message sent successfully!", "success");

    console.log("✅ Contact message sent:", values);

    // Reset contact form after successful submission
    resetContact();
  } else {
    // Touch all fields to show validation errors
    contactName.onBlur();
    contactEmail.onBlur();
    contactMessage.onBlur();
    showToast(
      `Please fix ${result.errors.length} error(s) before sending`,
      "error",
    );
  }
};

// Reset registration form
const resetForm = () => {
  resetAll();
  showToast("Registration form has been reset", "info");
};

// Reset contact form
const resetContactForm = () => {
  resetContact();
  showToast("Contact form has been cleared", "info");
};

// ============================================================================
// DEBUG FEATURES
// ============================================================================

const showFormStateDebug = ref(false);

// Toggle debug view (can be controlled via dev tools)
if (import.meta.env.DEV) {
  (window as any).toggleDebug = () => {
    showFormStateDebug.value = !showFormStateDebug.value;
  };
}

// ============================================================================
// LIFECYCLE & CONSOLE LOGGING
// ============================================================================

onMounted(() => {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║  🎯 Valora Vue Example - Framework Feature Showcase          ║
║                                                               ║
║  ✨ Features Demonstrated:                                   ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Vue 3 Composition API integration                         ║
║  • Complex validation rules with custom messages             ║
║  • Real-time validation on input/blur                        ║
║  • Form state subscriptions & reactive updates               ║
║  • Field-specific subscriptions                              ║
║  • Character counter (contact form message)                  ║
║  • Password strength indicator                               ║
║  • Submit button state management                            ║
║  • Toast notifications                                       ║
║  • Success modal                                             ║
║  • Multiple independent forms                                ║
║                                                               ║
║  🔧 Try These:                                               ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  • Watch password strength change as you type                ║
║  • See character counter update in contact form              ║
║  • Submit invalid data → see error messages                  ║
║  • Check console for validation state logs                   ║
║  • Notice submit button disabled when form invalid           ║
║                                                               ║
║  🛠️  Vue Adapter APIs (for debugging):                      ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  window.registrationAdapter.getFormState()                   ║
║  window.registrationAdapter.getFieldState('email')           ║
║  window.registrationAdapter.validateAll()                    ║
║  window.contactAdapter.getValues()                           ║
║  window.toggleDebug()  // Toggle form state debug view      ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

  // Expose adapters globally for debugging in dev mode
  if (import.meta.env.DEV) {
    (window as any).registrationAdapter = adapter;
    (window as any).contactAdapter = contactAdapter;
    console.log("✅ Valora Vue adapter initialized successfully!");
    console.log(
      "💡 Tip: Open the console to see validation state updates in real-time",
    );
  }
});
</script>
