
-- Student dataset table (simulating university data)
CREATE TABLE IF NOT EXISTS public.student_dataset (
  registration_number TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  department TEXT,
  batch TEXT
);

-- Add some dummy data for demo
INSERT INTO public.student_dataset (registration_number, full_name, department, batch)
VALUES 
  ('12100001', 'John Doe', 'CSE', '2021'),
  ('12100002', 'Jane Smith', 'ECE', '2021'),
  ('12100003', 'Rahul Kumar', 'ME', '2022')
ON CONFLICT (registration_number) DO NOTHING;

-- Update handle_new_user to automatically fetch name from dataset if available
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  student_name TEXT;
  reg_number TEXT;
BEGIN
  reg_number := NEW.raw_user_meta_data->>'registration_number';
  
  -- Try to find in student dataset
  IF reg_number IS NOT NULL THEN
    SELECT full_name INTO student_name FROM public.student_dataset WHERE registration_number = reg_number;
  END IF;

  INSERT INTO public.profiles (user_id, display_name, registration_number)
  VALUES (
    NEW.id,
    COALESCE(student_name, NEW.raw_user_meta_data->>'display_name', NEW.raw_user_meta_data->>'full_name', NEW.email),
    reg_number
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
