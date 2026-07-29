import { createClient } from 'npm:@supabase/supabase-js@2';
import { buildOtpEmailHtml } from './email-template.ts';

const OTP_TTL_MINUTES = 10;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

function generateCode(): string {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return String(100000 + (buf[0] % 900000));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  let email: unknown;
  try {
    ({ email } = await req.json());
  } catch {
    return json({ error: 'Invalid request body.' }, 400);
  }

  if (typeof email !== 'string' || !email.includes('@')) {
    return json({ error: 'A valid email is required.' }, 400);
  }

  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const code = generateCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000).toISOString();

  const { error: insertError } = await supabaseAdmin
    .from('otp_codes')
    .insert({ email, code, purpose: 'signup', expires_at: expiresAt });

  if (insertError) {
    return json({ error: insertError.message }, 500);
  }

  const resendApiKey = Deno.env.get('RESEND_API_KEY');
  const fromAddress = Deno.env.get('RESEND_FROM_EMAIL');

  if (!resendApiKey || !fromAddress) {
    // No email provider configured yet. The code is safely stored either way
    // (see the note in supabase/migrations/20260730000000_custom_signup_otp.sql
    // for reading it by hand in the SQL editor), but echoing it back here too
    // means local/dev testing isn't blocked on that. This only ever happens
    // when delivery is unconfirmed — once RESEND_API_KEY/RESEND_FROM_EMAIL are
    // set and email sending actually succeeds, the code stops being returned.
    return json({ ok: true, delivered: false, code }, 200);
  }

  const emailResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromAddress,
      to: email,
      subject: 'Verify your NHIS Connect account',
      html: buildOtpEmailHtml(code),
    }),
  });

  const delivered = emailResponse.ok;
  return json({ ok: true, delivered, code: delivered ? undefined : code }, 200);
});
