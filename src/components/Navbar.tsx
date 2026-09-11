"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { DumbbellIcon, HomeIcon, UserIcon, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import FitPilotLogo from "./FitPilotLogo";

const Navbar = () => {
  const { isSignedIn } = useUser();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border py-2.5">
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* BRAND LOGO */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="p-1.5 bg-primary/10 border border-primary/20 rounded-md transition-colors group-hover:border-primary/50">
            <FitPilotLogo size={20} />
          </div>
          <span className="text-lg sm:text-xl font-bold font-mono tracking-tight text-foreground">
            FitPilot <span className="text-primary">AI</span>
          </span>
        </Link>

        {/* NAVIGATION */}
        <nav className="flex items-center gap-3 sm:gap-5">
          {isSignedIn ? (
            <>
              <Link
                href="/"
                className="hidden sm:flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <HomeIcon size={15} />
                <span>Home</span>
              </Link>

              <Link
                href="/generate-program"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <DumbbellIcon size={15} />
                <span>Generate</span>
              </Link>

              <Link
                href="/profile"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <UserIcon size={15} />
                <span>Profile</span>
              </Link>

              <Link
                href="/progress"
                className="flex items-center gap-1.5 text-xs sm:text-sm font-mono text-muted-foreground hover:text-primary transition-colors"
              >
                <Activity size={15} />
                <span>Progress</span>
              </Link>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8.5 px-3 text-xs font-mono border-primary/50 text-primary hover:text-white hover:bg-primary/10"
              >
                <Link href="/generate-program">Get Started</Link>
              </Button>

              <div className="flex items-center pl-1">
                <UserButton />
              </div>
            </>
          ) : (
            <>
              <SignInButton>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8.5 px-3.5 text-xs font-mono border-primary/50 text-primary hover:text-white hover:bg-primary/10"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton>
                <Button
                  size="sm"
                  className="h-8.5 px-4 text-xs font-mono bg-primary text-primary-foreground hover:bg-primary/90 font-medium"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
