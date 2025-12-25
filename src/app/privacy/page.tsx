"use client";

import CornerElements from "@/components/CornerElements";

const PrivacyPage = () => {
  return (
    <section className="relative z-10 pt-16 pb-32 container mx-auto px-4 space-y-10">

      <Header
        title="Privacy Policy"
        subtitle="Your privacy matters. Here’s how we protect your data."
      />

      <ContentCard title="1. Information We Collect">
        We collect information you provide such as name, email,
        fitness preferences, and usage data to improve our services.
      </ContentCard>

      <ContentCard title="2. How We Use Your Data">
        Data is used to personalize workout and diet plans, improve
        platform performance, and enhance user experience.
      </ContentCard>

      <ContentCard title="3. Data Security">
        We use industry-standard security measures including
        authentication, encryption, and access control.
      </ContentCard>

      <ContentCard title="4. Data Sharing">
        We do not sell your personal data. Information is shared only
        when legally required or to provide essential services.
      </ContentCard>

      <ContentCard title="5. Cookies & Analytics">
        Cookies help us understand usage patterns and optimize
        performance. You may disable cookies in your browser settings.
      </ContentCard>

      <ContentCard title="6. Your Rights">
        You have the right to access, modify, or delete your personal
        data. Contact us for any privacy-related requests.
      </ContentCard>

      <ContentCard title="7. Policy Updates">
        This policy may change periodically. Updates will be reflected
        on this page.
      </ContentCard>

    </section>
  );
};

export default PrivacyPage;

/* ---------- SAME REUSABLE ---------- */

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
