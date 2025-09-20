export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number = 500, code?: string, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 400, code);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication failed', code?: string) {
    super(message, 401, code);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Access denied', code?: string) {
    super(message, 403, code);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found', code?: string) {
    super(message, 404, code);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Resource conflict', code?: string) {
    super(message, 409, code);
  }
}

export class PaymentError extends AppError {
  constructor(message: string = 'Payment processing failed', code?: string) {
    super(message, 422, code);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', code?: string) {
    super(message, 429, code);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed', code?: string) {
    super(message, 500, code);
  }
}

export class ExternalServiceError extends AppError {
  constructor(message: string = 'External service error', code?: string) {
    super(message, 502, code);
  }
}

// Firebase specific errors
export class FirebaseAuthError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 401, code);
  }
}

export class FirestoreError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 500, code);
  }
}

// Payment specific errors
export class PaymentGatewayError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 422, code);
  }
}

export class PaymentVerificationError extends AppError {
  constructor(message: string, code?: string) {
    super(message, 422, code);
  }
}

// User specific errors
export class UserNotFoundError extends NotFoundError {
  constructor(userId?: string) {
    super(`User ${userId ? `with ID ${userId}` : ''} not found`, 'USER_NOT_FOUND');
  }
}

export class UserAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`User with email ${email} already exists`, 'USER_ALREADY_EXISTS');
  }
}

export class InvalidCredentialsError extends AuthenticationError {
  constructor() {
    super('Invalid email or password', 'INVALID_CREDENTIALS');
  }
}

export class EmailNotVerifiedError extends AuthenticationError {
  constructor() {
    super('Email address not verified', 'EMAIL_NOT_VERIFIED');
  }
}

export class PasswordResetExpiredError extends AuthenticationError {
  constructor() {
    super('Password reset link has expired', 'PASSWORD_RESET_EXPIRED');
  }
}

// Portal access errors
export class PortalAccessDeniedError extends AuthorizationError {
  constructor(reason?: string) {
    super(`Portal access denied${reason ? `: ${reason}` : ''}`, 'PORTAL_ACCESS_DENIED');
  }
}

export class SubscriptionExpiredError extends AuthorizationError {
  constructor() {
    super('Subscription has expired', 'SUBSCRIPTION_EXPIRED');
  }
}

export class PaymentRequiredError extends AuthorizationError {
  constructor() {
    super('Payment required to access this feature', 'PAYMENT_REQUIRED');
  }
}

// Error handling utilities
export const handleError = (error: unknown): AppError => {
  if (error instanceof AppError) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, 500, 'UNKNOWN_ERROR');
  }

  return new AppError('An unexpected error occurred', 500, 'UNKNOWN_ERROR');
};

export const isOperationalError = (error: AppError): boolean => {
  return error.isOperational;
};

export const logError = (error: AppError, context?: Record<string, any>): void => {
  console.error('Error occurred:', {
    message: error.message,
    statusCode: error.statusCode,
    code: error.code,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString(),
  });
};

// Error response formatter
export const formatErrorResponse = (error: AppError): { error: string; code?: string; message?: string } => {
  return {
    error: error.message,
    code: error.code,
    message: error.message,
  };
};
