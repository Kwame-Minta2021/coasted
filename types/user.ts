export interface User {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  enrollmentDate: Date;
  isActive: boolean;
  paymentStatus: PaymentStatus;
  subscriptionPlan?: string;
  profileData?: UserProfileData;
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  role: UserRole;
  lastLoginAt?: Date;
  loginCount: number;
}

export interface UserProfileData {
  dateOfBirth?: Date;
  gender?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
  };
  preferences?: {
    notifications: boolean;
    marketingEmails: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
  avatarUrl?: string;
  bio?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type UserRole = 'student' | 'parent' | 'admin' | 'instructor';

export interface UserEnrollmentData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  subscriptionPlan: string;
  profileData?: Partial<UserProfileData>;
}

export interface UserUpdateData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  profileData?: Partial<UserProfileData>;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
  message?: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  code: string;
  newPassword: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
