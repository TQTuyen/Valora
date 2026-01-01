<template>
  <div class="comprehensive-demo">
    
    <form @submit.prevent="handleSubmit" class="demo-form">
      
      <!-- TRƯỜNG 1: USERNAME - Demo yêu cầu 3, 4, 5, 6 -->
      <div class="form-section highlight">
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
          <div v-if="username.shouldShowError.value" class="inline-errors">
            <p v-for="(msg, index) in username.errorMessages.value" :key="index" class="error-message">
              {{ msg }}
            </p>
          </div>
        </div>
      </div>

      <!-- TRƯỜNG 2: PASSWORD - Demo yêu cầu 2, 3, 4, 6 + Cách hiển thị 3 -->
      <div class="form-section highlight">
        
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
          
          
          
          <!-- YÊU CẦU 1: Cách 3 - Badge errors (dạng tag) -->
          <div v-if="password.shouldShowError.value" class="badge-errors">
            <span 
              v-for="(msg, index) in password.errorMessages.value" 
              :key="index"
              class="error-badge"
            >
              {{ msg }}
            </span>
          </div>
        </div>
      </div>

      <!-- TRƯỜNG 3: EMAIL - Demo yêu cầu 3, 5 + Cách hiển thị 4 -->
      <div class="form-section highlight">
       
        
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
          
          <!-- YÊU CẦU 1: Cách 4 - Tooltip errors (hover để xem) -->
          <div v-if="email.shouldShowError.value" class="tooltip-errors">
            <div class="tooltip-trigger">❌ Có lỗi - di chuột vào đây</div>
            <div class="tooltip-content">
              <p v-for="(msg, index) in email.errorMessages.value" :key="index">
                • {{ msg }}
              </p>
              <p class="hint-text">💡 Cách 4: <strong>Tooltip errors</strong> - hover để xem chi tiết</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TRƯỜNG 4: PHONE - Demo yêu cầu 3, 4, 5, 6 -->
      <div class="form-section highlight">
        
        <div class="form-group">
          <label for="phoneNumber">
            Số điện thoại
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
          
          <!-- Inline errors cho phone -->
          <div v-if="phoneNumber.shouldShowError.value" class="inline-errors">
            <p v-for="(msg, index) in phoneNumber.errorMessages.value" :key="index" class="error-message">
            {{ msg }}
            </p>
          </div>
        </div>
      </div>

      <!-- TRƯỜNG 5: AGE - Demo Number validation + Business logic -->
      <div class="form-section highlight">
        <div class="form-group">
          <label for="age">
            Tuổi
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
          
          <div v-if="age.shouldShowError.value" class="inline-errors">
            <p v-for="(msg, index) in age.errorMessages.value" :key="index" class="error-message">
              {{ msg }}
            </p>
          </div>
          
          <!-- Age category indicator -->
          <div v-if="age.modelValue.value && age.isValid.value" class="age-category">
            <span class="category-badge">{{ getAgeCategory(age.modelValue.value) }}</span>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="formState.isSubmitting"
        >
          {{ formState.isSubmitting ? '⏳ Đang xử lý...' : '✓ Submit Form' }}
        </button>
        <button 
          type="button" 
          class="btn-validate"
          @click="validateAllFields"
        >
          🔍 Validate tất cả
        </button>
        <button 
          type="button" 
          class="btn-reset"
          @click="resetForm"
        >
          🔄 Reset Form
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
        <h2>🎉 Validation thành công!</h2>
        <p>Tất cả dữ liệu đã được validate và hợp lệ.</p>
        <pre class="data-preview">{{ JSON.stringify({
  username: username.modelValue.value,
  password: password.modelValue.value,
  email: email.modelValue.value,
  phoneNumber: phoneNumber.modelValue.value,
  age: age.modelValue.value
}, null, 2) }}</pre>
        <button @click="showSuccessModal = false" class="btn-close">Đóng</button>
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
    .minLength(8, 'Mật khẩu phải có ít nhất 8 ký tự')            
    .custom((value) => /[A-Z]/.test(value), 'Thiếu chữ hoa')    
    .custom((value) => /[a-z]/.test(value), 'Thiếu chữ thường') 
    .custom((value) => /[0-9]/.test(value), 'Thiếu chữ số')     
    .custom(                                                     
      (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      'Thiếu ký tự đặc biệt'
    ),

  // Email: Demo yêu cầu 3, 5
  email: string()
    .required('Email là bắt buộc')  // Yêu cầu 3: Declarative
    .email('Email không hợp lệ'),   // Yêu cầu 3 + 5: Built-in regex pattern

  // Phone: Demo yêu cầu 3, 4, 5, 6
  phoneNumber: string()
    .required('Số điện thoại là bắt buộc')                                   
    .numeric('Chỉ được chứa chữ số')                                          
    .length(10, 'Số điện thoại phải có 10 chữ số')                            
    .pattern(/^0\d{9}$/, 'Phải bắt đầu bằng số 0')                            
    .custom(                                                                   
      (value) => {
        const prefixes = ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039', 
                         '088', '091', '094', '083', '084', '085', '081', '082',                              
                         '089', '090', '093', '070', '079', '077', '076', '078'];                             
        return prefixes.some(prefix => value.startsWith(prefix));
      },
      'Số điện thoại không thuộc nhà mạng Việt Nam'
    ),

  // Age: Demo yêu cầu 2, 3, 4, 6
  age: number()
    .required('Tuổi là bắt buộc')             
    .integer('Tuổi phải là số nguyên')      
    .min(18, 'Phải từ 18 tuổi trở lên')       
    .max(100, 'Tuổi không được quá 100'),      
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
  password: 'Mật khẩu',
  email: 'Email',
  phoneNumber: 'Số điện thoại',
  age: 'Tuổi',
};

const getFieldLabel = (fieldName: string): string => {
  return fieldLabels[fieldName] || fieldName;
};

// Password strength calculator (Yêu cầu 2: Code-based validation)
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
  let label = '❌ Yếu';
  
  if (strength >= 80) {
    level = 'strong';
    label = '✅ Mạnh';
  } else if (strength >= 50) {
    level = 'medium';
    label = '⚠️ Trung bình';
  }
  
  return { percentage: strength, level, label };
});

// Age category calculator (Yêu cầu 2: Code-based logic)
const getAgeCategory = (ageValue: number): string => {
  if (ageValue < 18) return '🚫 Chưa đủ tuổi';
  if (ageValue < 30) return '👨‍🎓 Thanh niên';
  if (ageValue < 50) return '👨‍💼 Trung niên';
  return '👴 Cao tuổi';
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
    showToast('✅ Tất cả các trường đều hợp lệ!', 'success');
  } else {
    showToast(`❌ Có ${result.errors.length} lỗi cần sửa`, 'error');
  }
};

// Handle submit
const handleSubmit = () => {
  const result = validateAll();
  
  if (result.success) {
    showToast('✅ Form đã được submit thành công!', 'success');
    showSuccessModal.value = true;
  } else {
    showToast(`❌ Vui lòng sửa ${result.errors.length} lỗi trước khi submit`, 'error');
  }
};

// Reset form
const resetForm = () => {
  resetAll();
  showToast('🔄 Form đã được reset', 'info');
};
</script>
