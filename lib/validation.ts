import { z } from 'zod';

// User validation schemas
export const userEnrollmentSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters'),
  phone: z.string().optional(),
  subscriptionPlan: z.string().min(1, 'Subscription plan is required'),
  profileData: z.object({
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
    address: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'Zip code is required'),
      country: z.string().min(1, 'Country is required'),
    }).optional(),
    emergencyContact: z.object({
      name: z.string().min(1, 'Emergency contact name is required'),
      relationship: z.string().min(1, 'Relationship is required'),
      phone: z.string().min(1, 'Emergency contact phone is required'),
      email: z.string().email('Invalid emergency contact email').optional(),
    }).optional(),
    preferences: z.object({
      notifications: z.boolean().default(true),
      marketingEmails: z.boolean().default(false),
      theme: z.enum(['light', 'dark', 'auto']).default('auto'),
    }).optional(),
  }).optional(),
});

export const userUpdateSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters').max(50, 'First name must be less than 50 characters').optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters').max(50, 'Last name must be less than 50 characters').optional(),
  phone: z.string().optional(),
  profileData: z.object({
    dateOfBirth: z.date().optional(),
    gender: z.string().optional(),
    address: z.object({
      street: z.string().min(1, 'Street address is required'),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      zipCode: z.string().min(1, 'Zip code is required'),
      country: z.string().min(1, 'Country is required'),
    }).optional(),
    emergencyContact: z.object({
      name: z.string().min(1, 'Emergency contact name is required'),
      relationship: z.string().min(1, 'Relationship is required'),
      phone: z.string().min(1, 'Emergency contact phone is required'),
      email: z.string().email('Invalid emergency contact email').optional(),
    }).optional(),
    preferences: z.object({
      notifications: z.boolean(),
      marketingEmails: z.boolean(),
      theme: z.enum(['light', 'dark', 'auto']),
    }).optional(),
  }).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const passwordResetConfirmSchema = z.object({
  code: z.string().min(1, 'Reset code is required'),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

// Payment validation schemas
export const paymentRequestSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().min(3, 'Currency code is required').max(3, 'Currency code must be 3 characters'),
  paymentMethod: z.enum(['card', 'bank_transfer', 'paypal', 'crypto', 'mobile_money']),
  subscriptionPlan: z.string().min(1, 'Subscription plan is required'),
  metadata: z.object({
    gateway: z.string().min(1, 'Payment gateway is required'),
    gatewayTransactionId: z.string().optional(),
    cardLast4: z.string().optional(),
    cardBrand: z.string().optional(),
    billingAddress: z.object({
      line1: z.string().min(1, 'Billing address line 1 is required'),
      line2: z.string().optional(),
      city: z.string().min(1, 'City is required'),
      state: z.string().min(1, 'State is required'),
      postalCode: z.string().min(1, 'Postal code is required'),
      country: z.string().min(1, 'Country is required'),
    }).optional(),
    customerIp: z.string().optional(),
    userAgent: z.string().optional(),
    description: z.string().optional(),
    customFields: z.record(z.any()).optional(),
  }).optional(),
});

export const paymentWebhookSchema = z.object({
  event: z.string().min(1, 'Event type is required'),
  data: z.object({
    id: z.string().min(1, 'Payment ID is required'),
    status: z.enum(['pending', 'completed', 'failed', 'refunded', 'cancelled']),
    amount: z.number().positive('Amount must be positive'),
    currency: z.string().min(3, 'Currency code is required').max(3, 'Currency code must be 3 characters'),
    transactionId: z.string().min(1, 'Transaction ID is required'),
    metadata: z.record(z.any()).optional(),
  }),
  timestamp: z.date(),
  signature: z.string().optional(),
});

// Portal access validation
export const portalAccessSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
});

// Utility validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Sanitization functions
export const sanitizeString = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

export const sanitizeEmail = (email: string): string => {
  return email.trim().toLowerCase();
};

export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[^\d\+\-\(\)\s]/g, '');
};
