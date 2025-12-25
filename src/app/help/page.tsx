"use client";

import CornerElements from "@/components/CornerElements";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const HelpPage = () => {
  return (
    <section className="relative z-10 pt-16 pb-32 container mx-auto px-4 space-y-12">

      <Header
        title="Help & Support"
        subtitle="Find answers, guidance, and support for using FitAI."
      />

      {/* FAQ */}
      <div className="relative backdrop-blur-sm border border-border rounded-xl p-8">
        <CornerElements />

        <h2 className="text-xl font-bold mb-6">
          Frequently Asked <span className="text-primary">Questions</span>
        </h2>

        <Accordion type="multiple" className="space-y-4">
          <FAQ
            q="Is FitAI suitable for beginners?"
            a="Yes. Plans are generated based on your fitness level, including complete beginners."
          />
          <FAQ
            q="Can I change my fitness goal later?"
            a="Absolutely. You can generate a new plan anytime based on updated goals."
          />
          <FAQ
            q="Is FitAI a medical service?"
            a="No. FitAI provides educational fitness guidance, not medical advice."
          />
          <FAQ
            q="How accurate are AI-generated plans?"
            a="Plans are structured using proven fitness principles, but results depend on consistency."
          />
          <FAQ
            q="How do I contact support?"
            a="Use the Contact page to reach our support team."
          />
        </Accordion>
      </div>

      {/* SUPPORT NOTE */}
      <div className="relative backdrop-blur-sm border border-border rounded-xl p-8">
        <CornerElements />

        <h2 className="text-xl font-bold mb-3">
          Still Need Help?
        </h2>

        <p className="text-muted-foreground max-w-2xl">
          If your question is not answered here, feel free to reach out
          via the Contact page. Our team is always ready to help.
        </p>
      </div>

    </section>
  );
};

export default HelpPage;

/* ---------- SMALL ---------- */

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="relative backdrop-blur-sm border border-border rounded-xl p-8">
    <CornerElements />
    <h1 className="text-3xl font-bold mb-3">{title}</h1>
    <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
  </div>
);

const FAQ = ({ q, a }: { q: string; a: string }) => (
  <AccordionItem value={q} className="border rounded-lg px-4">
    <AccordionTrigger className="font-mono text-left">
      {q}
    </AccordionTrigger>
    <AccordionContent className="text-muted-foreground">
      {a}
    </AccordionContent>
  </AccordionItem>
);
