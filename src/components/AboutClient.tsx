"use client";

import React from "react";
import Header from "./Header";
import {
  GAM_ABOUT_TAGLINE,
  GAM_MISSION_PARAGRAPHS,
  GAM_VISION_2026,
} from "@/content/gamAboutCopy";

export default function AboutClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} theme="light" />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              About GAM solutions L.L.C-FZ
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              {GAM_ABOUT_TAGLINE}
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Our Mission
              </h2>
              {GAM_MISSION_PARAGRAPHS.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
            </section>

            <hr className="border-line" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Who We Are
              </h2>
              <p>
                GAM solutions L.L.C-FZ is an AI-driven marketing innovator operating on a collaborative business model between the UAE and Japan. We are a team of technologists and strategists who believe in solving market challenges through sustainable systems rather than short-term tactics. We make decisions based on hard data and are fiercely dedicated to supporting the long-term survival and prosperity of local businesses.
              </p>
              <div className="grid md:grid-cols-2 gap-8 mt-8">
                <div className="p-6 bg-muted/5 rounded-2xl border border-line">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    AI-Optimized Infrastructure
                  </h3>
                  <p className="text-sm text-muted">
                    We provide a structural foundation that organizes your digital presence. We take your everyday content—like posts and reviews—and structure it so it is easily understood, evaluated, and prioritized by modern AI systems.
                  </p>
                </div>
                <div className="p-6 bg-muted/5 rounded-2xl border border-line">
                  <h3 className="text-xl font-bold text-primary mb-3">
                    mirAIreach Ecosystem
                  </h3>
                  <p className="text-sm text-muted">
                    Our execution-ready platform bridges the gap between daily operations and comprehensive search optimization. We seamlessly automate the flow of your localized information directly to Google Maps, AI Search, and Voice Search.
                  </p>
                </div>
              </div>
            </section>

            <hr className="border-line" />

            <section className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Our Vision for 2026
              </h2>
              <p>{GAM_VISION_2026}</p>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
