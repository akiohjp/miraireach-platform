"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function PrivacyClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              Our commitment to your data protection.
            </p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="space-y-6">
              <p>
                mirAIreach NEWS is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you use our platform and services.
              </p>
              
              <h2 className="text-2xl font-bold text-white">Information We Collect</h2>
              <p>
                We may collect personal information such as your name, email address, and company details when you interact with our contact forms or subscribe to our insights.
              </p>

              <h2 className="text-2xl font-bold text-white">How We Use Your Information</h2>
              <p>
                Your data is used to provide requested services, personalize your experience, and send updates regarding the UAE's AI business landscape. We do not sell your personal data to third parties.
              </p>

              <h2 className="text-2xl font-bold text-white">Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information from unauthorized access, alteration, or disclosure.
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
