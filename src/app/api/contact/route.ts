import { NextResponse } from "next/server";

const MAX_NAME = 200;
const MAX_EMAIL = 320;
/** Quiz block + user notes (contact embeds quiz in this field). */
const MAX_MESSAGE = 12000;

type Body = {
  name?: string;
  email?: string;
  service?: string;
  message?: string;
};

function trim(s: unknown, max: number): string {
  if (typeof s !== "string") return "";
  return s.trim().slice(0, max);
}

export async function POST(request: Request) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = trim(body.name, MAX_NAME);
  const email = trim(body.email, MAX_EMAIL);
  const service = trim(body.service, 120);
  const message = trim(body.message, MAX_MESSAGE);
  const hasQuizInBody = message.includes("=== LocalReach visibility quiz (answers on file) ===");

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "info.ae@miraireach.marketing";
  const subject = `[${service || "inquiry"}]${hasQuizInBody ? " [quiz]" : ""} Contact from ${name}`;

  const resendKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;

  if (resendKey && from) {
    const text = `Service: ${service || "(none)"}\nFrom: ${name} <${email}>\n\n${message}\n`;
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject,
        text,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Resend error:", res.status, err);
      return NextResponse.json({ error: "Failed to send message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (webhook) {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, service, message, subject }),
    });

    if (!res.ok) {
      console.error("Contact webhook error:", res.status, await res.text());
      return NextResponse.json({ error: "Failed to forward message." }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  }

  console.error("Contact: configure RESEND_API_KEY+RESEND_FROM or CONTACT_WEBHOOK_URL");
  return NextResponse.json(
    { error: "Contact delivery is not configured on the server." },
    { status: 503 }
  );
}
