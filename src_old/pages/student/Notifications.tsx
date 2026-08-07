import React from 'react';
import { Bell } from 'lucide-react';

const StudentNotifications = () => {
  return (
    <div className="p-6">
      <div className="mb-6 flex items-center gap-3">
        <Bell className="h-6 w-6 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
      </div>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-full">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Assignment Due Reminder</h3>
              <p className="text-gray-600 mt-1">Your Mathematics assignment is due tomorrow at 11:59 PM</p>
              <span className="text-sm text-gray-500 mt-2 block">2 hours ago</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-green-100 rounded-full">
              <Bell className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Grade Posted</h3>
              <p className="text-gray-600 mt-1">Your Physics quiz grade has been posted</p>
              <span className="text-sm text-gray-500 mt-2 block">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;