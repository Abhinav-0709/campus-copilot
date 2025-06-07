import React from 'react';

const FacultyNotices = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Notices</h1>
      
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create and Manage Notices</h2>
              <p className="text-gray-600 mt-1">Post important announcements and updates for students</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              New Notice
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow divide-y">
          {/* Sample Notice */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Mid-Term Examination Schedule</h3>
                <p className="mt-1 text-sm text-gray-500">Posted on: March 15, 2025</p>
                <p className="mt-2 text-gray-600">The mid-term examinations will commence from April 1st, 2025. Please check the detailed schedule attached.</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="p-2 text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          </div>

          {/* Sample Notice */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Techno-max Event</h3>
                <p className="mt-1 text-sm text-gray-500">Posted on: April 10, 2025</p>
                <p className="mt-2 text-gray-600">The techno-max event will commence from may 24th, 2025,all the faculty are requested to to notify the students.</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="p-2 text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          </div>

         
          {/* Sample Notice */}
          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Parents-Teacher  Meeting</h3>
                <p className="mt-1 text-sm text-gray-500">Posted on: April 14, 2025</p>
                <p className="mt-2 text-gray-600">All mentor are requested to contact student's parents for the PT meeting scheduled for April 20th at 2 PM.</p>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 text-blue-600 hover:text-blue-800">
                  Edit
                </button>
                <button className="p-2 text-red-600 hover:text-red-800">
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyNotices;