"use client";

import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function TermsClient() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10">
        <Header showNav={true} />
        
        <main className="mt-16 max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-black tracking-tighter md:text-6xl uppercase">
              Terms of Service
            </h1>
            <p className="text-xl text-muted leading-relaxed">
              Standard operating procedures for our platform.
            </p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <section className="space-y-6">
              <p>
                By accessing and using mirAIreach NEWS, you agree to comply with and be bound by the following terms and conditions. Please read them carefully.
              </p>
              
              <h2 className="text-2xl font-bold text-white">Intellectual Property</h2>
              <p>
                All materials published on mirAIreach NEWS, including articles, reports, and graphics, are the intellectual property of the platform or its partners. Content may not be reproduced without prior written permission.
              </p>

              <h2 className="text-2xl font-bold text-white">Trademarks</h2>
              <p>
                'mirAIreach' and 'AI Search Audit' are protected trademarks. Any unauthorized use of these marks or associated logos is strictly prohibited.
              </p>

              <h2 className="text-2xl font-bold text-white">Disclaimer of Insights</h2>
              <p>
                The AI-generated insights, reports, and analytics on mirAIreach NEWS are provided for informational purposes only. We strive for accuracy but do not guarantee the completeness or correctness of the data provided.
              </p>
              <p>
                mirAIreach NEWS shall not be held liable for any business losses or investment decisions made based on information available on the platform.
              </p>
            </section>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
