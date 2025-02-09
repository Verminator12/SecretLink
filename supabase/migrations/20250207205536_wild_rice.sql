/*
  # Allow anonymous messages

  1. Changes
    - Update RLS policies to allow anonymous users to insert messages
    - Remove user_id requirement for messages table
  
  2. Security
    - Allow public access for reading and writing messages
    - Remove user_id foreign key constraint since we're not using authentication
*/

-- Remove user_id foreign key and make it nullable
ALTER TABLE messages ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE messages DROP CONSTRAINT IF EXISTS messages_user_id_fkey;

-- Drop existing policies
DROP POLICY IF EXISTS "Messages are public" ON messages;
DROP POLICY IF EXISTS "Users can create messages" ON messages;

-- Create new policies for public access
CREATE POLICY "Anyone can read messages"
  ON messages
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can create messages"
  ON messages
  FOR INSERT
  TO public
  WITH CHECK (true);