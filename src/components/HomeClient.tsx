"use client";

import React from "react";
import Link from "next/link";
import Header from "./Header";
import { ArrowRight, MapPin, Zap, Shield, MessageCircle, RefreshCw, Layout, Search } from "lucide-react";

export default function HomeClient() {
  return (
    <div className="mx-auto w-full bg-white selection:bg-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <Header showNav={true} />
        
        {/* SECTION 1: HERO (GAM solutions L.L.C-FZ) */}
        <main className="mt-12 md:mt-24 pb-24 border-b border-line/10">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center gap-3 rounded-full bg-primary/10 px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
              GAM solutions L.L.C-FZ
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
              Shaping Dubai's Future with <br className="hidden md:block" />
              <span className="text-primary">Intelligent Business Infrastructure.</span>
            </h1>
            <p className="text-base md:text-xl text-muted/90 leading-relaxed font-medium max-w-2xl mx-auto">
              We empower F&B, Real Estate, and enterprise businesses in the UAE with cutting-edge AI integration, digital transformation, and generative optimization strategies.
            </p>
            <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link 
                href="/contact" 
                className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-black transition-all bg-black rounded-full hover:bg-primary w-full sm:w-auto"
              >
                <span className="relative text-[10px] sm:text-xs uppercase tracking-[0.3em] text-white transition-colors">
                  Consult With Us Today
                </span>
              </Link>
              <Link 
                href="/about" 
                className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-muted hover:text-primary transition-colors underline underline-offset-8"
              >
                Our Corporate Vision
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* SECTION 2: CORE SERVICE (mirAIreach) */}
      <section className="w-full py-24 bg-[#fafafa] border-t border-line/5">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="space-y-16">
            
            <div className="space-y-6 text-center max-w-3xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Our Core System</p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter leading-[1.1]">
                Introducing <span className="text-foreground font-black">mirAIreach</span>. <br />
                The AI-Powered Acquisition Engine.
              </h2>
              <p className="text-sm md:text-base text-muted/90 leading-relaxed font-medium">
                mirAIreach is our proprietary system designed to liberate local businesses from the escalating costs of traditional Google Ads. We optimize your brand for Generative AI search (GEO), ensuring you are the definitive recommendation across ChatGPT, Perplexity, and AI Overviews.
              </p>
            </div>

            <div className="grid gap-px md:grid-cols-2 border border-line/10 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="p-10 space-y-4 border-b border-r border-line/10">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"><Zap size={24} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Instagram-to-Everywhere</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Post once on Instagram to update Google, TikTok, Threads, and Voice Assistants instantly, keeping AI models fed with your latest data.</p>
              </div>

              <div className="p-10 space-y-4 border-b border-line/10">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"><Shield size={24} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Secure Google Management</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Centralized control for multiple locations. Lock down your profiles against unauthorized edits and competitor spam.</p>
              </div>

              <div className="p-10 space-y-4 border-r border-line/10">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"><MessageCircle size={24} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">AI Review Engine</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Automated, empathetic, and SEO-rich replies to customer reviews to boost your visibility and trust algorithmically.</p>
              </div>

              <div className="p-10 space-y-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6"><RefreshCw size={24} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Global Citation Sync</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Instant business data synchronization across 57+ platforms including Apple Maps, ensuring AI accuracy.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: LEAD MAGNET / HOOK */}
      <section className="w-full py-24 bg-white border-t border-line/5">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="space-y-12">
            <div className="text-center space-y-4 max-w-2xl mx-auto">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">
                Experience The Value Risk-Free
              </p>
              <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
                Start your transformation today.
              </h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="group bg-[#fafafa] rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="space-y-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Search size={24} /></div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black leading-tight">Free AI Search Audit</h3>
                    <p className="text-sm leading-relaxed text-muted/90 font-medium">
                      Discover exactly how generative AI systems like ChatGPT perceive and recommend your brand to potential customers in Dubai.
                    </p>
                  </div>
                  <Link href="/contact?service=aio-diagnostic" className="inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                    <span>Request Audit</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>

              <div className="group bg-[#fafafa] rounded-3xl p-10 border border-line/10 shadow-sm transition hover:shadow-xl hover:-translate-y-1 duration-500">
                <div className="space-y-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><Layout size={24} /></div>
                  <div className="space-y-4">
                    <h3 className="text-2xl font-black leading-tight">Free Premium Web Design</h3>
                    <p className="text-sm leading-relaxed text-muted/90 font-medium">
                      Need a modern, high-converting landing page? Let our experts build you a premium foundation for your digital presence at zero cost.
                    </p>
                  </div>
                  <Link href="/contact?service=free-design" className="inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-colors">
                    <span>Claim Offer</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORPORATE PROFILE */}
      <section className="w-full py-24 bg-black text-white border-t border-white/10">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Corporate Profile</p>
                <h2 className="text-3xl md:text-5xl font-black tracking-tighter">
                  GAM solutions <br /> L.L.C-FZ
                </h2>
              </div>
              <p className="text-sm text-white/70 leading-relaxed max-w-md">
                Registered and operating in the United Arab Emirates. We are dedicated to providing enterprise-grade AI infrastructure and digital marketing solutions to forward-thinking businesses.
              </p>
              
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-4">
                  <div className="mt-1 text-primary"><MapPin size={16} /></div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Headquarters</p>
                    <p className="text-sm font-medium">Business Center 1, M Floor, <br /> The Meydan Hotel, Nad Al Sheba, <br /> Dubai, U.A.E.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/5 p-10 rounded-3xl border border-white/10 space-y-8 backdrop-blur-sm">
              <h3 className="text-xl font-black">Direct Inquiry</h3>
              <p className="text-sm text-white/60">
                Whether you need a full system integration or strategic consultation, our executive team is ready to assist you.
              </p>
              <div className="space-y-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-1">Email</p>
                  <a href="mailto:info.ae@miraireach.marketing" className="text-sm md:text-base font-bold text-white hover:text-primary transition-colors">
                    info.ae@miraireach.marketing
                  </a>
                </div>
                <Link 
                  href="/contact" 
                  className="block w-full text-center bg-white text-black py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
                >
                  Contact Form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
