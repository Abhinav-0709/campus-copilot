import React, { useState } from 'react';
import { 
  ThumbsUp, 
  MessageSquare, 
  Share2, 
  UserCircle,
  Image,
  Smile,
  Send
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';

interface Post {
  id: number;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
}

const CommunityFeed: React.FC = () => {
  const { user } = useAuth();
  const [postContent, setPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([
    {
      id: 1,
      author: {
        id: 'Ak',
        name: 'Ayush Kumar Pandey',
        avatar: '/images/ayush.jpg',
        role: 'Student, Computer Science and Engineering'
      },
      content: 'College is going to organize Technomax 2025 on 03-06-2025 "A team is not a group of people that work together.A team is a group of people that trust each other" We offer you to show your enthusiasm for tech by participating in tech feast "TECHNO MAX"',
      image: '/images/techno.jpg',
      likes: 156,
      comments: 35,
      shares: 28,
      timestamp: '2025-05-12T18:45:00',
      liked: true
    },
    {
      id: 2,
      author: {
        id: 'VKV',
        name: 'Dr. Vidit Vats',
        avatar: '/images/sir.jpg',
        role: 'Assistant Professor,Applied Science And Humanities '
      },
      content: 'Check your assignment on portal for details. Looking forward to seeing your creative solutions! Keep Studying',
      likes: 124,
      comments: 37,
      shares: 22,
      timestamp: '2024-05-10T14:30:00',
      liked: false
    },
    
    {
      id: 3,
      author: {
        id: 'BS',
        name: 'Dr.Bhavana Sethi',
        avatar: 'data:image/png;base64,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',
        role: 'Assistant Professor,Applied Science And Humanities '
      },
      content: 'Reminder: Complete your all assign. before CIE-2. Revise your notes and all the best for your examinaations. ',
      likes: 218,
      comments: 53,
      shares: 15,
      timestamp: '2023-05-23T10:15:00',
      liked: false
    },
    {
      id: 4,
      author: {
        id: 'Ak',
        name: 'Ayush Kumar Pandey',
        avatar: '/images/ayush.jpg',
        role: 'student, Computer Science and Engineering'
      },
      content: "Anugoonj 2k25: Be a part of our college's yearly feast. It is the one of the best experience you can have. It will be total of 5 days with multiple inter and intra level competition including other workshops and many exclusive cheif guests. We have Mr. Anand Kuamr for his inspirational speech and story and we also have a great singer and the winner of Indian Idol Mr. Salman Ali for his preformance at the celebrity night.",
      image: '/images/anu.jpg',
      likes: 156,
      comments: 35,
      shares: 28,
      timestamp: '2024-05-09T18:45:00',
      liked: true
    },
  ]);

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    const newPost: Post = {
      id: Date.now(),
      author: {
        id: user?.id || '',
        name: user?.name || '',
        avatar: user?.avatar,
        role: user?.role || 'student'
      },
      content: postContent,
      likes: 0,
      comments: 0,
      shares: 0,
      timestamp: new Date().toISOString(),
      liked: false
    };

    setPosts([newPost, ...posts]);
    setPostContent('');
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        return {
          ...post,
          liked: !post.liked,
          likes: post.liked ? post.likes - 1 : post.likes + 1
        };
      }
      return post;
    }));
  };

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campus Feed</h1>
        <p className="text-gray-600">Connect with your campus community</p>
      </div>

      {/* Create post */}
      <div className="mb-6 overflow-hidden rounded-lg bg-white shadow">
        <div className="p-4">
          <form onSubmit={handlePostSubmit}>
            <div className="flex">
              {user?.avatar ? (
                <img
                  className="h-10 w-10 rounded-full"
                  src={user.avatar}
                  alt={user.name}
                />
              ) : (
                <UserCircle className="h-10 w-10 text-gray-400" />
              )}
              <div className="ml-3 flex-1">
                <textarea
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent-500 focus:ring-accent-500 sm:text-sm"
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                ></textarea>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Image className="mr-2 h-5 w-5 text-gray-500" />
                  Photo
                </button>
                <button
                  type="button"
                  className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  <Smile className="mr-2 h-5 w-5 text-gray-500" />
                  Feeling
                </button>
              </div>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-accent-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-accent-700 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2"
                disabled={!postContent.trim()}
              >
                <Send className="mr-2 h-4 w-4" />
                Post
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="animate-slide-in overflow-hidden rounded-lg bg-white shadow">
            <div className="p-4">
              <div className="flex">
                {post.author.avatar ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={post.author.avatar}
                    alt={post.author.name}
                  />
                ) : (
                  <UserCircle className="h-10 w-10 text-gray-400" />
                )}
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    {post.author.name}
                    <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500 capitalize">
                      {post.author.role}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(post.timestamp), 'MMM d, yyyy • h:mm a')}
                  </p>
                </div>
              </div>
              <div className="mt-3">
                <p className="text-gray-900">{post.content}</p>
                {post.image && (
                  <div className="mt-3">
                    <img
                      src={post.image}
                      alt="Post attachment"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex space-x-4">
                  <button
                    type="button"
                    className={`flex items-center space-x-1 text-sm ${
                      post.liked ? 'text-accent-600' : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => handleLike(post.id)}
                  >
                    <ThumbsUp className="h-4 w-4" />
                    <span>{post.likes}</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <MessageSquare className="h-4 w-4" />
                    <span>{post.comments}</span>
                  </button>
                  <button
                    type="button"
                    className="flex items-center space-x-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>{post.shares}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommunityFeed;