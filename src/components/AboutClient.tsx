"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              About mirAIreach NEWS
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              Bridging the gap between AI intelligence and business excellence in Dubai.
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Our Mission
              </h2>
              <p>
                At mirAIreach NEWS, our mission is to empower businesses in Dubai and the UAE to navigate the rapidly evolving digital landscape. We combine cutting-edge AI technologies with deep local market insights to drive growth, innovation, and visibility.
              </p>
              <p>
                We believe the future belongs to those who can harness the power of AI to transform traditional operations in sectors like F&B, Real Estate, and Deep Tech into intelligent, sustainable business models.
              </p>
            </section>

            <hr className="border-line" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Who We Are
              </h2>
              <p>
                mirAIreach NEWS is a premium business intelligence platform based in Dubai. We are a team of technologists, strategists, and creatives dedicated to providing high-quality content and actionable solutions.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 bg-muted/5 rounded-2xl border border-line">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    Intelligence Platform
                  </h3>
                  <p className="text-sm text-muted">
                    We provide deep analytics and exclusive reports on AI trends and their impact on the local GCC economy.
                  </p>
                </div>
                <div className="p-6 bg-muted/5 rounded-2xl border border-line">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    AIO Solutions
                  </h3>
                  <p className="text-sm text-muted">
                    Through our AI Search Audit service, we help brands optimize their visibility in generative search engines like ChatGPT and Gemini.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-line" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Our Vision for 2026
              </h2>
              <p>
                By 2026, we aim to be the Middle East's primary trusted source for businesses seeking to integrate AI into their core strategies. We don't just report the news; we shape the future.
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
