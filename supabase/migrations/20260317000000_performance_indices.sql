
-- Performance indices for reports
CREATE INDEX IF NOT EXISTS idx_reports_category_status ON public.reports(category, status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at_desc ON public.reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_title_search ON public.reports USING gin (to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- Indices for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_registration_number ON public.profiles(registration_number);
