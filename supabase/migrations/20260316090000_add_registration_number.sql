-- Add registration_number column to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS registration_number TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_registration_number ON public.profiles(registration_number);

-- Update the handle_new_user trigger to also save registration_number from metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, registration_number)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.raw_user_meta_data->>'registration_number'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- RPC function: given a registration number, return the email
-- This is used at login time to resolve reg number -> email for Supabase auth
CREATE OR REPLACE FUNCTION public.get_email_by_registration_number(reg_number TEXT)
RETURNS TEXT AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT u.email INTO found_email
  FROM auth.users u
  JOIN public.profiles p ON p.user_id = u.id
  WHERE p.registration_number = reg_number
  LIMIT 1;

  RETURN found_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
