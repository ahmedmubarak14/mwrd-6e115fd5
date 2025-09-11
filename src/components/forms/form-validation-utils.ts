import * as z from 'zod';

// Common validation patterns
export const ValidationPatterns = {
  // Saudi phone number (with or without country code)
  saudiPhone: /^(\+966|966|0)?[5-9]\d{8}$/,
  
  // Arabic and English text
  arabicEnglishText: /^[a-zA-Z\s\u0600-\u06FF\u0660-\u0669]+$/,
  
  // URL validation
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  
  // Strong password
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  
  // Numbers only
  numbersOnly: /^\d+$/,
  
  // Saudi commercial registration
  saudiCR: /^[1-9]\d{9}$/,
  
  // IBAN (Saudi)
  saudiIBAN: /^SA\d{2}\d{2}[A-Z0-9]{18}$/
};

// Reusable validation schemas
export const CommonValidations = {
  // Required string with min/max length
  requiredString: (min: number = 1, max: number = 255, message?: string) =>
    z.string()
      .min(min, message || `Must be at least ${min} characters`)
      .max(max, message || `Must not exceed ${max} characters`)
      .trim(),

  // Optional string with max length
  optionalString: (max: number = 255) =>
    z.string()
      .max(max, `Must not exceed ${max} characters`)
      .optional()
      .or(z.literal('')),

  // Email validation
  email: z.string()
    .email('Please enter a valid email address')
    .max(254, 'Email must not exceed 254 characters')
    .toLowerCase(),

  // Saudi phone number
  saudiPhone: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      return ValidationPatterns.saudiPhone.test(val.replace(/[\s-]/g, ''));
    }, 'Please enter a valid Saudi phone number'),

  // URL validation
  url: z.string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      try {
        new URL(val);
        return val.startsWith('http://') || val.startsWith('https://');
      } catch {
        return false;
      }
    }, 'Please enter a valid URL (must include http:// or https://)')
    .or(z.literal('')),

  // Positive number
  positiveNumber: z.coerce.number()
    .positive('Must be a positive number')
    .finite('Must be a valid number'),

  // Optional positive number
  optionalPositiveNumber: z.coerce.number()
    .positive('Must be a positive number')
    .finite('Must be a valid number')
    .optional(),

  // Date validation
  futureDate: z.coerce.date()
    .refine((date) => date > new Date(), 'Date must be in the future'),

  // Past date
  pastDate: z.coerce.date()
    .refine((date) => date < new Date(), 'Date must be in the past'),

  // Password validation
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(ValidationPatterns.strongPassword, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),

  // Confirm password
  confirmPassword: (data: any, passwordField: string) => {
    return data.password === data[passwordField];
  },

  // Arabic/English text
  arabicEnglishText: (min: number = 2, max: number = 100) =>
    z.string()
      .min(min, `Must be at least ${min} characters`)
      .max(max, `Must not exceed ${max} characters`)
      .regex(ValidationPatterns.arabicEnglishText, 'Only Arabic and English letters are allowed'),

  // File validation
  fileSize: (maxSizeInMB: number) => 
    z.instanceof(File)
      .refine((file) => file.size <= maxSizeInMB * 1024 * 1024, 
        `File size must be less than ${maxSizeInMB}MB`),

  fileType: (allowedTypes: string[]) =>
    z.instanceof(File)
      .refine((file) => allowedTypes.includes(file.type), 
        `File type must be one of: ${allowedTypes.join(', ')}`),

  // Array with min/max items
  arrayMinMax: <T>(schema: z.ZodType<T>, min: number, max?: number) => {
    let arraySchema = z.array(schema).min(min, `Must select at least ${min} item(s)`);
    if (max) {
      arraySchema = arraySchema.max(max, `Cannot select more than ${max} item(s)`);
    }
    return arraySchema;
  }
};

// Form field error messages in multiple languages
export const ValidationMessages = {
  en: {
    required: 'This field is required',
    email: 'Please enter a valid email address',
    phone: 'Please enter a valid phone number',
    url: 'Please enter a valid URL',
    minLength: (min: number) => `Must be at least ${min} characters`,
    maxLength: (max: number) => `Must not exceed ${max} characters`,
    positiveNumber: 'Must be a positive number',
    futureDate: 'Date must be in the future',
    pastDate: 'Date must be in the past',
    passwordWeak: 'Password is too weak',
    passwordMismatch: 'Passwords do not match',
    fileSize: (size: number) => `File size must be less than ${size}MB`,
    fileType: (types: string[]) => `File type must be one of: ${types.join(', ')}`
  },
  ar: {
    required: 'هذا الحقل مطلوب',
    email: 'يرجى إدخال عنوان بريد إلكتروني صحيح',
    phone: 'يرجى إدخال رقم هاتف صحيح',
    url: 'يرجى إدخال رابط صحيح',
    minLength: (min: number) => `يجب أن يكون على الأقل ${min} حرف`,
    maxLength: (max: number) => `يجب ألا يتجاوز ${max} حرف`,
    positiveNumber: 'يجب أن يكون رقماً موجباً',
    futureDate: 'يجب أن يكون التاريخ في المستقبل',
    pastDate: 'يجب أن يكون التاريخ في الماضي',
    passwordWeak: 'كلمة المرور ضعيفة جداً',
    passwordMismatch: 'كلمات المرور غير متطابقة',
    fileSize: (size: number) => `يجب أن يكون حجم الملف أقل من ${size} ميغابايت`,
    fileType: (types: string[]) => `يجب أن يكون نوع الملف واحداً من: ${types.join(', ')}`
  }
};

// Utility function to get validation message
export const getValidationMessage = (
  key: keyof typeof ValidationMessages.en, 
  language: 'en' | 'ar' = 'en',
  params: any[] = []
) => {
  const messages = ValidationMessages[language];
  const message = messages[key];
  return typeof message === 'function' ? message.apply(null, params) : message;
};

// Custom validation functions
export const CustomValidations = {
  // Validate Saudi commercial registration number
  saudiCR: (value: string) => {
    if (!value) return false;
    return ValidationPatterns.saudiCR.test(value);
  },

  // Validate Saudi IBAN
  saudiIBAN: (value: string) => {
    if (!value) return false;
    return ValidationPatterns.saudiIBAN.test(value.replace(/\s/g, ''));
  },

  // Check if date is business day (Sunday to Thursday in Saudi)
  isBusinessDay: (date: Date) => {
    const day = date.getDay();
    return day >= 0 && day <= 4; // Sunday (0) to Thursday (4)
  },

  // Validate age range
  ageRange: (birthDate: Date, minAge: number, maxAge: number) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= minAge && age - 1 <= maxAge;
    }
    
    return age >= minAge && age <= maxAge;
  },

  // Validate coordination (latitude, longitude)
  coordinates: (lat: number, lng: number) => {
    return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  }
};

// Form validation helpers
export const FormValidationHelpers = {
  // Check if form has errors
  hasErrors: (errors: Record<string, any>) => {
    return Object.keys(errors).length > 0;
  },

  // Get first error message
  getFirstError: (errors: Record<string, any>) => {
    const firstKey = Object.keys(errors)[0];
    return firstKey ? errors[firstKey]?.message : null;
  },

  // Count total errors
  errorCount: (errors: Record<string, any>) => {
    return Object.keys(errors).length;
  },

  // Check if specific field has error
  fieldHasError: (errors: Record<string, any>, fieldName: string) => {
    return !!errors[fieldName];
  },

  // Get field error message
  getFieldError: (errors: Record<string, any>, fieldName: string) => {
    return errors[fieldName]?.message || null;
  }
};