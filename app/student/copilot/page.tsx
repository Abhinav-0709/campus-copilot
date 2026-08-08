'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, BookOpen, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function StudentCopilotPage() {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: `Hello ${user?.name || 'there'}! I am your AI Campus Copilot. How can I help you today? You can ask about your attendance, course materials, class schedules, or campus services.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessageText = input.trim();
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (response.ok && data.response) {
        const botMsg: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, botMsg]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error: any) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an issue: ${error.message || 'Unable to connect to AI service'}. Please check your LLM provider API key in .env.local.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const samplePrompts = [
    'What is my overall attendance summary?',
    'When is the library open on weekends?',
    'What assignments do I have pending?',
    'Show me the academic calendar dates.',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white dark:bg-[#14191F] rounded-2xl shadow-[0_8px_30px_rgba(15,23,42,0.04)] dark:shadow-none overflow-hidden border border-[#E5EAF2] dark:border-[#27313B]">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-[#E5EAF2] dark:border-[#27313B] px-6 py-4 bg-white dark:bg-[#14191F] text-[#111827] dark:text-[#F5F7FA]">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F5F7FA]">Campus Copilot AI</h2>
            <p className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA]">Powered by Gemini / Groq / Ollama</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#F8FAFC] dark:bg-[#0B0E12] custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                msg.role === 'user' ? 'bg-[#2563EB] text-white' : 'bg-[#14191F] dark:bg-[#1A2129] text-[#60A5FA] border border-[#27313B]'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm font-medium ${
                msg.role === 'user'
                  ? 'bg-[#2563EB] text-white rounded-tr-none shadow-sm'
                  : 'bg-white dark:bg-[#14191F] text-[#111827] dark:text-[#F5F7FA] shadow-sm border border-[#E5EAF2] dark:border-[#27313B] rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <p>{msg.content}</p>
              <span
                className={`mt-1 block text-[10px] ${
                  msg.role === 'user' ? 'text-blue-200 text-right' : 'text-[#94A3B8] dark:text-[#6B7682]'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#14191F] dark:bg-[#1A2129] text-[#60A5FA]">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2 rounded-2xl bg-white dark:bg-[#14191F] px-4 py-3 text-sm border border-[#E5EAF2] dark:border-[#27313B]">
              <Loader2 className="h-4 w-4 animate-spin text-[#2563EB]" />
              <span className="text-[#475569] dark:text-[#A3ADB8] text-xs font-semibold">Copilot is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 py-2.5 bg-[#F5F8FC] dark:bg-[#14191F] border-t border-[#E5EAF2] dark:border-[#27313B] flex flex-wrap gap-2">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="text-xs font-semibold bg-white dark:bg-[#1A2129] text-[#475569] dark:text-[#A3ADB8] px-3.5 py-1.5 rounded-full border border-[#E5EAF2] dark:border-[#27313B] hover:border-[#2563EB] dark:hover:border-[#60A5FA] hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-[#E5EAF2] dark:border-[#27313B] bg-white dark:bg-[#14191F]">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Campus Copilot anything..."
            className="flex-1 rounded-xl border border-[#E5EAF2] dark:border-[#27313B] bg-[#F5F8FC] dark:bg-[#1A2129] px-4 py-2.5 text-sm text-[#111827] dark:text-[#F5F7FA] placeholder-[#94A3B8] focus:border-[#2563EB] focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="aurora-btn-primary px-4 py-2.5 text-xs inline-flex items-center justify-center disabled:opacity-50 cursor-pointer"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

