/*
  # Create embeddings table for chatbot

  1. New Tables
    - `chatbot_embeddings`
      - `id` (uuid, primary key)
      - `content` (text)
      - `embedding` (vector)
      - `metadata` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `chatbot_embeddings` table
    - Add policy for authenticated users to read embeddings
*/

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