import React, { useState } from 'react';
import {
  User,
  Heart,
  MessageSquare,
  Share,
  Calendar,
  MapPin,
  Clock,
  Image,
  Smile
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Sample posts data
const INITIAL_POSTS = [
  {
    id: 1,
    author: {
      name: 'Dr. Vidit Vats',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=300',
      role: 'Professor, Engineering Mathmatics'
    },
    content: 'Just published a new research paper on advanced machine learning techniques. Check it out in the latest issue of the Journal of Artificial Intelligence.',
    image: 'https://images.pexels.com/photos/177598/pexels-photo-177598.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    liked: false
  },
  {
    id: 2,
    author: {
      name: 'Jane Doe',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=300',
      role: 'Student, Computer Science'
    },
    content: 'Excited to announce that our team won first place in the National Coding Competition! Thanks to everyone who supported us along the way.',
    image: 'https://images.pexels.com/photos/1181360/pexels-photo-1181360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    timestamp: '5 hours ago',
    likes: 42,
    comments: 8,
    liked: false
  },
  {
    id: 3,
    author: {
      name: 'Student Council',
      avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      role: 'Official Club'
    },
    content: 'Remember to vote for your student representatives next week! The polling stations will be open from Monday to Wednesday in the Student Center.',
    image: null,
    timestamp: '1 day ago',
    likes: 15,
    comments: 3,
    liked: false
  }
];

// Sample upcoming events
const UPCOMING_EVENTS = [
  {
    id: 1,
    title: 'Annual Technology Fair',
    date: 'May 15, 2025',
    time: '10:00 AM - 4:00 PM',
    location: 'Main Campus Quad',
    attendees: 156
  },
  {
    id: 2,
    title: 'Guest Lecture: AI Ethics',
    date: 'May 20, 2025',
    time: '2:00 PM - 4:00 PM',
    location: 'Auditorium A',
    attendees: 89
  },
  {
    id: 3,
    title: 'Job Fair 2025',
    date: 'May 25, 2025',
    time: '9:00 AM - 3:00 PM',
    location: 'Student Center',
    attendees: 210
  }
];

const CommunityPage: React.FC = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [newPostContent, setNewPostContent] = useState('');
  const [activeTab, setActiveTab] = useState('feed');

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost = {
      id: Date.now(),
      author: {
        name: user?.name || 'Anonymous',
        avatar: user?.avatar || '',
        role: user?.role === 'faculty' ? 'Faculty Member' : 'Student'
      },
      content: newPostContent,
      image: null,
      timestamp: 'Just now',
      likes: 0,
      comments: 0,
      liked: false
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  const toggleLike = (postId: number) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-bold">Community</h1>
          <p className="mt-2">Connect with the campus community</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex border-b border-neutral-200 mb-6">
          <button
            className={`py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'feed'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            onClick={() => setActiveTab('feed')}
          >
            Campus Feed
          </button>
          <button
            className={`ml-8 py-2 px-4 border-b-2 font-medium text-sm ${activeTab === 'events'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              }`}
            onClick={() => setActiveTab('events')}
          >
            Upcoming Events
          </button>
        </div>

        {activeTab === 'feed' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Create Post */}
              <div className="bg-white rounded-lg shadow-sm p-4 border border-neutral-200">
                <form onSubmit={handlePostSubmit}>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <textarea
                        className="w-full border border-neutral-300 rounded-lg p-3 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="What's on your mind?"
                        rows={3}
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                      ></textarea>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-2">
                          <button type="button" className="p-2 rounded-full hover:bg-neutral-100">
                            <Image size={18} className="text-neutral-600" />
                          </button>
                          <button type="button" className="p-2 rounded-full hover:bg-neutral-100">
                            <Smile size={18} className="text-neutral-600" />
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="btn-primary text-sm"
                          disabled={!newPostContent.trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Posts */}
              {posts.map(post => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden fade-in">
                  <div className="p-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        {post.author.avatar ? (
                          <img
                            src={post.author.avatar}
                            alt={post.author.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700">
                            <User size={18} />
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-medium text-neutral-900">{post.author.name}</h3>
                        <p className="text-xs text-neutral-500">{post.author.role} • {post.timestamp}</p>
                      </div>
                    </div>
                    <p className="mt-3 text-neutral-700">{post.content}</p>
                  </div>

                  {post.image && (
                    <div className="w-full">
                      <img
                        src={post.image}
                        alt="Post attachment"
                        className="w-full h-auto"
                      />
                    </div>
                  )}

                  <div className="px-4 py-3 border-t border-neutral-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button
                          className={`flex items-center space-x-1 ${post.liked ? 'text-error-600' : 'text-neutral-600 hover:text-error-600'}`}
                          onClick={() => toggleLike(post.id)}
                        >
                          <Heart size={18} fill={post.liked ? 'currentColor' : 'none'} />
                          <span className="text-sm">{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600">
                          <MessageSquare size={18} />
                          <span className="text-sm">{post.comments}</span>
                        </button>
                      </div>
                      <button className="flex items-center space-x-1 text-neutral-600 hover:text-primary-600">
                        <Share size={18} />
                        <span className="text-sm hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Events */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-medium text-neutral-900 flex items-center">
                    <Calendar size={18} className="mr-2 text-primary-600" />
                    Upcoming Events
                  </h2>
                  <button className="text-sm text-primary-600 hover:text-primary-800">View all</button>
                </div>
                <div className="space-y-4">
                  {UPCOMING_EVENTS.slice(0, 3).map(event => (
                    <div key={event.id} className="border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium text-neutral-800">{event.title}</h3>
                      <div className="mt-2 text-sm space-y-1">
                        <p className="flex items-center text-neutral-600">
                          <Calendar size={14} className="mr-2" />
                          {event.date}
                        </p>
                        <p className="flex items-center text-neutral-600">
                          <Clock size={14} className="mr-2" />
                          {event.time}
                        </p>
                        <p className="flex items-center text-neutral-600">
                          <MapPin size={14} className="mr-2" />
                          {event.location}
                        </p>
                      </div>
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-neutral-500">{event.attendees} attending</span>
                        <button className="text-xs text-primary-600 hover:text-primary-800">
                          RSVP
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trending Topics */}
              <div className="bg-white rounded-lg shadow-sm border border-neutral-200 p-4">
                <h2 className="font-medium text-neutral-900 mb-4">Trending Topics</h2>
                <div className="space-y-3">
                  <div className="flex items-center text-neutral-600 hover:text-primary-600">
                    <span className="text-sm font-medium">#CampusReforms</span>
                    <span className="ml-auto text-xs text-neutral-500">42 posts</span>
                  </div>
                  <div className="flex items-center text-neutral-600 hover:text-primary-600">
                    <span className="text-sm font-medium">#SpringFestival</span>
                    <span className="ml-auto text-xs text-neutral-500">38 posts</span>
                  </div>
                  <div className="flex items-center text-neutral-600 hover:text-primary-600">
                    <span className="text-sm font-medium">#ResearchSymposium</span>
                    <span className="ml-auto text-xs text-neutral-500">26 posts</span>
                  </div>
                  <div className="flex items-center text-neutral-600 hover:text-primary-600">
                    <span className="text-sm font-medium">#CareerOpportunities</span>
                    <span className="ml-auto text-xs text-neutral-500">21 posts</span>
                  </div>
                  <div className="flex items-center text-neutral-600 hover:text-primary-600">
                    <span className="text-sm font-medium">#CampusLife</span>
                    <span className="ml-auto text-xs text-neutral-500">19 posts</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Events Tab */
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {UPCOMING_EVENTS.concat(UPCOMING_EVENTS).map(event => (
              <div key={event.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow fade-in">
                <div className="relative h-40 bg-primary-700">
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Calendar size={32} className="mx-auto mb-2" />
                      <h3 className="font-bold">{event.date.split(',')[0]}</h3>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-neutral-900">{event.title}</h3>
                  <div className="mt-2 text-sm space-y-1">
                    <p className="flex items-center text-neutral-600">
                      <Clock size={14} className="mr-2" />
                      {event.time}
                    </p>
                    <p className="flex items-center text-neutral-600">
                      <MapPin size={14} className="mr-2" />
                      {event.location}
                    </p>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs text-neutral-500">{event.attendees} attending</span>
                    <button className="btn-primary text-xs py-1.5">
                      RSVP
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;