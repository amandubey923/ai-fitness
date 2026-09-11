import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { ShieldCheck, Lock, Database, EyeOff } from "lucide-react";

export default function PrivacyPage() {
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
            SECURITY PROTOCOL // DATA PRIVACY
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 font-mono">
          Privacy <span className="text-primary">Policy</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Last Updated: September 2026. This policy describes truthfully and transparently what information FitPilot AI collects, how it is processed by our AI models, and where your data resides.
        </p>
      </div>

      {/* THREE PILLARS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-lg border border-border bg-card/40 space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-bold">
            <Lock className="size-3.5" />
            <span>NO DATA SELLING</span>
          </div>
          <p className="text-xs text-muted-foreground">
            We never monetize, broker, or sell your health metrics or personal email to advertisers.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/40 space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-bold">
            <Database className="size-3.5" />
            <span>CONVEX STORAGE</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Plans are stored in Convex Cloud securely partitioned by your unique Clerk user ID.
          </p>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card/40 space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-xs font-mono font-bold">
            <EyeOff className="size-3.5" />
            <span>LOCAL PRIVACY</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Daily workout checklist states are kept client-side inside your browser’s localStorage.
          </p>
        </div>
      </div>

      {/* DETAILED SECTIONS */}
      <div className="space-y-3.5">
        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            01 // INFORMATION WE COLLECT
          </h2>
          <ul className="space-y-1.5 text-xs text-muted-foreground">
            <li>• <strong>Account Identity:</strong> Your name, email, and avatar image managed securely through Clerk Authentication.</li>
            <li>• <strong>Fitness Parameters:</strong> Age, height, weight, workout frequency, goal (e.g. Muscle Gain), intensity level, dietary preferences, and limitation notes provided during generation.</li>
          </ul>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            02 // HOW AI PROCESSING OPERATES
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            When you generate or modify a plan, your parameters are transmitted to AI completion endpoints (Google Gemini and Groq Llama 3.3). These APIs process the prompt strictly to generate JSON workout and diet plans. Your data is not used by FitPilot AI for public training callouts.
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            03 // THIRD-PARTY INFRASTRUCTURE
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed mb-2">
            FitPilot AI integrates verified cloud infrastructure partners to operate:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono text-muted-foreground">
            <span className="p-2 rounded bg-background/50 border border-border">Clerk — Identity & Session Authentication</span>
            <span className="p-2 rounded bg-background/50 border border-border">Convex — Real-Time Database Storage</span>
            <span className="p-2 rounded bg-background/50 border border-border">Google Gemini & Groq — AI Inference</span>
            <span className="p-2 rounded bg-background/50 border border-border">Vercel — Application Hosting</span>
          </div>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            04 // COOKIES & CLIENT STORAGE
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            We use strictly functional cookies provided by Clerk to maintain active sessions. We do not deploy third-party advertising trackers. Your workout completion checkmarks are stored locally in your browser storage (`fitpilot_completed_*`).
          </p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4 sm:p-5">
          <CornerElements />
          <h2 className="font-mono text-sm font-bold text-foreground mb-1.5 text-primary">
            05 // YOUR DATA RIGHTS & INQUIRIES
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            You maintain full control over your data. You may generate new active plans, switch active plans, or request full account deletion by contacting our team via the Contact page or emailing <span className="text-foreground font-mono">support@fitpilot.ai</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
