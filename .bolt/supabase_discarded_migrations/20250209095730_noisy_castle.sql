/*
  # Add expiration_date column and update cleanup logic

  1. Changes
    - Add expiration_date column to messages table
    - Set expiration_date for existing messages
    - Create trigger to set expiration_date on new messages
    - Update cleanup function to use expiration_date

  2. Security
    - Maintain existing RLS policies
    - No changes to permissions required
*/

-- Add expiration_date column
ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS expiration_date timestamptz;

-- Set expiration_date for existing messages
UPDATE messages 
SET expiration_date = created_at + INTERVAL '24 hours'
WHERE expiration_date IS NULL;

-- Make expiration_date NOT NULL after setting values
ALTER TABLE messages 
ALTER COLUMN expiration_date SET NOT NULL;

-- Create trigger function to set expiration_date
CREATE OR REPLACE FUNCTION set_message_expiration()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expiration_date := NEW.created_at + INTERVAL '24 hours';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_message_expiration_trigger ON messages;
CREATE TRIGGER set_message_expiration_trigger
  BEFORE INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION set_message_expiration();

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