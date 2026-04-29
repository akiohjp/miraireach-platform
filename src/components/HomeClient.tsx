"use client";

import React from "react";
import Link from "next/link";
import Header from "./Header";
import { ArrowRight, MapPin, Zap, Shield, MessageCircle, RefreshCw, Layout, Search, Play } from "lucide-react";

export default function HomeClient() {
  return (
    <div className="mx-auto w-full bg-white selection:bg-primary/10">
      <div className="mx-auto max-w-7xl px-6 py-8 md:px-12">
        <Header showNav={true} />
        
        {/* SECTION 1: HERO (GAM solutions L.L.C-FZ) with Video Background */}
        <main className="relative mt-4 overflow-hidden rounded-[2.5rem] bg-black">
          {/* Video Background Placeholder */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <video 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="h-full w-full object-cover opacity-60"
              poster="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop"
            >
              <source src="/assets/hero-video.mp4" type="video/mp4" />
              {/* Fallback image is used via the poster attribute */}
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
          </div>

          <div className="relative z-10 flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center space-y-10">
            <div className="animate-fade-in inline-flex items-center gap-3 rounded-full bg-white/10 backdrop-blur-md px-5 py-2 text-[10px] font-black uppercase tracking-[0.3em] text-white border border-white/20">
              GAM solutions L.L.C-FZ
            </div>
            
            <div className="max-w-4xl space-y-6">
              <h1 className="animate-slide-up text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05]">
                Solving Complexity <br className="hidden md:block" />
                With <span className="text-primary italic">Intelligent</span> Systems.
              </h1>
              <p className="animate-slide-up-delayed mx-auto max-w-2xl text-base md:text-xl text-white/80 leading-relaxed font-medium">
                We empower enterprise and local businesses in Dubai with the infrastructure of tomorrow. From AI-driven acquisition to full digital transformation.
              </p>
            </div>

            <div className="animate-slide-up-delayed pt-4 flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
              <Link 
                href="/contact" 
                className="group relative inline-flex items-center justify-center px-12 py-5 overflow-hidden font-black transition-all bg-white rounded-full hover:bg-primary w-full sm:w-auto shadow-2xl shadow-white/5"
              >
                <span className="relative text-[10px] sm:text-xs uppercase tracking-[0.3em] text-black group-hover:text-white transition-colors">
                  Strategic Consultation
                </span>
              </Link>
              <Link 
                href="/about" 
                className="flex items-center gap-3 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-white/60 hover:text-white transition-colors group"
              >
                View Corporate Profile
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* SECTION 2: CORE SERVICE (mirAIreach) */}
      <section id="mirai-reach" className="w-full py-32 bg-[#fafafa] border-t border-line/5">
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="space-y-20">
            
            <div className="grid md:grid-cols-2 gap-12 items-end">
              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">The Acquisition Engine</p>
                <h2 className="text-4xl md:text-5xl font-black tracking-tighter leading-[1.1]">
                  Introducing <span className="text-foreground">mirAIreach</span>.
                </h2>
              </div>
              <p className="text-base text-muted/80 leading-relaxed font-medium">
                mirAIreach is our proprietary system designed to liberate Dubai businesses from the escalating costs of traditional Google Ads. We optimize your brand for the generative era, ensuring you are the definitive recommendation across ChatGPT, Perplexity, and AI Overviews.
              </p>
            </div>

            <div className="grid gap-px md:grid-cols-2 border border-line/10 rounded-3xl overflow-hidden bg-white shadow-sm">
              <div className="p-12 space-y-4 border-b border-r border-line/10 hover:bg-primary/[0.01] transition-colors group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform"><Zap size={28} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Instagram-to-Everywhere</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Update your global digital footprint instantly from a single social post. Automated sync across Google, TikTok, and Voice AI.</p>
              </div>

              <div className="p-12 space-y-4 border-b border-line/10 hover:bg-primary/[0.01] transition-colors group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform"><Shield size={28} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Enterprise Shield</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Lock down your business profiles across 50+ directories. Protect your reputation from unauthorized edits and spam.</p>
              </div>

              <div className="p-12 space-y-4 border-r border-line/10 hover:bg-primary/[0.01] transition-colors group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform"><MessageCircle size={28} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">AI Review Synthesis</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Respond to customers with AI-powered, empathetic, and context-aware replies that boost visibility and trust metrics.</p>
              </div>

              <div className="p-12 space-y-4 hover:bg-primary/[0.01] transition-colors group">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform"><RefreshCw size={28} strokeWidth={2.5} /></div>
                <h4 className="text-xl font-black tracking-tight">Global Visibility Sync</h4>
                <p className="text-sm text-muted/90 leading-relaxed">Real-time business data synchronization across Apple Maps, ChatGPT, and local UAE search directories.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: LEAD MAGNET / HOOK (New Section) */}
      <section className="w-full py-32 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 blur-[120px] -z-10" />
        
        <div className="mx-auto max-w-5xl px-6 md:px-12">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-20 backdrop-blur-xl relative">
            <div className="max-w-3xl space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Strategic Advantage</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                  Is your business <br className="hidden md:block" />
                  <span className="italic">AI-Ready?</span>
                </h2>
                <p className="text-lg text-white/60 leading-relaxed font-medium max-w-xl">
                  We offer a complimentary strategic audit to analyze how generative search engines perceive your brand in the Dubai market.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8">
                <Link 
                  href="/contact?service=aio-diagnostic"
                  className="flex items-center gap-4 bg-primary text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
                >
                  Request Free Audit
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <div className="flex -space-x-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="h-12 w-12 rounded-full border-2 border-black bg-muted/20 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i+10}`} alt="User" />
                    </div>
                  ))}
                  <div className="h-12 w-12 rounded-full border-2 border-black bg-primary flex items-center justify-center text-[10px] font-black">
                    +50
                  </div>
                </div>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Joined by leading <br /> Dubai brands</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: CORPORATE PROFILE */}
      <section className="w-full py-40 bg-[#0a0a0a] text-white overflow-hidden relative">
        {/* Subtle decorative elements for premium feel */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        
        <div className="mx-auto max-w-5xl px-6 md:px-12 relative z-10">
          <div className="grid md:grid-cols-2 gap-20 lg:gap-32 items-start">
            
            <div className="space-y-16">
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.5em] text-primary/80">Corporate Profile</p>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[1.05]">
                    GAM solutions <br /> 
                    <span className="text-primary/90 italic">L.L.C-FZ</span>
                  </h2>
                </div>
                <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
              </div>
              
              <p className="text-lg text-white/60 leading-loose font-light">
                GAM solutions L.L.C-FZ is a Dubai-based strategic consulting firm dedicated to redefining the digital landscape for local businesses. We go beyond simply introducing technology; we seamlessly integrate Artificial Intelligence into real-world operations. By bridging the gap between cutting-edge AI innovation—including advanced search optimization—and practical business execution, we drive tangible growth and operational excellence for highly competitive sectors like retail and gastronomy.
              </p>
              
              {/* Editorial Grid Design */}
              <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-white/10 mt-12">
                <div className="py-8 pr-8 border-b sm:border-b-0 sm:border-r border-white/10 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Headquarters</p>
                  <p className="text-sm font-medium leading-relaxed text-white/90">
                    Business Center 1, M Floor,<br />
                    The Meydan Hotel, Nad Al Sheba,<br />
                    Dubai, U.A.E.
                  </p>
                </div>
                <div className="py-8 sm:pl-8 space-y-3">
                  <p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30">Primary Focus</p>
                  <p className="text-sm font-medium leading-relaxed text-white/90">
                    Enterprise AI Integration<br />
                    AIO Search Strategy<br />
                    Digital Infrastructure
                  </p>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              {/* Glassmorphism Card */}
              <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-1000" />
              <div className="relative backdrop-blur-2xl bg-white/[0.03] p-10 md:p-14 rounded-[3rem] border border-white/10 space-y-12">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.4em] text-primary">Company Mission</h3>
                  <p className="text-xl md:text-2xl font-light leading-relaxed text-white/90">
                    "To empower brick-and-mortar businesses with enterprise-grade AI. Our mission is to democratize advanced digital infrastructure, turning a sophisticated online presence into measurable offline success and competitive supremacy."
                  </p>
                </div>
                
                <div className="space-y-8 pt-4">
                  <div className="flex items-center gap-5">
                    <div className="h-12 w-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-primary">
                      <MapPin size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Registered Zone</p>
                      <p className="text-sm font-bold text-white/80">Meydan Free Zone, Dubai</p>
                    </div>
                  </div>
                  
                  <Link 
                    href="/contact" 
                    className="group relative flex items-center justify-center w-full bg-white text-black py-6 rounded-full text-[10px] font-black uppercase tracking-[0.3em] overflow-hidden transition-all hover:bg-primary hover:text-white"
                  >
                    <span className="relative z-10">Start Direct Inquiry</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </Link>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Footer is handled globally in layout.tsx */}
    </div>
  );
}
