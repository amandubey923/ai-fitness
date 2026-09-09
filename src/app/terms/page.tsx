"use client";

import CornerElements from "@/components/CornerElements";

const TermsPage = () => {
  return (
    <section className="relative z-10 pt-16 pb-32 container mx-auto px-4 space-y-10">

      <Header
        title="Terms & Conditions"
        subtitle="Please read these terms carefully before using FitPilot AI."
      />

      <ContentCard title="1. Acceptance of Terms">
        By accessing or using FitPilot AI, you agree to be bound by these Terms
        and all applicable laws. If you do not agree, you may not use
        the platform.
      </ContentCard>

      <ContentCard title="2. Use of the Platform">
        FitPilot AI provides AI-generated fitness and diet plans for
        educational and informational purposes only. It is not a
        replacement for professional medical advice.
      </ContentCard>

      <ContentCard title="3. User Responsibilities">
        You agree to provide accurate information and use the platform
        responsibly. Misuse, abuse, or unauthorized access is strictly
        prohibited.
      </ContentCard>

      <ContentCard title="4. Health Disclaimer">
        You acknowledge that fitness activities carry risks.
        FitPilot AI is not responsible for injuries, health conditions,
        or outcomes resulting from the use of our plans.
      </ContentCard>

      <ContentCard title="5. Intellectual Property">
        All content, designs, algorithms, and branding are the
        intellectual property of FitPilot AI and may not be copied or reused
        without permission.
      </ContentCard>

      <ContentCard title="6. Termination">
        We reserve the right to suspend or terminate accounts that
        violate these terms without prior notice.
      </ContentCard>

      <ContentCard title="7. Changes to Terms">
        These terms may be updated at any time. Continued use of
        FitPilot AI implies acceptance of updated terms.
      </ContentCard>

    </section>
  );
};

export default TermsPage;

/* ---------- REUSABLE ---------- */

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="relative backdrop-blur-sm border border-border rounded-xl p-8">
    <CornerElements />
    <h1 className="text-3xl font-bold mb-3">{title}</h1>
    <p className="text-muted-foreground max-w-3xl">{subtitle}</p>
  </div>
);

const ContentCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="relative backdrop-blur-sm border border-border rounded-lg p-6">
    <CornerElements />
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground leading-relaxed">{children}</p>
  </div>
);
