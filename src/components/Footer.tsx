import Link from "next/link";
import FitPilotLogo from "./FitPilotLogo";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-background/80 backdrop-blur-sm">
      {/* Top border glow */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-primary/30 to-transparent"></div>

      <div className="container mx-auto px-4 sm:px-6 py-5 sm:py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-md transition-colors group-hover:border-primary/50">
                <FitPilotLogo size={18} />
              </div>
              <span className="text-lg font-bold font-mono tracking-tight text-foreground">
                FitPilot <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()} FitPilot AI - All rights reserved
            </p>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 sm:gap-x-12 gap-y-2 text-xs font-mono">
            <Link
              href="/about"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/terms"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/help"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              Help
            </Link>
          </div>

          {/* Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 border border-border rounded-md bg-background/50">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-xs font-mono text-muted-foreground tracking-wider">
              SYSTEM OPERATIONAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
