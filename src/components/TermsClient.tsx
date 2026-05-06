"use client";

import React from "react";
import Header from "./Header";

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} theme="light" />

        <main className="mx-auto mt-16 max-w-4xl space-y-16">
          <div className="space-y-4 text-center">
            <h1 className="text-4xl font-black uppercase tracking-tighter md:text-6xl">
              Terms &amp; Conditions
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              Legal terms governing use of services provided by GAM Solutions L.L.C-FZ.
            </p>
          </div>

          <div className="prose prose-lg max-w-none text-foreground">
            <section className="space-y-6">
              <p className="leading-relaxed text-base text-foreground">
                By accessing or using any services provided by GAM Solutions L.L.C-FZ (&ldquo;the Company,&rdquo; &ldquo;we,&rdquo;
                &ldquo;us,&rdquo; or &ldquo;our&rdquo;), you (&ldquo;the User&rdquo;) agree to be bound by the following Terms and
                Conditions. Please read them carefully. If you do not agree to these terms, you must discontinue use of our
                platform immediately.
              </p>

              <h2 className="text-foreground text-2xl font-bold">1. Intellectual Property</h2>
              <p className="leading-relaxed text-muted">
                All materials, content, and resources published by GAM Solutions L.L.C-FZ—including but not limited to
                articles, reports, analytics, data visualizations, and graphics—are the exclusive intellectual property of
                GAM Solutions L.L.C-FZ or its licensed partners. Unauthorized reproduction, distribution, modification, or
                commercial use of such content without prior written consent from the Company is strictly prohibited and
                may constitute a violation of applicable copyright laws.
              </p>

              <h2 className="text-foreground text-2xl font-bold">2. Trademarks</h2>
              <p className="leading-relaxed text-muted">
                The names, logos, and service marks &ldquo;mirAIreach,&rdquo; &ldquo;AI Search Audit,&rdquo; &ldquo;LocalReach,&rdquo; and
                &ldquo;OutreachAI&rdquo; are registered or unregistered trademarks of GAM Solutions L.L.C-FZ. Any unauthorized use,
                reproduction, imitation, or association of these marks in connection with any product or service not
                affiliated with GAM Solutions L.L.C-FZ is strictly prohibited.
              </p>

              <h2 className="text-foreground text-2xl font-bold">3. Disclaimer of AI-Generated Insights</h2>
              <p className="leading-relaxed text-muted">
                All AI-generated insights, reports, and analytics provided through our platform are intended for general
                informational purposes only and do not constitute professional, legal, financial, or strategic advice.
                While GAM Solutions L.L.C-FZ endeavors to maintain the accuracy and reliability of its outputs, the Company
                makes no representations or warranties—express or implied—regarding the completeness, accuracy, or fitness
                for a particular purpose of any information provided. Users assume full responsibility for decisions made
                based on such information.
              </p>

              <h2 className="text-foreground text-2xl font-bold">4. Limitation of Liability</h2>
              <p className="leading-relaxed text-muted">
                To the fullest extent permitted by applicable law, GAM Solutions L.L.C-FZ, its directors, officers,
                employees, contractors, or partners shall not be liable for any direct, indirect, incidental, consequential,
                special, or punitive damages arising from or in connection with the use of, or inability to use, our platform
                or services. This includes, without limitation, loss of profits, loss of business, loss of data, or any
                adverse outcomes resulting from investment, operational, or strategic decisions made in reliance upon our
                platform or content. The Company reserves the right to modify, suspend, or discontinue any part of its
                services at any time without prior notice.
              </p>

              <h2 className="text-foreground text-2xl font-bold">5. Governing Law &amp; Jurisdiction</h2>
              <p className="leading-relaxed text-muted">
                These Terms and Conditions shall be governed by and construed in accordance with the laws of the United
                Arab Emirates, including applicable regulations governing free zone companies. Any disputes arising out of
                or in connection with these Terms shall be subject to the exclusive jurisdiction of the competent courts of
                the United Arab Emirates. The Company&apos;s registered place of business is within the Meydan Free Zone, Dubai,
                UAE.
              </p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
