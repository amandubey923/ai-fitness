"use client";

import { useState } from "react";
import CornerElements from "@/components/CornerElements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  SendIcon,
} from "lucide-react";

const ContactPage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // later connect to Convex / Email / Webhook
    setTimeout(() => {
      setLoading(false);
      alert("Message sent successfully!");
    }, 1200);
  };

  return (
    <section className="relative z-10 pt-16 pb-32 grow container mx-auto px-4">
      {/* HERO */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 mb-12">
        <CornerElements />

        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Contact <span className="text-primary">Us</span>
        </h1>

        <p className="text-muted-foreground max-w-2xl leading-relaxed">
          Have questions, feedback, or ideas?  
          We’d love to hear from you. Reach out and let’s build
          something impactful together.
        </p>
      </div>

      {/* CONTACT INFO */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <InfoCard
          icon={<MailIcon className="h-5 w-5 text-primary" />}
          title="Email"
          value="support@fitai.app"
        />

        <InfoCard
          icon={<PhoneIcon className="h-5 w-5 text-primary" />}
          title="Phone"
          value="+91 90000 00000"
        />

        <InfoCard
          icon={<MapPinIcon className="h-5 w-5 text-primary" />}
          title="Location"
          value="India"
        />
      </div>

      {/* CONTACT FORM */}
      <div className="relative backdrop-blur-sm border border-border rounded-lg p-8 max-w-3xl mx-auto">
        <CornerElements />

        <h2 className="text-xl font-bold mb-6">
          Send a <span className="text-primary">Message</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              required
              placeholder="Your Name"
              className="bg-background/50"
            />

            <Input
              type="email"
              required
              placeholder="Your Email"
              className="bg-background/50"
            />
          </div>

          <Textarea
            required
            placeholder="Your Message"
            rows={5}
            className="bg-background/50"
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="font-mono flex items-center gap-2"
            >
              {loading ? "Sending..." : "Send Message"}
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default ContactPage;

/* ---------- SMALL COMPONENT ---------- */

const InfoCard = ({
  icon,
  title,
  value,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
}) => {
  return (
    <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
      <CornerElements />

      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>

      <p className="text-sm text-muted-foreground">{value}</p>
    </div>
  );
};
