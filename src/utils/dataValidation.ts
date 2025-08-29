import { z } from 'zod';

// Request validation schema
export const requestSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description cannot exceed 2000 characters'),
  category: z.string().min(1, 'Category is required'),
  budget_min: z.number().positive('Minimum budget must be positive').optional(),
  budget_max: z.number().positive('Maximum budget must be positive').optional(),
  currency: z.string().min(3, 'Currency code required').max(3).optional(),
  deadline: z.string().datetime().optional(),
  location: z.string().max(200, 'Location cannot exceed 200 characters').optional(),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
}).refine(data => {
  if (data.budget_min && data.budget_max) {
    return data.budget_min <= data.budget_max;
  }
  return true;
}, {
  message: 'Minimum budget must be less than or equal to maximum budget',
  path: ['budget_max'],
});

// Offer validation schema
export const offerSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters').max(2000, 'Description cannot exceed 2000 characters'),
  price: z.number().positive('Price must be positive'),
  currency: z.string().min(3, 'Currency code required').max(3).default('USD'),
  delivery_time_days: z.number().positive('Delivery time must be positive').min(1, 'Delivery time must be at least 1 day'),
  request_id: z.string().uuid('Valid request ID required'),
});

// RFQ validation schema
export const rfqSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(200, 'Title cannot exceed 200 characters'),
  description: z.string().min(100, 'Description must be at least 100 characters').max(5000, 'Description cannot exceed 5000 characters'),
  category_id: z.string().uuid().optional(),
  budget_min: z.number().positive('Minimum budget must be positive').optional(),
  budget_max: z.number().positive('Maximum budget must be positive').optional(),
  currency: z.string().min(3, 'Currency code required').max(3).default('USD'),
  submission_deadline: z.string().datetime('Valid deadline required'),
  delivery_location: z.string().max(500, 'Location cannot exceed 500 characters').optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  is_public: z.boolean().default(true),
  requirements: z.object({}).passthrough().optional(),
  evaluation_criteria: z.object({}).passthrough().optional(),
}).refine(data => {
  if (data.budget_min && data.budget_max) {
    return data.budget_min <= data.budget_max;
  }
  return true;
}, {
  message: 'Minimum budget must be less than or equal to maximum budget',
  path: ['budget_max'],
}).refine(data => {
  const deadline = new Date(data.submission_deadline);
  const now = new Date();
  const minDeadline = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours from now
  
  return deadline > minDeadline;
}, {
  message: 'Submission deadline must be at least 24 hours from now',
  path: ['submission_deadline'],
});

// User profile validation schema
export const userProfileSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters'),
  email: z.string().email('Valid email required'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').max(20, 'Phone number cannot exceed 20 digits').optional(),
  company_name: z.string().min(2, 'Company name must be at least 2 characters').max(200, 'Company name cannot exceed 200 characters').optional(),
  address: z.string().max(500, 'Address cannot exceed 500 characters').optional(),
  bio: z.string().max(1000, 'Bio cannot exceed 1000 characters').optional(),
  website: z.string().url('Valid URL required').optional(),
});

// Validation helper functions
export const validateRequest = (data: any) => {
  try {
    return requestSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const validateOffer = (data: any) => {
  try {
    return offerSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const validateRFQ = (data: any) => {
  try {
    return rfqSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

export const validateUserProfile = (data: any) => {
  try {
    return userProfileSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(error.errors[0].message);
    }
    throw error;
  }
};

// File validation
export const validateFileUpload = (file: File, maxSizeMB: number = 10, allowedTypes: string[] = []) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  
  if (file.size > maxSizeBytes) {
    throw new Error(`File size cannot exceed ${maxSizeMB}MB`);
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    throw new Error(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  return true;
};

// Data sanitization
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeNumber = (input: any): number | undefined => {
  const num = parseFloat(input);
  return isNaN(num) ? undefined : num;
};

export const sanitizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};