import React from 'react';
import { Bell, Check, Clock, Filter, X, AlertTriangle, Info, Settings, Search } from 'lucide-react';

type NotificationType = 'alert' | 'system' | 'warning' | 'info';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  read: boolean;
  priority: 'high' | 'medium' | 'low';
  source?: string;
}

const notifications: Notification[] = [
  {
    id: 1,
    title: 'Motion Detected',
    message: 'Motion detected in Parking Lot camera',
    time: '2 minutes ago',
    type: 'alert',
    read: false,
    priority: 'high',
    source: 'Parking Lot'
  },
  {
    id: 2,
    title: 'System Update',
    message: 'New security update available',
    time: '1 hour ago',
    type: 'system',
    read: false,
    priority: 'medium',
    source: 'System'
  },
  {
    id: 3,
    title: 'Storage Warning',
    message: 'Storage capacity reaching 80%',
    time: '3 hours ago',
    type: 'warning',
    read: true,
    priority: 'low',
    source: 'Storage'
  },
];

const notificationTypes = ['All Types', 'Alert', 'System', 'Warning', 'Info'];
const priorityLevels = ['All Priorities', 'High', 'Medium', 'Low'];
const readStatus = ['All Status', 'Read', 'Unread'];

export function NotificationCenter() {
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    type: 'All Types',
    priority: 'All Priorities',
    status: 'All Status',
    search: '',
    dateRange: 'all',
  });

  const filteredNotifications = notifications.filter(notification => {
    const matchesType = 
      filters.type === 'All Types' || 
      notification.type === filters.type.toLowerCase();
    
    const matchesPriority = 
      filters.priority === 'All Priorities' || 
      notification.priority === filters.priority.toLowerCase();
    
    const matchesStatus = 
      filters.status === 'All Status' || 
      (filters.status === 'Read' ? notification.read : !notification.read);
    
    const matchesSearch = 
      filters.search === '' || 
      notification.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      notification.message.toLowerCase().includes(filters.search.toLowerCase()) ||
      notification.source?.toLowerCase().includes(filters.search.toLowerCase());

    return matchesType && matchesPriority && matchesStatus && matchesSearch;
  });

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'alert':
        return <Bell className="w-5 h-5 text-red-500" />;
      case 'system':
        return <Settings className="w-5 h-5 text-blue-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'info':
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleMarkAllRead = () => {
    // Implementation for marking all as read
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="w-7 h-7" />
          Notification Center
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              <Filter className="w-5 h-5" />
              Filter
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg p-4 z-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold">Filters</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={filters.search}
                        onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        placeholder="Search notifications..."
                        className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={filters.type}
                      onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {notificationTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      value={filters.priority}
                      onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {priorityLevels.map(priority => (
                        <option key={priority} value={priority}>{priority}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {readStatus.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Check className="w-5 h-5" />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow ${
              !notification.read ? 'border-l-4 border-blue-500' : ''
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className={`p-2 rounded-lg
                  ${notification.type === 'alert' ? 'bg-red-100' : ''}
                  ${notification.type === 'system' ? 'bg-blue-100' : ''}
                  ${notification.type === 'warning' ? 'bg-yellow-100' : ''}
                  ${notification.type === 'info' ? 'bg-gray-100' : ''}
                `}>
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {notification.title}
                  </h3>
                  <p className="text-gray-600">{notification.message}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>{notification.time}</span>
                    </div>
                    {notification.source && (
                      <span className="text-sm text-gray-500">
                        Source: {notification.source}
                      </span>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium
                      ${notification.priority === 'high' ? 'bg-red-100 text-red-800' : ''}
                      ${notification.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${notification.priority === 'low' ? 'bg-green-100 text-green-800' : ''}
                    `}>
                      {notification.priority.toUpperCase()}
                    </span>
                  </div>
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