import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Worker, SERVICE_CATEGORIES } from '../types';
import {
  MagnifyingGlassIcon,
  StarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  FunnelIcon,
  UserIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

// Mock worker data
const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91 9876543210',
    address: 'Sector 15, Noida',
    userType: 'worker',
    services: ['electrician'],
    experience: 5,
    rating: 4.8,
    totalJobs: 150,
    availability: [],
    hourlyRate: 500,
    description: 'Experienced electrician with 5 years of experience in residential and commercial electrical work.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
  {
    id: '2',
    name: 'Priya Sharma',
    email: 'priya@example.com',
    phone: '+91 9876543211',
    address: 'Koramangala, Bangalore',
    userType: 'worker',
    services: ['cleaner'],
    experience: 3,
    rating: 4.9,
    totalJobs: 200,
    availability: [],
    hourlyRate: 300,
    description: 'Professional house cleaner with attention to detail and eco-friendly cleaning methods.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
  {
    id: '3',
    name: 'Amit Singh',
    email: 'amit@example.com',
    phone: '+91 9876543212',
    address: 'Bandra, Mumbai',
    userType: 'worker',
    services: ['plumber'],
    experience: 7,
    rating: 4.7,
    totalJobs: 180,
    availability: [],
    hourlyRate: 450,
    description: 'Expert plumber specializing in pipe repairs, installations, and bathroom fittings.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
  {
    id: '4',
    name: 'Sunita Devi',
    email: 'sunita@example.com',
    phone: '+91 9876543213',
    address: 'Lajpat Nagar, Delhi',
    userType: 'worker',
    services: ['gardener'],
    experience: 4,
    rating: 4.6,
    totalJobs: 120,
    availability: [],
    hourlyRate: 350,
    description: 'Passionate gardener with expertise in plant care, landscaping, and organic gardening.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
  {
    id: '5',
    name: 'Vikram Patel',
    email: 'vikram@example.com',
    phone: '+91 9876543214',
    address: 'Satellite, Ahmedabad',
    userType: 'worker',
    services: ['painter'],
    experience: 6,
    rating: 4.5,
    totalJobs: 140,
    availability: [],
    hourlyRate: 400,
    description: 'Professional painter with experience in interior and exterior painting, wall texturing.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
  {
    id: '6',
    name: 'Ravi Carpenter',
    email: 'ravi@example.com',
    phone: '+91 9876543215',
    address: 'Jubilee Hills, Hyderabad',
    userType: 'worker',
    services: ['carpenter'],
    experience: 8,
    rating: 4.9,
    totalJobs: 160,
    availability: [],
    hourlyRate: 480,
    description: 'Master carpenter specializing in furniture making, repairs, and custom woodwork.',
    verified: true,
    tools: [],
    createdAt: new Date(),
  },
];

const Services: React.FC = () => {
  const { state } = useApp();
  const [searchParams] = useSearchParams();
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [minRating, setMinRating] = useState(0);

  useEffect(() => {
    let filtered = workers;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        worker.services.some(service => service.toLowerCase().includes(searchTerm.toLowerCase())) ||
        worker.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(worker =>
        worker.services.includes(selectedCategory)
      );
    }

    // Filter by price range
    filtered = filtered.filter(worker =>
      worker.hourlyRate >= priceRange.min && worker.hourlyRate <= priceRange.max
    );

    // Filter by rating
    filtered = filtered.filter(worker => worker.rating >= minRating);

    // Sort workers
    switch (sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => a.hourlyRate - b.hourlyRate);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.hourlyRate - a.hourlyRate);
        break;
      case 'experience':
        filtered.sort((a, b) => b.experience - a.experience);
        break;
      case 'jobs':
        filtered.sort((a, b) => b.totalJobs - a.totalJobs);
        break;
      default:
        break;
    }

    setFilteredWorkers(filtered);
  }, [workers, searchTerm, selectedCategory, sortBy, priceRange, minRating]);

  const handleBookWorker = (worker: Worker) => {
    // In a real app, this would navigate to a booking page
    alert(`Booking ${worker.name} for ${worker.services.join(', ')} service. This would open a booking modal in a real app.`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">{rating}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Find Workers</h1>
              <p className="text-gray-600">
                {filteredWorkers.length} workers available
                {selectedCategory && ` for ${SERVICE_CATEGORIES.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FunnelIcon className="h-4 w-4" />
                <span>Filters</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">All Categories</option>
                  {SERVICE_CATEGORIES.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Range (₹/day)
                </label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <span>-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value={0}>Any Rating</option>
                  <option value={4}>4+ Stars</option>
                  <option value={4.5}>4.5+ Stars</option>
                  <option value={4.8}>4.8+ Stars</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="rating">Highest Rated</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="experience">Most Experienced</option>
                  <option value="jobs">Most Jobs Completed</option>
                </select>
              </div>
            </div>
          </div>

          {/* Workers Grid */}
          <div className="lg:w-3/4">
            {filteredWorkers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No workers found matching your criteria</div>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredWorkers.map((worker) => (
                  <div key={worker.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            {worker.name}
                            {worker.verified && (
                              <ShieldCheckIcon className="h-4 w-4 text-green-500 ml-1" />
                            )}
                          </h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <MapPinIcon className="h-4 w-4 mr-1" />
                            {worker.address}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                          ₹{worker.hourlyRate}/day
                        </div>
                        {renderStars(worker.rating)}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {worker.services.map(service => {
                          const category = SERVICE_CATEGORIES.find(c => c.id === service);
                          return (
                            <span
                              key={service}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                            >
                              {category?.icon} {category?.name}
                            </span>
                          );
                        })}
                      </div>
                      <p className="text-gray-600 text-sm">{worker.description}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div>{worker.experience} years experience</div>
                      <div>{worker.totalJobs} jobs completed</div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleBookWorker(worker)}
                        className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        Book Now
                      </button>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;