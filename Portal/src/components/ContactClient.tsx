"use client";

import React, { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./Header";
import {
  formatLocalReachQuizForMessage,
  formatLocalReachQuizFromAnswers,
  LOCALREACH_QUIZ_BODY_MARKER,
  LOCALREACH_QUIZ_STORAGE_KEY,
  readLocalReachQuizTripleFromBrowser,
} from "@/content/localReachLeadQuiz";

function ContactForm() {
  const searchParams = useSearchParams();
  const fromQuery = searchParams.get("service");
  const q0 = searchParams.get("q0");
  const q1 = searchParams.get("q1");
  const q2 = searchParams.get("q2");
  /** Parsed quiz; sent in JSON so email always includes answers even if the user clears the textarea. */
  const [attachedQuiz, setAttachedQuiz] = useState<[string, string, string] | null>(null);
  /** URL sets initial preset; user edits are local-only (avoid sync setState in effects). */
  const [picked, setPicked] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fromUrl =
      q0?.trim() && q1?.trim() && q2?.trim() ? ([q0, q1, q2] as [string, string, string]) : null;
    if (fromUrl) {
      setAttachedQuiz(fromUrl);
      try {
        sessionStorage.setItem(LOCALREACH_QUIZ_STORAGE_KEY, JSON.stringify({ q0, q1, q2 }));
      } catch {
        /* ignore quota / private mode */
      }
      return;
    }
    try {
      const raw = sessionStorage.getItem(LOCALREACH_QUIZ_STORAGE_KEY);
      if (!raw) {
        setAttachedQuiz(null);
        return;
      }
      const o = JSON.parse(raw) as { q0?: string; q1?: string; q2?: string };
      if (o.q0?.trim() && o.q1?.trim() && o.q2?.trim()) {
        setAttachedQuiz([o.q0, o.q1, o.q2]);
      } else {
        setAttachedQuiz(null);
      }
    } catch {
      setAttachedQuiz(null);
    }
  }, [q0, q1, q2]);

  useEffect(() => {
    if (!attachedQuiz) return;
    const p = new URLSearchParams();
    attachedQuiz.forEach((a, i) => p.set(`q${i}`, a));
    const recordedAt = new Date().toLocaleString("en-AE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Dubai",
    });
    const block = formatLocalReachQuizForMessage(p, { recordedAt });
    if (!block) return;
    setMessage((m) => (m.trim() === "" ? block : m));
  }, [attachedQuiz]);

  const service = picked ?? fromQuery ?? "local-seo-audit";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorText(null);
    try {
      const quizTriple = readLocalReachQuizTripleFromBrowser() ?? attachedQuiz;
      const recordedAt = new Date().toLocaleString("en-AE", {
        dateStyle: "medium",
        timeStyle: "short",
        timeZone: "Asia/Dubai",
      });
      const trimmed = message.trim();
      const messageAlreadyHasQuiz = trimmed.includes(LOCALREACH_QUIZ_BODY_MARKER);
      const messageToSend =
        messageAlreadyHasQuiz
          ? trimmed
          : quizTriple && quizTriple.every(Boolean)
            ? `${formatLocalReachQuizFromAnswers(quizTriple, { recordedAt })}\n\n--- Message from contact form ---\n\n${trimmed || "(empty)"}`
            : trimmed;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          service,
          message: messageToSend,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setErrorText(data.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
      setAttachedQuiz(null);
      try {
        sessionStorage.removeItem(LOCALREACH_QUIZ_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } catch {
      setErrorText("Network error. Please try again.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="text-center py-20 space-y-6">
        <div className="mx-auto h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-primary text-2xl">✓</div>
        <h2 className="text-3xl font-black">Message Sent Successfully</h2>
        <p className="text-muted">
          We will get back to you from info.ae@miraireach.marketing very shortly.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setErrorText(null);
          }}
          className="text-xs font-black uppercase tracking-widest underline underline-offset-8"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="space-y-8">
        {status === "error" && errorText && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{errorText}</p>
        )}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Full Name</label>
            <input
              required
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full bg-white border border-line rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors text-foreground"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Email Address</label>
            <input
              required
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-full bg-white border border-line rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Interested Service</label>
          <select 
            value={service} 
            onChange={(e) => setPicked(e.target.value)}
            className="w-full bg-white border border-line rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors appearance-none text-foreground"
          >
            <optgroup label="mirAIreach &amp; reputation">
              <option value="local-seo-audit">mirAIreach Consultation &amp; Demo</option>
              <option value="localreach">LocalReach — Automated Google Reviews</option>
            </optgroup>
            <optgroup label="Paid acquisition">
              <option value="ai-google-ads">Google AI Ads — AI-managed campaigns</option>
            </optgroup>
            <optgroup label="Audits &amp; design">
              <option value="aio-diagnostic">Free AI Search Audit</option>
              <option value="free-design">Free Web Design</option>
            </optgroup>
            <optgroup label="Strategy">
              <option value="consultancy">AI Strategic Consultancy</option>
              <option value="other">Other Inquiry</option>
            </optgroup>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-50">Message</label>
          {attachedQuiz && (
            <p className="text-xs text-muted rounded-lg border border-primary/20 bg-primary/5 px-3 py-2">
              Your LocalReach quiz answers are attached to this request and will appear in the email to our
              team, even if you shorten the text below.
            </p>
          )}
          <textarea
            required={!attachedQuiz}
            name="message"
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full bg-white border border-line rounded-lg px-4 py-3 focus:border-primary outline-none transition-colors resize-none text-foreground"
          />
        </div>

        <button 
          type="submit" 
          disabled={status === "loading"}
          className="w-full rounded-full bg-primary py-5 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-black transition-all disabled:opacity-50 shadow-lg shadow-primary/10 active:scale-[0.98]"
        >
          {status === "loading" ? "Sending..." : "Send Request Now"}
        </button>
      </form>
    </div>
  );
}

export default function ContactClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} theme="light" />
        
        <main className="mt-12 space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              Work with GAM solutions L.L.C-FZ
            </h1>
            <p className="mx-auto max-w-xl text-muted leading-relaxed">
              Initiate your digital transformation today. Our team is ready to help you dominate in the AI-driven landscape.
            </p>
          </div>

          <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
            <ContactForm />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
