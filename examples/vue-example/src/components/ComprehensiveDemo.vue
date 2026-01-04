<template>
  <div class="comprehensive-demo">
    
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
          @blur="username.onBlur"
          type="text"
          placeholder="john_doe123"
          :class="{ 'error': username.shouldShowError.value, 'success': username.isValid.value && username.touched.value }"
        />
        <div v-if="username.shouldShowError.value" class="error-messages">
          <p v-for="(msg, index) in username.errorMessages.value" :key="index" class="error-message">
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
          @blur="password.onBlur"
          type="password"
          placeholder="••••••••"
          :class="{ 'error': password.shouldShowError.value, 'success': password.isValid.value && password.touched.value }"
        />
        <div v-if="password.shouldShowError.value" class="error-messages">
          <p v-for="(msg, index) in password.errorMessages.value" :key="index" class="error-message">
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
          @blur="email.onBlur"
          type="email"
          placeholder="example@company.com"
          :class="{ 'error': email.shouldShowError.value, 'success': email.isValid.value && email.touched.value }"
        />
        <div v-if="email.shouldShowError.value" class="error-messages">
          <p v-for="(msg, index) in email.errorMessages.value" :key="index" class="error-message">
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
          @blur="phoneNumber.onBlur"
          type="tel"
          placeholder="0912345678"
          :class="{ 'error': phoneNumber.shouldShowError.value, 'success': phoneNumber.isValid.value && phoneNumber.touched.value }"
        />
        <div v-if="phoneNumber.shouldShowError.value" class="error-messages">
          <p v-for="(msg, index) in phoneNumber.errorMessages.value" :key="index" class="error-message">
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
          @blur="age.onBlur"
          type="number"
          placeholder="25"
          :class="{ 'error': age.shouldShowError.value, 'success': age.isValid.value && age.touched.value }"
        />
        <div v-if="age.shouldShowError.value" class="error-messages">
          <p v-for="(msg, index) in age.errorMessages.value" :key="index" class="error-message">
            {{ msg }}
          </p>
        </div>
        <div v-if="age.modelValue.value && age.isValid.value" class="age-info">
          <span class="age-badge">{{ getAgeCategory(age.modelValue.value) }}</span>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="formState.isSubmitting"
        >
          {{ formState.isSubmitting ? 'Submitting...' : 'Submit' }}
        </button>
        <button 
          type="button" 
          class="btn-reset"
          @click="resetForm"
        >
          Reset
        </button>
      </div>
    </form>

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
    <div v-if="showSuccessModal" class="modal-overlay" @click="showSuccessModal = false">
      <div class="modal" @click.stop>
        <h2>Success!</h2>
        <p>All data has been validated successfully.</p>
        <pre class="data-preview">{{ JSON.stringify({
  username: username.modelValue.value,
  password: password.modelValue.value,
  email: email.modelValue.value,
  phoneNumber: phoneNumber.modelValue.value,
  age: age.modelValue.value
}, null, 2) }}</pre>
        <button @click="showSuccessModal = false" class="btn-close">Close</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number } from '@validators/index';
import './ComprehensiveDemo.css';

interface ComprehensiveForm {
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  age: number;
}


const validationSchema = {
  username: string()
    .required('Username is required')                                   
    .minLength(3, 'Username must have at least 3 characters.')                    
    .maxLength(20, 'Username must be a maximum of 20 characters.')                   
    .pattern(/^[a-z0-9_]+$/, 'Only lowercase letters, numbers, and underscores.') 
    .custom(                                                              
      (value) => /^[a-z]/.test(value),
      'Must start with a lowercase.'
    ),

  password: string()
    .required('Password is required')                             
    .minLength(8, 'Password must be at least 8 characters')            
    .custom((value) => /[A-Z]/.test(value), 'Must contain uppercase letter')    
    .custom((value) => /[a-z]/.test(value), 'Must contain lowercase letter') 
    .custom((value) => /[0-9]/.test(value), 'Must contain a number')     
    .custom(                                                     
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      'Must contain special character'
    ),

  // Email
  email: string()
    .required('Email is required')
    .email('Invalid email format'),

  // Phone Number
  phoneNumber: string()
    .required('Phone number is required')                                   
    .numeric('Must contain only numbers')                                          
    .length(10, 'Phone number must be 10 digits')                            
    .pattern(/^0\d{9}$/, 'Must start with 0')                            
    .custom(                                                                   
      (value) => {
        const prefixes = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', 
                         '088', '091', '094', '083', '084', '085', '081', '082',                              
                         '089', '090', '093', '070', '079', '077', '076', '078'];                             
        return prefixes.some(prefix => value.startsWith(prefix));
      },
      'Invalid Vietnamese phone number'
    ),

  // Age
  age: number()
    .required('Age is required')             
    .integer('Age must be an integer')      
    .min(18, 'Must be at least 18 years old')       
    .max(100, 'Age must not exceed 100'),      
};

// Form validation hook
const { adapter, formState, validateAll, resetAll } = useFormValidation<ComprehensiveForm>(validationSchema);

// Create field validations
const username = useFieldValidation(adapter, 'username');
const password = useFieldValidation(adapter, 'password');
const email = useFieldValidation(adapter, 'email');
const phoneNumber = useFieldValidation(adapter, 'phoneNumber');
const age = useFieldValidation(adapter, 'age');

const fieldLabels: Record<string, string> = {
  username: 'Username',
  password: 'Password',
  email: 'Email',
  phoneNumber: 'Phone Number',
  age: 'Age',
};

const getFieldLabel = (fieldName: string): string => {
  return fieldLabels[fieldName] || fieldName;
};

// Password strength calculator
const passwordStrength = computed(() => {
  const pwd = password.modelValue.value || '';
  let strength = 0;
  
  if (pwd.length >= 8) strength += 25;
  if (pwd.length >= 12) strength += 15;
  if (/[A-Z]/.test(pwd)) strength += 20;
  if (/[a-z]/.test(pwd)) strength += 20;
  if (/[0-9]/.test(pwd)) strength += 10;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) strength += 10;
  
  let level = 'weak';
  let label = 'Weak';
  
  if (strength >= 80) {
    level = 'strong';
    label = 'Strong';
  } else if (strength >= 50) {
    level = 'medium';
    label = 'Medium';
  }
  
  return { percentage: strength, level, label };
});

// Age category calculator
const getAgeCategory = (ageValue: number): string => {
  if (ageValue < 18) return 'Under 18';
  if (ageValue < 30) return 'Young Adult';
  if (ageValue < 50) return 'Middle Age';
  return 'Senior';
};

// Toast notifications (Yêu cầu 1: Cách 5 - Toast)
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const toasts = ref<Toast[]>([]);
let toastId = 0;

const showToast = (message: string, type: Toast['type'] = 'info') => {
  const id = toastId++;
  toasts.value.push({ id, message, type });
  
  setTimeout(() => {
    toasts.value = toasts.value.filter(t => t.id !== id);
  }, 4000);
};

// Success modal
const showSuccessModal = ref(false);

// Validate all fields
const validateAllFields = () => {
  const result = validateAll();
  
  if (result.success) {
    showToast('All fields are valid!', 'success');
  } else {
    showToast(`${result.errors.length} error(s) found`, 'error');
  }
};

// Handle submit
const handleSubmit = () => {
  const result = validateAll();
  
  if (result.success) {
    showToast('Form submitted successfully!', 'success');
    showSuccessModal.value = true;
  } else {
    showToast(`Please fix ${result.errors.length} error(s) before submitting`, 'error');
  }
};

// Reset form
const resetForm = () => {
  resetAll();
  showToast('Form has been reset', 'info');
};
</script>
