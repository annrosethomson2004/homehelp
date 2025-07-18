export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  userType: 'customer' | 'worker';
  profilePicture?: string;
  createdAt: Date;
}

export interface Worker extends User {
  userType: 'worker';
  services: string[];
  experience: number;
  rating: number;
  totalJobs: number;
  availability: Availability[];
  hourlyRate: number;
  description: string;
  verified: boolean;
  tools: Tool[];
}

export interface Customer extends User {
  userType: 'customer';
  savedWorkers: string[];
  preferences: {
    preferredServices: string[];
    maxDistance: number;
    priceRange: {
      min: number;
      max: number;
    };
  };
}

export interface Availability {
  id: string;
  workerId: string;
  date: Date;
  timeSlots: TimeSlot[];
  isAvailable: boolean;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface Booking {
  id: string;
  customerId: string;
  workerId: string;
  serviceType: string;
  date: Date;
  timeSlot: TimeSlot;
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  description: string;
  address: string;
  estimatedDuration: number;
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
  feedback?: Feedback;
  toolsRequested?: string[];
}

export interface Feedback {
  id: string;
  bookingId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  dailyRate: number;
  ownerId: string;
  ownerType: 'worker' | 'vendor';
  availability: Date[];
  condition: 'excellent' | 'good' | 'fair';
  images: string[];
  specifications?: Record<string, string>;
}

export interface ToolRental {
  id: string;
  toolId: string;
  renterId: string;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  dailyRate: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'returned' | 'cancelled';
  deposit: number;
  returnCondition?: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'booking' | 'payment' | 'reminder' | 'general';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: Record<string, any>;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  averageRate: number;
  popularityScore: number;
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'electrician',
    name: 'Electrician',
    description: 'Electrical repairs, installations, and maintenance',
    icon: '⚡',
    averageRate: 500,
    popularityScore: 85
  },
  {
    id: 'plumber',
    name: 'Plumber',
    description: 'Plumbing repairs, installations, and maintenance',
    icon: '🔧',
    averageRate: 450,
    popularityScore: 90
  },
  {
    id: 'cleaner',
    name: 'House Cleaner',
    description: 'House cleaning and maintenance services',
    icon: '🧹',
    averageRate: 300,
    popularityScore: 95
  },
  {
    id: 'gardener',
    name: 'Gardener',
    description: 'Garden maintenance and landscaping',
    icon: '🌱',
    averageRate: 350,
    popularityScore: 70
  },
  {
    id: 'painter',
    name: 'Painter',
    description: 'Interior and exterior painting services',
    icon: '🎨',
    averageRate: 400,
    popularityScore: 75
  },
  {
    id: 'carpenter',
    name: 'Carpenter',
    description: 'Furniture repair and woodworking',
    icon: '🔨',
    averageRate: 480,
    popularityScore: 80
  }
];

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  auth: AuthState;
  workers: Worker[];
  bookings: Booking[];
  tools: Tool[];
  notifications: Notification[];
  loading: boolean;
  error: string | null;
}