# Google Analytics Integration Examples

Here are examples of how to integrate Google Analytics tracking into your existing components:

## 1. EnrollModal Component

Add tracking to the enrollment form submission:

```typescript
// In EnrollModal.tsx
import { trackEnrollment } from '@/components/GoogleAnalytics'

// In the submit function, after successful enrollment:
async function submit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const form = new FormData(e.currentTarget)
  const payload = Object.fromEntries(form.entries())
  setStatus('loading')
  try {
    const res = await fetch('/api/enroll', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, courseId: course.id, courseTitle: course.title })
    })
    if (!res.ok) throw new Error('Request failed')
    
    // Track successful enrollment
    trackEnrollment(course.title, payload.studentAge ? parseInt(payload.studentAge) : undefined)
    
    setStatus('ok')
  } catch {
    setStatus('error')
  }
}
```

## 2. Login Page

Add tracking to login attempts:

```typescript
// In login/page.tsx
import { trackLogin } from '@/components/GoogleAnalytics'

// In the handleLogin function, after successful login:
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  setMessage('');

  try {
    console.log('Attempting student login with:', email);
    const result = await signIn(email, password);
    
    if (result.success) {
      // Track successful login
      trackLogin('student')
      
      setMessage('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/student/dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Login failed');
    }
  } catch (error) {
    console.error('Login error:', error);
    setError('An unexpected error occurred');
  } finally {
    setIsLoading(false);
  }
};
```

## 3. Course Viewing

Add tracking to course detail views:

```typescript
// In CourseDetail.tsx or similar component
import { trackCourseView } from '@/components/GoogleAnalytics'
import { useEffect } from 'react'

export default function CourseDetail({ course }: { course: Course }) {
  useEffect(() => {
    // Track course view when component mounts
    trackCourseView(course.title)
  }, [course.title])

  // ... rest of component
}
```

## 4. Payment Tracking

Add tracking to payment completion:

```typescript
// In payment completion handler
import { trackPayment } from '@/components/GoogleAnalytics'

const handlePaymentSuccess = (amount: number, currency: string = 'GHS') => {
  // Track successful payment
  trackPayment(amount, currency)
  
  // ... rest of payment success logic
}
```

## 5. Lesson Completion

Add tracking to lesson completion:

```typescript
// In LessonPlayer.tsx or similar component
import { trackLessonComplete } from '@/components/GoogleAnalytics'

const markLessonComplete = (lessonName: string, courseName: string) => {
  // Track lesson completion
  trackLessonComplete(lessonName, courseName)
  
  // ... rest of completion logic
}
```

## 6. Search Functionality

Add tracking to search functionality:

```typescript
// In search component
import { trackSearch } from '@/components/GoogleAnalytics'

const handleSearch = (searchTerm: string) => {
  // Track search query
  trackSearch(searchTerm)
  
  // ... rest of search logic
}
```

## 7. Custom Event Tracking

For other interactions, use the generic trackEvent function:

```typescript
import { trackEvent } from '@/components/GoogleAnalytics'

// Track button clicks
const handleButtonClick = () => {
  trackEvent('button_click', 'engagement', 'header_cta')
}

// Track form submissions
const handleFormSubmit = () => {
  trackEvent('form_submit', 'engagement', 'contact_form')
}

// Track video plays
const handleVideoPlay = (videoTitle: string) => {
  trackEvent('video_play', 'media', videoTitle)
}
```

## Implementation Tips

1. **Import only what you need**: Import specific tracking functions rather than the entire GoogleAnalytics component
2. **Track meaningful events**: Focus on user actions that provide business value
3. **Use consistent naming**: Follow a consistent naming convention for events and categories
4. **Test in development**: Use Google Analytics DebugView to test your events
5. **Respect user privacy**: Consider implementing cookie consent if required

## Testing Your Implementation

1. Set up your Measurement ID in `.env.local`
2. Use Google Analytics DebugView or Real-time reports
3. Test each tracking function to ensure events are being sent
4. Verify that custom parameters are being captured correctly
