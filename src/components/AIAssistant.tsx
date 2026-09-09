"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import CornerElements from "@/components/CornerElements";
import FitPilotLogo from "@/components/FitPilotLogo";
import {
  Mic,
  MicOff,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

export interface FormState {
  age: string;
  height: string;
  weight: string;
  injuries: string;
  workout_days: string;
  fitness_goal: string;
  fitness_level: string;
  dietary_restrictions: string;
}

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface AIAssistantProps {
  form: FormState;
  onUpdateForm: (updates: Partial<FormState>) => void;
  onSwitchToManual: () => void;
  isGenerating: boolean;
}

export default function AIAssistant({
  form,
  onUpdateForm,
  onSwitchToManual,
  isGenerating,
}: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hey! I'm FitPilot AI, your personal fitness coach. Tell me about yourself—your age, height, weight, how many days a week you want to train, your fitness goal, and any dietary restrictions or injuries.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceMuted, setVoiceMuted] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Auto-scroll chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, interimText, isLoading]);

  // Initialize Speech Recognition if supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setErrorMsg(null);
          setInterimText("");
        };

        recognition.onresult = (event: any) => {
          let currentInterim = "";
          let finalTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              currentInterim += event.results[i][0].transcript;
            }
          }

          if (currentInterim) {
            setInterimText(currentInterim);
          }

          if (finalTranscript) {
            setInterimText("");
            sendMessage(finalTranscript);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          setIsListening(false);
          setInterimText("");
          if (event.error === "not-allowed") {
            setErrorMsg("Microphone permission denied. You can still type below.");
          } else if (event.error !== "no-speech") {
            setErrorMsg(`Voice input: ${event.error}. You can also type below.`);
          }
        };

        recognition.onend = () => {
          setIsListening(false);
          setInterimText("");
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn("Speech recognition initialization failed:", err);
        setVoiceSupported(false);
      }
    } else {
      // Check for MediaRecorder support
      if (
        typeof navigator === "undefined" ||
        !navigator.mediaDevices?.getUserMedia
      ) {
        setVoiceSupported(false);
      }
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  // Text-to-speech for assistant replies
  const speakText = (text: string) => {
    if (voiceMuted || typeof window === "undefined" || !("speechSynthesis" in window)) {
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // ignore
    }
  };

  // Toggle voice listening
  const toggleListening = async () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const startListening = async () => {
    setErrorMsg(null);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        return;
      } catch (err) {
        console.warn("SpeechRecognition start failed:", err);
      }
    }

    // Fallback: MediaRecorder -> Groq Whisper
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        audioChunksRef.current = [];

        recorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        recorder.onstop = async () => {
          setIsListening(false);
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          if (audioBlob.size > 100) {
            await transcribeAudio(audioBlob);
          }
        };

        recorder.start();
        mediaRecorderRef.current = recorder;
        setIsListening(true);
      } catch (err: any) {
        console.error("Microphone access error:", err);
        setErrorMsg("Microphone permission denied. Please enable mic or type below.");
      }
    } else {
      setErrorMsg("Voice input is not supported in this browser. Please type below.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  };

  // Transcribe audio via Groq Whisper API
  const transcribeAudio = async (blob: Blob) => {
    setIsLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.webm");

      const res = await fetch("/api/groq/transcribe", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) throw new Error("Transcription failed");
      const data = await res.json();
      if (data.text?.trim()) {
        await sendMessage(data.text.trim());
      }
    } catch (err) {
      console.error("Transcribe error:", err);
      setErrorMsg("Could not transcribe audio. Please try again or type below.");
    } finally {
      setIsLoading(false);
    }
  };

  // Send message to Groq Chat for conversational extraction
  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: textToSend.trim() };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText("");
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/groq/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          currentForm: form,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Assistant service failed.");
      }

      const data = await res.json();
      const assistantReply = data.reply || "Got it!";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);

      speakText(assistantReply);

      // Populate extracted values into the shared form state
      if (data.extracted && typeof data.extracted === "object") {
        const updates: Partial<FormState> = {};
        const ext = data.extracted;

        if (ext.age && String(ext.age).trim()) {
          const a = parseInt(String(ext.age).replace(/\D/g, ""), 10);
          if (!isNaN(a) && a >= 10 && a <= 100) updates.age = String(a);
        }
        if (ext.height && String(ext.height).trim()) {
          updates.height = String(ext.height).trim();
        }
        if (ext.weight && String(ext.weight).trim()) {
          updates.weight = String(ext.weight).trim();
        }
        if (ext.workout_days) {
          const d = parseInt(String(ext.workout_days).replace(/\D/g, ""), 10);
          if (!isNaN(d) && d >= 1 && d <= 7) updates.workout_days = String(d);
        }
        if (ext.fitness_goal) {
          updates.fitness_goal = String(ext.fitness_goal).trim();
        }
        if (ext.fitness_level) {
          updates.fitness_level = String(ext.fitness_level).trim();
        }
        if (ext.dietary_restrictions) {
          updates.dietary_restrictions = String(ext.dietary_restrictions).trim();
        }
        if (ext.injuries !== undefined && ext.injuries !== null) {
          updates.injuries = String(ext.injuries).trim();
        }

        if (Object.keys(updates).length > 0) {
          onUpdateForm(updates);
        }
      }
    } catch (err: any) {
      console.error("AI Assistant error:", err);
      setErrorMsg(err.message || "Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
    }
  };

  // Required fields completion tracker
  const completedFieldsCount = [
    form.age,
    form.height,
    form.weight,
    form.workout_days,
    form.fitness_goal,
    form.fitness_level,
    form.dietary_restrictions,
  ].filter(Boolean).length;

  const isFormComplete = completedFieldsCount >= 7;

  return (
    <Card className="bg-card/90 backdrop-blur-sm border border-border overflow-hidden relative mb-6">
      <CornerElements />

      {/* Card Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-background/40">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isListening
                ? "bg-red-500 animate-ping"
                : isLoading
                  ? "bg-primary animate-pulse"
                  : "bg-green-500"
            }`}
          />
          <span className="text-xs font-mono text-primary flex items-center gap-1.5">
            <FitPilotLogo size={14} />
            FITPILOT_AI_ASSISTANT
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Mute TTS button */}
          <button
            type="button"
            onClick={() => setVoiceMuted((prev) => !prev)}
            title={voiceMuted ? "Unmute voice" : "Mute voice"}
            className="text-muted-foreground hover:text-foreground text-xs p-1 transition-colors"
          >
            {voiceMuted ? (
              <VolumeX className="w-3.5 h-3.5" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-primary" />
            )}
          </button>

          <span className="text-xs font-mono text-muted-foreground">
            {completedFieldsCount}/7 Fields
          </span>
        </div>
      </div>

      {/* Live Extracted Fields Bar */}
      <div className="px-5 py-2.5 bg-muted/30 border-b border-border text-xs font-mono flex flex-wrap gap-2 items-center">
        <span className="text-muted-foreground text-[11px] uppercase tracking-wider">
          Profile:
        </span>
        {form.age ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            Age: {form.age}
          </span>
        ) : null}
        {form.height ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            H: {form.height}
          </span>
        ) : null}
        {form.weight ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            W: {form.weight}
          </span>
        ) : null}
        {form.workout_days ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            Days: {form.workout_days}/wk
          </span>
        ) : null}
        {form.fitness_goal ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            Goal: {form.fitness_goal}
          </span>
        ) : null}
        {form.fitness_level ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            Lvl: {form.fitness_level}
          </span>
        ) : null}
        {form.dietary_restrictions ? (
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">
            Diet: {form.dietary_restrictions}
          </span>
        ) : null}
        {form.injuries && form.injuries !== "none" ? (
          <span className="px-2 py-0.5 rounded bg-secondary/20 text-secondary-foreground border border-secondary/40">
            Injuries: {form.injuries}
          </span>
        ) : null}

        {completedFieldsCount === 0 && (
          <span className="text-muted-foreground text-xs italic">
            Start speaking or typing to fill your profile...
          </span>
        )}
      </div>

      {/* Chat Messages Container */}
      <div className="p-5 space-y-4 max-h-96 min-h-[260px] overflow-y-auto font-sans">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex flex-col ${
              msg.role === "user" ? "items-end" : "items-start"
            }`}
          >
            <span className="text-[11px] font-mono text-muted-foreground mb-1 px-1">
              {msg.role === "assistant" ? "FitPilot AI" : "You"}
            </span>
            <div
              className={`max-w-[85%] rounded-xl px-4 py-2.5 text-sm ${
                msg.role === "user"
                  ? "bg-primary text-primary-foreground font-medium rounded-tr-xs"
                  : "bg-background/80 border border-border text-foreground rounded-tl-xs shadow-xs"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Interim voice transcript bubble */}
        {interimText && (
          <div className="flex flex-col items-end animate-pulse">
            <span className="text-[11px] font-mono text-muted-foreground mb-1 px-1">
              Listening...
            </span>
            <div className="max-w-[85%] rounded-xl px-4 py-2.5 text-sm bg-primary/30 text-foreground border border-primary/50 italic rounded-tr-xs">
              {interimText}...
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-primary animate-pulse py-1">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>AI is analyzing your fitness data...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Completion Banner */}
      {isFormComplete && (
        <div className="mx-5 mb-3 p-3 rounded-lg border border-primary/40 bg-primary/10 flex items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            <span className="text-xs text-foreground font-mono">
              All fitness parameters collected! Ready to generate.
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSwitchToManual}
            className="h-7 text-xs font-mono border-primary/50 hover:bg-primary/20 shrink-0"
          >
            <span>Review Form</span>
            <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      )}

      {/* Error display */}
      {errorMsg && (
        <div className="mx-5 mb-3 p-2.5 rounded-md border border-destructive/40 bg-destructive/10 flex items-center gap-2 text-xs text-destructive">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Controls & Input */}
      <div className="p-4 border-t border-border bg-background/30 space-y-3">
        {/* Voice Animation Wave (visible when listening) */}
        {isListening && (
          <div className="flex items-center justify-center gap-1.5 h-8 bg-background/60 rounded-md border border-primary/40 px-3">
            {[...Array(9)].map((_, i) => (
              <div
                key={i}
                className="w-1 bg-primary rounded-full animate-sound-wave"
                style={{
                  animationDelay: `${i * 0.12}s`,
                  height: "70%",
                }}
              />
            ))}
            <span className="text-xs font-mono text-primary ml-3 animate-pulse">
              Listening... Speak naturally
            </span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="flex gap-2 items-center">
          {/* Microphone button */}
          <Button
            type="button"
            onClick={toggleListening}
            disabled={isLoading || isGenerating}
            title={isListening ? "Stop listening" : "Speak to AI"}
            className={`rounded-full size-10 shrink-0 transition-all ${
              isListening
                ? "bg-destructive hover:bg-destructive/90 text-white animate-pulse"
                : "bg-primary/20 hover:bg-primary/30 text-primary border border-primary/40"
            }`}
          >
            {isListening ? (
              <MicOff className="w-4 h-4" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </Button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              isListening
                ? "Listening to you..."
                : "Speak into mic or type (e.g. 22yo, 60kg, 175cm, vegetarian, beginner muscle gain)..."
            }
            disabled={isLoading || isGenerating}
            className="flex-1 bg-background/60 border border-border text-foreground rounded-md px-3.5 py-2 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 placeholder:text-muted-foreground transition-colors"
          />

          {/* Send Button */}
          <Button
            type="submit"
            disabled={!inputText.trim() || isLoading || isGenerating}
            className="rounded-md px-3.5 bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}

