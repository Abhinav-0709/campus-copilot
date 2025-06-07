import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, BookText, Users, Calendar, Map, MessageSquare, School, Award, CheckCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="bg-primary-600 text-white p-1.5 rounded">
                  <BookOpen size={20} />
                </div>
                <span className="ml-2 text-lg font-semibold">Campus Copilot</span>
              </div>
            </div>
            <div className="flex items-center">
              <Link to="/login" className="btn-primary">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative bg-primary-700 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 py-8 bg-primary-700 sm:py-16 md:py-20 lg:max-w-2xl lg:w-full lg:py-28 xl:py-32">
            <div className="px-4 sm:px-6 lg:px-8">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">Streamline your</span>
                <span className="block text-accent-400">campus experience</span>
              </h1>
              <p className="mt-3 text-base text-primary-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                A comprehensive ERP system designed specifically for educational institutions. Enhance communication, streamline administrative tasks, and improve the overall campus experience.
              </p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-start">
                <div className="rounded-md shadow">
                  <Link to="/login" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-accent-500 hover:bg-accent-600 md:py-4 md:text-lg md:px-10">
                    Get started
                  </Link>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-neutral-50 md:py-4 md:text-lg md:px-10">
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="University campus"
          />
        </div>
      </div>

      {/* Features */}
      <div className="py-12 bg-white" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-neutral-900 sm:text-4xl">
              Key Features
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-500 mx-auto">
              Everything you need to manage your educational institution effectively
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-primary-600 rounded-md shadow-lg">
                        <BookText className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Faculty Portal</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Manage attendance, create assignments, post notices, and handle leave requests all in one place.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-accent-500 rounded-md shadow-lg">
                        <School className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Student Portal</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Access attendance records, view assignments, check academic performance, and apply for leave easily.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-success-500 rounded-md shadow-lg">
                        <Users className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Community Area</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Share posts, interact with campus events, and build a stronger educational community.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-warning-500 rounded-md shadow-lg">
                        <Calendar className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Attendance Management</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Automated attendance tracking, statistics, reports, and alerts for both faculty and students.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-secondary-600 rounded-md shadow-lg">
                        <Map className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">Campus Navigator</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Interactive campus map, locate facilities, find nearby places, and get directions easily.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="flow-root bg-white rounded-lg shadow-sm px-6 pb-8 border border-neutral-200 hover:shadow-md transition-shadow duration-300">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-error-500 rounded-md shadow-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </span>
                    </div>
                    <h3 className="mt-4 text-lg font-medium text-neutral-900">AI Assistant</h3>
                    <p className="mt-2 text-base text-neutral-600">
                      Get personalized support, answers to common questions, and academic guidance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-700">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to streamline your campus?</span>
            <span className="block text-accent-400">Get started today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/login" className="btn bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-400">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8 md:flex md:items-center md:justify-between">
            <div className="flex justify-center md:justify-start">
              <div className="flex items-center">
                <div className="bg-primary-600 text-white p-1.5 rounded">
                  <BookOpen size={20} />
                </div>
                <span className="ml-2 text-lg font-semibold">Campus Copilot</span>
              </div>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center text-base text-neutral-500">&copy; 2025 Campus Copilot. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;