const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

module.exports = async (req, res) => {
  console.log('[contact] function hit —', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { naam, email, bedrijf, pakket, bericht, honeypot } = req.body || {};

  // Server-side honeypot check — stille weigering
  if (honeypot) {
    return res.status(200).json({ success: true });
  }

  // Validatie
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!naam || String(naam).trim().length < 2) {
    return res.status(400).json({ error: 'Vul een geldige naam in.' });
  }
  if (!email || !emailRe.test(String(email).trim())) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }

  try {
    await resend.emails.send({
      from: 'PL Web Solutions <noreply@pl-websolutions.nl>',
      to: 'info@plwebsolutions.nl',
      replyTo: String(email).trim(),
      subject: `Nieuwe aanvraag van ${String(naam).trim()}`,
      html: `
        <h2 style="font-family:sans-serif;color:#111;">Nieuwe contactaanvraag — PL Web Solutions</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:560px;">
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:130px;">Naam</td><td style="padding:8px 12px;">${esc(naam)}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">E-mail</td><td style="padding:8px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Bedrijf</td><td style="padding:8px 12px;">${esc(bedrijf) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Pakket</td><td style="padding:8px 12px;">${esc(pakket) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;vertical-align:top;">Bericht</td><td style="padding:8px 12px;">${esc(bericht).replace(/\n/g, '<br>') || '—'}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Versturen mislukt. Probeer het opnieuw of bel ons direct.' });
  }
};
