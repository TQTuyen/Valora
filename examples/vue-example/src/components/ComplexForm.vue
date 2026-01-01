<template>
  <div class="section">
    <h2>5. Complex Form - Đăng Ký Hoàn Chỉnh</h2>
    <p>Form phức tạp với nhiều loại validation và thông báo khác nhau</p>

    <form @submit.prevent="handleSubmit">
      <!-- Personal Information -->
      <h3>Thông Tin Cá Nhân</h3>
      
      <div class="form-group">
        <label for="firstName">Họ *</label>
        <input
          id="firstName"
          v-model="firstName.modelValue.value"
          @blur="firstName.onBlur"
          :class="{ error: firstName.shouldShowError.value, valid: firstName.isValid.value && firstName.touched.value }"
        />
        <div v-if="firstName.shouldShowError.value" class="error-message">
          {{ firstName.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="lastName">Tên *</label>
        <input
          id="lastName"
          v-model="lastName.modelValue.value"
          @blur="lastName.onBlur"
          :class="{ error: lastName.shouldShowError.value, valid: lastName.isValid.value && lastName.touched.value }"
        />
        <div v-if="lastName.shouldShowError.value" class="error-message">
          {{ lastName.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="birthYear">Năm Sinh *</label>
        <input
          id="birthYear"
          v-model.number="birthYear.modelValue.value"
          type="number"
          @blur="birthYear.onBlur"
          :class="{ error: birthYear.shouldShowError.value, valid: birthYear.isValid.value && birthYear.touched.value }"
        />
        <div v-if="birthYear.shouldShowError.value" class="error-message">
          {{ birthYear.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="gender">Giới Tính *</label>
        <select
          id="gender"
          v-model="gender.modelValue.value"
          @blur="gender.onBlur"
          :class="{ error: gender.shouldShowError.value, valid: gender.isValid.value && gender.touched.value }"
        >
          <option value="">-- Chọn giới tính --</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
        <div v-if="gender.shouldShowError.value" class="error-message">
          {{ gender.error.value }}
        </div>
      </div>

      <!-- Account Information -->
      <h3>Thông Tin Tài Khoản</h3>

      <div class="form-group">
        <label for="regEmail">Email *</label>
        <input
          id="regEmail"
          v-model="email.modelValue.value"
          type="email"
          @blur="email.onBlur"
          :class="{ error: email.shouldShowError.value, valid: email.isValid.value && email.touched.value }"
        />
        <div v-if="email.shouldShowError.value" class="error-message">
          {{ email.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="regPassword">Mật Khẩu *</label>
        <input
          id="regPassword"
          v-model="password.modelValue.value"
          type="password"
          @blur="password.onBlur"
          :class="{ error: password.shouldShowError.value, valid: password.isValid.value && password.touched.value }"
        />
        <div v-if="password.shouldShowError.value">
          <ul class="error-list">
            <li v-for="(msg, idx) in password.errorMessages.value" :key="idx">{{ msg }}</li>
          </ul>
        </div>
      </div>

      <!-- Contact Information -->
      <h3>Thông Tin Liên Hệ</h3>

      <div class="form-group">
        <label for="phone">Số Điện Thoại *</label>
        <input
          id="phone"
          v-model="phone.modelValue.value"
          @blur="phone.onBlur"
          :class="{ error: phone.shouldShowError.value, valid: phone.isValid.value && phone.touched.value }"
        />
        <div v-if="phone.shouldShowError.value" class="error-message">
          {{ phone.error.value }}
        </div>
      </div>

      <div class="form-group">
        <label for="address">Địa Chỉ *</label>
        <textarea
          id="address"
          v-model="address.modelValue.value"
          rows="3"
          @blur="address.onBlur"
          :class="{ error: address.shouldShowError.value, valid: address.isValid.value && address.touched.value }"
        ></textarea>
        <div v-if="address.shouldShowError.value" class="error-message">
          {{ address.error.value }}
        </div>
      </div>

      <!-- Terms and Conditions -->
      <div class="form-group">
        <div class="checkbox-group">
          <input
            id="terms"
            v-model="terms.modelValue.value"
            type="checkbox"
            @blur="terms.onBlur"
          />
          <label for="terms">Tôi đồng ý với điều khoản và điều kiện *</label>
        </div>
        <div v-if="terms.shouldShowError.value" class="error-message">
          {{ terms.error.value }}
        </div>
      </div>

      <button type="submit" :disabled="!formState.canSubmit.value">
        Đăng Ký
      </button>
      <button type="button" @click="resetAll()" class="secondary">
        Reset
      </button>

      <div v-if="submitted" class="success-message" style="margin-top: 1rem;">
        ✓ Đăng ký thành công!
      </div>
    </form>

    <div class="form-state">
      <strong>Form Progress:</strong>
      <pre>{{ JSON.stringify({
        isValid: formState.isValid.value,
        touched: formState.touched.value,
        dirty: formState.dirty.value,
        completedFields: Object.keys(getAllFieldStates()).filter(k => 
          getAllFieldStates()[k as keyof ComplexForm]?.isValid
        ).length + '/' + Object.keys(getAllFieldStates()).length
      }, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useFormValidation, useFieldValidation } from 'valora/adapters/vue';
import { string, number, boolean } from 'valora/validators';

interface ComplexForm {
  firstName: string;
  lastName: string;
  birthYear: number;
  gender: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  terms: boolean;
}

const currentYear = new Date().getFullYear();

const { adapter, formState, validateAll, resetAll } = useFormValidation<ComplexForm>({
  firstName: string().required().minLength(2).maxLength(50),
  lastName: string().required().minLength(2).maxLength(50),
  birthYear: number().required().integer().min(1900).max(currentYear - 13),
  gender: string()
    .required()
    .custom(
      (value) => ['male', 'female', 'other'].includes(value),
      'Vui lòng chọn giới tính hợp lệ'
    ),
  email: string().required().email(),
  password: string()
    .required()
    .minLength(8)
    .custom((value) => /[A-Z]/.test(value), 'Cần ít nhất 1 chữ hoa')
    .custom((value) => /[a-z]/.test(value), 'Cần ít nhất 1 chữ thường')
    .custom((value) => /[0-9]/.test(value), 'Cần ít nhất 1 số'),
  phone: string().required().numeric().length(10),
  address: string().required().minLength(10).maxLength(200),
  terms: boolean()
    .required()
    .custom(
      (value) => value === true,
      'Bạn phải đồng ý với điều khoản'
    ),
});

const firstName = useFieldValidation(adapter, 'firstName');
const lastName = useFieldValidation(adapter, 'lastName');
const birthYear = useFieldValidation(adapter, 'birthYear');
const gender = useFieldValidation(adapter, 'gender');
const email = useFieldValidation(adapter, 'email');
const password = useFieldValidation(adapter, 'password');
const phone = useFieldValidation(adapter, 'phone');
const address = useFieldValidation(adapter, 'address');
const terms = useFieldValidation(adapter, 'terms');

const submitted = ref(false);

const getAllFieldStates = () => adapter.getAllFieldStates();

const handleSubmit = () => {
  const result = validateAll();
  if (result.success) {
    submitted.value = true;
    alert('✓ Form đăng ký hoàn tất!');
    setTimeout(() => submitted.value = false, 3000);
  }
};
</script>
