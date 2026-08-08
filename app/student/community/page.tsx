'use client';

import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Send, Image as ImageIcon, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import EmptyState from '@/components/ui/EmptyState';

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
  const { user } = useAuth();
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
  ]);

  const [newPostContent, setNewPostContent] = useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    const newPost: Post = {
      id: Date.now().toString(),
      author: user?.name || 'Student',
      avatar: user?.name ? user.name.charAt(0).toUpperCase() : 'S',
      role: user?.role ? user.role.toUpperCase() : 'Student',
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
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F5F7FA]">Campus Community Feed</h1>
        <p className="text-sm font-medium text-[#475569] dark:text-[#A3ADB8]">Connect with peers, clubs, and campus announcements</p>
      </div>

      {/* Create Post Card */}
      <form onSubmit={handleCreatePost} className="rounded-2xl bg-white dark:bg-[#14191F] p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] space-y-3">
        <textarea
          rows={3}
          value={newPostContent}
          onChange={(e) => setNewPostContent(e.target.value)}
          placeholder="Share an update, ask a question, or post an event..."
          className="w-full rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] p-3 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
        />
        <div className="flex items-center justify-between pt-1">
          <button type="button" className="inline-flex items-center text-xs font-semibold text-[#475569] dark:text-[#A3ADB8] hover:text-[#111827] cursor-pointer">
            <ImageIcon className="mr-1 h-4 w-4" /> Add Photo
          </button>
          <button
            type="submit"
            disabled={!newPostContent.trim()}
            className="aurora-btn-primary px-4 py-2 text-xs flex items-center disabled:opacity-50 cursor-pointer"
          >
            <Send className="mr-1.5 h-3.5 w-3.5" /> Post
          </button>
        </div>
      </form>

      {/* Feed Posts */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <EmptyState
            title="No Community Posts Yet"
            description="Be the first to share an update, ask a question, or post an event on the campus feed above!"
            icon={MessageSquare}
          />
        ) : (
          posts.map((post) => (
          <div key={post.id} className="rounded-2xl bg-white dark:bg-[#14191F] p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none border border-[#E5EAF2] dark:border-[#27313B] space-y-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#DBEAFE] dark:bg-[#1A2129] font-bold text-[#2563EB] dark:text-[#60A5FA]">
                {post.avatar}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-sm font-bold text-[#111827] dark:text-[#F5F7FA]">{post.author}</h3>
                  <span className="rounded-lg bg-[#DBEAFE] dark:bg-[#1A2129] px-2 py-0.5 text-[10px] font-extrabold text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/20 dark:border-[#27313B]">
                    {post.role}
                  </span>
                </div>
                <p className="text-xs font-medium text-[#94A3B8] dark:text-[#6B7682]">{post.time}</p>
              </div>
            </div>

            <p className="text-sm font-medium text-[#111827] dark:text-[#F5F7FA] leading-relaxed">{post.content}</p>

            <div className="flex items-center space-x-6 border-t border-[#E5EAF2] dark:border-[#27313B] pt-3 text-xs font-semibold text-[#475569] dark:text-[#A3ADB8]">
              <button className="flex items-center space-x-1.5 hover:text-rose-600 transition-colors cursor-pointer">
                <Heart className="h-4 w-4" />
                <span>{post.likes} Likes</span>
              </button>
              <button className="flex items-center space-x-1.5 hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors cursor-pointer">
                <MessageCircle className="h-4 w-4" />
                <span>{post.comments} Comments</span>
              </button>
            </div>
          </div>
        )))}
      </div>
    </div>
  );
}

