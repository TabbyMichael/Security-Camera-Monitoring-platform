import React from 'react';
import { Bell, Check, Clock, Filter } from 'lucide-react';

const notifications = [
  {
    id: 1,
    title: 'Motion Detected',
    message: 'Motion detected in Parking Lot camera',
    time: '2 minutes ago',
    type: 'alert',
    read: false,
  },
  {
    id: 2,
    title: 'System Update',
    message: 'New security update available',
    time: '1 hour ago',
    type: 'system',
    read: false,
  },
  {
    id: 3,
    title: 'Storage Warning',
    message: 'Storage capacity reaching 80%',
    time: '3 hours ago',
    type: 'warning',
    read: true,
  },
];

export function NotificationCenter() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-7 h-7" />
          Notification Center
        </h1>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
            <Filter className="w-5 h-5" />
            Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <Check className="w-5 h-5" />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
              !notification.read ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-gray-800">
                  {notification.title}
                </h3>
                <p className="text-gray-600">{notification.message}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{notification.time}</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Check className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}