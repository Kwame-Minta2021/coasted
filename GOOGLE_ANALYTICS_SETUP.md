# Google Analytics Setup Guide

## 1. Get Your Google Analytics Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new GA4 property for your website
3. Copy your Measurement ID (format: G-XXXXXXXXXX)

## 2. Environment Variable Setup

Add the following environment variable to your `.env.local` file:

```bash
# Google Analytics Configuration
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H2EE34FVLG

# Gemini AI Configuration (for Chatbot)
GEMINI_API_KEY=your_gemini_api_key_here
```

Your Google Analytics Measurement ID is already configured: `G-H2EE34FVLG`

## 3. Implementation Details

The Google Analytics implementation includes:

- **Automatic page tracking**: Tracks page views automatically
- **Event tracking functions**: Pre-built functions for common events
- **Performance optimized**: Uses Next.js Script component with proper loading strategy

## 4. Available Tracking Functions

You can use these functions throughout your application:

```typescript
import { 
  trackEvent, 
  trackEnrollment, 
  trackCourseView, 
  trackLessonComplete, 
  trackPayment, 
  trackLogin, 
  trackSearch 
} from '@/components/GoogleAnalytics'

// Track custom events
trackEvent('button_click', 'engagement', 'header_cta')

// Track enrollment
trackEnrollment('Python Basics', 12)

// Track course views
trackCourseView('JavaScript Fundamentals')

// Track lesson completion
trackLessonComplete('Variables and Data Types', 'Python Basics')

// Track payments
trackPayment(150, 'GHS')

// Track login
trackLogin('student')

// Track search
trackSearch('python programming')
```

## 5. Testing

1. Add your Measurement ID to `.env.local`
2. Restart your development server
3. Visit your website
4. Check Google Analytics Real-time reports to see if data is being received

## 6. Production Deployment

Make sure to add the `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable to your production environment (Vercel, Netlify, etc.).

## 7. Privacy Considerations

- The implementation respects user privacy
- Consider adding a cookie consent banner if required by your jurisdiction
- You can conditionally load GA based on user consent if needed
