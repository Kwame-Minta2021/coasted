import { supabase, supabaseAdmin } from '../supabase';
import { AuthResponse, LoginCredentials, PasswordResetRequest, PasswordResetConfirm } from '../../types/user';
import { InvalidCredentialsError, EmailNotVerifiedError, AuthenticationError, UserNotFoundError, DatabaseError } from '../errors';
import { loginSchema, passwordResetRequestSchema, passwordResetConfirmSchema, sanitizeEmail } from '../validation';
import { userService } from './userService';
import { sendPasswordResetEmail } from '../email';

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      // Validate input
      const validatedCredentials = loginSchema.parse(credentials);
      const sanitizedEmail = sanitizeEmail(validatedCredentials.email);

      // Attempt to sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: sanitizedEmail,
        password: validatedCredentials.password,
      });
      if (error || !data.user) {
        throw new InvalidCredentialsError();
      }

      // Get user profile from Supabase users table
      const user = await userService.getUserById(data.user.id);
      if (!user) {
        throw new InvalidCredentialsError();
      }

      if (!user.isActive) {
        throw new AuthenticationError('Account is deactivated. Please contact support.');
      }

      if (!user.emailVerified) {
        throw new EmailNotVerifiedError();
      }

      await userService.updateLoginInfo(user.uid);

      return {
        success: true,
        user,
        token: data.session?.access_token,
        message: 'Login successful',
      };
    } catch (error) {
      if (error instanceof InvalidCredentialsError || error instanceof EmailNotVerifiedError || error instanceof AuthenticationError) {
        throw error;
      }
      throw new AuthenticationError(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(request: PasswordResetRequest): Promise<{ success: boolean; message: string }> {
    try {
      // Validate input
      const validatedRequest = passwordResetRequestSchema.parse(request);
      const sanitizedEmail = sanitizeEmail(validatedRequest.email);

      // Check if user exists
      const user = await userService.getUserByEmail(sanitizedEmail);
      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          success: true,
          message: 'If an account with this email exists, a password reset link has been sent.',
        };
      }

      // Trigger Supabase password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(sanitizedEmail, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
      });
      if (error) {
        throw error;
      }

      // Log password reset attempt
      await this.logPasswordResetAttempt(user.uid, 'email_sent');

      return {
        success: true,
        message: 'Password reset email sent successfully',
      };
    } catch (error) {
      console.error('Password reset email error:', error);
      // Don't expose internal errors to user
      return {
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.',
      };
    }
  }

  /**
   * Confirm password reset with code
   */
  async confirmPasswordReset(confirmData: PasswordResetConfirm): Promise<{ success: boolean; message: string }> {
    try {
      // Validate input
      const validatedData = passwordResetConfirmSchema.parse(confirmData);

      // With Supabase, password reset confirmation happens via magic link to redirect URL
      return {
        success: true,
        message: 'Password reset link sent. Please complete the process via your email.'
      };
    } catch (error) {
      console.error('Password reset confirmation error:', error);
      throw new AuthenticationError('Invalid or expired reset code. Please request a new password reset.');
    }
  }

  /**
   * Verify Supabase access token
   */
  async verifyToken(idToken: string): Promise<{ uid: string; user: any }> {
    try {
      const { data, error } = await supabaseAdmin.auth.getUser(idToken);
      if (error || !data.user) {
        throw new AuthenticationError('Invalid or expired token');
      }
      const user = await userService.getUserById(data.user.id);

      if (!user) {
        throw new UserNotFoundError(data.user.id);
      }

      return {
        uid: data.user.id,
        user,
      };
    } catch (error) {
      throw new AuthenticationError('Invalid or expired token');
    }
  }

  /**
   * Create custom token for user (not applicable in Supabase)
   */
  async createCustomToken(uid: string): Promise<string> {
    try {
      // Supabase does not support custom tokens in the same way; return empty
      return '';
    } catch (error) {
      throw new AuthenticationError('Failed to create authentication token');
    }
  }

  /**
   * Revoke user tokens (logout)
   */
  async revokeTokens(uid: string): Promise<void> {
    try {
      // Supabase: sign-out should be done client-side; no direct server revoke
    } catch (error) {
      console.error('Token revocation error:', error);
      // Don't throw error as this is not critical
    }
  }

  /**
   * Get user session info
   */
  async getSessionInfo(uid: string): Promise<{ user: any; sessionData: any }> {
    try {
      const user = await userService.getUserById(uid);
      if (!user) {
        throw new UserNotFoundError(uid);
      }

      // Sessions are not listed server-side in Supabase
      return {
        user,
        sessionData: {
          activeSessions: 0,
          lastLoginAt: user.lastLoginAt,
          loginCount: user.loginCount,
        },
      };
    } catch (error) {
      throw new AuthenticationError('Failed to get session information');
    }
  }

  /**
   * Log password reset attempts
   */
  private async logPasswordResetAttempt(userId: string, action: 'email_sent' | 'password_changed' | 'failed'): Promise<void> {
    try {
      const logData = {
        userId,
        action,
        timestamp: new Date(),
        ipAddress: 'unknown',
        userAgent: 'unknown',
      };

      await supabaseAdmin.from('passwordResetLogs').insert(logData);
    } catch (error) {
      console.error('Failed to log password reset attempt:', error);
      // Don't throw error as logging is not critical
    }
  }

  /**
   * Check if user has valid session
   */
  async checkSessionValidity(uid: string): Promise<boolean> {
    try {
      const user = await userService.getUserById(uid);
      if (!user) {
        return false;
      }

      // Check if user is active
      if (!user.isActive) {
        return false;
      }

      // Check if email is verified (if required)
      if (!user.emailVerified) {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user permissions and roles
   */
  async getUserPermissions(uid: string): Promise<{
    role: string;
    permissions: string[];
    isActive: boolean;
    paymentStatus: string;
  }> {
    try {
      const user = await userService.getUserById(uid);
      if (!user) {
        throw new UserNotFoundError(uid);
      }

      // Define permissions based on role
      const rolePermissions: Record<string, string[]> = {
        student: ['view_courses', 'access_portal', 'view_progress'],
        parent: ['view_child_progress', 'manage_subscription', 'view_billing'],
        admin: ['manage_users', 'manage_courses', 'view_analytics', 'manage_payments'],
        instructor: ['manage_courses', 'view_student_progress', 'create_content'],
      };

      return {
        role: user.role,
        permissions: rolePermissions[user.role] || [],
        isActive: user.isActive,
        paymentStatus: user.paymentStatus,
      };
    } catch (error) {
      throw new AuthenticationError('Failed to get user permissions');
    }
  }

  /**
   * Validate user access to specific features
   */
  async validateFeatureAccess(uid: string, feature: string): Promise<boolean> {
    try {
      const permissions = await this.getUserPermissions(uid);
      
      // Check if user is active
      if (!permissions.isActive) {
        return false;
      }

      // Check if user has required permission
      if (!permissions.permissions.includes(feature)) {
        return false;
      }

      // Check payment status for premium features
      if (feature.startsWith('premium_') && permissions.paymentStatus !== 'completed') {
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();
