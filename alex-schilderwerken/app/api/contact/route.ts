import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { naam, telefoon, email, werkType, omschrijving } = body;

  if (!naam || !telefoon || !email) {
    return NextResponse.json({ error: "Verplichte velden ontbreken" }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    // Formspree fallback — stel NEXT_PUBLIC_FORMSPREE_ID in als .env var
    const formspreeId = process.env.FORMSPREE_ID;
    if (formspreeId) {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ naam, telefoon, email, werkType, omschrijving }),
      });
      if (res.ok) return NextResponse.json({ ok: true });
      return NextResponse.json({ error: "Verzenden mislukt" }, { status: 500 });
    }

    // Dev fallback — log to console
    console.log("Contact form submission:", { naam, telefoon, email, werkType, omschrijving });
    return NextResponse.json({ ok: true });
  }

  // Resend
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Alex Schilderwerken <noreply@alexschilderwerken.nl>",
      to: ["schildersbedrijf.lanotte@gmail.com"],
      reply_to: email,
      subject: `Nieuwe offerte-aanvraag van ${naam}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1B3A6B;">Nieuwe offerte-aanvraag</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Naam</td><td style="padding: 8px 0;">${naam}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Telefoon</td><td style="padding: 8px 0;"><a href="tel:${telefoon}">${telefoon}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">E-mail</td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 13px;">Type werk</td><td style="padding: 8px 0;">${werkType || "Niet opgegeven"}</td></tr>
          </table>
          ${omschrijving ? `<h3 style="color: #1B3A6B; margin-top: 20px;">Omschrijving</h3><p style="color: #555; line-height: 1.6;">${omschrijving}</p>` : ""}
        </div>
      `,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ error: "E-mail verzenden mislukt" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
