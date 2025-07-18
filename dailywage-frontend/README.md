# DailyWageConnect - Frontend

A modern React TypeScript application for connecting households with local daily-wage workers like electricians, plumbers, cleaners, and gardeners.

## 🚀 Features

### User Features
- **User Authentication**: Separate registration and login flows for customers and workers
- **Service Browsing**: Search and filter workers by category, location, price, and ratings
- **Booking Management**: Schedule services with real-time availability
- **Tool Rental**: Browse and rent tools from workers and vendors
- **Notifications**: Real-time updates on bookings, payments, and reminders
- **Responsive Design**: Mobile-first approach with modern UI/UX

### Worker Features
- **Profile Management**: Create and update worker profiles with services offered
- **Availability Management**: Set daily/weekly availability calendars
- **Job Management**: Accept/reject booking requests
- **Tool Listing**: List tools for rental with pricing and availability
- **Earnings Tracking**: View job history and earnings summary

### System Features
- **Real-time Notifications**: Instant updates on booking status
- **Rating & Review System**: Feedback mechanism for service quality
- **Advanced Filtering**: Search by category, price, rating, and location
- **Secure Authentication**: JWT-based authentication with localStorage persistence
- **Modern UI**: Built with Tailwind CSS for responsive design

## 🛠️ Technology Stack

- **Frontend Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS for modern, responsive design
- **Icons**: Heroicons for consistent iconography
- **Routing**: React Router DOM for navigation
- **State Management**: React Context API with useReducer
- **Date Handling**: date-fns for date formatting and manipulation
- **Build Tool**: Create React App with TypeScript template

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dailywage-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🎯 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (irreversible)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   └── Navigation.tsx   # Main navigation component
├── context/            # React Context for state management
│   └── AppContext.tsx  # Global application state
├── pages/              # Main page components
│   ├── Home.tsx        # Landing page
│   ├── Login.tsx       # User authentication
│   ├── Register.tsx    # User registration
│   ├── Services.tsx    # Worker browsing and booking
│   ├── Bookings.tsx    # Booking management
│   ├── Tools.tsx       # Tool rental marketplace
│   └── Notifications.tsx # Notification center
├── types/              # TypeScript type definitions
│   └── index.ts        # All application types
├── App.tsx             # Main app component with routing
├── index.tsx           # Application entry point
└── index.css           # Global styles with Tailwind
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue tones (#0ea5e9, #0284c7, #0369a1)
- **Secondary**: Purple tones (#d946ef, #c026d3, #a21caf)
- **Success**: Green tones for positive actions
- **Warning**: Yellow tones for cautions
- **Error**: Red tones for errors

### Typography
- **Font Family**: System fonts (Inter, Segoe UI, Roboto)
- **Font Sizes**: Responsive scaling from mobile to desktop
- **Font Weights**: Regular (400), Medium (500), Semibold (600), Bold (700)

## 🔐 Authentication

The application uses a mock authentication system with the following demo accounts:

### Customer Account
- **Email**: customer@example.com
- **Password**: password

### Worker Account
- **Email**: worker@example.com
- **Password**: password

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px and above

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify
```bash
npm run build
# Upload dist folder to Netlify
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
REACT_APP_API_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
```

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Custom color palette
- Extended spacing and sizing
- Custom component classes
- Responsive breakpoints

## 🎯 Key Features Implementation

### 1. Service Categories
- Electrician, Plumber, Cleaner, Gardener, Painter, Carpenter
- Each category has custom icons and pricing
- Popularity scoring for recommendations

### 2. Booking System
- Real-time availability checking
- Multiple booking statuses (pending, confirmed, in-progress, completed, cancelled)
- Booking history and management

### 3. Tool Rental
- Category-based tool organization
- Condition tracking (excellent, good, fair)
- Availability calendar
- Specifications and pricing

### 4. Notification System
- Real-time notifications for bookings, payments, reminders
- Categorized notification filtering
- Mark as read/unread functionality
- Action buttons for quick responses

## 🔮 Future Enhancements

### Phase 1 (Next 3 months)
- [ ] Real backend API integration
- [ ] Payment gateway integration
- [ ] Real-time chat system
- [ ] Push notifications
- [ ] Advanced search filters

### Phase 2 (Next 6 months)
- [ ] Geolocation-based matching
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Mobile app development
- [ ] AI-powered recommendations

### Phase 3 (Next 12 months)
- [ ] Voice interface integration
- [ ] IoT device integration
- [ ] Blockchain-based payments
- [ ] Advanced ML algorithms
- [ ] Marketplace expansion

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support, email support@dailywageconnect.com or join our Slack channel.

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icon set
- The open-source community for inspiration and tools

---

**Made with ❤️ for the daily-wage worker community**
