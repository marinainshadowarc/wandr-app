-- Invitations table for the "Invite Pals" feature
-- Run in: Supabase Dashboard → SQL Editor → New query

CREATE TABLE IF NOT EXISTS public.invitations (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id    uuid REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
  invited_email text NOT NULL,
  role       text NOT NULL DEFAULT 'Viewer',
  invited_by uuid REFERENCES public.profiles(id),
  token      uuid DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  status     text DEFAULT 'pending',        -- 'pending' | 'accepted'
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Any authenticated user can read invitations (needed for token-based acceptance)
CREATE POLICY "Authenticated users can view invitations"
  ON public.invitations FOR SELECT
  TO authenticated
  USING (true);

-- Only trip Owner/Editor can send invitations
CREATE POLICY "Trip owners and editors can create invitations"
  ON public.invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.trip_members
      WHERE trip_members.trip_id = invitations.trip_id
        AND trip_members.user_id = auth.uid()
        AND trip_members.role IN ('Owner', 'Editor')
    )
  );

-- Any authenticated user can accept (update status) an invitation
CREATE POLICY "Authenticated users can accept invitations"
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (true);
