
-- Enum types
CREATE TYPE public.report_type AS ENUM ('lost', 'found');
CREATE TYPE public.report_status AS ENUM ('open', 'matched', 'resolved');
CREATE TYPE public.item_category AS ENUM (
  'electronics', 'clothing', 'accessories', 'books', 'keys', 
  'wallet', 'bag', 'id_card', 'sports', 'other'
);

-- Profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type report_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category item_category NOT NULL DEFAULT 'other',
  brand TEXT,
  color TEXT,
  photo_url TEXT,
  location TEXT NOT NULL,
  status report_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reports are viewable by everyone"
  ON public.reports FOR SELECT USING (true);

CREATE POLICY "Users can create their own reports"
  ON public.reports FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reports"
  ON public.reports FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reports"
  ON public.reports FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_reports_type ON public.reports(type);
CREATE INDEX idx_reports_category ON public.reports(category);
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_user_id ON public.reports(user_id);

-- Matches table
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lost_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  found_report_id UUID NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
  score INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lost_report_id, found_report_id)
);

ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view matches for their reports"
  ON public.matches FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.reports
      WHERE reports.id IN (lost_report_id, found_report_id)
        AND reports.user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert matches"
  ON public.matches FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their matches"
  ON public.matches FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.reports
      WHERE reports.id IN (lost_report_id, found_report_id)
        AND reports.user_id = auth.uid()
    )
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-matching function
CREATE OR REPLACE FUNCTION public.find_matches_for_report(report_id UUID)
RETURNS SETOF public.matches AS $$
DECLARE
  r public.reports;
  opposite_type report_type;
  match_record public.matches;
BEGIN
  SELECT * INTO r FROM public.reports WHERE id = report_id;
  
  IF r IS NULL THEN RETURN; END IF;
  
  IF r.type = 'lost' THEN opposite_type := 'found';
  ELSE opposite_type := 'lost';
  END IF;

  FOR match_record IN
    INSERT INTO public.matches (lost_report_id, found_report_id, score)
    SELECT 
      CASE WHEN r.type = 'lost' THEN r.id ELSE other.id END,
      CASE WHEN r.type = 'found' THEN r.id ELSE other.id END,
      (CASE WHEN other.category = r.category THEN 50 ELSE 0 END) +
      (CASE WHEN LOWER(other.location) = LOWER(r.location) THEN 30 ELSE 0 END) +
      (CASE WHEN LOWER(COALESCE(other.color,'')) = LOWER(COALESCE(r.color,'')) AND r.color IS NOT NULL THEN 10 ELSE 0 END) +
      (CASE WHEN LOWER(COALESCE(other.brand,'')) = LOWER(COALESCE(r.brand,'')) AND r.brand IS NOT NULL THEN 10 ELSE 0 END)
    FROM public.reports other
    WHERE other.type = opposite_type
      AND other.status = 'open'
      AND other.id != r.id
      AND (other.category = r.category OR LOWER(other.location) = LOWER(r.location))
      AND NOT EXISTS (
        SELECT 1 FROM public.matches m
        WHERE (m.lost_report_id = CASE WHEN r.type = 'lost' THEN r.id ELSE other.id END)
          AND (m.found_report_id = CASE WHEN r.type = 'found' THEN r.id ELSE other.id END)
      )
    ON CONFLICT DO NOTHING
    RETURNING *
  LOOP
    RETURN NEXT match_record;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Storage bucket for item photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('item-photos', 'item-photos', true);

CREATE POLICY "Anyone can view item photos"
  ON storage.objects FOR SELECT USING (bucket_id = 'item-photos');

CREATE POLICY "Authenticated users can upload item photos"
  ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'item-photos' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "Users can update their own photos"
  ON storage.objects FOR UPDATE USING (
    bucket_id = 'item-photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own photos"
  ON storage.objects FOR DELETE USING (
    bucket_id = 'item-photos' AND auth.uid()::text = (storage.foldername(name))[1]
  );
