import { supabaseAdmin } from '../supabase';
import { User } from '../../types/user';
import { PaymentStatus } from '../../types/payment';
import { PortalAccessDeniedError, SubscriptionExpiredError, PaymentRequiredError, UserNotFoundError, DatabaseError } from '../errors';
import { userService } from './userService';
import { paymentService } from './paymentService';

export interface PortalAccess {
  hasAccess: boolean;
  reason?: string;
  permissions: string[];
  subscriptionStatus: string;
  features: string[];
  lastAccessCheck: Date;
}

export interface DashboardData {
  user: User;
  access: PortalAccess;
  recentActivity: any[];
  subscriptionInfo: any;
  paymentHistory: any[];
  usageStats: any;
}

export class PortalService {
  private readonly portalAccessCollection = 'portalAccess';
  private readonly userActivityCollection = 'userActivity';

  /**
   * Check user portal access
   */
  async checkPortalAccess(userId: string): Promise<PortalAccess> {
    try {
      // Get user information
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }

      // Check if user is active
      if (!user.isActive) {
        return {
          hasAccess: false,
          reason: 'Account is deactivated',
          permissions: [],
          subscriptionStatus: 'inactive',
          features: [],
          lastAccessCheck: new Date(),
        };
      }

      // Check payment status
      if (user.paymentStatus !== 'completed') {
        return {
          hasAccess: false,
          reason: 'Payment required',
          permissions: ['view_basic'],
          subscriptionStatus: user.paymentStatus,
          features: ['view_courses', 'view_profile'],
          lastAccessCheck: new Date(),
        };
      }

      // Get user permissions based on role and subscription
      const permissions = await this.getUserPermissions(userId, user.role, user.subscriptionPlan);

      // Get available features based on subscription
      const features = await this.getAvailableFeatures(user.subscriptionPlan);

      const access: PortalAccess = {
        hasAccess: true,
        permissions,
        subscriptionStatus: user.paymentStatus,
        features,
        lastAccessCheck: new Date(),
      };

      // Log access check
      await this.logPortalAccess(userId, access);

      return access;
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to check portal access: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get dashboard data for user
   */
  async getDashboardData(userId: string): Promise<DashboardData> {
    try {
      // Get user information
      const user = await userService.getUserById(userId);
      if (!user) {
        throw new UserNotFoundError(userId);
      }

      // Check portal access
      const access = await this.checkPortalAccess(userId);

      // Get recent activity
      const recentActivity = await this.getRecentActivity(userId, 10);

      // Get subscription information
      const subscriptionInfo = await this.getSubscriptionInfo(userId);

      // Get payment history
      const paymentHistory = await paymentService.getUserPaymentHistory(userId, 5);

      // Get usage statistics
      const usageStats = await this.getUsageStats(userId);

      return {
        user,
        access,
        recentActivity,
        subscriptionInfo,
        paymentHistory,
        usageStats,
      };
    } catch (error) {
      if (error instanceof UserNotFoundError) {
        throw error;
      }
      throw new DatabaseError(`Failed to get dashboard data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate feature access for user
   */
  async validateFeatureAccess(userId: string, feature: string): Promise<boolean> {
    try {
      const access = await this.checkPortalAccess(userId);
      
      if (!access.hasAccess) {
        return false;
      }

      return access.features.includes(feature) || access.permissions.includes(feature);
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user permissions based on role and subscription
   */
  private async getUserPermissions(userId: string, role: string, subscriptionPlan: string): Promise<string[]> {
    // Base permissions by role
    const rolePermissions: Record<string, string[]> = {
      student: ['view_courses', 'access_portal', 'view_progress', 'submit_assignments'],
      parent: ['view_child_progress', 'manage_subscription', 'view_billing', 'view_reports'],
      admin: ['manage_users', 'manage_courses', 'view_analytics', 'manage_payments', 'system_settings'],
      instructor: ['manage_courses', 'view_student_progress', 'create_content', 'grade_assignments'],
    };

    // Subscription-based permissions
    const subscriptionPermissions: Record<string, string[]> = {
      basic: ['view_courses', 'basic_support'],
      premium: ['view_courses', 'premium_support', 'advanced_features', 'priority_support'],
      enterprise: ['view_courses', 'enterprise_support', 'advanced_features', 'priority_support', 'custom_integrations'],
    };

    const basePermissions = rolePermissions[role] || [];
    const subscriptionBasedPermissions = subscriptionPermissions[subscriptionPlan] || [];

    return [...new Set([...basePermissions, ...subscriptionBasedPermissions])];
  }

  /**
   * Get available features based on subscription plan
   */
  private async getAvailableFeatures(subscriptionPlan: string): Promise<string[]> {
    const planFeatures: Record<string, string[]> = {
      basic: [
        'view_courses',
        'basic_lessons',
        'progress_tracking',
        'email_support',
      ],
      premium: [
        'view_courses',
        'premium_lessons',
        'progress_tracking',
        'priority_support',
        'advanced_analytics',
        'certificate_generation',
        'live_sessions',
      ],
      enterprise: [
        'view_courses',
        'premium_lessons',
        'progress_tracking',
        'enterprise_support',
        'advanced_analytics',
        'certificate_generation',
        'live_sessions',
        'custom_integrations',
        'white_label',
        'dedicated_support',
      ],
    };

    return planFeatures[subscriptionPlan] || planFeatures.basic;
  }

  /**
   * Get recent user activity
   */
  private async getRecentActivity(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.userActivityCollection)
        .select('*')
        .eq('userId', userId)
        .order('timestamp', { ascending: false })
        .limit(limit);
      if (error || !data) return [];
      return data as any[];
    } catch (error) {
      console.error('Failed to get recent activity:', error);
      return [];
    }
  }

  /**
   * Get subscription information
   */
  private async getSubscriptionInfo(userId: string): Promise<any> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return null;
      }

      // Get subscription plan details
      const plans = await paymentService.getSubscriptionPlans();
      const currentPlan = plans.find(plan => plan.id === user.subscriptionPlan);

      return {
        currentPlan: currentPlan || null,
        status: user.paymentStatus,
        enrollmentDate: user.enrollmentDate,
        lastPaymentDate: user.updatedAt,
        nextBillingDate: this.calculateNextBillingDate(user.enrollmentDate, currentPlan?.interval),
      };
    } catch (error) {
      console.error('Failed to get subscription info:', error);
      return null;
    }
  }

  /**
   * Get usage statistics
   */
  private async getUsageStats(userId: string): Promise<any> {
    try {
      const user = await userService.getUserById(userId);
      if (!user) {
        return null;
      }

      // Get activity count
      const { data: activityRows } = await supabaseAdmin
        .from(this.userActivityCollection)
        .select('id', { count: 'exact', head: true })
        .eq('userId', userId);
      const totalActivities = (activityRows as any)?.length ?? 0;

      // Get login statistics
      const loginStats = {
        totalLogins: user.loginCount || 0,
        lastLogin: user.lastLoginAt,
        averageSessionDuration: 45, // Mock data - would be calculated from actual session data
      };

      // Get course progress (mock data - would be calculated from actual progress data)
      const courseProgress = {
        coursesEnrolled: 3,
        coursesCompleted: 1,
        totalLessons: 24,
        lessonsCompleted: 8,
        averageScore: 85,
      };

      return {
        totalActivities,
        loginStats,
        courseProgress,
        timeSpent: {
          total: 120, // hours
          thisWeek: 8,
          thisMonth: 32,
        },
      };
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  }

  /**
   * Log portal access check
   */
  private async logPortalAccess(userId: string, access: PortalAccess): Promise<void> {
    try {
      const logData = {
        userId,
        hasAccess: access.hasAccess,
        reason: access.reason,
        permissions: access.permissions,
        features: access.features,
        timestamp: new Date(),
      };

      await supabaseAdmin.from(this.portalAccessCollection).insert(logData);
    } catch (error) {
      console.error('Failed to log portal access:', error);
      // Don't throw error as logging is not critical
    }
  }

  /**
   * Log user activity
   */
  async logUserActivity(userId: string, activity: {
    type: string;
    description: string;
    metadata?: any;
  }): Promise<void> {
    try {
      const activityData = {
        userId,
        type: activity.type,
        description: activity.description,
        metadata: activity.metadata || {},
        timestamp: new Date(),
      };
      await supabaseAdmin.from(this.userActivityCollection).insert(activityData);
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw error as logging is not critical
    }
  }

  /**
   * Calculate next billing date
   */
  private calculateNextBillingDate(enrollmentDate: Date, interval?: string): Date | null {
    if (!interval || interval === 'one-time') {
      return null;
    }

    const nextDate = new Date(enrollmentDate);
    
    switch (interval) {
      case 'monthly':
        nextDate.setMonth(nextDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDate.setFullYear(nextDate.getFullYear() + 1);
        break;
      default:
        return null;
    }

    return nextDate;
  }

  /**
   * Update user subscription status
   */
  async updateSubscriptionStatus(userId: string, status: PaymentStatus): Promise<void> {
    try {
      await userService.updatePaymentStatus(userId, status);

      // Log the status change
      await this.logUserActivity(userId, {
        type: 'subscription_status_changed',
        description: `Subscription status updated to ${status}`,
        metadata: { status },
      });
    } catch (error) {
      throw new DatabaseError(`Failed to update subscription status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get portal analytics (admin only)
   */
  async getPortalAnalytics(): Promise<any> {
    try {
      // Get total users
      const { count: totalUsers } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact', head: true });

      // Get active users (users with completed payments)
      const { count: activeUsers } = await supabaseAdmin
        .from('users')
        .select('id', { count: 'exact', head: true })
        .eq('paymentStatus', 'completed');

      // Get recent enrollments
      const { data: recentEnrollments } = await supabaseAdmin
        .from('users')
        .select('*')
        .order('enrollmentDate', { ascending: false })
        .limit(10);

      // Get payment statistics
      const { count: totalPayments } = await supabaseAdmin
        .from('payments')
        .select('id', { count: 'exact', head: true });
      const { count: completedPayments } = await supabaseAdmin
        .from('payments')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      return {
        totalUsers,
        activeUsers,
        conversionRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
        recentEnrollments,
        paymentStats: {
          total: totalPayments,
          completed: completedPayments,
          successRate: totalPayments > 0 ? (completedPayments / totalPayments) * 100 : 0,
        },
        timestamp: new Date(),
      };
    } catch (error) {
      throw new DatabaseError(`Failed to get portal analytics: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const portalService = new PortalService();
