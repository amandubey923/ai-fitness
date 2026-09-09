"use client";

import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2 } from "lucide-react";

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 sm:py-10 max-w-4xl space-y-6">
      {/* HEADER */}
      <div className="relative backdrop-blur-sm border border-border bg-card/60 rounded-xl p-5 sm:p-7">
        <CornerElements />

        <div className="flex items-center gap-2 mb-2.5">
          <div className="p-1.5 rounded bg-primary/10 border border-primary/30">
            <FitPilotLogo size={18} />
          </div>
          <span className="font-mono text-xs font-semibold text-primary uppercase tracking-wider">
            LEGAL PROTOCOL // TERMS OF SERVICE
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 font-mono">
          Terms of <span className="text-primary">Service</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Effective Date: September 2026. By accessing or using FitPilot AI, you acknowledge that you have read, understood, and agree to these terms.
        </p>
      </div>

      {/* HEALTH DISCLAIMER ALERT */}
      <div className="relative backdrop-blur-sm border border-amber-500/30 bg-amber-500/5 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="size-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h3 className="font-mono text-xs font-bold text-amber-500 uppercase">
            Mandatory Physical Health Disclaimer
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FitPilot AI generates algorithmic workout routines and nutritional suggestions for informational and personal fitness purposes only. 
            It is not a licensed medical provider and does not provide clinical diagnosis or therapeutic prescriptions. 
            Always consult a qualified healthcare physician prior to starting any rigorous physical conditioning or dietary changes.
          </p>
        </div>
      </div>

      {/* SECTIONS */}
      <div className="space-y-3.5">
        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            01 // ACCEPTANCE OF TERMS
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            By creating an account, accessing the application, or generating fitness plans via FitPilot AI, you enter into a binding agreement with the service. If you do not consent to these terms, you must discontinue use immediately.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            02 // SERVICE PURPOSE & AI-GENERATED CONTENT
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            FitPilot AI utilizes automated language models (Google Gemini and Groq Llama) to synthesize workout structures and macronutrient targets based on input data. Outputs are generated probabilistically and should be executed with sound judgment. You retain full responsibility for choosing weights, technique, and exertion levels safely.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            03 // USER ACCOUNT RESPONSIBILITIES
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Authentication is managed via Clerk. You agree to provide accurate biometric measurements (age, weight, height, limitations) to ensure safe output calculations. You are responsible for preserving credentials and notifying us of any suspected unauthorized access.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            04 // ACCEPTABLE USE POLICY
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You agree not to reverse engineer, scrape, overload, or bypass API security controls. Automated bot generation or intentional injection of malicious prompts into the assistant or backend actions is strictly prohibited.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            05 // LIMITATION OF LIABILITY
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            To the maximum extent permitted by applicable law, FitPilot AI and its creators shall not be liable for any direct, indirect, incidental, or consequential injuries or damages arising from physical exercise, dietary adoption, or inability to access the service.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            06 // INTELLECTUAL PROPERTY & UPDATES
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            The FitPilot AI brand, design system, custom logos, and code implementations remain the intellectual property of the project creators. We reserve the right to modify these terms as platform functionality evolves.
          </p>
        </div>
      </div>
    </div>
  );
}
