'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, Bot, Loader2, BookOpen, Clock, AlertCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export default function StudentCopilotPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello Ayush! I am your AI Campus Copilot. How can I help you today? You can ask about your attendance, course materials, class schedules, or campus services.',
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
    <div className="flex flex-col h-[calc(100vh-7rem)] bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
      {/* Copilot Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4 bg-slate-900 text-white">
        <div className="flex items-center space-x-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-semibold">Campus Copilot AI</h2>
            <p className="text-xs text-indigo-300">Powered by Gemini / Groq / Ollama</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-indigo-400'
              }`}
            >
              {msg.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            <div
              className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-white text-gray-800 shadow-sm border border-gray-200 rounded-tl-none whitespace-pre-wrap'
              }`}
            >
              <p>{msg.content}</p>
              <span
                className={`mt-1 block text-[10px] ${
                  msg.role === 'user' ? 'text-blue-200 text-right' : 'text-gray-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-indigo-400">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center space-x-2 rounded-2xl bg-white px-4 py-3 text-sm shadow-sm border border-gray-200">
              <Loader2 className="h-4 w-4 animate-spin text-indigo-600" />
              <span className="text-gray-500 text-xs">Copilot is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-6 py-2 bg-gray-50 border-t border-gray-100 flex flex-wrap gap-2">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => setInput(prompt)}
              className="text-xs bg-white text-gray-700 px-3 py-1.5 rounded-full border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Campus Copilot anything..."
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
