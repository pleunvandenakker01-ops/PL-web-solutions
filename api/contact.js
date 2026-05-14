const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function dutchDateTime() {
  return new Date().toLocaleString('nl-NL', {
    timeZone: 'Europe/Amsterdam',
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

module.exports = async (req, res) => {
  console.log('[contact] function hit —', req.method);

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { naam, email, telefoon, bedrijf, pakket, bericht, honeypot } = req.body || {};

  if (honeypot) {
    return res.status(200).json({ success: true });
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!naam || String(naam).trim().length < 2) {
    return res.status(400).json({ error: 'Vul een geldige naam in.' });
  }
  if (!email || !emailRe.test(String(email).trim())) {
    return res.status(400).json({ error: 'Vul een geldig e-mailadres in.' });
  }

  const timestamp = dutchDateTime();
  const cleanEmail = String(email).trim();
  const cleanNaam = String(naam).trim();

  try {
    // Notificatie naar info@plwebsolutions.nl
    await resend.emails.send({
      from: 'PL Web Solutions <noreply@pl-websolutions.nl>',
      to: 'info@plwebsolutions.nl',
      replyTo: cleanEmail,
      subject: `Nieuwe aanvraag van ${cleanNaam}`,
      html: `
        <h2 style="font-family:sans-serif;color:#111;">Nieuwe contactaanvraag — PL Web Solutions</h2>
        <table style="font-family:sans-serif;font-size:15px;border-collapse:collapse;width:100%;max-width:580px;">
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:140px;">Naam</td><td style="padding:8px 12px;">${esc(naam)}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">E-mail</td><td style="padding:8px 12px;"><a href="mailto:${esc(cleanEmail)}">${esc(cleanEmail)}</a></td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Telefoon</td><td style="padding:8px 12px;">${esc(telefoon) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Bedrijf</td><td style="padding:8px 12px;">${esc(bedrijf) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;">Pakket</td><td style="padding:8px 12px;">${esc(pakket) || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f5f5f5;font-weight:600;vertical-align:top;">Bericht</td><td style="padding:8px 12px;">${esc(bericht).replace(/\n/g, '<br>') || '—'}</td></tr>
          <tr><td style="padding:8px 12px;background:#f0f0f0;font-weight:600;color:#888;">Ontvangen</td><td style="padding:8px 12px;color:#888;">${timestamp}</td></tr>
        </table>
      `,
    });

    // Bevestigingsmail naar de klant
    await resend.emails.send({
      from: 'PL Web Solutions <noreply@pl-websolutions.nl>',
      to: cleanEmail,
      subject: 'Bedankt voor je aanvraag — PL Web Solutions',
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#222;">
          <p style="font-size:16px;">Hoi ${esc(cleanNaam)},</p>
          <p style="font-size:15px;line-height:1.7;">
            Bedankt voor je aanvraag! We hebben je bericht in goede orde ontvangen en nemen
            <strong>binnen 24 uur</strong> contact met je op met een vrijblijvend advies op maat.
          </p>
          <p style="font-size:15px;line-height:1.7;">
            Wil je ons in de tussentijd bereiken? Bel of app ons gerust via
            <a href="tel:+31630937447" style="color:#C9A84C;text-decoration:none;font-weight:600;">06-30937447</a>.
          </p>
          <p style="font-size:15px;line-height:1.7;">
            Met vriendelijke groet,<br>
            <strong>Pleun &amp; Lars</strong><br>
            PL Web Solutions
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
          <p style="font-size:12px;color:#999;">
            Je ontvangt deze e-mail omdat je het contactformulier op
            <a href="https://www.pl-websolutions.nl" style="color:#999;">pl-websolutions.nl</a> hebt ingevuld.
          </p>
        </div>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Versturen mislukt. Probeer het opnieuw of bel ons direct.' });
  }
};
