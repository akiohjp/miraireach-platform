"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";

export default function WebDesignOffer() {
  return (
    <section className="w-full py-10 bg-white border-t border-line/5 overflow-hidden">
      <div className="mx-auto max-w-5xl px-6 md:px-12">
        <div className="relative rounded-[2rem] bg-[#0a0a0a] p-8 md:p-10 overflow-hidden group">
          {/* Subtle UAE/Dubai Motif Background */}
          <div className="absolute inset-0 opacity-10 grayscale pointer-events-none">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          </div>

          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-block rounded bg-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-primary border border-primary/20">
                Limited Time Offer
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter leading-[1.1]">
                Claim Free Web <br />
                Design Offer
              </h2>
            </div>

            <div className="space-y-6">
              <p className="text-sm text-white/70 leading-relaxed font-medium">
                Apply now to claim your free premium website build. We help Dubai businesses transition to AI-ready infrastructure with zero upfront costs.
              </p>
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2">
                <Link 
                  href="/contact?service=free-design"
                  className="inline-flex items-center gap-3 rounded-full bg-primary px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-white hover:text-black"
                >
                  Apply Now
                  <ArrowRight size={14} />
                </Link>
                
                <div className="space-y-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">Contact Us:</p>
                  <a 
                    href="mailto:info.ae@miraireach.marketing"
                    className="text-xs font-bold text-white/80 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <Mail size={12} />
                    info.ae@miraireach.marketing
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
