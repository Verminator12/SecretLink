/*
  # Fix message cleanup cron job
  
  1. Changes
    - Add schema qualification for messages table
    - Add error handling and logging
    - Improve cleanup function with transaction
    - Add proper schema qualification for security
  
  2. Security
    - Function runs with SECURITY DEFINER to ensure proper permissions
    - Explicit schema qualification for security
*/

-- First, enable the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the cleanup function with proper error handling
CREATE OR REPLACE FUNCTION public.cleanup_expired_messages()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete expired messages and get count of deleted rows
  WITH deleted AS (
    DELETE FROM public.messages
    WHERE created_at < NOW() - INTERVAL '24 hours'
    RETURNING id
  )
  SELECT COUNT(*) INTO deleted_count FROM deleted;

  -- Log the cleanup operation
  INSERT INTO public.cron_job_log (job_name, status, message)
  VALUES (
    'cleanup-expired-messages',
    'success',
    format('Deleted %s expired messages', deleted_count)
  );

EXCEPTION WHEN OTHERS THEN
  -- Log any errors that occur
  INSERT INTO public.cron_job_log (job_name, status, message)
  VALUES (
    'cleanup-expired-messages',
    'error',
    format('Error cleaning up messages: %s', SQLERRM)
  );
  RAISE;
END;
$$;

-- Create logging table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.cron_job_log (
  id BIGSERIAL PRIMARY KEY,
  job_name TEXT NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Drop existing schedule if it exists
SELECT cron.unschedule('cleanup-expired-messages');

-- Create a scheduled job to run every minute
SELECT cron.schedule(
  'cleanup-expired-messages',  -- job name
  '* * * * *',               -- every minute
  $$SELECT public.cleanup_expired_messages()$$
);

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION public.cleanup_expired_messages() TO postgres;
GRANT ALL ON public.cron_job_log TO postgres;