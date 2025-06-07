/*
  # Setup chatbot embeddings with pgvector

  1. New Extensions
    - Enable pgvector extension for vector operations
  
  2. New Tables
    - `chatbot_embeddings` for storing text embeddings
      - `id` (uuid, primary key)
      - `content` (text)
      - `embedding` (vector)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
  
  3. Security
    - Enable RLS on chatbot_embeddings
    - Add policy for authenticated users to read embeddings
*/

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS chatbot_embeddings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  embedding vector(1536),
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chatbot_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read embeddings"
  ON chatbot_embeddings
  FOR SELECT
  TO authenticated
  USING (true);