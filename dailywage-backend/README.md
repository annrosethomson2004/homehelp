# 🚀 DailyWageConnect Backend API

A comprehensive Node.js backend API for the DailyWageConnect platform, connecting households with local daily-wage workers.

## 📋 Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [File Upload](#file-upload)
9. [Real-time Communication](#real-time-communication)
10. [Error Handling](#error-handling)
11. [Security](#security)
12. [Deployment](#deployment)

## 🎯 Overview

The DailyWageConnect backend API provides:
- **User Authentication** with JWT tokens
- **Worker Management** with profiles and availability
- **Booking System** for service requests
- **Tool Rental** marketplace
- **Real-time Notifications** via Socket.IO
- **File Upload** for profiles and documents
- **Rating & Review** system
- **Search & Filtering** capabilities

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **JWT** - Authentication tokens
- **Socket.IO** - Real-time communication
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **Express Validator** - Input validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing

## ✨ Features

### Core Features
- ✅ User registration and authentication
- ✅ Worker profile management
- ✅ Service booking system
- ✅ Real-time notifications
- ✅ Tool rental marketplace
- ✅ Rating and review system
- ✅ File upload (avatars, documents)
- ✅ Search and filtering
- ✅ Geolocation-based matching

### Security Features
- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation and sanitization
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Error handling middleware

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository:**
```bash
git clone <repository-url>
cd dailywage-backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment Configuration:**
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/dailywageconnect

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=5000000
UPLOAD_PATH=./uploads

# Rate Limiting
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

4. **Start the server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

5. **Verify installation:**
Visit `http://localhost:5000/health` to check if the server is running.

## 🔌 API Endpoints

### Authentication Endpoints
```
POST   /api/auth/register          # User registration
POST   /api/auth/login             # User login
POST   /api/auth/logout            # User logout
GET    /api/auth/me                # Get current user
POST   /api/auth/forgot-password   # Forgot password
PUT    /api/auth/reset-password/:token  # Reset password
PUT    /api/auth/update-password   # Update password
GET    /api/auth/verify-email/:token    # Verify email
POST   /api/auth/resend-verification    # Resend verification email
```

### User Management
```
GET    /api/users/profile          # Get user profile
PUT    /api/users/profile          # Update user profile
POST   /api/users/upload-avatar    # Upload profile picture
DELETE /api/users/account          # Delete user account
```

### Worker Management
```
GET    /api/workers                # Get all workers
GET    /api/workers/:id            # Get worker by ID
GET    /api/workers/search         # Search workers
PUT    /api/workers/profile        # Update worker profile (Worker only)
PUT    /api/workers/availability   # Update availability (Worker only)
GET    /api/workers/bookings/me    # Get worker bookings (Worker only)
GET    /api/workers/stats/me       # Get worker statistics (Worker only)
```

### Booking Management
```
POST   /api/bookings               # Create new booking
GET    /api/bookings               # Get user bookings
GET    /api/bookings/:id           # Get booking by ID
PUT    /api/bookings/:id           # Update booking
DELETE /api/bookings/:id           # Cancel booking
POST   /api/bookings/:id/feedback  # Add feedback to booking
GET    /api/bookings/:id/messages  # Get booking messages
POST   /api/bookings/:id/messages  # Send message
```

### Tool Rental
```
GET    /api/tools                  # Get all tools
GET    /api/tools/:id              # Get tool by ID
GET    /api/tools/search           # Search tools
POST   /api/tools                  # Create tool listing (Auth required)
PUT    /api/tools/:id              # Update tool (Owner only)
DELETE /api/tools/:id              # Delete tool (Owner only)
POST   /api/tools/:id/favorite     # Toggle favorite (Auth required)
POST   /api/tools/:id/rent         # Rent tool (Auth required)
```

### Notifications
```
GET    /api/notifications          # Get user notifications
GET    /api/notifications/unread-count  # Get unread count
PUT    /api/notifications/:id/read # Mark notification as read
PUT    /api/notifications/read-all # Mark all notifications as read
DELETE /api/notifications/:id      # Delete notification
```

### Services
```
GET    /api/services               # Get services overview
GET    /api/services/categories    # Get service categories
GET    /api/services/stats         # Get service statistics
```

### System
```
GET    /health                     # Health check endpoint
```

## 📊 Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    coordinates: { lat: Number, lng: Number }
  },
  userType: Enum ['customer', 'worker'],
  profilePicture: String,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  isActive: Boolean,
  preferences: Object,
  timestamps: true
}
```

### Worker Model
```javascript
{
  userId: ObjectId (ref: User),
  services: [String],
  experience: Number,
  hourlyRate: Number,
  dailyRate: Number,
  description: String,
  availability: {
    schedule: [Object],
    unavailableDates: [Date],
    workingRadius: Number
  },
  ratings: {
    average: Number,
    count: Number,
    breakdown: Object
  },
  stats: Object,
  verification: Object,
  timestamps: true
}
```

### Booking Model
```javascript
{
  customer: ObjectId (ref: User),
  worker: ObjectId (ref: Worker),
  serviceType: String,
  bookingDate: Date,
  timeSlot: { startTime: String, endTime: String },
  status: Enum ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
  description: String,
  location: Object,
  pricing: Object,
  timeline: Object,
  communication: { messages: [Object] },
  feedback: Object,
  timestamps: true
}
```

### Tool Model
```javascript
{
  owner: ObjectId (ref: User),
  name: String,
  description: String,
  category: String,
  condition: Enum ['excellent', 'good', 'fair', 'poor'],
  pricing: {
    dailyRate: Number,
    weeklyRate: Number,
    monthlyRate: Number,
    securityDeposit: Number
  },
  availability: Object,
  location: Object,
  media: { images: [Object], videos: [Object] },
  rental: Object,
  timestamps: true
}
```

### Notification Model
```javascript
{
  recipient: ObjectId (ref: User),
  sender: ObjectId (ref: User),
  type: Enum ['booking', 'payment', 'reminder', 'general'],
  title: String,
  message: String,
  status: Enum ['pending', 'sent', 'delivered', 'read'],
  data: Object,
  timestamps: true
}
```

## 🔐 Authentication

### JWT Token Structure
```javascript
{
  id: "user_id",
  iat: timestamp,
  exp: timestamp
}
```

### Authentication Flow
1. User registers/logs in
2. Server generates JWT token
3. Token sent in response and stored in HTTP-only cookie
4. Client includes token in Authorization header: `Bearer <token>`
5. Server validates token on protected routes

### Protected Routes
- All routes under `/api/users/*`
- All routes under `/api/bookings/*`
- All routes under `/api/notifications/*`
- Worker-specific routes under `/api/workers/*`
- Tool creation/modification routes

## 📁 File Upload

### Supported File Types
- **Images**: JPEG, JPG, PNG, GIF
- **Documents**: PDF, DOC, DOCX
- **Maximum Size**: 5MB per file

### Upload Endpoints
- `POST /api/users/upload-avatar` - Profile pictures
- File uploads handled by Multer middleware
- Files stored in `/uploads` directory
- Automatic file cleanup on user deletion

## 🔄 Real-time Communication

### Socket.IO Events
```javascript
// Client to Server
socket.emit('join', userId);
socket.emit('booking-update', data);
socket.emit('new-message', data);

// Server to Client
socket.on('booking-notification', data);
socket.on('message-received', data);
```

### Real-time Features
- Live booking status updates
- Instant messaging between users
- Real-time notifications
- Worker availability updates

## ⚠️ Error Handling

### Error Response Format
```javascript
{
  success: false,
  error: "Error message",
  stack: "Error stack trace" // Development only
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## 🔒 Security

### Security Measures
1. **Helmet.js** - Security headers
2. **CORS** - Cross-origin resource sharing
3. **Rate Limiting** - Prevent abuse
4. **Input Validation** - Sanitize user input
5. **Password Hashing** - bcrypt with salt
6. **JWT Tokens** - Secure authentication
7. **File Upload Security** - Type and size validation

### Rate Limiting
- **Window**: 15 minutes
- **Max Requests**: 100 per IP
- **Applies to**: All `/api/*` routes

## 🚀 Deployment

### Environment Variables
Ensure all environment variables are set in production:
```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-production-secret
# ... other variables
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secret
- [ ] Configure MongoDB Atlas
- [ ] Set up SSL certificates
- [ ] Configure reverse proxy (Nginx)
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy

### Deployment Platforms
- **Railway** - Simple deployment
- **Heroku** - Easy scaling
- **AWS EC2** - Full control
- **DigitalOcean** - Cost-effective
- **Google Cloud** - Enterprise features

## 📝 API Usage Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "+1234567890",
    "userType": "customer"
  }'
```

### Login User
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Get Workers
```bash
curl -X GET "http://localhost:5000/api/workers?service=electrician&minRating=4"
```

### Create Booking
```bash
curl -X POST http://localhost:5000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "worker": "worker_id",
    "serviceType": "electrician",
    "bookingDate": "2024-01-15",
    "timeSlot": {
      "startTime": "09:00",
      "endTime": "17:00"
    },
    "description": "Electrical repair work",
    "location": {
      "address": "123 Main St, City, State"
    },
    "pricing": {
      "baseRate": 500
    }
  }'
```

## 🧪 Testing

### Manual Testing
Use Postman or curl to test API endpoints:
1. Import API collection
2. Set environment variables
3. Test authentication flow
4. Test CRUD operations
5. Test real-time features

### Health Check
```bash
curl http://localhost:5000/health
```

Expected response:
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 📞 Support

For technical support or questions:
- Email: dev@dailywageconnect.com
- Documentation: [API Docs](https://api.dailywageconnect.com/docs)
- GitHub Issues: [Create Issue](https://github.com/dailywageconnect/backend/issues)

---

**Made with ❤️ for the daily-wage worker community**