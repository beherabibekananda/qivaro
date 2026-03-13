
-- Fix the overly permissive matches insert policy
DROP POLICY "System can insert matches" ON public.matches;

-- Only allow inserts via the security definer function (no direct user inserts)
-- The find_matches_for_report function runs as SECURITY DEFINER so it bypasses RLS
CREATE POLICY "Authenticated users can insert matches for their reports"
  ON public.matches FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.reports
      WHERE reports.id IN (lost_report_id, found_report_id)
        AND reports.user_id = auth.uid()
    )
  );
