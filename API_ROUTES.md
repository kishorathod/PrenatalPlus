# API Routes Documentation - MotherCare+

## Overview

All API routes are located in `/src/app/api/` following Next.js 15 App Router conventions. Each route is a TypeScript file exporting HTTP method handlers.

## Authentication

All protected routes require a valid NextAuth session. The session is checked via middleware or within the route handler.

## Route Structure

### Base URL
- Development: `http://localhost:3000/api`
- Production: `https://yourdomain.com/api`

## API Endpoints

### Authentication Routes

#### `POST /api/auth/[...nextauth]`
NextAuth.js handler for all authentication operations.

**Endpoints:**
- `GET /api/auth/signin` - Sign in page
- `POST /api/auth/signin` - Sign in request
- `POST /api/auth/signout` - Sign out request
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

**Response:**
```json
{
  "user": {
    "id": "string",
    "email": "string",
    "name": "string",
    "role": "PATIENT" | "DOCTOR" | "ADMIN"
  }
}
```

---

### User Routes

#### `GET /api/users/me`
Get current authenticated user's profile.

**Authentication:** Required

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  "role": "PATIENT",
  "phone": "string",
  "dateOfBirth": "2024-01-01T00:00:00Z",
  "avatar": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "country": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### `PUT /api/users/me`
Update current user's profile.

**Authentication:** Required

**Request Body:**
```json
{
  "name": "string",
  "phone": "string",
  "dateOfBirth": "2024-01-01T00:00:00Z",
  "address": "string",
  "city": "string",
  "state": "string",
  "zipCode": "string",
  "country": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "name": "string",
  ...
}
```

---

### Appointment Routes

#### `GET /api/appointments`
Get all appointments for the current user.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
{
  "appointments": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "type": "ROUTINE_CHECKUP",
      "doctorName": "string",
      "location": "string",
      "date": "2024-01-01T00:00:00Z",
      "duration": 30,
      "status": "SCHEDULED",
      "pregnancyId": "string",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

#### `POST /api/appointments`
Create a new appointment.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "ROUTINE_CHECKUP",
  "doctorName": "string",
  "location": "string",
  "date": "2024-01-01T00:00:00Z",
  "duration": 30,
  "pregnancyId": "string",
  "reminderTime": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  ...
}
```

#### `GET /api/appointments/[id]`
Get a specific appointment by ID.

**Authentication:** Required

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "type": "ROUTINE_CHECKUP",
  "doctorName": "string",
  "location": "string",
  "date": "2024-01-01T00:00:00Z",
  "duration": 30,
  "status": "SCHEDULED",
  "notes": "string",
  "pregnancyId": "string",
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

#### `PUT /api/appointments/[id]`
Update an appointment.

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "type": "ROUTINE_CHECKUP",
  "doctorName": "string",
  "location": "string",
  "date": "2024-01-01T00:00:00Z",
  "duration": 30,
  "status": "SCHEDULED",
  "notes": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  ...
}
```

#### `DELETE /api/appointments/[id]`
Delete an appointment.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

---

### Vitals Routes

#### `GET /api/vitals`
Get all vital signs for the current user.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by vital type
- `pregnancyId` (optional): Filter by pregnancy
- `startDate` (optional): Filter by start date
- `endDate` (optional): Filter by end date

**Response:**
```json
{
  "vitals": [
    {
      "id": "string",
      "type": "WEIGHT",
      "value": 65.5,
      "unit": "kg",
      "week": 12,
      "notes": "string",
      "recordedAt": "2024-01-01T00:00:00Z",
      "pregnancyId": "string"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50
  }
}
```

#### `POST /api/vitals`
Create a new vital sign entry.

**Authentication:** Required

**Request Body:**
```json
{
  "type": "WEIGHT",
  "value": 65.5,
  "unit": "kg",
  "week": 12,
  "notes": "string",
  "pregnancyId": "string",
  "recordedAt": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "string",
  "type": "WEIGHT",
  "value": 65.5,
  "unit": "kg",
  "week": 12,
  "recordedAt": "2024-01-01T00:00:00Z",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### `GET /api/vitals/[id]`
Get a specific vital sign entry.

**Authentication:** Required

**Response:**
```json
{
  "id": "string",
  "type": "WEIGHT",
  "value": 65.5,
  "unit": "kg",
  "week": 12,
  "notes": "string",
  "recordedAt": "2024-01-01T00:00:00Z",
  "pregnancyId": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### `PUT /api/vitals/[id]`
Update a vital sign entry.

**Authentication:** Required

**Request Body:**
```json
{
  "value": 66.0,
  "unit": "kg",
  "notes": "string",
  "recordedAt": "2024-01-01T00:00:00Z"
}
```

**Response:**
```json
{
  "id": "string",
  "type": "WEIGHT",
  "value": 66.0,
  ...
}
```

---

### Report Routes

#### `GET /api/reports`
Get all medical reports for the current user.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `type` (optional): Filter by report type
- `pregnancyId` (optional): Filter by pregnancy

**Response:**
```json
{
  "reports": [
    {
      "id": "string",
      "title": "string",
      "type": "ULTRASOUND",
      "description": "string",
      "fileUrl": "string",
      "fileName": "string",
      "fileSize": 1024000,
      "mimeType": "application/pdf",
      "reportDate": "2024-01-01T00:00:00Z",
      "doctorName": "string",
      "clinicName": "string",
      "pregnancyId": "string",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25
  }
}
```

#### `POST /api/reports`
Create a new medical report (after file upload).

**Authentication:** Required

**Request Body:**
```json
{
  "title": "string",
  "type": "ULTRASOUND",
  "description": "string",
  "fileUrl": "string",
  "fileName": "string",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "reportDate": "2024-01-01T00:00:00Z",
  "doctorName": "string",
  "clinicName": "string",
  "pregnancyId": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "type": "ULTRASOUND",
  "fileUrl": "string",
  ...
}
```

#### `GET /api/reports/[id]`
Get a specific medical report.

**Authentication:** Required

**Response:**
```json
{
  "id": "string",
  "title": "string",
  "type": "ULTRASOUND",
  "description": "string",
  "fileUrl": "string",
  "fileName": "string",
  "fileSize": 1024000,
  "mimeType": "application/pdf",
  "reportDate": "2024-01-01T00:00:00Z",
  "doctorName": "string",
  "clinicName": "string",
  "pregnancyId": "string",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

#### `DELETE /api/reports/[id]`
Delete a medical report.

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Report deleted successfully"
}
```

---

### Upload Routes

#### `POST /api/upload`
Upload a file using UploadThing.

**Authentication:** Required

**Request:**
- FormData with file

**Response:**
```json
{
  "url": "https://uploadthing.com/...",
  "key": "string",
  "name": "string",
  "size": 1024000
}
```

---

### Notification Routes

#### `GET /api/notifications`
Get all notifications for the current user.

**Authentication:** Required

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page
- `read` (optional): Filter by read status
- `type` (optional): Filter by notification type

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "title": "string",
      "message": "string",
      "type": "APPOINTMENT_REMINDER",
      "priority": "NORMAL",
      "link": "string",
      "read": false,
      "readAt": null,
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "unreadCount": 5,
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 20
  }
}
```

#### `PUT /api/notifications/[id]`
Mark a notification as read.

**Authentication:** Required

**Request Body:**
```json
{
  "read": true
}
```

**Response:**
```json
{
  "id": "string",
  "read": true,
  "readAt": "2024-01-01T00:00:00Z"
}
```

---

### Pusher Routes

#### `POST /api/pusher/auth`
Authenticate Pusher channel subscription.

**Authentication:** Required

**Request Body:**
```json
{
  "socket_id": "string",
  "channel_name": "user-123"
}
```

**Response:**
```json
{
  "auth": "string"
}
```

---

## Error Responses

All endpoints return standard error responses:

### 400 Bad Request
```json
{
  "error": "Validation Error",
  "message": "Invalid input data",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
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
  "message": "You don't have permission to access this resource"
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

## Rate Limiting

API routes should implement rate limiting to prevent abuse:
- Authentication routes: 5 requests per minute
- Other routes: 100 requests per minute per user

## CORS

CORS is configured for:
- Development: `http://localhost:3000`
- Production: Your production domain

## Security

- All routes validate input using Zod schemas
- Authentication is required for protected routes
- Role-based authorization is enforced
- SQL injection prevention via Prisma
- XSS protection via input sanitization


