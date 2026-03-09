-- Allow trip members to delete pending invitations for their trips.

CREATE POLICY "Trip members can delete invitations" ON invitations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
        FROM profiles p
        JOIN trip_members tm ON tm.user_id = p.id
       WHERE p.auth_id = auth.uid()
         AND tm.trip_id = invitations.trip_id
    )
  );
