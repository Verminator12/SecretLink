/*
  # Add protection columns to messages table

  1. Changes
    - Add `protection_type` column to store the type of protection (password or game)
    - Add `protection_data` column to store protection-specific data (password hash or game configuration)
    - Add `slug` column for unique message URLs

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns
ALTER TABLE messages ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS protection_type text;
ALTER TABLE messages ADD COLUMN IF NOT EXISTS protection_data text;

-- Add unique constraint to slug
ALTER TABLE messages ADD CONSTRAINT messages_slug_key UNIQUE (slug);

-- Update existing policies to include new columns
DROP POLICY IF EXISTS "Anyone can read messages" ON messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON messages;

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