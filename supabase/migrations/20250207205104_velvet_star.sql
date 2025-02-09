/*
  # Create messages table

  1. New Tables
    - `messages`
      - `id` (uuid, primary key)
      - `content` (text, required)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on messages table
    - Add policies for:
      - Anyone can read messages
      - Authenticated users can create messages
*/

CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read messages
CREATE POLICY "Messages are public" 
  ON messages
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert messages
CREATE POLICY "Users can create messages"
  ON messages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);