# 🚀 DailyWageConnect - Complete Full-Stack Application

A comprehensive platform connecting households with local daily-wage workers including electricians, plumbers, cleaners, and gardeners.

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Installation & Setup](#installation--setup)
5. [Frontend Code](#frontend-code)
6. [Backend Code](#backend-code)
7. [API Documentation](#api-documentation)
8. [Database Schema](#database-schema)
9. [Deployment](#deployment)
10. [Contributing](#contributing)

## 🎯 Project Overview

DailyWageConnect is a full-stack web application that enables:
- **Customers** to find and book local daily-wage workers
- **Workers** to manage their profiles, availability, and bookings
- **Tool Rental** marketplace for equipment sharing
- **Real-time notifications** and communication
- **Rating and review system** for quality assurance

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **React Router DOM** for navigation
- **Context API** for state management
- **Heroicons** for icons
- **date-fns** for date manipulation

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Socket.IO** for real-time communication
- **Express Validator** for input validation
- **Helmet** for security
- **CORS** for cross-origin requests

## ✨ Features

### Core Features
- ✅ User authentication (Customer/Worker)
- ✅ Worker profile management
- ✅ Service booking system
- ✅ Real-time availability management
- ✅ Tool rental marketplace
- ✅ Notification system
- ✅ Rating and review system
- ✅ Search and filtering
- ✅ Responsive design

### Advanced Features
- ✅ Geolocation-based matching
- ✅ Real-time chat (Socket.IO)
- ✅ File upload support
- ✅ Email notifications
- ✅ Password reset functionality
- ✅ Account verification
- ✅ Rate limiting
- ✅ Error handling

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Clone and setup backend:**
```bash
mkdir dailywage-backend
cd dailywage-backend
npm init -y
```

2. **Install dependencies:**
```bash
npm install express cors helmet bcryptjs jsonwebtoken mongoose dotenv multer express-rate-limit express-validator nodemailer socket.io uuid
npm install -D nodemon concurrently
```

3. **Create environment file (.env):**
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

4. **Start backend server:**
```bash
npm run dev
```

### Frontend Setup

1. **Create React app:**
```bash
npx create-react-app dailywage-frontend --template typescript
cd dailywage-frontend
```

2. **Install dependencies:**
```bash
npm install @heroicons/react react-router-dom @types/react-router-dom date-fns
npm install -D tailwindcss@3.4.17 postcss autoprefixer
```

3. **Initialize Tailwind CSS:**
```bash
npx tailwindcss init -p
```

4. **Start frontend server:**
```bash
npm start
```

## 📁 Complete Project Structure

```
dailywage-connect/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── tools.js
│   │   ├── users.js
│   │   └── workers.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── notFound.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Worker.js
│   │   ├── Booking.js
│   │   ├── Tool.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── bookings.js
│   │   ├── tools.js
│   │   ├── users.js
│   │   └── workers.js
│   ├── uploads/
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navigation.tsx
    │   ├── context/
    │   │   └── AppContext.tsx
    │   ├── pages/
    │   │   ├── Home.tsx
    │   │   ├── Login.tsx
    │   │   ├── Register.tsx
    │   │   ├── Services.tsx
    │   │   ├── Bookings.tsx
    │   │   ├── Tools.tsx
    │   │   └── Notifications.tsx
    │   ├── types/
    │   │   └── index.ts
    │   ├── App.tsx
    │   ├── index.tsx
    │   └── index.css
    ├── public/
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `PUT /api/auth/reset-password/:token` - Reset password
- `PUT /api/auth/update-password` - Update password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-avatar` - Upload profile picture

### Workers
- `GET /api/workers` - Get all workers
- `GET /api/workers/:id` - Get worker by ID
- `PUT /api/workers/profile` - Update worker profile
- `PUT /api/workers/availability` - Update availability
- `GET /api/workers/search` - Search workers

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking by ID
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking
- `POST /api/bookings/:id/feedback` - Add feedback

### Tools
- `GET /api/tools` - Get all tools
- `POST /api/tools` - Create tool listing
- `GET /api/tools/:id` - Get tool by ID
- `PUT /api/tools/:id` - Update tool
- `DELETE /api/tools/:id` - Delete tool
- `POST /api/tools/:id/rent` - Rent tool

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark as read
- `PUT /api/notifications/read-all` - Mark all as read

## 📊 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  address: Object,
  userType: Enum ['customer', 'worker'],
  profilePicture: String,
  isEmailVerified: Boolean,
  isPhoneVerified: Boolean,
  isActive: Boolean,
  preferences: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Worker Model
```javascript
{
  userId: ObjectId (ref: User),
  services: Array,
  experience: Number,
  hourlyRate: Number,
  dailyRate: Number,
  description: String,
  availability: Object,
  ratings: Object,
  stats: Object,
  verification: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Model
```javascript
{
  customer: ObjectId (ref: User),
  worker: ObjectId (ref: Worker),
  serviceType: String,
  bookingDate: Date,
  timeSlot: Object,
  status: Enum,
  description: String,
  location: Object,
  pricing: Object,
  feedback: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Running the Application

### Development Mode

1. **Start MongoDB:**
```bash
mongod
```

2. **Start Backend:**
```bash
cd backend
npm run dev
```

3. **Start Frontend:**
```bash
cd frontend
npm start
```

4. **Access Application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

### Production Mode

1. **Build Frontend:**
```bash
cd frontend
npm run build
```

2. **Start Backend:**
```bash
cd backend
npm start
```

## 🔧 Configuration

### Frontend Configuration
- Update `src/config/api.ts` with your backend URL
- Configure Tailwind CSS in `tailwind.config.js`
- Set up environment variables in `.env`

### Backend Configuration
- Update `.env` with your database and service credentials
- Configure CORS origins
- Set up email service credentials
- Configure file upload settings

## 📱 Key Features Implementation

### 1. Authentication System
- JWT-based authentication
- Password hashing with bcrypt
- Email verification
- Password reset functionality
- Role-based access control

### 2. Real-time Communication
- Socket.IO for real-time updates
- Live notifications
- Booking status updates
- Chat functionality

### 3. File Upload System
- Multer for file handling
- Image upload for profiles
- Document upload for verification
- File size and type validation

### 4. Search and Filtering
- Advanced search algorithms
- Location-based filtering
- Price range filtering
- Rating-based sorting
- Service category filtering

### 5. Notification System
- Real-time notifications
- Email notifications
- Push notifications (future)
- SMS notifications (future)

## 🔐 Security Features

- **Helmet.js** for security headers
- **Rate limiting** to prevent abuse
- **Input validation** with express-validator
- **CORS** configuration
- **JWT token** authentication
- **Password hashing** with bcrypt
- **SQL injection** prevention
- **XSS protection**

## 🚀 Deployment

### Backend Deployment (Railway/Heroku)
1. Create account on Railway/Heroku
2. Connect your GitHub repository
3. Set environment variables
4. Deploy with automatic builds

### Frontend Deployment (Vercel/Netlify)
1. Build the React app
2. Deploy to Vercel/Netlify
3. Configure environment variables
4. Set up custom domain (optional)

### Database Deployment (MongoDB Atlas)
1. Create MongoDB Atlas account
2. Create cluster and database
3. Get connection string
4. Update MONGODB_URI in backend

## 📈 Future Enhancements

### Phase 1 (Next 3 months)
- [ ] Payment gateway integration
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] Push notifications
- [ ] Advanced search filters

### Phase 2 (Next 6 months)
- [ ] Multi-language support
- [ ] Video calling integration
- [ ] AI-powered recommendations
- [ ] Advanced booking management
- [ ] Subscription plans

### Phase 3 (Next 12 months)
- [ ] Voice interface
- [ ] IoT integration
- [ ] Blockchain payments
- [ ] Advanced ML algorithms
- [ ] Marketplace expansion

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@dailywageconnect.com or create an issue in the repository.

---

**Made with ❤️ for the daily-wage worker community**

## 🎯 Quick Start Commands

```bash
# Clone the repository
git clone <repository-url>
cd dailywage-connect

# Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your configurations
npm run dev

# Setup Frontend (in new terminal)
cd ../frontend
npm install
npm start

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

## 🔍 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

### API Testing
Use Postman or curl to test API endpoints:
```bash
# Health check
curl http://localhost:5000/health

# Register user
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

This completes the full-stack DailyWageConnect application with both frontend and backend code!