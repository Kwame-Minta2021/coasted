# Google Analytics Configuration - Coasted Code

## Stream Details

| Property | Value |
|----------|-------|
| **Stream Name** | coasted code |
| **Stream URL** | Your website URL |
| **Stream ID** | 12039784773 |
| **Measurement ID** | G-H2EE34FVLG |

## Implementation Status

✅ **Fully Configured and Active**

### What's Implemented

1. **Google Analytics 4 (GA4)** with your Measurement ID: `G-H2EE34FVLG`
2. **Automatic page tracking** on all pages
3. **Custom event tracking** functions
4. **Performance optimized** loading strategy
5. **TypeScript support** with proper type definitions

### Files Updated

- `components/GoogleAnalytics.tsx` - Main GA component
- `app/layout.tsx` - Root layout integration
- `GOOGLE_ANALYTICS_SETUP.md` - Setup documentation
- `app/test-ga/page.tsx` - Test page for verification

## Tracking Capabilities

### Automatic Tracking
- Page views on all routes
- User sessions and engagement
- Device and browser information
- Geographic data

### Custom Event Tracking
```typescript
// Available tracking functions
trackEnrollment(courseName, studentAge)     // Track course enrollments
trackCourseView(courseName)                 // Track course page views
trackLessonComplete(lessonName, courseName) // Track lesson completions
trackPayment(amount, currency)              // Track payment transactions
trackLogin(userType)                        // Track user logins
trackSearch(searchTerm)                     // Track search queries
trackEvent(action, category, label, value)  // Generic event tracking
```

## Testing Your Implementation

### 1. Visit Test Page
Go to: `http://localhost:3000/test-ga`
- Tests page view tracking
- Tests custom event tracking
- Provides verification instructions

### 2. Check Google Analytics
1. Open your Google Analytics dashboard
2. Go to **Real-time** reports
3. Look for:
   - Active users
   - Page views
   - Events

### 3. Browser Developer Tools
1. Open browser console (F12)
2. Check for:
   - `window.gtag` function
   - `window.dataLayer` array
   - Network requests to `googletagmanager.com`

## Environment Variables

```bash
# Optional: Override the default Measurement ID
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-H2EE34FVLG
```

## Integration Examples

### Track Course Enrollment
```typescript
import { trackEnrollment } from '@/components/GoogleAnalytics'

// In your enrollment component
const handleEnrollment = (courseName: string, studentAge: number) => {
  // Your enrollment logic...
  
  // Track the event
  trackEnrollment(courseName, studentAge)
}
```

### Track Payment
```typescript
import { trackPayment } from '@/components/GoogleAnalytics'

// In your payment component
const handlePaymentSuccess = (amount: number) => {
  // Your payment logic...
  
  // Track the payment
  trackPayment(amount, 'GHS')
}
```

### Track Page Views
```typescript
import { trackPageView } from '@/components/GoogleAnalytics'

// In your page component
useEffect(() => {
  trackPageView('/courses', 'Course Catalog')
}, [])
```

## Analytics Dashboard

### Key Metrics to Monitor
1. **User Engagement**
   - Page views per session
   - Average session duration
   - Bounce rate

2. **Course Performance**
   - Most viewed courses
   - Enrollment conversion rates
   - Lesson completion rates

3. **User Behavior**
   - Popular pages and features
   - User flow through the platform
   - Device and browser usage

### Custom Reports
Create custom reports in Google Analytics for:
- Course enrollment funnels
- Student progress tracking
- Payment conversion rates
- Feature usage analytics

## Troubleshooting

### If Analytics Isn't Working
1. Check browser console for errors
2. Verify Measurement ID is correct
3. Ensure scripts are loading (Network tab)
4. Check Google Analytics Real-time reports

### Common Issues
- **No data**: Check if ad blockers are enabled
- **Delayed data**: Real-time data may take a few minutes
- **Missing events**: Verify tracking functions are called

## Next Steps

1. **Monitor Real-time Data**: Check Google Analytics for incoming data
2. **Set Up Goals**: Configure conversion goals in GA4
3. **Create Audiences**: Set up user segments for targeted analysis
4. **Custom Dimensions**: Add custom parameters for deeper insights

## Support

- **Google Analytics Help**: https://support.google.com/analytics
- **GA4 Documentation**: https://developers.google.com/analytics/devguides/collection/ga4
- **Test Page**: Visit `/test-ga` to verify implementation

---

**Status**: ✅ Active and Ready  
**Last Updated**: $(date)  
**Measurement ID**: G-H2EE34FVLG
