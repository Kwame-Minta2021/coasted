import { sendMail } from './mailer'

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(email: string, firstName: string): Promise<void> {
  try {
    const template = getWelcomeEmailTemplate(firstName);
    
    await sendMail({
      from: 'Coasted Code <noreply@coasted-code.com>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw new Error('Failed to send welcome email');
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, firstName: string, resetLink: string): Promise<void> {
  try {
    const template = getPasswordResetEmailTemplate(firstName, resetLink);
    
    await sendMail({
      from: 'Coasted Code <noreply@coasted-code.com>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Send payment confirmation email
 */
export async function sendPaymentConfirmationEmail(
  email: string,
  firstName: string,
  payment: { reference: string; amount: number; currency: string; paidAt: string; course: string },
  magicLink: string
): Promise<void> {
  try {
    const template = getPaymentConfirmationTemplate(firstName, payment, magicLink);
    await sendMail({
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    })

    console.log(`Payment confirmation email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send payment confirmation email:', error);
    // Don't throw error - just log it so payment processing can continue
    console.warn('Email sending failed but payment verification will continue');
  }
}

/**
 * Send payment failure email
 */
export async function sendPaymentFailureEmail(email: string, firstName: string, payment: any): Promise<void> {
  try {
    const template = getPaymentFailureTemplate(firstName, payment);
    
    await sendMail({
      from: 'Coasted Code <noreply@coasted-code.com>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Payment failure email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send payment failure email:', error);
    throw new Error('Failed to send payment failure email');
  }
}

/**
 * Send subscription renewal reminder
 */
export async function sendSubscriptionRenewalReminder(email: string, firstName: string, renewalDate: Date): Promise<void> {
  try {
    const template = getSubscriptionRenewalTemplate(firstName, renewalDate);
    
    await sendMail({
      from: 'Coasted Code <noreply@coasted-code.com>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Subscription renewal reminder sent to ${email}`);
  } catch (error) {
    console.error('Failed to send subscription renewal reminder:', error);
    throw new Error('Failed to send subscription renewal reminder');
  }
}

/**
 * Send account verification email
 */
export async function sendAccountVerificationEmail(email: string, firstName: string, verificationLink: string): Promise<void> {
  try {
    const template = getAccountVerificationTemplate(firstName, verificationLink);
    
    await sendMail({
      from: 'Coasted Code <noreply@coasted-code.com>',
      to: email,
      subject: template.subject,
      html: template.html,
      text: template.text,
    });

    console.log(`Account verification email sent to ${email}`);
  } catch (error) {
    console.error('Failed to send account verification email:', error);
    throw new Error('Failed to send account verification email');
  }
}

// Email Templates

function getWelcomeEmailTemplate(firstName: string): EmailTemplate {
  const subject = `Welcome to Coasted Code, ${firstName}! 🚀`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Coasted Code</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Coasted Code! 🎉</h1>
          <p>Your coding journey starts here</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Welcome to Coasted Code! We're excited to have you join our community of learners and developers.</p>
          
          <h3>What's next?</h3>
          <ul>
            <li>Complete your profile setup</li>
            <li>Explore our course catalog</li>
            <li>Join our community discussions</li>
            <li>Start your first coding project</li>
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
          
          <p>If you have any questions, don't hesitate to reach out to our support team.</p>
          
          <p>Happy coding!<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>You received this email because you signed up for Coasted Code.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Welcome to Coasted Code, ${firstName}! 🚀

Your coding journey starts here.

What's next?
- Complete your profile setup
- Explore our course catalog
- Join our community discussions
- Start your first coding project

Go to Dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

If you have any questions, don't hesitate to reach out to our support team.

Happy coding!
The Coasted Code Team

© 2024 Coasted Code. All rights reserved.
You received this email because you signed up for Coasted Code.
  `;

  return { subject, html, text };
}

function getPasswordResetEmailTemplate(firstName: string, resetLink: string): EmailTemplate {
  const subject = 'Reset Your Coasted Code Password 🔐';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password 🔐</h1>
          <p>Secure your Coasted Code account</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>We received a request to reset your password for your Coasted Code account.</p>
          
          <a href="${resetLink}" class="button">Reset Password</a>
          
          <div class="warning">
            <strong>Important:</strong> This link will expire in 1 hour for security reasons.
          </div>
          
          <p>If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.</p>
          
          <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
          <p>${resetLink}</p>
          
          <p>Best regards,<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;
  
  const text = `
Reset Your Coasted Code Password 🔐
    
Hi ${firstName},
    
We received a request to reset your password for your Coasted Code account.
    
Reset Password: ${resetLink}
    
    Important: This link will expire in 1 hour for security reasons.
    
If you didn't request this password reset, you can safely ignore this email. Your password will remain unchanged.

If you're having trouble with the link above, copy and paste this URL into your browser:
${resetLink}

Best regards,
The Coasted Code Team

© 2024 Coasted Code. All rights reserved.
This is an automated email. Please do not reply.
  `;

  return { subject, html, text };
}

function getPaymentConfirmationTemplate(
  firstName: string,
  payment: { reference: string; amount: number; currency: string; paidAt: string; course: string },
  magicLink: string
): EmailTemplate {
  const subject = 'Payment Confirmed — Access your portal';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Confirmed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .receipt { background: white; border: 1px solid #ddd; padding: 20px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Payment Confirmed! ✅</h1><p>Your Coasted Code access is active</p></div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Great news! Your payment has been processed successfully.</p>
          
          <div class="receipt">
            <h3>Payment Receipt</h3>
            <p><strong>Reference:</strong> ${payment.reference}</p>
            <p><strong>Amount:</strong> ${payment.amount} ${payment.currency}</p>
            <p><strong>Course:</strong> ${payment.course}</p>
            <p><strong>Paid at:</strong> ${new Date(payment.paidAt).toLocaleString()}</p>
          </div>
          <a href="${magicLink}" class="button">Open My Portal</a>
          
          <p>You now have full access to all features included in your subscription plan.</p>
          
          <p>Happy learning!<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>Questions? Contact us at support@coasted-code.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `Payment confirmed.
Reference: ${payment.reference}
Amount: ${payment.amount} ${payment.currency}
Course: ${payment.course}
Paid at: ${new Date(payment.paidAt).toLocaleString()}
Login: ${magicLink}`

  return { subject, html, text };
}

function getPaymentFailureTemplate(firstName: string, payment: any): EmailTemplate {
  const subject = 'Payment Failed - Action Required ❌';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Payment Failed</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .alert { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Payment Failed ❌</h1>
          <p>We need your attention</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>We're sorry, but your recent payment for Coasted Code could not be processed.</p>
          
          <div class="alert">
            <strong>Transaction Details:</strong><br>
            Amount: $${payment.amount}<br>
            Plan: ${payment.subscriptionPlan}<br>
            Date: ${new Date(payment.paymentDate).toLocaleDateString()}
          </div>
          
          <h3>What you can do:</h3>
          <ul>
            <li>Check your payment method details</li>
            <li>Ensure sufficient funds are available</li>
            <li>Try using a different payment method</li>
            <li>Contact your bank if needed</li>
          </ul>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/payment/retry" class="button">Try Payment Again</a>
          
          <p>If you continue to experience issues, please contact our support team for assistance.</p>
          
          <p>Best regards,<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>Need help? Contact us at support@coasted-code.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Payment Failed ❌

Hi ${firstName},

We're sorry, but your recent payment for Coasted Code could not be processed.

Transaction Details:
- Amount: $${payment.amount}
- Plan: ${payment.subscriptionPlan}
- Date: ${new Date(payment.paymentDate).toLocaleDateString()}

What you can do:
- Check your payment method details
- Ensure sufficient funds are available
- Try using a different payment method
- Contact your bank if needed

Try Payment Again: ${process.env.NEXT_PUBLIC_APP_URL}/payment/retry

If you continue to experience issues, please contact our support team for assistance.

Best regards,
The Coasted Code Team

© 2024 Coasted Code. All rights reserved.
Need help? Contact us at support@coasted-code.com
  `;

  return { subject, html, text };
}

function getSubscriptionRenewalTemplate(firstName: string, renewalDate: Date): EmailTemplate {
  const subject = 'Your Coasted Code Subscription Renews Soon 🔄';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Subscription Renewal</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .reminder { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .button { display: inline-block; background: #ffc107; color: #333; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Subscription Renewal Reminder 🔄</h1>
          <p>Keep your learning journey going</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>This is a friendly reminder that your Coasted Code subscription will automatically renew on ${renewalDate.toLocaleDateString()}.</p>
          
          <div class="reminder">
            <strong>Renewal Date:</strong> ${renewalDate.toLocaleDateString()}<br>
            <strong>Time:</strong> ${renewalDate.toLocaleTimeString()}
          </div>
          
          <p>Your subscription will continue uninterrupted, and you'll maintain access to all your current features and courses.</p>
          
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/billing" class="button">Manage Subscription</a>
          
          <p>If you wish to cancel or modify your subscription, please do so before the renewal date.</p>
          
          <p>Thank you for being part of our community!<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>Questions? Contact us at support@coasted-code.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Subscription Renewal Reminder 🔄

Hi ${firstName},

This is a friendly reminder that your Coasted Code subscription will automatically renew on ${renewalDate.toLocaleDateString()}.

Renewal Details:
- Date: ${renewalDate.toLocaleDateString()}
- Time: ${renewalDate.toLocaleTimeString()}

Your subscription will continue uninterrupted, and you'll maintain access to all your current features and courses.

Manage Subscription: ${process.env.NEXT_PUBLIC_APP_URL}/account/billing

If you wish to cancel or modify your subscription, please do so before the renewal date.

Thank you for being part of our community!
The Coasted Code Team

© 2024 Coasted Code. All rights reserved.
Questions? Contact us at support@coasted-code.com
  `;

  return { subject, html, text };
}

function getAccountVerificationTemplate(firstName: string, verificationLink: string): EmailTemplate {
  const subject = 'Verify Your Coasted Code Account ✉️';
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Account</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .info { background: #e3f2fd; border: 1px solid #bbdefb; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Verify Your Account ✉️</h1>
          <p>Complete your Coasted Code registration</p>
        </div>
        <div class="content">
          <h2>Hi ${firstName},</h2>
          <p>Welcome to Coasted Code! To complete your registration and start your coding journey, please verify your email address.</p>
          
          <a href="${verificationLink}" class="button">Verify Email Address</a>
          
          <div class="info">
            <strong>Why verify your email?</strong><br>
            • Secure your account<br>
            • Receive important updates<br>
            • Access all platform features<br>
            • Reset your password if needed
          </div>
          
          <p>If you're having trouble with the button above, copy and paste this link into your browser:</p>
          <p>${verificationLink}</p>
          
          <p>Best regards,<br>The Coasted Code Team</p>
        </div>
        <div class="footer">
          <p>© 2024 Coasted Code. All rights reserved.</p>
          <p>This is an automated email. Please do not reply.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Verify Your Account ✉️

Hi ${firstName},

Welcome to Coasted Code! To complete your registration and start your coding journey, please verify your email address.

Verify Email Address: ${verificationLink}

Why verify your email?
• Secure your account
• Receive important updates
• Access all platform features
• Reset your password if needed

If you're having trouble with the link above, copy and paste this URL into your browser:
${verificationLink}

Best regards,
The Coasted Code Team

© 2024 Coasted Code. All rights reserved.
This is an automated email. Please do not reply.
  `;

  return { subject, html, text };
}
