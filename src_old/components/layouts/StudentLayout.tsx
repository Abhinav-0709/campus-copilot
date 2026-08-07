import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  BarChart3, 
  Users, 
  ClipboardList, 
  GraduationCap,
  Bell, 
  Calendar, 
  MapPin, 
  MessageSquare,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const StudentLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { name: 'Dashboard', path: '/student', icon: <BarChart3 className="h-5 w-5" /> },
    { name: 'Attendance', path: '/student/attendance', icon: <Users className="h-5 w-5" /> },
    { name: 'Assignments', path: '/student/assignments', icon: <ClipboardList className="h-5 w-5" /> },
    { name: 'Academics', path: '/student/academics', icon: <GraduationCap className="h-5 w-5" /> },
    { name: 'Notifications', path: '/student/notifications', icon: <Bell className="h-5 w-5" /> },
    { name: 'Leave Application', path: '/student/leave', icon: <Calendar className="h-5 w-5" /> },
    { 
      name: 'Community', 
      path: '/student/community', 
      icon: <Users className="h-5 w-5" />,
      subItems: [
        { name: 'Feed', path: '/student/community' },
        { name: 'Events', path: '/student/events' },
      ]
    },
    { name: 'Campus Navigator', path: '/student/campus', icon: <MapPin className="h-5 w-5" /> },
    { name: 'Campus Copilot', path: '/student/copilot', icon: <MessageSquare className="h-5 w-5" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/student' && location.pathname === '/student') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/student';
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-accent-900 transition duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar header */}
          <div className="flex h-16 flex-shrink-0 items-center px-4">
            <BookOpen className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-semibold text-white">Campus Copilot</span>
            <button
              type="button"
              className="ml-auto rounded-md text-gray-300 lg:hidden"
              onClick={closeSidebar}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Sidebar navigation */}
          <div className="flex-1 overflow-y-auto px-2 py-4">
            <nav className="flex-1 space-y-1">
              {navigationItems.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <div className="space-y-1">
                      <button
                        className={`
                          group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium
                          ${isActive(item.path) ? 'bg-accent-800 text-white' : 'text-accent-100 hover:bg-accent-800 hover:text-white'}
                        `}
                      >
                        {item.icon}
                        <span className="ml-3">{item.name}</span>
                        <ChevronDown className="ml-auto h-4 w-4" />
                      </button>
                      <div className="space-y-1 pl-10">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            to={subItem.path}
                            className={`
                              group flex items-center rounded-md px-2 py-2 text-sm font-medium
                              ${isActive(subItem.path) ? 'bg-accent-800 text-white' : 'text-accent-100 hover:bg-accent-800 hover:text-white'}
                            `}
                            onClick={closeSidebar}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.path}
                      className={`
                        group flex items-center rounded-md px-2 py-2 text-sm font-medium
                        ${isActive(item.path) ? 'bg-accent-800 text-white' : 'text-accent-100 hover:bg-accent-800 hover:text-white'}
                      `}
                      onClick={closeSidebar}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Sidebar footer */}
          <div className="flex flex-shrink-0 bg-accent-800 p-4">
            <button
              type="button"
              className="group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-accent-100 hover:bg-accent-700 hover:text-white"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top navbar */}
        <div className="bg-white shadow">
          <div className="flex h-16 items-center justify-between px-4">
            <button
              type="button"
              className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-500 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center">
              <h1 className="text-lg font-semibold text-gray-900">Student Portal</h1>
            </div>

            {/* User profile dropdown */}
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                  id="user-menu-button"
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                >
                  <span className="sr-only">Open user menu</span>
                  {user?.avatar ? (
                    <img
                      className="h-8 w-8 rounded-full"
                      src={user.avatar}
                      alt="User avatar"
                    />
                  ) : (
                    <UserCircle className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="ml-2 hidden md:block">{user?.name}</span>
                  <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
                </button>
              </div>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                >
                  <div className="border-b border-gray-100 px-4 py-2">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="truncate text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </a>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </a>
                  <button
                    type="button"
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;