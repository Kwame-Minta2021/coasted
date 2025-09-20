export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  transactionId: string;
  subscriptionPlan: string;
  paymentDate: Date;
  metadata: PaymentMetadata;
  createdAt: Date;
  updatedAt: Date;
  refundedAt?: Date;
  refundAmount?: number;
  failureReason?: string;
}

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
export type PaymentMethod = 'card' | 'bank_transfer' | 'paypal' | 'crypto' | 'mobile_money';

export interface PaymentMetadata {
  gateway: string;
  gatewayTransactionId?: string;
  cardLast4?: string;
  cardBrand?: string;
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  customerIp?: string;
  userAgent?: string;
  description?: string;
  customFields?: Record<string, any>;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  subscriptionPlan: string;
  metadata?: Partial<PaymentMetadata>;
}

export interface PaymentResponse {
  success: boolean;
  payment?: Payment;
  error?: string;
  message?: string;
  redirectUrl?: string;
}

export interface PaymentWebhook {
  event: string;
  data: {
    id: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    transactionId: string;
    metadata?: Record<string, any>;
  };
  timestamp: Date;
  signature?: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'one-time';
  features: string[];
  isActive: boolean;
  maxUsers?: number;
  trialDays?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentVerification {
  paymentId: string;
  userId: string;
  amount: number;
  status: PaymentStatus;
}
