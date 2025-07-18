import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Notification } from '../types';
import {
  BellIcon,
  CalendarDaysIcon,
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

// Mock notification data
const mockNotifications: Notification[] = [
  {
    id: '1',
    userId: '1',
    type: 'booking',
    title: 'Booking Confirmed',
    message: 'Your electrician service booking for January 20th has been confirmed. Rajesh Kumar will arrive at 9:00 AM.',
    read: false,
    createdAt: new Date('2024-01-18T10:30:00'),
    data: { bookingId: '1', workerId: '1' },
  },
  {
    id: '2',
    userId: '1',
    type: 'reminder',
    title: 'Service Reminder',
    message: 'Your cleaning service is scheduled for tomorrow at 10:00 AM. Please ensure someone is available at the location.',
    read: false,
    createdAt: new Date('2024-01-21T09:00:00'),
    data: { bookingId: '2', workerId: '2' },
  },
  {
    id: '3',
    userId: '1',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of ₹1,800 has been received for your plumbing service. Thank you for using DailyWageConnect!',
    read: true,
    createdAt: new Date('2024-01-15T16:45:00'),
    data: { bookingId: '3', amount: 1800 },
  },
  {
    id: '4',
    userId: '1',
    type: 'general',
    title: 'New Feature: Tool Rental',
    message: 'You can now rent tools directly from workers and vendors. Check out our new Tool Rental section!',
    read: true,
    createdAt: new Date('2024-01-14T12:00:00'),
    data: {},
  },
  {
    id: '5',
    userId: '1',
    type: 'booking',
    title: 'Worker Cancelled',
    message: 'Unfortunately, your gardening service for January 18th has been cancelled by the worker. We are finding you an alternative.',
    read: false,
    createdAt: new Date('2024-01-17T14:20:00'),
    data: { bookingId: '5', workerId: '4' },
  },
  {
    id: '6',
    userId: '1',
    type: 'reminder',
    title: 'Rate Your Experience',
    message: 'How was your experience with Amit Singh? Please rate and review the plumbing service you received.',
    read: true,
    createdAt: new Date('2024-01-16T18:00:00'),
    data: { bookingId: '3', workerId: '3' },
  },
];

const Notifications: React.FC = () => {
  const { state, markNotificationAsRead } = useApp();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unread' | 'booking' | 'payment' | 'reminder' | 'general'>('all');

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return !notification.read;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <CalendarDaysIcon className="h-6 w-6 text-blue-500" />;
      case 'payment':
        return <CurrencyRupeeIcon className="h-6 w-6 text-green-500" />;
      case 'reminder':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      case 'general':
        return <BellIcon className="h-6 w-6 text-purple-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'booking':
        return 'bg-blue-50 border-blue-200';
      case 'payment':
        return 'bg-green-50 border-green-200';
      case 'reminder':
        return 'bg-yellow-50 border-yellow-200';
      case 'general':
        return 'bg-purple-50 border-purple-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    setNotifications(notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    ));
    markNotificationAsRead(notificationId);
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
    notifications.forEach(n => {
      if (!n.read) {
        markNotificationAsRead(n.id);
      }
    });
  };

  const handleDeleteNotification = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'booking' && notification.data?.bookingId) {
      // Navigate to booking details
      console.log('Navigate to booking:', notification.data.bookingId);
    } else if (notification.type === 'payment' && notification.data?.bookingId) {
      // Navigate to payment details
      console.log('Navigate to payment:', notification.data.bookingId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
              <p className="text-gray-600">
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All' },
                { key: 'unread', label: 'Unread' },
                { key: 'booking', label: 'Bookings' },
                { key: 'payment', label: 'Payments' },
                { key: 'reminder', label: 'Reminders' },
                { key: 'general', label: 'General' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedFilter(tab.key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    selectedFilter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.key === 'unread' && unreadCount > 0 && (
                    <span className="ml-2 bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                      {unreadCount}
                    </span>
                  )}
                  {tab.key !== 'unread' && (
                    <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.key === 'all' 
                        ? notifications.length 
                        : notifications.filter(n => n.type === tab.key).length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <BellIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500">
              {selectedFilter === 'all' 
                ? "You don't have any notifications yet." 
                : `No ${selectedFilter} notifications found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`relative bg-white rounded-lg shadow-sm border p-6 cursor-pointer transition-all hover:shadow-md ${
                  !notification.read 
                    ? `${getNotificationColor(notification.type)} border-l-4` 
                    : 'border-gray-200'
                }`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        !notification.read ? 'text-gray-700' : 'text-gray-500'
                      }`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(notification.createdAt, 'MMM d, yyyy \'at\' h:mm a')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="text-blue-600 hover:text-blue-700 text-xs font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteNotification(notification.id);
                      }}
                      className="text-red-600 hover:text-red-700 p-1"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Action buttons based on notification type */}
                {notification.type === 'booking' && notification.data?.bookingId && (
                  <div className="mt-4 flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Booking
                    </button>
                    {notification.title.includes('Confirmed') && (
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Contact Worker
                      </button>
                    )}
                  </div>
                )}

                {notification.type === 'reminder' && notification.data?.bookingId && (
                  <div className="mt-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                )}

                {notification.type === 'payment' && notification.data?.amount && (
                  <div className="mt-4">
                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      View Receipt
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;