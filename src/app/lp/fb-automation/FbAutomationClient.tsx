"use client";

import React, { useState } from "react";
import Header from "@/components/Header";

export default function FbAutomationClient() {
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-12 md:px-10">
      <Header showNav={false} />

      <main className="mt-8 space-y-20 pb-20">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-br from-muted/5 via-background to-muted/10 p-10 md:p-16 text-center shadow-2xl">
          <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-foreground/5 blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-foreground/5 blur-3xl"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-foreground/20 bg-background px-4 py-1.5 text-xs font-semibold tracking-[0.2em] text-foreground uppercase">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-foreground"></span>
              </span>
              Free Download / Strategy Session
            </div>
            
            <h1 className="mx-auto max-w-4xl text-4xl font-medium leading-[1.2] tracking-tight md:text-6xl">
              Dubai F&B: Zero-Cost AI Website & Acquisition Automation Roadmap
            </h1>
            
            <p className="mx-auto max-w-2xl text-base leading-relaxed text-muted md:text-xl">
              The era of paying high upfront fees for websites is over. Discover our playbook that uses entirely free, AI-generated premium websites as a foundation for AIO (AI Search) and WhatsApp automation to consistently drive revenue.
            </p>
          </div>
        </section>

        {/* The Problem / Pain Agitation */}
        <section className="mx-auto max-w-3xl space-y-8 text-center">
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">
            Why do beautiful websites fail to attract customers?
          </h2>
          <p className="text-base leading-8 text-muted/90 md:text-lg">
            In Dubai's F&B market, a website often becomes just a static billboard. Everyone knows they can build a site for free with Wix or Squarespace, but owners hesitate due to lack of time, fear of looking cheap, or technical hurdles. More importantly, simply having a site doesn't mean you'll be found on Google or AI answer engines like ChatGPT.
          </p>
        </section>

        {/* 3-Step Roadmap */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-sm font-semibold tracking-[0.2em] text-muted uppercase">
              The 3-Step Playbook
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative overflow-hidden rounded-xl border border-line bg-background p-8 transition-all hover:border-foreground/30 hover:shadow-lg">
              <div className="mb-6 text-4xl font-light text-muted group-hover:text-foreground transition-colors">01</div>
              <h3 className="mb-4 text-xl font-medium">
                Zero-Cost AI Site Build
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                We combine the latest AI generators with professional direction to build a high-quality site at lightning speed for 'free'. We take away the hassle and time commitment from you.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative overflow-hidden rounded-xl border border-line bg-background p-8 transition-all hover:border-foreground/30 hover:shadow-lg">
              <div className="mb-6 text-4xl font-light text-muted group-hover:text-foreground transition-colors">02</div>
              <h3 className="mb-4 text-xl font-medium">
                AIO (Answer Engine) Optimization
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                The real game starts when the site is live. Beyond traditional SEO, we optimize your content so your restaurant is recommended when users ask ChatGPT for 'best dinner in Dubai'.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative overflow-hidden rounded-xl border border-line bg-background p-8 transition-all hover:border-foreground/30 hover:shadow-lg">
              <div className="mb-6 text-4xl font-light text-muted group-hover:text-foreground transition-colors">03</div>
              <h3 className="mb-4 text-xl font-medium">
                WhatsApp CRM Automation
              </h3>
              <p className="text-sm leading-relaxed text-muted">
                To capture every site visitor, we integrate WhatsApp automated responses. We fully systemize everything from booking automation to promotional broadcasts for repeat customers.
              </p>
            </div>
          </div>
        </section>

        {/* Lead Capture Form */}
        <section className="mx-auto max-w-xl rounded-2xl border border-line bg-muted/5 p-8 shadow-sm">
          <div className="mb-8 text-center space-y-3">
            <h2 className="text-2xl font-medium">
              Get the Full Roadmap
            </h2>
            <p className="text-sm text-muted">
              Fill out the form to download the detailed PDF and schedule your free website consultation.
            </p>
          </div>

          {formSubmitted ? (
            <div className="animate-in fade-in zoom-in rounded-lg bg-foreground/5 p-8 text-center duration-500">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-background">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-medium">
                Thank you!
              </h3>
              <p className="text-sm text-muted">
                We have emailed you the Roadmap PDF. Our team will contact you via WhatsApp shortly to begin your free site consultation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  Name
                </label>
                <input required type="text" className="w-full rounded-md border border-line bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  Email
                </label>
                <input required type="email" className="w-full rounded-md border border-line bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  WhatsApp Number
                </label>
                <input required type="tel" className="w-full rounded-md border border-line bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium uppercase tracking-wider text-muted">
                  Restaurant / Business Name
                </label>
                <input required type="text" className="w-full rounded-md border border-line bg-background px-4 py-3 text-sm focus:border-foreground focus:outline-none" />
              </div>
              <button type="submit" className="w-full rounded-md bg-foreground px-6 py-4 text-sm font-medium tracking-wide text-background transition-opacity hover:opacity-90">
                Download PDF & Request Free Strategy Session
              </button>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
