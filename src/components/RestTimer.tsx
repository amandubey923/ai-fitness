"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Timer, Volume2, VolumeX, X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RestTimerProps {
  initialSeconds?: number;
  onClose?: () => void;
  inline?: boolean;
}

export default function RestTimer({
  initialSeconds = 60,
  onClose,
  inline = false,
}: RestTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMinimized, setIsMinimized] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Play audio alert on completion using Web Audio API
  const playBeep = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);

      setTimeout(() => {
        try {
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = "sine";
          osc2.frequency.setValueAtTime(1174.66, ctx.currentTime);
          gain2.gain.setValueAtTime(0.3, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime);
          osc2.stop(ctx.currentTime + 0.4);
        } catch {}
      }, 250);
    } catch (e) {
      console.warn("Web Audio alert suppressed:", e);
    }
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            playBeep();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, soundEnabled]);

  const handleStart = () => {
    if (timeLeft === 0) setTimeLeft(totalSeconds);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = (newSecs?: number) => {
    const target = newSecs ?? totalSeconds;
    setIsRunning(false);
    setTimeLeft(target);
    if (newSecs) setTotalSeconds(target);
  };

  const adjustTime = (delta: number) => {
    setTimeLeft((prev) => {
      const next = Math.max(5, prev + delta);
      setTotalSeconds(next);
      return next;
    });
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  if (isMinimized && !inline) {
    return (
      <div className="fixed bottom-5 right-5 z-40 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all font-mono ${
            timeLeft === 0
              ? "bg-green-500/20 border-green-500 text-green-400 animate-pulse"
              : isRunning
              ? "bg-primary/15 border-primary text-primary shadow-primary/20"
              : "bg-card/90 border-border text-foreground hover:border-primary/50"
          }`}
        >
          <Timer className="size-4" />
          <span className="text-sm font-bold tracking-wider">{formatTime(timeLeft)}</span>
          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
            {isRunning ? "RESTING" : timeLeft === 0 ? "DONE" : "PAUSED"}
          </span>
        </button>
      </div>
    );
  }

  const containerClasses = inline
    ? "relative border border-primary/30 bg-background/60 backdrop-blur-sm rounded-lg p-3.5 space-y-3"
    : "fixed bottom-5 right-5 z-40 w-80 max-w-[calc(100vw-2rem)] border border-primary/40 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-2xl shadow-primary/10 space-y-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200";

  return (
    <div className={containerClasses}>
      {/* HEADER */}
      <div className="flex items-center justify-between pb-2 border-b border-border/70">
        <div className="flex items-center gap-2">
          <Timer className="size-4 text-primary" />
          <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
            REST & INTERVAL TIMER
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title={soundEnabled ? "Mute audio beep" : "Enable audio beep"}
          >
            {soundEnabled ? (
              <Volume2 className="size-3.5 text-primary" />
            ) : (
              <VolumeX className="size-3.5 text-muted-foreground/60" />
            )}
          </button>

          {!inline && (
            <button
              type="button"
              onClick={() => setIsMinimized(true)}
              className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs font-mono font-bold px-1.5"
              title="Minimize to floating pill"
            >
              _
            </button>
          )}

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              title="Close Timer"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* TIME DISPLAY & ADJUSTMENT */}
      <div className="flex items-center justify-between px-2">
        <button
          type="button"
          onClick={() => adjustTime(-10)}
          className="size-7 rounded bg-muted/40 hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Subtract 10s"
        >
          <Minus className="size-3.5" />
        </button>

        <div className="text-center space-y-0.5">
          <div
            className={`font-mono text-3xl sm:text-4xl font-black tracking-tight ${
              timeLeft === 0
                ? "text-green-400 animate-pulse"
                : isRunning
                ? "text-primary"
                : "text-foreground"
            }`}
          >
            {formatTime(timeLeft)}
          </div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
            {timeLeft === 0 ? "REST COMPLETE" : isRunning ? "COUNTDOWN ACTIVE" : "STANDBY"}
          </div>
        </div>

        <button
          type="button"
          onClick={() => adjustTime(10)}
          className="size-7 rounded bg-muted/40 hover:bg-muted border border-border flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
          title="Add 10s"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="w-full bg-muted/40 h-1.5 rounded-full overflow-hidden border border-border/50">
        <div
          className={`h-full transition-all duration-300 ${
            timeLeft === 0 ? "bg-green-500" : "bg-primary"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* PRESET BUTTONS */}
      <div className="grid grid-cols-4 gap-1.5 font-mono text-xs">
        {[30, 60, 90, 120].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleReset(preset)}
            className={`py-1 rounded border text-center transition-all ${
              totalSeconds === preset && !isRunning
                ? "bg-primary/20 border-primary text-primary font-bold"
                : "bg-background/40 border-border/70 hover:border-primary/50 text-muted-foreground hover:text-foreground"
            }`}
          >
            {preset}s
          </button>
        ))}
      </div>

      {/* CONTROLS */}
      <div className="flex items-center gap-2 pt-0.5">
        {isRunning ? (
          <Button
            type="button"
            size="sm"
            onClick={handlePause}
            className="grow h-8 text-xs font-mono font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30"
          >
            <Pause className="size-3.5 mr-1.5" /> Pause
          </Button>
        ) : (
          <Button
            type="button"
            size="sm"
            onClick={handleStart}
            className="grow h-8 text-xs font-mono font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Play className="size-3.5 mr-1.5 fill-current" /> {timeLeft === 0 ? "Restart" : "Start"}
          </Button>
        )}

        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => handleReset()}
          className="h-8 px-3 text-xs font-mono border-border hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Reset timer"
        >
          <RotateCcw className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
