const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify shared secret (since JWT verification is disabled for this function)
    const authHeader = req.headers.get('Authorization') ?? '';
    const expectedSecret = Deno.env.get('INVITE_EMAIL_SECRET');
    if (!expectedSecret || authHeader !== `Bearer ${expectedSecret}`) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const { to, inviterName, tripName, inviteLink } = await req.json();

    if (!to || !inviteLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: to, inviteLink' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({ error: 'RESEND_API_KEY not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const senderName = inviterName || 'Someone';
    const trip = tripName || 'a trip';

    const htmlBody = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fff7f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:480px;margin:0 auto;padding:40px 24px;">
    <div style="text-align:center;margin-bottom:32px;">
      <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:28px;color:#2d2a26;margin:0 0 4px;">
        Wandr
      </h1>
      <p style="font-size:13px;color:#8a7f72;margin:0;">Travel together</p>
    </div>

    <div style="background:#ffffff;border-radius:16px;padding:32px 24px;text-align:center;border:1px solid #ede8e1;">
      <p style="font-size:40px;margin:0 0 16px;">&#9992;&#65039;</p>
      <h2 style="font-family:Georgia,'Times New Roman',serif;font-size:22px;color:#2d2a26;margin:0 0 12px;">
        You're invited!
      </h2>
      <p style="font-size:15px;color:#5c5650;line-height:1.6;margin:0 0 8px;">
        <strong>${senderName}</strong> invited you to join their trip
      </p>
      <p style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#2d2a26;margin:0 0 28px;">
        ${trip}
      </p>

      <a href="${inviteLink}"
         style="display:inline-block;padding:16px 48px;background:#2d2a26;color:#fff7f0;
                font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;
                text-decoration:none;border-radius:12px;">
        Join Trip
      </a>

      <p style="font-size:12px;color:#8a7f72;margin:24px 0 0;line-height:1.5;">
        Or copy this link:<br>
        <a href="${inviteLink}" style="color:#6366f1;word-break:break-all;">${inviteLink}</a>
      </p>
    </div>

    <p style="text-align:center;font-size:11px;color:#b5ada3;margin:24px 0 0;">
      Sent via Wandr &mdash; plan trips with your pals
    </p>
  </div>
</body>
</html>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Wandr <onboarding@resend.dev>',
        to: [to],
        subject: `${senderName} invited you to join their trip on Wandr!`,
        html: htmlBody,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: result?.message || 'Resend API error' }),
        { status: res.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
});
