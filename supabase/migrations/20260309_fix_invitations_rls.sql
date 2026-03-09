-- Fix invitations INSERT policy: the old policy compared trip_members.user_id
-- directly against auth.uid(), but user_id stores profiles.id (not the auth UUID).
-- This migration joins through profiles so the check works correctly.

DROP POLICY IF EXISTS "Trip members can insert invitations" ON invitations;

CREATE POLICY "Trip members can insert invitations" ON invitations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
        FROM profiles p
        JOIN trip_members tm ON tm.user_id = p.id
       WHERE p.auth_id = auth.uid()
         AND tm.trip_id = trip_id
    )
  );
