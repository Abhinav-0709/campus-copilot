/*
  # Create tables for chatbot functionality

  1. New Tables
    - `chatbot_knowledge`
      - `id` (uuid, primary key)
      - `topic` (text)
      - `content` (text)
      - `embedding` (vector)
      - `created_at` (timestamp)
    
    - `chat_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `created_at` (timestamp)
      
    - `chat_messages`
      - `id` (uuid, primary key)
      - `session_id` (uuid, references chat_sessions)
      - `role` (text)
      - `content` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create the vector extension if it doesn't exist
create extension if not exists vector;

-- Create chatbot_knowledge table
create table if not exists chatbot_knowledge (
  id uuid primary key default gen_random_uuid(),
  topic text not null,
  content text not null,
  embedding vector(1536),
  created_at timestamptz default now()
);

-- Create chat_sessions table
create table if not exists chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  created_at timestamptz default now()
);

-- Create chat_messages table
create table if not exists chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references chat_sessions not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table chatbot_knowledge enable row level security;
alter table chat_sessions enable row level security;
alter table chat_messages enable row level security;

-- Create policies
create policy "Allow read access to chatbot knowledge for authenticated users"
  on chatbot_knowledge for select
  to authenticated
  using (true);

create policy "Allow users to manage their own chat sessions"
  on chat_sessions for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Allow users to manage their own chat messages"
  on chat_messages for all
  to authenticated
  using (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  )
  with check (
    session_id in (
      select id from chat_sessions where user_id = auth.uid()
    )
  );

-- Create index for vector similarity search
create index on chatbot_knowledge using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);