-- Activity Log table for the activity feed feature
CREATE TABLE public.activity_log (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id    uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  user_id    uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  action     text NOT NULL,
  category   text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Index for efficient feed queries (newest first per trip)
CREATE INDEX idx_activity_log_trip ON public.activity_log (trip_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users full access (matches existing RLS pattern)
CREATE POLICY "Auth users full access on activity_log"
  ON public.activity_log FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Enable Realtime for activity_log
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
