import React, { useState, useRef, useEffect } from 'react';
import { Bell } from 'lucide-react';

// Sample notification data
const SAMPLE_NOTIFICATIONS = [
  {
    id: '1',
    title: 'New Assignment Posted',
    message: 'Database Systems assignment due next week',
    time: '2 hours ago',
    read: false
  },
  {
    id: '2',
    title: 'Attendance Update',
    message: 'Your attendance for this month is 92%',
    time: '1 day ago',
    read: false
  },
  {
    id: '3',
    title: 'Leave Request Approved',
    message: 'Your leave request for May 15 has been approved',
    time: '2 days ago',
    read: true
  }
];

const Notification: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const markAsRead = (id: string) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-neutral-600 rounded-full hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-error-500 text-xs font-medium text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 slide-in-bottom">
          <div className="border-b border-neutral-200 px-4 py-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-primary-600 hover:text-primary-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 border-b border-neutral-100 hover:bg-neutral-50 transition-colors duration-150 ${
                      !notification.read ? 'bg-primary-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium">{notification.title}</span>
                      <span className="text-xs text-neutral-500">{notification.time}</span>
                    </div>
                    <p className="text-sm text-neutral-600 mt-1">{notification.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center text-neutral-500">
                <p>No notifications</p>
              </div>
            )}
          </div>
          <div className="px-4 py-2 border-t border-neutral-200">
            <button className="text-xs text-primary-600 hover:text-primary-800 w-full text-center">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;