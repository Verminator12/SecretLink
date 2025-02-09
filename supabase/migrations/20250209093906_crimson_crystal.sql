/*
  # Add automatic cleanup for expired messages

  1. Changes
    - Add a scheduled job to automatically delete expired messages (older than 24 hours)
    - The job will run every hour to clean up expired messages
    
  2. Security
    - No changes to RLS policies
    - Job runs with full database access to perform cleanup
*/

-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cleanup function
CREATE OR REPLACE FUNCTION cleanup_expired_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM messages
  WHERE created_at < NOW() - INTERVAL '24 hours';
END;
$$;

-- Create a scheduled job to run every hour
SELECT cron.schedule(
  'cleanup-expired-messages',  -- job name
  '* * * * *',               -- every minute
  'SELECT cleanup_expired_messages()'
);