"use client";

import { useState } from "react";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import { Button } from "@/components/ui/button";
import {
  MailIcon,
  SendIcon,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ClockIcon,
  Code2,
  Sparkles,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Support");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to send message. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("[Contact Form] Submit error:", err);
      setError(err?.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setMessage("");
    setIsSubmitted(false);
    setError(null);
  };

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
            COMMUNICATION CHANNEL // INQUIRIES
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2 font-mono">
          Contact <span className="text-primary">FitPilot Support</span>
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-2xl">
          Have questions about plan generation, feedback on the AI assistant, or technical issues? 
          Submit your message below and our team will follow up directly at your email.
        </p>
      </div>

      {/* QUICK CHANNELS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4">
          <CornerElements />
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-1">
            <MailIcon className="size-4" />
            <span>DIRECT INQUIRY</span>
          </div>
          <p className="text-xs font-semibold text-foreground">support@fitpilot.ai</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Direct technical inquiries</p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4">
          <CornerElements />
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-1">
            <ClockIcon className="size-4" />
            <span>RESPONSE WINDOW</span>
          </div>
          <p className="text-xs font-semibold text-foreground">24 to 48 Hours</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Standard inquiry turnaround</p>
        </div>

        <div className="relative backdrop-blur-sm border border-border bg-card/40 rounded-lg p-4">
          <CornerElements />
          <div className="flex items-center gap-2 text-primary font-mono text-xs mb-1">
            <Code2 className="size-4" />
            <span>PROJECT REPO</span>
          </div>
          <p className="text-xs font-semibold text-foreground truncate">github.com/amandubey923</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">Issues & feature feedback</p>
        </div>
      </div>

      {/* CONTACT FORM */}
      <div className="relative backdrop-blur-sm border border-border bg-card/50 rounded-xl p-5 sm:p-7">
        <CornerElements />

        <div className="flex items-center justify-between mb-4 pb-2 border-b border-border/70">
          <h2 className="text-sm sm:text-base font-bold font-mono text-foreground flex items-center gap-2">
            <MessageSquare className="size-4 text-primary" />
            <span>DISPATCH INQUIRY FORM</span>
          </h2>
          <span className="text-[11px] font-mono text-muted-foreground">ENCRYPTED // DIRECT</span>
        </div>

        {isSubmitted ? (
          <div className="p-6 text-center space-y-3 animate-in fade-in duration-200">
            <div className="size-10 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto text-green-500">
              <CheckCircle2 className="size-6" />
            </div>
            <h3 className="font-mono text-base font-bold text-foreground">
              Inquiry Dispatched Successfully
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mx-auto">
              Thank you, <span className="text-foreground font-semibold">{name}</span>. We have logged your request under topic <span className="text-primary font-mono">[{subject}]</span> and will reply to <span className="text-foreground font-semibold">{email}</span>.
            </p>
            <div className="pt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="h-8 px-4 text-xs font-mono border-primary/40 text-primary hover:bg-primary/10"
              >
                Send Another Message
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-2.5 rounded bg-destructive/10 border border-destructive/30 text-destructive text-xs font-mono">
                <AlertCircle className="size-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-muted-foreground uppercase">
                  Your Name <span className="text-primary">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Morgan"
                  disabled={isSubmitting}
                  className="w-full h-9 bg-background/50 border border-border rounded px-3 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-muted-foreground uppercase">
                  Email Address <span className="text-primary">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@example.com"
                  disabled={isSubmitting}
                  className="w-full h-9 bg-background/50 border border-border rounded px-3 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-muted-foreground uppercase">
                Inquiry Topic
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={isSubmitting}
                className="w-full h-9 bg-background/50 border border-border rounded px-3 text-xs text-foreground focus:outline-none focus:border-primary transition-colors"
              >
                <option value="General Support">General Support & Guidance</option>
                <option value="Plan Generation Help">Plan Generation Issue</option>
                <option value="AI Assistant Feedback">AI Assistant / Voice Feedback</option>
                <option value="Bug Report">Technical Bug Report</option>
                <option value="Feature Request">Feature Request</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-mono text-muted-foreground uppercase">
                Message <span className="text-primary">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Describe your question, issue, or feedback in detail..."
                disabled={isSubmitting}
                className="w-full bg-background/50 border border-border rounded p-3 text-xs text-foreground focus:outline-none focus:border-primary placeholder:text-muted-foreground resize-none transition-colors"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-9 px-5 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90 font-semibold"
              >
                {isSubmitting ? (
                  <>Transmitting...</>
                ) : (
                  <>
                    <SendIcon className="size-3.5 mr-1.5" />
                    Submit Message
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
