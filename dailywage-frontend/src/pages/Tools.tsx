import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Tool } from '../types';
import {
  MagnifyingGlassIcon,
  WrenchScrewdriverIcon,
  StarIcon,
  MapPinIcon,
  CalendarDaysIcon,
  FunnelIcon,
  UserIcon,
  ShieldCheckIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

// Mock tool data
const mockTools: Tool[] = [
  {
    id: '1',
    name: 'Electric Drill Machine',
    description: 'High-power electric drill suitable for concrete and metal drilling',
    category: 'Power Tools',
    dailyRate: 150,
    ownerId: '1',
    ownerType: 'worker',
    availability: [new Date('2024-01-20'), new Date('2024-01-21'), new Date('2024-01-22')],
    condition: 'excellent',
    images: ['drill1.jpg', 'drill2.jpg'],
    specifications: {
      'Power': '650W',
      'Chuck Size': '13mm',
      'Speed': '0-3000 RPM',
      'Weight': '1.5kg'
    },
  },
  {
    id: '2',
    name: 'Angle Grinder',
    description: 'Professional angle grinder for cutting and grinding metal',
    category: 'Power Tools',
    dailyRate: 120,
    ownerId: '2',
    ownerType: 'worker',
    availability: [new Date('2024-01-19'), new Date('2024-01-20'), new Date('2024-01-21')],
    condition: 'good',
    images: ['grinder1.jpg'],
    specifications: {
      'Power': '800W',
      'Disc Size': '115mm',
      'Speed': '11000 RPM',
      'Weight': '2.1kg'
    },
  },
  {
    id: '3',
    name: 'Ladder - 6 feet',
    description: 'Aluminum step ladder, lightweight and sturdy',
    category: 'Ladders',
    dailyRate: 80,
    ownerId: '3',
    ownerType: 'vendor',
    availability: [new Date('2024-01-18'), new Date('2024-01-19'), new Date('2024-01-20')],
    condition: 'good',
    images: ['ladder1.jpg'],
    specifications: {
      'Material': 'Aluminum',
      'Height': '6 feet',
      'Weight Capacity': '150kg',
      'Weight': '8kg'
    },
  },
  {
    id: '4',
    name: 'Pressure Washer',
    description: 'High-pressure water jet cleaner for outdoor cleaning',
    category: 'Cleaning Equipment',
    dailyRate: 200,
    ownerId: '4',
    ownerType: 'vendor',
    availability: [new Date('2024-01-21'), new Date('2024-01-22'), new Date('2024-01-23')],
    condition: 'excellent',
    images: ['washer1.jpg', 'washer2.jpg'],
    specifications: {
      'Pressure': '140 Bar',
      'Flow Rate': '420 L/hr',
      'Power': '1800W',
      'Hose Length': '8m'
    },
  },
  {
    id: '5',
    name: 'Circular Saw',
    description: 'Electric circular saw for wood cutting',
    category: 'Power Tools',
    dailyRate: 180,
    ownerId: '5',
    ownerType: 'worker',
    availability: [new Date('2024-01-20'), new Date('2024-01-21')],
    condition: 'good',
    images: ['saw1.jpg'],
    specifications: {
      'Power': '1200W',
      'Blade Size': '185mm',
      'Cutting Depth': '65mm',
      'Weight': '4.2kg'
    },
  },
  {
    id: '6',
    name: 'Welding Machine',
    description: 'Portable arc welding machine for metal joining',
    category: 'Welding Equipment',
    dailyRate: 300,
    ownerId: '6',
    ownerType: 'worker',
    availability: [new Date('2024-01-19'), new Date('2024-01-20'), new Date('2024-01-21')],
    condition: 'excellent',
    images: ['welder1.jpg'],
    specifications: {
      'Current': '200A',
      'Voltage': '220V',
      'Duty Cycle': '60%',
      'Weight': '15kg'
    },
  },
];

const toolCategories = [
  'All Categories',
  'Power Tools',
  'Hand Tools',
  'Ladders',
  'Cleaning Equipment',
  'Welding Equipment',
  'Measuring Tools',
  'Safety Equipment',
];

const Tools: React.FC = () => {
  const { state } = useApp();
  const [tools, setTools] = useState<Tool[]>(mockTools);
  const [filteredTools, setFilteredTools] = useState<Tool[]>(mockTools);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 500 });
  const [selectedCondition, setSelectedCondition] = useState('all');

  useEffect(() => {
    let filtered = tools;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(tool =>
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(tool => tool.category === selectedCategory);
    }

    // Filter by price range
    filtered = filtered.filter(tool =>
      tool.dailyRate >= priceRange.min && tool.dailyRate <= priceRange.max
    );

    // Filter by condition
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(tool => tool.condition === selectedCondition);
    }

    // Sort tools
    switch (sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_low':
        filtered.sort((a, b) => a.dailyRate - b.dailyRate);
        break;
      case 'price_high':
        filtered.sort((a, b) => b.dailyRate - a.dailyRate);
        break;
      case 'condition':
        filtered.sort((a, b) => {
          const conditionOrder = { 'excellent': 3, 'good': 2, 'fair': 1 };
          return conditionOrder[b.condition] - conditionOrder[a.condition];
        });
        break;
      default:
        break;
    }

    setFilteredTools(filtered);
  }, [tools, searchTerm, selectedCategory, sortBy, priceRange, selectedCondition]);

  const handleRentTool = (tool: Tool) => {
    // In a real app, this would navigate to a rental booking page
    alert(`Renting ${tool.name} for ₹${tool.dailyRate}/day. This would open a rental booking modal in a real app.`);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'excellent':
        return 'bg-green-100 text-green-800';
      case 'good':
        return 'bg-blue-100 text-blue-800';
      case 'fair':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isAvailable = (tool: Tool) => {
    const today = new Date();
    return tool.availability.some(date => date >= today);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tool Rental</h1>
              <p className="text-gray-600">
                {filteredTools.length} tools available for rent
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tools..."
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
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {toolCategories.map(category => (
                    <option key={category} value={category}>
                      {category}
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

              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Condition
                </label>
                <select
                  value={selectedCondition}
                  onChange={(e) => setSelectedCondition(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="all">All Conditions</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
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
                  <option value="name">Name</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="condition">Best Condition</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tools Grid */}
          <div className="lg:w-3/4">
            {filteredTools.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 text-lg">No tools found matching your criteria</div>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.map((tool) => (
                  <div key={tool.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <WrenchScrewdriverIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {tool.name}
                          </h3>
                          <p className="text-sm text-gray-600">{tool.category}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary-600">
                          ₹{tool.dailyRate}/day
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConditionColor(tool.condition)}`}>
                          {tool.condition}
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-gray-600 text-sm mb-3">{tool.description}</p>
                      
                      {/* Specifications */}
                      {tool.specifications && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">Specifications:</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(tool.specifications).slice(0, 4).map(([key, value]) => (
                              <div key={key} className="text-xs text-gray-600">
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <UserIcon className="h-4 w-4 mr-1" />
                        <span className="capitalize">{tool.ownerType}</span>
                      </div>
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-1" />
                        <span>
                          {isAvailable(tool) ? (
                            <span className="text-green-600">Available</span>
                          ) : (
                            <span className="text-red-600">Not Available</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleRentTool(tool)}
                        disabled={!isAvailable(tool)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isAvailable(tool)
                            ? 'bg-primary-600 text-white hover:bg-primary-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {isAvailable(tool) ? 'Rent Now' : 'Not Available'}
                      </button>
                      <button className="text-primary-600 hover:text-primary-700 font-medium text-sm">
                        View Details
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

export default Tools;