import Link from "next/link";
import { Button } from "@/components/ui/button";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import {
  HomeIcon,
  Sparkles,
  UserIcon,
  Compass,
  ArrowLeft,
  Terminal,
} from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center py-10 px-4">
      <div className="relative w-full max-w-xl backdrop-blur-md border border-border bg-card/70 rounded-xl p-6 sm:p-8 shadow-xl overflow-hidden text-center">
        <CornerElements />

        {/* Status Header Bar */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-border/70 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
            <span className="text-destructive font-semibold">SIGNAL_LOST</span>
          </div>
          <span className="text-muted-foreground">HTTP_STATUS // 404</span>
        </div>

        {/* Cyber 404 Badge */}
        <div className="inline-flex items-center justify-center p-3 mb-4 rounded-xl bg-primary/10 border border-primary/30">
          <FitPilotLogo size={36} />
        </div>

        <div className="space-y-2 mb-6">
          <h1 className="text-6xl sm:text-7xl font-extrabold font-mono tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-primary via-primary/80 to-primary/30">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground font-mono">
            SECTOR_NOT_FOUND
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            The navigational coordinates you entered do not match any active route in FitPilot AI. This protocol may have been moved or decommissioned.
          </p>
        </div>

        {/* Terminal diagnostic block */}
        <div className="mb-6 p-3 rounded-lg bg-background/80 border border-border/80 text-left font-mono text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1.5 text-primary text-[11px]">
            <Terminal className="size-3.5" />
            <span>DIAGNOSTIC_TRACE:</span>
          </div>
          <p className="text-[11px] text-muted-foreground/80 pl-5">
            ERR_ROUTE_UNDEFINED: Target path unresolved by FitPilot Router.
          </p>
          <p className="text-[11px] text-primary/80 pl-5">
            &gt; RECOMMENDATION: Return to safe operating sector.
          </p>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            size="sm"
            className="w-full sm:w-auto h-9 px-5 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-md shadow-primary/20"
          >
            <Link href="/" className="flex items-center justify-center">
              <HomeIcon className="size-3.5 mr-1.5" />
              Return to Base
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="sm"
            className="w-full sm:w-auto h-9 px-4 text-xs font-mono border-border hover:border-primary/50 text-foreground"
          >
            <Link href="/generate-program" className="flex items-center justify-center">
              <Sparkles className="size-3.5 mr-1.5 text-primary" />
              Generate Plan
            </Link>
          </Button>

          <Button
            asChild
            variant="ghost"
            size="sm"
            className="w-full sm:w-auto h-9 px-4 text-xs font-mono text-muted-foreground hover:text-foreground"
          >
            <Link href="/profile" className="flex items-center justify-center">
              <UserIcon className="size-3.5 mr-1.5" />
              My Profile
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
