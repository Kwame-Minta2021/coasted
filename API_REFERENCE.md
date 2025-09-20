# 🔌 Coasted Code - API Reference

## Base URL
```
Production: https://coasted-code.vercel.app/api
Development: http://localhost:3000/api
```

## Authentication
Most API endpoints require authentication. Include the Firebase ID token in the Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

---

## Authentication Endpoints

### Check User Existence
**POST** `/api/auth/check-user`

Check if a user exists in the system before authentication.

**Request Body:**
```json
{
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "exists": true,
  "user": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Doe",
    "role": "student"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "User not found"
}
```

---

### User Sign In
**POST** `/api/auth/signin`

Authenticate a user with email and password.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Doe",
    "role": "student",
    "ageBand": "10-13"
  },
  "token": "firebase_id_token"
}
```

---

### User Registration
**POST** `/api/auth/signup`

Register a new user account.

**Request Body:**
```json
{
  "email": "student@example.com",
  "password": "password123",
  "userData": {
    "displayName": "John Doe",
    "ageBand": "10-13",
    "role": "student"
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Doe",
    "role": "student"
  }
}
```

---

## Payment Endpoints

### Initialize Payment
**POST** `/api/paystack/initialize`

Initialize a Paystack payment transaction for course enrollment.

**Request Body:**
```json
{
  "email": "parent@example.com",
  "phone": "+233123456789",
  "ageBand": "10-13",
  "parentName": "Jane Doe",
  "childName": "John Doe",
  "amountGhs": 500
}
```

**Response:**
```json
{
  "success": true,
  "authorization_url": "https://checkout.paystack.com/...",
  "access_code": "access_code_123",
  "reference": "ref_123456789"
}
```

**Error Response:**
```json
{
  "error": "Missing required fields",
  "details": "Please provide all required fields"
}
```

---

### Verify Payment
**GET** `/api/paystack/verify?reference=ref_123456789`

Verify the status of a payment transaction.

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "reference": "ref_123456789",
    "status": "success",
    "email": "parent@example.com",
    "amount": 50000,
    "currency": "GHS",
    "channel": "mobile_money",
    "paidAt": "2024-12-01T10:30:00Z",
    "ageBand": "10-13",
    "childName": "John Doe",
    "parentName": "Jane Doe",
    "userCreated": true,
    "defaultPassword": "coastedcode2024"
  }
}
```

---

### Payment Webhook
**POST** `/api/paystack/webhook`

Handle Paystack webhook notifications for payment events.

**Request Body:**
```json
{
  "event": "charge.success",
  "data": {
    "reference": "ref_123456789",
    "status": "success",
    "amount": 50000,
    "currency": "GHS",
    "customer": {
      "email": "parent@example.com"
    },
    "metadata": {
      "ageBand": "10-13",
      "childName": "John Doe",
      "parentName": "Jane Doe"
    }
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Webhook processed successfully"
}
```

---

## User Management Endpoints

### Get User Profile
**GET** `/api/users/profile`

Retrieve the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Doe",
    "ageBand": "10-13",
    "role": "student",
    "enrollmentDate": "2024-12-01T10:30:00Z",
    "courseEnrolled": "Coasted Code Course",
    "status": "active",
    "address": {
      "line1": "123 Main St",
      "city": "Accra",
      "state": "Greater Accra",
      "postalCode": "00233",
      "country": "Ghana"
    },
    "emergencyContact": {
      "name": "Jane Doe",
      "phone": "+233123456789",
      "relationship": "Parent"
    },
    "preferences": {
      "notifications": true,
      "darkMode": false,
      "language": "en"
    }
  }
}
```

---

### Update User Profile
**PUT** `/api/users/profile`

Update the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Request Body:**
```json
{
  "displayName": "John Smith",
  "address": {
    "line1": "456 New St",
    "city": "Kumasi",
    "state": "Ashanti",
    "postalCode": "00233",
    "country": "Ghana"
  },
  "preferences": {
    "notifications": false,
    "darkMode": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "uid": "user123",
    "email": "student@example.com",
    "displayName": "John Smith",
    "updatedAt": "2024-12-01T11:00:00Z"
  }
}
```

---

### Enroll User
**POST** `/api/users/enroll`

Enroll a user in a course.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Request Body:**
```json
{
  "courseId": "course123",
  "paymentReference": "ref_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "userId": "user123",
    "courseId": "course123",
    "enrollmentDate": "2024-12-01T10:30:00Z",
    "status": "active"
  }
}
```

---

## Guidance System Endpoints

### Get Students
**GET** `/api/guidance/students`

Retrieve list of students under guidance (for parents/guardians).

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```json
{
  "success": true,
  "students": [
    {
      "id": "student1",
      "name": "John Doe",
      "email": "john@example.com",
      "age": 12,
      "screenTimeLimit": 120,
      "focusModeEnabled": true
    }
  ],
  "message": "Students loaded successfully"
}
```

---

### Update Screen Time Settings
**POST** `/api/guidance/screen-time`

Update screen time management settings for a student.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Request Body:**
```json
{
  "studentId": "student1",
  "dailyLimit": 120,
  "breakInterval": 30,
  "allowedHours": {
    "start": 8,
    "end": 20
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Screen time settings updated successfully"
}
```

---

### Set PIN
**POST** `/api/guidance/pin`

Set or update PIN for access control.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Request Body:**
```json
{
  "studentId": "student1",
  "pin": "1234",
  "restrictions": {
    "allowedHours": {
      "start": 8,
      "end": 20
    },
    "blockedSites": ["facebook.com", "twitter.com"],
    "allowedApps": ["coasted-code", "educational-apps"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "PIN set successfully"
}
```

---

### Get Screen Time Usage
**GET** `/api/guidance/usage`

Retrieve screen time usage data for a student.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters:**
- `studentId`: Student ID
- `period`: Time period (daily, weekly, monthly)

**Response:**
```json
{
  "success": true,
  "usage": {
    "studentId": "student1",
    "period": "daily",
    "totalTime": 90,
    "limit": 120,
    "remaining": 30,
    "breaksTaken": 3,
    "lastReset": "2024-12-01T00:00:00Z",
    "breakdown": {
      "educational": 60,
      "games": 20,
      "other": 10
    }
  }
}
```

---

## Course Management Endpoints

### Get Courses
**GET** `/api/courses`

Retrieve list of available courses.

**Response:**
```json
{
  "success": true,
  "courses": [
    {
      "id": "course1",
      "title": "Introduction to Coding",
      "description": "Learn the basics of programming",
      "instructor": "Dr. Smith",
      "level": "beginner",
      "category": "coding",
      "duration": "8 weeks",
      "price": 500,
      "currency": "GHS",
      "modules": [
        {
          "id": "module1",
          "title": "Variables and Data Types",
          "duration": "2 hours",
          "lessons": 5
        }
      ]
    }
  ]
}
```

---

### Get Course Details
**GET** `/api/courses/[courseId]`

Retrieve detailed information about a specific course.

**Response:**
```json
{
  "success": true,
  "course": {
    "id": "course1",
    "title": "Introduction to Coding",
    "description": "Learn the basics of programming",
    "instructor": "Dr. Smith",
    "level": "beginner",
    "category": "coding",
    "duration": "8 weeks",
    "price": 500,
    "currency": "GHS",
    "prerequisites": [],
    "learningObjectives": [
      "Understand basic programming concepts",
      "Write simple programs",
      "Debug code effectively"
    ],
    "certification": true,
    "modules": [
      {
        "id": "module1",
        "title": "Variables and Data Types",
        "description": "Learn about different data types",
        "duration": "2 hours",
        "lessons": [
          {
            "id": "lesson1",
            "title": "Introduction to Variables",
            "duration": "30 minutes",
            "type": "video"
          }
        ]
      }
    ]
  }
}
```

---

## Enrollment Endpoints

### Create Enrollment
**POST** `/api/enroll`

Create a new course enrollment.

**Request Body:**
```json
{
  "email": "student@example.com",
  "childName": "John Doe",
  "parentName": "Jane Doe",
  "ageBand": "10-13",
  "courseId": "course1",
  "paymentReference": "ref_123456789"
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "id": "enrollment123",
    "email": "student@example.com",
    "childName": "John Doe",
    "parentName": "Jane Doe",
    "ageBand": "10-13",
    "courseEnrolled": "Introduction to Coding",
    "paymentReference": "ref_123456789",
    "amount": 500,
    "currency": "GHS",
    "status": "completed",
    "enrollmentDate": "2024-12-01T10:30:00Z"
  }
}
```

---

### Update Enrollment Status
**PUT** `/api/enroll/update-status`

Update the status of an enrollment.

**Request Body:**
```json
{
  "enrollmentId": "enrollment123",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "enrollment": {
    "id": "enrollment123",
    "status": "active",
    "updatedAt": "2024-12-01T11:00:00Z"
  }
}
```

---

## Admin Endpoints

### Get Enrollments
**GET** `/api/admin/enrollments`

Retrieve all enrollments (admin only).

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Query Parameters:**
- `status`: Filter by status (pending, completed, failed)
- `limit`: Number of results to return
- `offset`: Number of results to skip

**Response:**
```json
{
  "success": true,
  "enrollments": [
    {
      "id": "enrollment123",
      "email": "student@example.com",
      "childName": "John Doe",
      "parentName": "Jane Doe",
      "ageBand": "10-13",
      "courseEnrolled": "Introduction to Coding",
      "paymentReference": "ref_123456789",
      "amount": 500,
      "currency": "GHS",
      "status": "completed",
      "enrollmentDate": "2024-12-01T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

---

### Resend Receipt
**POST** `/api/admin/resend-receipt`

Resend payment receipt to user (admin only).

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Request Body:**
```json
{
  "enrollmentId": "enrollment123",
  "email": "student@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Receipt sent successfully"
}
```

---

## Utility Endpoints

### Health Check
**GET** `/api/health`

Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-12-01T10:30:00Z",
  "version": "1.0.0",
  "services": {
    "firebase": "connected",
    "paystack": "connected",
    "email": "connected"
  }
}
```

---

### Environment Check
**GET** `/api/check-env`

Check environment configuration (development only).

**Response:**
```json
{
  "environment": "development",
  "firebase": {
    "configured": true,
    "projectId": "coasted-code-dev"
  },
  "paystack": {
    "configured": true,
    "mode": "test"
  },
  "email": {
    "resend": true,
    "sendgrid": false
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Invalid request parameters",
  "details": "Specific error details"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

---

## Rate Limiting

API endpoints are rate-limited to prevent abuse:

- **Authentication endpoints**: 5 requests per minute per IP
- **Payment endpoints**: 10 requests per minute per IP
- **General endpoints**: 100 requests per minute per IP

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Webhooks

### Paystack Webhook Events

The application listens for the following Paystack webhook events:

- `charge.success`: Payment completed successfully
- `charge.failed`: Payment failed
- `transfer.success`: Transfer completed
- `transfer.failed`: Transfer failed

### Webhook Security

Webhooks are secured using Paystack's signature verification. The webhook endpoint validates the signature to ensure requests are from Paystack.

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Initialize API client
const API_BASE = 'https://coasted-code.vercel.app/api';

// Authentication
async function signIn(email: string, password: string) {
  const response = await fetch(`${API_BASE}/auth/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  
  return response.json();
}

// Payment initialization
async function initializePayment(paymentData: any) {
  const response = await fetch(`${API_BASE}/paystack/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(paymentData),
  });
  
  return response.json();
}

// Get user profile
async function getUserProfile(token: string) {
  const response = await fetch(`${API_BASE}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  return response.json();
}
```

### Python

```python
import requests

API_BASE = 'https://coasted-code.vercel.app/api'

def sign_in(email, password):
    response = requests.post(
        f'{API_BASE}/auth/signin',
        json={'email': email, 'password': password}
    )
    return response.json()

def initialize_payment(payment_data):
    response = requests.post(
        f'{API_BASE}/paystack/initialize',
        json=payment_data
    )
    return response.json()

def get_user_profile(token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(f'{API_BASE}/users/profile', headers=headers)
    return response.json()
```

---

## Testing

### Postman Collection

A Postman collection is available for testing all API endpoints. Import the collection and configure environment variables for easy testing.

### Test Data

Use the following test data for development:

```json
{
  "testUser": {
    "email": "test@coastedcode.com",
    "password": "testpassword123",
    "displayName": "Test User",
    "ageBand": "10-13"
  },
  "testPayment": {
    "email": "test@coastedcode.com",
    "phone": "+233123456789",
    "ageBand": "10-13",
    "parentName": "Test Parent",
    "childName": "Test Child",
    "amountGhs": 100
  }
}
```

---

*Last updated: December 2024*
*API Version: 1.0.0*
