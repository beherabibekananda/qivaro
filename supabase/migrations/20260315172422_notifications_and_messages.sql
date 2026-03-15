-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('match', 'system', 'success')),
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Messages table (for match chat)
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages for their matches"
  ON public.messages FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.reports r ON r.id IN (m.lost_report_id, m.found_report_id)
      WHERE m.id = match_id AND r.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their matches"
  ON public.messages FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.matches m
      JOIN public.reports r ON r.id IN (m.lost_report_id, m.found_report_id)
      WHERE m.id = match_id AND r.user_id = auth.uid()
    ) AND auth.uid() = sender_id
  );

-- Trigger to create notifications on match creation
CREATE OR REPLACE FUNCTION public.notify_match_created()
RETURNS TRIGGER AS $$
DECLARE
  lost_user UUID;
  found_user UUID;
BEGIN
  -- Get user_ids for both reports
  SELECT user_id INTO lost_user FROM public.reports WHERE id = NEW.lost_report_id;
  SELECT user_id INTO found_user FROM public.reports WHERE id = NEW.found_report_id;

  -- Notify lost_report owner
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (lost_user, 'Possible Match Found!', 'We found an item that might be yours. Check it out.', 'match', '/report-detail/' || NEW.found_report_id);

  -- Notify found_report owner
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (found_user, 'Possible Match Found!', 'Someone reported losing an item like the one you found.', 'match', '/report-detail/' || NEW.lost_report_id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_match_created
  AFTER INSERT ON public.matches
  FOR EACH ROW EXECUTE FUNCTION public.notify_match_created();
