import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { trip_id, email, role, invited_by, trip_name } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    // Check if user already exists in profiles
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingProfile) {
      // User already has an account — add them directly to trip_members
      const { error: memberErr } = await supabaseAdmin
        .from('trip_members')
        .upsert({ trip_id, user_id: existingProfile.id, role }, { onConflict: 'trip_id,user_id' });

      if (memberErr) throw memberErr;

      return new Response(
        JSON.stringify({ success: true, existing: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    // New user — create invitation record then send Supabase invite email
    const { data: invitation, error: inviteErr } = await supabaseAdmin
      .from('invitations')
      .insert({ trip_id, invited_email: email, role, invited_by })
      .select()
      .single();

    if (inviteErr) throw inviteErr;

    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://wandr-app.vercel.app';
    const redirectTo = `${siteUrl}?invite=${invitation.token}`;

    const { error: authErr } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo,
      data: {
        invitation_token: String(invitation.token),
        trip_id,
        role,
        trip_name,
      },
    });

    if (authErr) throw authErr;

    return new Response(
      JSON.stringify({ success: true, token: invitation.token }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
