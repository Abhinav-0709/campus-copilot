'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon } from 'lucide-react';

interface Post {
  id: string;
  author: string;
  avatar: string;
  role: string;
  time: string;
  content: string;
  likes: number;
  comments: number;
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([
    {
      id: '1',
      author: 'Coding Club Techville',
      avatar: '💻',
      role: 'Official Club',
      time: '2 hours ago',
      content: '🚀 Registration for Hackathon 2026 is officially OPEN! $5,000 in prizes, mentor office hours, and free pizza. Link in bio to register your team!',
      likes: 34,
      comments: 8,
    },
    {
      id: '2',
      author: 'Dr. Vidit Vats',
      avatar: '👨‍🏫',
      role: 'Faculty',
      time: '5 hours ago',
      content: 'Reminder for 4th Sem CS students: Extra tutorial session on Fourier Series tomorrow at 4 PM in Room C-101.',
      likes: 19,
      comments: 3,
    },
  ]);

  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: 'Ayush Kumar Pandey',
      avatar: 'AK',
      role: 'Student',
      time: 'Just now',
      content: newPostContent,
      likes: 0,
      comments: 0,
    };

    setPosts([newPost, ...posts]);
    setNewPostContent('');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Campus Community Feed</h1>
        <p className="text-sm text-gray-500">Connect with peers, clubs, and campus announcements</p>
      </div>

      {/* Create Post Card */}
      <form onSubmit={handleCreatePost} className="rounded-lg bg-white p-4 shadow border border-gray-200 space-y-3">
        <textarea
          rows={3}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share an update, ask a question, or post an event..."
          className="w-full rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none"
        />
        <div className="flex items-center justify-between pt-1">
          <button type="button" className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-700">
            <ImageIcon className="mr-1 h-4 w-4" /> Add Photo
          </button>
          <button
            type="submit"
            disabled={!newPostContent.trim()}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Post
          </button>
        </div>
      </form>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="rounded-lg bg-white p-6 shadow border border-gray-200 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                {post.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-gray-900">{post.author}</h3>
                  <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-700">
                    {post.role}
                  </span>
                </div>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
            </div>

            <p className="text-sm text-gray-800 leading-relaxed">{post.content}</p>

            <div className="flex items-center space-x-6 border-t border-gray-100 pt-3 text-xs text-gray-500">
              <button className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors">
                <Heart className="h-4 w-4" />
                <span>{post.likes} Likes</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-blue-600 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments} Comments</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
