import { supabaseAdmin } from '../supabase';
import { Payment, PaymentRequest, PaymentResponse, PaymentWebhook, PaymentStatus, PaymentMethod, PaymentMetadata } from '../../types/payment';
import { PaymentError, PaymentGatewayError, PaymentVerificationError, UserNotFoundError, DatabaseError } from '../errors';
import { paymentRequestSchema, paymentWebhookSchema } from '../validation';
import { userService } from './userService';
import { sendPaymentConfirmationEmail, sendPaymentFailureEmail } from '../email';

export class PaymentService {
  private readonly paymentsCollection = 'payments';
  private readonly subscriptionPlansCollection = 'subscriptionPlans';

  /**
   * Process payment and create payment record
   */
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validate payment data
      const validatedData = paymentRequestSchema.parse(paymentData);

      // Verify user exists
      const user = await userService.getUserById(validatedData.userId);
      if (!user) {
        throw new UserNotFoundError(validatedData.userId);
      }

      // Generate unique payment ID
      const paymentId = this.generatePaymentId();

      // Create payment record
      const now = new Date();
      const payment: Payment = {
        id: paymentId,
        userId: validatedData.userId,
        amount: validatedData.amount,
        currency: validatedData.currency,
        status: 'pending' as PaymentStatus,
        paymentMethod: validatedData.paymentMethod,
        transactionId: this.generateTransactionId(),
        subscriptionPlan: validatedData.subscriptionPlan,
        paymentDate: now,
        metadata: {
          gateway: validatedData.metadata?.gateway || 'default',
          gatewayTransactionId: validatedData.metadata?.gatewayTransactionId,
          cardLast4: validatedData.metadata?.cardLast4,
          cardBrand: validatedData.metadata?.cardBrand,
          billingAddress: validatedData.metadata?.billingAddress ? {
            line1: validatedData.metadata.billingAddress.line1 || '',
            line2: validatedData.metadata.billingAddress.line2,
            city: validatedData.metadata.billingAddress.city || '',
            state: validatedData.metadata.billingAddress.state || '',
            postalCode: validatedData.metadata.billingAddress.postalCode || '',
            country: validatedData.metadata.billingAddress.country || ''
          } : undefined,
          customerIp: validatedData.metadata?.customerIp,
          userAgent: validatedData.metadata?.userAgent,
          description: validatedData.metadata?.description,
          customFields: validatedData.metadata?.customFields,
        },
        createdAt: now,
        updatedAt: now,
      };

      // Store payment in Supabase
      const { error: insertError } = await supabaseAdmin
        .from(this.paymentsCollection)
        .insert(payment);
      if (insertError) {
        throw new DatabaseError(`Failed to create payment: ${insertError.message}`);
      }

      // Update user payment status
      await userService.updatePaymentStatus(validatedData.userId, 'pending');

      // Process payment through gateway (mock implementation)
      const gatewayResponse = await this.processPaymentWithGateway(payment);

      // Update payment status based on gateway response
      const updatedPayment = await this.updatePaymentStatus(paymentId, gatewayResponse.status);

      // Send appropriate email notification
      if (gatewayResponse.status === 'completed') {
        await this.sendPaymentSuccessNotification(user, updatedPayment);
      } else if (gatewayResponse.status === 'failed') {
        await this.sendPaymentFailureNotification(user, updatedPayment);
      }

      return {
        success: gatewayResponse.status === 'completed',
        payment: updatedPayment,
        message: gatewayResponse.message,
        redirectUrl: gatewayResponse.redirectUrl,
      };
    } catch (error) {
      if (error instanceof PaymentError || error instanceof UserNotFoundError) {
        throw error;
      }
      throw new PaymentError(`Payment processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Verify payment and grant portal access
   */
  async verifyPaymentAndGrantAccess(userId: string, paymentId: string): Promise<{ success: boolean; message: string }> {
    try {
      // Get payment record
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new PaymentVerificationError('Payment not found');
      }

      // Verify payment belongs to user
      if (payment.userId !== userId) {
        throw new PaymentVerificationError('Payment does not belong to user');
      }

      // Check payment status
      if (payment.status !== 'completed') {
        throw new PaymentVerificationError(`Payment status is ${payment.status}, expected completed`);
      }

      // Update user payment status and subscription
      await userService.updatePaymentStatus(userId, 'completed');
      await userService.updateSubscriptionPlan(userId, payment.subscriptionPlan);

      // Grant portal access by updating user permissions
      await this.grantPortalAccess(userId, payment.subscriptionPlan);

      return {
        success: true,
        message: 'Payment verified and portal access granted',
      };
    } catch (error) {
      if (error instanceof PaymentVerificationError) {
        throw error;
      }
      throw new PaymentError(`Payment verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Handle payment webhook from gateway
   */
  async handlePaymentWebhook(webhookData: PaymentWebhook): Promise<{ success: boolean; message: string }> {
    try {
      // Validate webhook data
      const validatedWebhook = paymentWebhookSchema.parse(webhookData);

      // Verify webhook signature (implement based on your gateway)
      // For now, we'll skip signature verification as it requires gateway-specific implementation
      // if (!this.verifyWebhookSignature(validatedWebhook)) {
      //   throw new PaymentGatewayError('Invalid webhook signature');
      // }

      // Update payment status
      await this.updatePaymentStatus(validatedWebhook.data.id, validatedWebhook.data.status);

      // Get payment details
      const payment = await this.getPaymentById(validatedWebhook.data.id);
      if (!payment) {
        throw new PaymentVerificationError('Payment not found');
      }

      // Handle different webhook events
      switch (validatedWebhook.event) {
        case 'payment.completed':
          await this.handlePaymentCompleted(payment);
          break;
        case 'payment.failed':
          await this.handlePaymentFailed(payment);
          break;
        case 'payment.refunded':
          await this.handlePaymentRefunded(payment);
          break;
        default:
          console.log(`Unhandled webhook event: ${validatedWebhook.event}`);
      }

      return {
        success: true,
        message: 'Webhook processed successfully',
      };
    } catch (error) {
      console.error('Webhook processing error:', error);
      throw new PaymentGatewayError(`Webhook processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get payment by ID
   */
  async getPaymentById(paymentId: string): Promise<Payment | null> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.paymentsCollection)
        .select('*')
        .eq('id', paymentId)
        .single();
      if (error || !data) return null;
      return data as Payment;
    } catch (error) {
      throw new DatabaseError(`Failed to get payment: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get user payment history
   */
  async getUserPaymentHistory(userId: string, limit: number = 20): Promise<Payment[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.paymentsCollection)
        .select('*')
        .eq('userId', userId)
        .order('createdAt', { ascending: false })
        .limit(limit);
      if (error || !data) return [];
      return data as Payment[];
    } catch (error) {
      throw new DatabaseError(`Failed to get payment history: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get subscription plans
   */
  async getSubscriptionPlans(): Promise<any[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from(this.subscriptionPlansCollection)
        .select('*')
        .eq('isActive', true);
      if (error || !data) return [];
      return data;
    } catch (error) {
      throw new DatabaseError(`Failed to get subscription plans: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentId: string, refundAmount?: number): Promise<{ success: boolean; message: string }> {
    try {
      const payment = await this.getPaymentById(paymentId);
      if (!payment) {
        throw new PaymentVerificationError('Payment not found');
      }

      if (payment.status !== 'completed') {
        throw new PaymentError('Only completed payments can be refunded');
      }

      const refundAmountToProcess = refundAmount || payment.amount;

      // Process refund through gateway (mock implementation)
      const refundResponse = await this.processRefundWithGateway(payment, refundAmountToProcess);

      if (refundResponse.success) {
        // Update payment status
        await this.updatePaymentStatus(paymentId, 'refunded', {
          refundedAt: new Date(),
          refundAmount: refundAmountToProcess,
        });

        // Update user subscription if full refund
        if (refundAmountToProcess >= payment.amount) {
          await userService.updatePaymentStatus(payment.userId, 'refunded');
          await this.revokePortalAccess(payment.userId);
        }

        return {
          success: true,
          message: 'Refund processed successfully',
        };
      } else {
        throw new PaymentError('Refund processing failed');
      }
    } catch (error) {
      if (error instanceof PaymentError || error instanceof PaymentVerificationError) {
        throw error;
      }
      throw new PaymentError(`Refund processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update payment status
   */
  private async updatePaymentStatus(paymentId: string, status: PaymentStatus, additionalData?: any): Promise<Payment> {
    try {
      const updateData = {
        status,
        updatedAt: new Date(),
        ...additionalData,
      };
      const { data, error } = await supabaseAdmin
        .from(this.paymentsCollection)
        .update(updateData)
        .eq('id', paymentId)
        .select('*')
        .single();
      if (error || !data) {
        throw new DatabaseError(`Failed to update payment: ${error?.message || 'Unknown error'}`);
      }
      return data as Payment;
    } catch (error) {
      throw new DatabaseError(`Failed to update payment status: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Process payment with gateway (mock implementation)
   */
  private async processPaymentWithGateway(payment: Payment): Promise<{
    status: PaymentStatus;
    message: string;
    redirectUrl?: string;
  }> {
    // Mock gateway processing
    // In real implementation, this would integrate with Stripe, PayPal, etc.
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock success for demo purposes
    // In production, this would depend on actual gateway response
    const isSuccess = Math.random() > 0.1; // 90% success rate for demo

    if (isSuccess) {
      return {
        status: 'completed' as PaymentStatus,
        message: 'Payment processed successfully',
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success?paymentId=${payment.id}`,
      };
    } else {
      return {
        status: 'failed' as PaymentStatus,
        message: 'Payment processing failed',
      };
    }
  }

  /**
   * Process refund with gateway (mock implementation)
   */
  private async processRefundWithGateway(payment: Payment, refundAmount: number): Promise<{ success: boolean }> {
    // Mock refund processing
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { success: true };
  }

  /**
   * Verify webhook signature (mock implementation)
   */
  private verifyWebhookSignature(webhook: PaymentWebhook): boolean {
    // In real implementation, verify signature based on your gateway
    return true;
  }

  /**
   * Handle payment completed event
   */
  private async handlePaymentCompleted(payment: Payment): Promise<void> {
    await userService.updatePaymentStatus(payment.userId, 'completed');
    await userService.updateSubscriptionPlan(payment.userId, payment.subscriptionPlan);
    await this.grantPortalAccess(payment.userId, payment.subscriptionPlan);
  }

  /**
   * Handle payment failed event
   */
  private async handlePaymentFailed(payment: Payment): Promise<void> {
    await userService.updatePaymentStatus(payment.userId, 'failed');
  }

  /**
   * Handle payment refunded event
   */
  private async handlePaymentRefunded(payment: Payment): Promise<void> {
    await userService.updatePaymentStatus(payment.userId, 'refunded');
    await this.revokePortalAccess(payment.userId);
  }

  /**
   * Grant portal access based on subscription
   */
  private async grantPortalAccess(userId: string, subscriptionPlan: string): Promise<void> {
    // Update user permissions based on subscription plan
    // This would typically involve updating user roles or permissions
    console.log(`Granting portal access to user ${userId} with plan ${subscriptionPlan}`);
  }

  /**
   * Revoke portal access
   */
  private async revokePortalAccess(userId: string): Promise<void> {
    // Revoke user permissions
    console.log(`Revoking portal access for user ${userId}`);
  }

  /**
   * Send payment success notification
   */
  private async sendPaymentSuccessNotification(user: any, payment: Payment): Promise<void> {
    try {
      await sendPaymentConfirmationEmail(user.email, user.firstName, {
        reference: payment.transactionId || '',
        amount: payment.amount,
        currency: payment.currency,
        paidAt: payment.paymentDate.toISOString(),
        course: payment.subscriptionPlan || ''
      }, '');
    } catch (error) {
      console.error('Failed to send payment success email:', error);
    }
  }

  /**
   * Send payment failure notification
   */
  private async sendPaymentFailureNotification(user: any, payment: Payment): Promise<void> {
    try {
      await sendPaymentFailureEmail(user.email, user.firstName, payment);
    } catch (error) {
      console.error('Failed to send payment failure email:', error);
    }
  }

  /**
   * Generate unique payment ID
   */
  private generatePaymentId(): string {
    return `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate unique transaction ID
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export const paymentService = new PaymentService();
