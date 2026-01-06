import { useState, useMemo } from 'react';
import { useFormValidation, useFieldValidation } from '@tqtos/valora/adapters/react';
import { string, number } from '@tqtos/valora/validators';
import './ComprehensiveDemo.css';

interface ComprehensiveForm {
  [key: string]: any;
  username: string;
  password: string;
  email: string;
  phoneNumber: string;
  age: number;
}

interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ComprehensiveDemo = () => {
  // Validation schema - YÊU CẦU 3: Thiết lập valid tự động qua khai báo ràng buộc
  const validationSchema = {
    // Username - YÊU CẦU 4: Kết hợp các validation (rỗng, ký tự, độ dài)
    username: string()
      .required()
      .minLength(3, { message: 'Username must have at least 3 characters.' })
      .maxLength(20)
      .pattern(/^[a-z0-9_]+$/, { message: 'Only lowercase letters, numbers, an d underscores.' }) // YÊU CẦU 5: Regular expression
      .custom(
        // YÊU CẦU 6 & 2: Custom validation tự kiểm tra bằng code
        (value: string) => /^[a-z]/.test(value),
        'Must start with a lowercase.',
      ),

    // Password - YÊU CẦU 4 & 6: Kết hợp nhiều custom validation
    password: string()
      .required()
      .minLength(8, { message: 'Password must be at least 8 characters' })
      .custom((value: string) => /[A-Z]/.test(value), 'Must contain uppercase letter')
      .custom((value: string) => /[a-z]/.test(value), 'Must contain lowercase letter')
      .custom((value: string) => /[0-9]/.test(value), 'Must contain a number')
      .custom(
        (value: string) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
        'Must contain special character',
      ),

    // Email - Sử dụng built-in validator
    email: string().required().email().withMessage('Invalid email format'),

    // Phone Number - YÊU CẦU 5 & 6: Regex pattern + custom validation
    phoneNumber: string()
      .required({ message: 'Phone number is required' })
      .numeric()
      .length(10)
      .pattern(/^0\d{9}$/, { message: 'Must start with 0' })
      .custom((value: string) => {
        const prefixes = [
          '086',
          '096',
          '097',
          '098',
          '032',
          '033',
          '034',
          '035',
          '036',
          '037',
          '038',
          '039',
          '088',
          '091',
          '094',
          '083',
          '084',
          '085',
          '081',
          '082',
          '089',
          '090',
          '093',
          '070',
          '079',
          '077',
          '076',
          '078',
        ];
        return prefixes.some((prefix) => value.startsWith(prefix));
      }, 'Invalid Vietnamese phone number'),

    // Age - Number validation với range
    age: number()
      .required()
      .integer({ message: 'Age must be an integer' })
      .min(18, { message: 'Must be at least 18 years old' })
      .max(100, { message: 'Age must not exceed 100' }),
  };

  // YÊU CẦU 1: Framework hooks - quản lý state và validation
  const { adapter, validateAll, resetAll } = useFormValidation<ComprehensiveForm>(validationSchema);

  // Field validations
  const username = useFieldValidation(adapter, 'username');
  const password = useFieldValidation(adapter, 'password');
  const email = useFieldValidation(adapter, 'email');
  const phoneNumber = useFieldValidation(adapter, 'phoneNumber');
  const age = useFieldValidation(adapter, 'age');

  // Toast notifications - YÊU CẦU 1: Cách thông báo khác nhau (Toast)
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  let toastId = 0;

  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = toastId++;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Password strength calculator
  const passwordStrength = useMemo(() => {
    const pwd = password.value || '';
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
  }, [password.value]);

  // Age category calculator
  const getAgeCategory = (ageValue: number): string => {
    if (ageValue < 18) return 'Under 18';
    if (ageValue < 30) return 'Young Adult';
    if (ageValue < 50) return 'Middle Age';
    return 'Senior';
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // YÊU CẦU 1: Tổng hợp các thông báo lỗi
    const result = validateAll();

    setTimeout(() => {
      setIsSubmitting(false);

      if (result.success) {
        showToast('Form submitted successfully!', 'success');
        setShowSuccessModal(true);
      } else {
        // YÊU CẦU 1: Hiển thị thông báo lỗi
        // Touch all fields to show validation errors
        username.touch();
        password.touch();
        email.touch();
        phoneNumber.touch();
        age.touch();
        showToast(`Please fix ${result.errors.length} error(s) before submitting`, 'error');
      }
    }, 500);
  };

  // Reset form
  const resetForm = () => {
    resetAll();
    showToast('Form has been reset', 'info');
  };

  return (
    <div className="comprehensive-demo">
      <form onSubmit={handleSubmit} className="demo-form">
        {/* USERNAME - YÊU CẦU 1: Hiển thị inline errors */}
        <div className="form-group">
          <label htmlFor="username">
            Username
            <span className="required">*</span>
          </label>
          <input
            id="username"
            type="text"
            value={username.value || ''}
            onChange={(e) => username.setValue(e.target.value)}
            onBlur={username.touch}
            placeholder="john_doe123"
            className={`${username.shouldShowError ? 'error' : ''} ${username.isValid && username.touched ? 'success' : ''}`}
          />
          {/* YÊU CẦU 1: Cách 1 - Inline error messages */}
          {username.shouldShowError && (
            <div className="error-messages">
              {username.errorMessages.map((msg, index) => (
                <p key={index} className="error-message">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* PASSWORD với strength indicator */}
        <div className="form-group">
          <label htmlFor="password">
            Password
            <span className="required">*</span>
          </label>
          <input
            id="password"
            type="password"
            value={password.value || ''}
            onChange={(e) => password.setValue(e.target.value)}
            onBlur={password.touch}
            placeholder="••••••••"
            className={`${password.shouldShowError ? 'error' : ''} ${password.isValid && password.touched ? 'success' : ''}`}
          />
          {password.shouldShowError && (
            <div className="error-messages">
              {password.errorMessages.map((msg, index) => (
                <p key={index} className="error-message">
                  {msg}
                </p>
              ))}
            </div>
          )}
          {/* YÊU CẦU 1: Cách 2 - Visual feedback (strength meter) */}
          {password.value && (
            <div className="password-strength">
              <div className="strength-bar">
                <div
                  className={`strength-fill ${passwordStrength.level}`}
                  style={{ width: `${passwordStrength.percentage}%` }}
                />
              </div>
              <span className={`strength-label ${passwordStrength.level}`}>
                {passwordStrength.label}
              </span>
            </div>
          )}
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <label htmlFor="email">
            Email
            <span className="required">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email.value || ''}
            onChange={(e) => email.setValue(e.target.value)}
            onBlur={email.touch}
            placeholder="example@company.com"
            className={`${email.shouldShowError ? 'error' : ''} ${email.isValid && email.touched ? 'success' : ''}`}
          />
          {email.shouldShowError && (
            <div className="error-messages">
              {email.errorMessages.map((msg, index) => (
                <p key={index} className="error-message">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* PHONE NUMBER */}
        <div className="form-group">
          <label htmlFor="phoneNumber">
            Phone Number
            <span className="required">*</span>
          </label>
          <input
            id="phoneNumber"
            type="tel"
            value={phoneNumber.value || ''}
            onChange={(e) => phoneNumber.setValue(e.target.value)}
            onBlur={phoneNumber.touch}
            placeholder="0912345678"
            className={`${phoneNumber.shouldShowError ? 'error' : ''} ${phoneNumber.isValid && phoneNumber.touched ? 'success' : ''}`}
          />
          {phoneNumber.shouldShowError && (
            <div className="error-messages">
              {phoneNumber.errorMessages.map((msg, index) => (
                <p key={index} className="error-message">
                  {msg}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* AGE với category badge */}
        <div className="form-group">
          <label htmlFor="age">
            Age
            <span className="required">*</span>
          </label>
          <input
            id="age"
            type="number"
            value={age.value || ''}
            onChange={(e) => age.setValue(Number(e.target.value))}
            onBlur={age.touch}
            placeholder="25"
            className={`${age.shouldShowError ? 'error' : ''} ${age.isValid && age.touched ? 'success' : ''}`}
          />
          {age.shouldShowError && (
            <div className="error-messages">
              {age.errorMessages.map((msg, index) => (
                <p key={index} className="error-message">
                  {msg}
                </p>
              ))}
            </div>
          )}
          {/* YÊU CẦU 1: Cách 3 - Badge/Label feedback */}
          {age.value && age.isValid && (
            <div className="age-info">
              <span className="age-badge">{getAgeCategory(age.value)}</span>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
          <button type="button" className="btn-reset" onClick={resetForm}>
            Reset
          </button>
        </div>
      </form>

      {/* YÊU CẦU 1: Cách 4 - Toast notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast toast-${toast.type}`}>
            {toast.message}
          </div>
        ))}
      </div>

      {/* YÊU CẦU 1: Cách 5 - Success modal */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Success!</h2>
            <p>All data has been validated successfully.</p>
            <pre className="data-preview">
              {JSON.stringify(
                {
                  username: username.value,
                  password: password.value,
                  email: email.value,
                  phoneNumber: phoneNumber.value,
                  age: age.value,
                },
                null,
                2,
              )}
            </pre>
            <button onClick={() => setShowSuccessModal(false)} className="btn-close">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComprehensiveDemo;
