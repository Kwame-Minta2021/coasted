# 🚀 Coasted Code - Deployment Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Environment Setup](#environment-setup)
3. [Firebase Configuration](#firebase-configuration)
4. [Payment Gateway Setup](#payment-gateway-setup)
5. [Email Service Configuration](#email-service-configuration)
6. [Deployment Platforms](#deployment-platforms)
7. [Production Checklist](#production-checklist)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Accounts
- **Firebase Project**: For authentication and database
- **Paystack Account**: For payment processing
- **Email Service**: Resend or SendGrid for notifications
- **Deployment Platform**: Vercel, Netlify, or custom server
- **Domain**: Custom domain for production

### Required Tools
- Node.js 18+ 
- npm or yarn
- Git
- Firebase CLI
- Deployment platform CLI (Vercel, Netlify, etc.)

---

## Environment Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/coasted-code.git
cd coasted-code
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create `.env.local` file with the following variables:

```env
# Application Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Firebase Configuration (Client)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Firebase Admin (Server)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your_project.iam.gserviceaccount.com

# Payment Gateway
PAYSTACK_SECRET_KEY=sk_live_your_secret_key
PAYSTACK_PUBLIC_KEY=pk_live_your_public_key

# Email Services
RESEND_API_KEY=re_your_resend_key
SENDGRID_API_KEY=SG.your_sendgrid_key
FROM_EMAIL=noreply@your-domain.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## Firebase Configuration

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `coasted-code`
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Configure authorized domains:
   - `your-domain.com`
   - `localhost` (for development)

### 3. Create Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select location closest to your users
5. Create database

### 4. Set Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Enrollments are readable by authenticated users
    match /enrollments/{enrollmentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (resource == null || resource.data.email == request.auth.token.email);
    }
    
    // Courses are publicly readable
    match /courses/{courseId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@coastedcode.com'];
    }
    
    // Progress data is user-specific
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Guidance data is guardian-specific
    match /guidance/{guidanceId} {
      allow read, write: if request.auth != null && 
        resource.data.guardianId == request.auth.uid;
    }
  }
}
```

### 5. Generate Service Account Key
1. Go to "Project Settings" > "Service accounts"
2. Click "Generate new private key"
3. Download the JSON file
4. Extract the private key and client email for environment variables

### 6. Configure Storage (Optional)
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select location
5. Create bucket

---

## Payment Gateway Setup

### 1. Create Paystack Account
1. Go to [Paystack](https://paystack.com/)
2. Sign up for an account
3. Complete business verification
4. Get your API keys

### 2. Configure Webhooks
1. In Paystack Dashboard, go to "Settings" > "Webhooks"
2. Add webhook URL: `https://your-domain.com/api/paystack/webhook`
3. Select events:
   - `charge.success`
   - `charge.failed`
   - `transfer.success`
   - `transfer.failed`

### 3. Test Payment Flow
```bash
# Test with Paystack test keys
PAYSTACK_SECRET_KEY=sk_test_your_test_key
PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
```

### 4. Production Keys
```bash
# Switch to live keys for production
PAYSTACK_SECRET_KEY=sk_live_your_live_key
PAYSTACK_PUBLIC_KEY=pk_live_your_live_key
```

---

## Email Service Configuration

### Option 1: Resend (Recommended)
1. Sign up at [Resend](https://resend.com/)
2. Verify your domain
3. Get API key from dashboard
4. Configure in environment variables

### Option 2: SendGrid
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Verify sender identity
4. Configure in environment variables

### Email Templates
Create the following email templates:

#### Welcome Email
```html
<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Coasted Code</title>
</head>
<body>
    <h1>Welcome to Coasted Code!</h1>
    <p>Hello {{childName}},</p>
    <p>Welcome to your coding journey! Your account has been created successfully.</p>
    <p>Login credentials:</p>
    <ul>
        <li>Email: {{email}}</li>
        <li>Password: {{defaultPassword}}</li>
    </ul>
    <p>Please change your password after first login.</p>
    <a href="{{loginUrl}}">Login to your account</a>
</body>
</html>
```

#### Payment Receipt
```html
<!DOCTYPE html>
<html>
<head>
    <title>Payment Receipt - Coasted Code</title>
</head>
<body>
    <h1>Payment Receipt</h1>
    <p>Thank you for your payment!</p>
    <p>Course: {{courseName}}</p>
    <p>Amount: {{amount}} {{currency}}</p>
    <p>Reference: {{reference}}</p>
    <p>Date: {{paymentDate}}</p>
</body>
</html>
```

---

## Deployment Platforms

### Option 1: Vercel (Recommended)

#### 1. Install Vercel CLI
```bash
npm i -g vercel
```

#### 2. Deploy
```bash
# Login to Vercel
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

#### 3. Configure Environment Variables
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add all environment variables
5. Redeploy

#### 4. Custom Domain
1. In Vercel Dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS records
4. Enable SSL

### Option 2: Netlify

#### 1. Build Configuration
Create `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

#### 2. Deploy
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Login and deploy
netlify login
netlify deploy --prod
```

### Option 3: Custom Server

#### 1. Build Application
```bash
npm run build
```

#### 2. Docker Deployment
Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### 3. Deploy with Docker
```bash
# Build image
docker build -t coasted-code .

# Run container
docker run -p 3000:3000 --env-file .env.local coasted-code
```

---

## Production Checklist

### Pre-Deployment
- [ ] All environment variables configured
- [ ] Firebase project set up and configured
- [ ] Paystack account verified and webhooks configured
- [ ] Email service configured and tested
- [ ] Custom domain configured
- [ ] SSL certificate enabled
- [ ] Database security rules implemented
- [ ] Error tracking configured (Sentry, etc.)

### Post-Deployment
- [ ] Test authentication flow
- [ ] Test payment flow with real transactions
- [ ] Test email notifications
- [ ] Verify all API endpoints work
- [ ] Check performance metrics
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy
- [ ] Test on multiple devices/browsers

### Security Checklist
- [ ] Environment variables are secure
- [ ] API keys are not exposed in client code
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] Input validation is implemented
- [ ] SQL injection protection (if applicable)
- [ ] XSS protection enabled
- [ ] HTTPS is enforced

---

## Monitoring & Maintenance

### 1. Error Tracking
Set up error tracking with Sentry:

```bash
npm install @sentry/nextjs
```

Configure in `sentry.client.config.js`:
```javascript
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### 2. Performance Monitoring
Set up Firebase Performance Monitoring:

```javascript
import { getPerformance } from 'firebase/performance';

const perf = getPerformance(app);
```

### 3. Analytics
Configure Google Analytics:

```javascript
// In _app.tsx or layout.tsx
import { GoogleAnalytics } from 'nextjs-google-analytics';

export default function App({ Component, pageProps }) {
  return (
    <>
      <GoogleAnalytics gaMeasurementId={process.env.NEXT_PUBLIC_GA_ID} />
      <Component {...pageProps} />
    </>
  );
}
```

### 4. Uptime Monitoring
Set up uptime monitoring with:
- UptimeRobot
- Pingdom
- StatusCake

### 5. Backup Strategy
- **Database**: Firestore automatic backups
- **Code**: Git repository with multiple remotes
- **Assets**: Firebase Storage with versioning
- **Configuration**: Environment variable backup

---

## Troubleshooting

### Common Issues

#### 1. Firebase Authentication Not Working
**Symptoms**: Users can't sign in
**Solutions**:
- Check Firebase configuration in environment variables
- Verify authorized domains in Firebase Console
- Check browser console for errors
- Ensure Firebase project is active

#### 2. Payment Processing Fails
**Symptoms**: Payments not going through
**Solutions**:
- Verify Paystack API keys
- Check webhook configuration
- Test with Paystack test keys first
- Check payment amount format (pesewas for GHS)

#### 3. Email Not Sending
**Symptoms**: Users not receiving emails
**Solutions**:
- Check email service API keys
- Verify sender email is authenticated
- Check spam folders
- Test with different email providers

#### 4. Build Failures
**Symptoms**: Deployment fails during build
**Solutions**:
- Check Node.js version compatibility
- Verify all dependencies are installed
- Check for TypeScript errors
- Review build logs for specific errors

#### 5. Performance Issues
**Symptoms**: Slow loading times
**Solutions**:
- Enable bundle analysis
- Check image optimization
- Review database queries
- Implement caching strategies

### Debug Mode
Enable debug mode for development:

```env
NODE_ENV=development
DEBUG=coasted-code:*
```

### Logging
Set up structured logging:

```javascript
// lib/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

---

## Support

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Paystack Documentation](https://paystack.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

### Community
- [GitHub Issues](https://github.com/your-username/coasted-code/issues)
- [Discord Community](https://discord.gg/your-community)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/coasted-code)

### Professional Support
For enterprise support and custom development:
- Email: support@coastedcode.com
- Phone: +233-XXX-XXXX
- Website: https://coastedcode.com/support

---

*Last updated: December 2024*
*Version: 1.0.0*
