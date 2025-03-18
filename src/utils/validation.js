import { t } from '../localization';

export const validators = {
  required: (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    return true;
  },
  email: (value) => {
    if (!value) return true; 
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(value);
  },
  minLength: (value, minLength) => {
    if (!value) return true; 
    return String(value).length >= minLength;
  },
  maxLength: (value, maxLength) => {
    if (!value) return true;
    return String(value).length <= maxLength;
  },
  pattern: (value, pattern) => {
    if (!value) return true;
    const regex = new RegExp(pattern);
    return regex.test(value);
  },
  min: (value, min) => {
    if (!value && value !== 0) return true;
    const num = Number(value);
    return !isNaN(num) && num >= min;
  },
  max: (value, max) => {
    if (!value) return true;
    return Number(value) <= max;
  },
  minDate: (value, minDate) => {
    if (!value) return true;
    return new Date(value) >= new Date(minDate);
  },
  maxDate: (value, maxDate) => {
    if (!value) return true;
    return new Date(value) <= new Date(maxDate);
  },
  minSelect: (value, minSelect) => {
    if (!value) return true;
    return value.length >= minSelect;
  },
  maxSelect: (value, maxSelect) => {
    if (!value) return true;
    return value.length <= maxSelect;
  },
  numeric: (value) => {
    if (!value) return true;
    return !isNaN(Number(value));
  }
};

/**
 * Get localized error message for validation errors
 * @param {string} validationType - Type of validation that failed
 * @param {string} language - Current language code
 * @param {any} params - Additional parameters for the error message
 * @returns {string} - Localized error message
 */
export const getErrorMessage = (validationType, language, params) => {
  switch (validationType) {
    case 'required':
      return t('validationRequired', language);
    case 'email':
      return t('validationEmail', language) || 'Please enter a valid email address';
    case 'minLength':
      return t('validationMinLength', language, { length: params }).replace('{length}', params);
    case 'maxLength':
      return t('validationMaxLength', language, { length: params }).replace('{length}', params);
    case 'pattern':
      return t('validationPattern', language);
    case 'min':
      return t('validationMin', language, { min: params }).replace('{min}', params);
    case 'max':
      return t('validationMax', language, { max: params }).replace('{max}', params);
    case 'minDate':
      return t('validationMinDate', language, { minDate: params }).replace('{minDate}', params);
    case 'maxDate':
      return t('validationMaxDate', language, { maxDate: params }).replace('{maxDate}', params);
    case 'minSelect':
      return t('validationMinSelect', language, { minSelect: params }).replace('{min}', params);
    case 'maxSelect':
      return t('validationMaxSelect', language, { maxSelect: params }).replace('{max}', params);
    case 'numeric':
      return t('validationNumeric', language);
    default:
      return "Invalid input";
  }
};

/**
 * Validate a field value against validation rules
 * @param {any} value - The value to validate
 * @param {Object} validationRules - Object containing validation rules
 * @returns {Object} - { isValid: boolean, errorType: string, param: any }
 */
export const validateField = (value, validationRules = {}) => {
  if (!validationRules) return { isValid: true };
  
  for (const [rule, param] of Object.entries(validationRules)) {
    if (rule === 'required' && param && !validators.required(value)) {
      return { isValid: false, errorType: 'required' };
    }
    if (rule === 'email' && param && !validators.email(value)) {
      return { isValid: false, errorType: 'email' };
    }
    if (rule === 'minLength' && !validators.minLength(value, param)) {
      return { isValid: false, errorType: 'minLength', param };
    }
    if (rule === 'maxLength' && !validators.maxLength(value, param)) {
      return { isValid: false, errorType: 'maxLength', param };
    }
    if (rule === 'pattern' && !validators.pattern(value, param)) {
      return { isValid: false, errorType: 'pattern' };
    }
    if (rule === 'min' && !validators.min(value, param)) {
      return { isValid: false, errorType: 'min', param };
    }
    if (rule === 'max' && !validators.max(value, param)) {
      return { isValid: false, errorType: 'max', param };
    }
    if (rule === 'numeric' && !validators.numeric(value, param)) {
      return { isValid: false, errorType: 'numeric', param };
    }
    if (rule === 'minDate' && !validators.minDate(value, param)) {
      return { isValid: false, errorType: 'minDate', param };
    }
    if (rule === 'maxDate' && !validators.maxDate(value, param)) {
      return { isValid: false, errorType: 'maxDate', param };
    }
    if (rule === 'minSelect' && !validators.minSelect(value, param)) {
      return { isValid: false, errorType: 'minSelect', param };
    }
    if (rule === 'maxSelect' && !validators.maxSelect(value, param)) {
      return { isValid: false, errorType: 'maxSelect', param };
    }
    if (rule === 'numeric' && !validators.numeric(value, param)) {
      return { isValid: false, errorType: 'numeric', param };
    }
  }
  
  return { isValid: true };
}; 