import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Booking } from '../types';
import {
  CalendarDaysIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  StarIcon,
  XMarkIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Mock booking data
const mockBookings: Booking[] = [
  {
    id: '1',
    customerId: '1',
    workerId: '1',
    serviceType: 'electrician',
    date: new Date('2024-01-20'),
    timeSlot: { startTime: '09:00', endTime: '17:00', isBooked: true },
    status: 'confirmed',
    description: 'Fix electrical wiring in kitchen and install new switches',
    address: '123 Main Street, Apartment 4B, Mumbai',
    estimatedDuration: 8,
    totalAmount: 4000,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    customerId: '1',
    workerId: '2',
    serviceType: 'cleaner',
    date: new Date('2024-01-22'),
    timeSlot: { startTime: '10:00', endTime: '14:00', isBooked: true },
    status: 'pending',
    description: 'Deep cleaning of 2BHK apartment',
    address: '123 Main Street, Apartment 4B, Mumbai',
    estimatedDuration: 4,
    totalAmount: 1200,
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: '3',
    customerId: '1',
    workerId: '3',
    serviceType: 'plumber',
    date: new Date('2024-01-15'),
    timeSlot: { startTime: '11:00', endTime: '15:00', isBooked: true },
    status: 'completed',
    description: 'Fix leaking pipes in bathroom',
    address: '123 Main Street, Apartment 4B, Mumbai',
    estimatedDuration: 4,
    totalAmount: 1800,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    feedback: {
      id: '1',
      bookingId: '3',
      rating: 5,
      comment: 'Excellent work! Very professional and fixed the issue quickly.',
      createdAt: new Date('2024-01-15'),
    },
  },
];

const Bookings: React.FC = () => {
  const { state } = useApp();
  const [bookings] = useState<Booking[]>(mockBookings);
  const [selectedTab, setSelectedTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings.filter(booking => {
    if (selectedTab === 'all') return true;
    return booking.status === selectedTab;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <ClockIcon className="h-4 w-4" />;
      case 'confirmed':
        return <CheckIcon className="h-4 w-4" />;
      case 'completed':
        return <CheckIcon className="h-4 w-4" />;
      case 'cancelled':
        return <XMarkIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    // In a real app, this would make an API call
    alert(`Booking ${bookingId} cancelled. This would update the booking status in a real app.`);
  };

  const handleRescheduleBooking = (bookingId: string) => {
    // In a real app, this would open a reschedule modal
    alert(`Reschedule booking ${bookingId}. This would open a reschedule modal in a real app.`);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            className={`h-4 w-4 ${
              i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
              <p className="text-gray-600">Manage your service bookings</p>
            </div>
            <div className="text-sm text-gray-500">
              {filteredBookings.length} bookings
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Bookings' },
                { key: 'pending', label: 'Pending' },
                { key: 'confirmed', label: 'Confirmed' },
                { key: 'completed', label: 'Completed' },
                { key: 'cancelled', label: 'Cancelled' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedTab === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.key === 'all' ? bookings.length : bookings.filter(b => b.status === tab.key).length}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <CalendarDaysIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No bookings found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedTab === 'all' 
                ? "You haven't made any bookings yet." 
                : `No ${selectedTab} bookings found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)} Service
                      </h3>
                      <p className="text-sm text-gray-600">Booking #{booking.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₹{booking.totalAmount}</div>
                      <div className="text-sm text-gray-500">{booking.estimatedDuration} hours</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarDaysIcon className="h-4 w-4 mr-2" />
                      {format(booking.date, 'EEEE, MMMM d, yyyy')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {booking.timeSlot.startTime} - {booking.timeSlot.endTime}
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2 mt-0.5" />
                      <span>{booking.address}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">Service Description:</p>
                    <p className="text-sm text-gray-900">{booking.description}</p>
                  </div>
                </div>

                {booking.feedback && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-medium text-green-800">Your Feedback</h4>
                      {renderStars(booking.feedback.rating)}
                    </div>
                    <p className="text-sm text-green-700">{booking.feedback.comment}</p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="text-xs text-gray-500">
                    Booked on {format(booking.createdAt, 'MMM d, yyyy')}
                  </div>
                  <div className="flex items-center space-x-3">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => handleRescheduleBooking(booking.id)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        Reschedule
                      </button>
                    )}
                    <button
                      onClick={() => setSelectedBooking(booking)}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Booking Details
                </h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Service Type</label>
                    <p className="mt-1 text-sm text-gray-900 capitalize">{selectedBooking.serviceType}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedBooking.status)}`}>
                      {getStatusIcon(selectedBooking.status)}
                      <span className="ml-1 capitalize">{selectedBooking.status}</span>
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Date & Time</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {format(selectedBooking.date, 'EEEE, MMMM d, yyyy')} at {selectedBooking.timeSlot.startTime} - {selectedBooking.timeSlot.endTime}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.address}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <p className="mt-1 text-sm text-gray-900">{selectedBooking.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <p className="mt-1 text-sm text-gray-900">{selectedBooking.estimatedDuration} hours</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Amount</label>
                    <p className="mt-1 text-sm text-gray-900">₹{selectedBooking.totalAmount}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                {selectedBooking.status === 'completed' && !selectedBooking.feedback && (
                  <button className="px-4 py-2 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700">
                    Leave Feedback
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;