/*
  # Update cleanup function to use expiration_date

  1. Changes
    - Update cleanup function to use expiration_date instead of created_at
    - Maintain logging functionality
    - No schema changes needed since expiration_date already exists
*/

-- Update cleanup function to use expiration_date
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
    WHERE expiration_date < NOW()
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