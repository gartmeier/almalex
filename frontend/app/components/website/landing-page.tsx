import type { ReactNode } from "react";
import { Fragment } from "react";
import {
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  ChevronRight,
  Code,
  Cpu,
  Database,
  ExternalLink,
  FileCheck,
  FileText,
  Flag,
  Github,
  Globe,
  HardDrive,
  HelpCircle,
  Landmark,
  MessageCircle,
  Search,
  Shield,
  ShieldCheck,
  ShieldOff,
  Sparkles,
  UserX,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { FeatureCard } from "~/components/website/feature-card";
import { HeroCircles } from "~/components/website/hero-circles";
import { IconBox } from "~/components/website/icon-box";
import { PageSection } from "~/components/website/page-section";
import { SectionBadge } from "~/components/website/section-badge";
import { SectionHeader } from "~/components/website/section-header";

export type StepContent = { title: string; desc: string };
export type SourceContent = { title: string; subtitle: string; desc: string };
export type CardContent = { title: string; desc: string };
export type FaqItem = { value: string; q: string; a: string };

export type LandingPageContent = {
  jsonLd: { description: string; featureList: string[] };
  hero: {
    title: ReactNode;
    subtitle: string;
    cta: string;
    trustBadges: [string, string, string];
  };
  chatPreview: { userMessage: string; botResponse: string; sourceLabel: string };
  howItWorks: {
    sectionId: string;
    badgeLabel: string;
    title: string;
    steps: [StepContent, StepContent, StepContent];
  };
  dataSources: {
    sectionId: string;
    badgeLabel: string;
    title: string;
    subtitle: string;
    federal: SourceContent;
    court: SourceContent;
  };
  privacy: {
    sectionId: string;
    badgeLabel: string;
    title: string;
    subtitle: string;
    cards: [CardContent, CardContent, CardContent];
    cards2: [CardContent, CardContent];
  };
  faq: { title: string; items: FaqItem[] };
  openSource: {
    title: string;
    subtitle: string;
    cards: [CardContent, CardContent, CardContent, CardContent, CardContent, CardContent];
    githubCta: string;
  };
};

export function LandingPage({ content }: { content: LandingPageContent }) {
  let jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Alma Lex",
    url: "https://almalex.ch",
    description: content.jsonLd.description,
    applicationCategory: "LegalApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "CHF",
      availability: "https://schema.org/InStock",
    },
    inLanguage: ["de-CH", "fr-CH", "en"],
    availableLanguage: [
      { "@type": "Language", name: "German" },
      { "@type": "Language", name: "French" },
      { "@type": "Language", name: "English" },
    ],
    isAccessibleForFree: true,
    featureList: content.jsonLd.featureList,
    author: {
      "@type": "Organization",
      name: "Alma Lex",
      url: "https://almalex.ch",
    },
  };

  let faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Hero content={content} />
      <HowItWorksSection content={content.howItWorks} />
      <DataSourcesSection content={content.dataSources} />
      <PrivacySection content={content.privacy} />
      <FAQSection content={content.faq} />
      <OpenSourceSection content={content.openSource} />
    </>
  );
}

function TrustBadge({ icon, bg, label }: { icon: ReactNode; bg: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <IconBox size="sm" className={bg}>{icon}</IconBox>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function ChatPreview({ content }: { content: LandingPageContent["chatPreview"] }) {
  return (
    <div className="w-full max-w-[680px] rounded-[20px] bg-card p-6 shadow-[0_8px_32px_#1E3A5F15] flex flex-col gap-4 mt-4">
      <div className="flex items-center gap-3">
        <IconBox size="sm" className="w-9 h-9 rounded-[18px] bg-secondary">
          <Bot className="w-5 h-5 text-primary" />
        </IconBox>
        <span className="text-[15px] font-semibold text-foreground">Alma Lex</span>
        <div className="w-2 h-2 rounded-full bg-success" />
      </div>
      <div className="self-end rounded-[16px_16px_4px_16px] bg-primary px-[18px] py-3">
        <p className="text-sm text-primary-foreground">{content.userMessage}</p>
      </div>
      <div className="self-start rounded-[16px_16px_16px_4px] bg-muted px-[18px] py-3.5 flex flex-col gap-2 max-w-[480px]">
        <p className="text-sm text-foreground leading-relaxed">{content.botResponse}</p>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">{content.sourceLabel}</span>
        </div>
      </div>
    </div>
  );
}

function SourceCard({
  accentGradient,
  icon,
  iconBg,
  title,
  subtitle,
  desc,
  url,
  urlColor,
}: {
  accentGradient: string;
  icon: ReactNode;
  iconBg: string;
  title: string;
  subtitle: string;
  desc: string;
  url: string;
  urlColor: string;
}) {
  return (
    <div className="flex flex-col rounded-[20px] bg-card shadow-[0_6px_28px_#1E3A5F12] overflow-hidden w-full max-w-[520px]">
      <div className={`h-[5px] bg-gradient-to-r ${accentGradient}`} />
      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-center gap-4">
          <IconBox className={iconBg}>{icon}</IconBox>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-secondary-foreground">{title}</h3>
            <p className="text-[13px] font-medium text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <p className="text-[15px] text-muted-foreground leading-[1.6]">{desc}</p>
        <div className="flex items-center gap-2 rounded-[10px] bg-muted px-4 py-2 w-fit">
          <ExternalLink className={`w-3.5 h-3.5 ${urlColor}`} />
          <span className={`text-[13px] font-medium ${urlColor}`}>{url}</span>
        </div>
      </div>
    </div>
  );
}

function Hero({ content }: { content: LandingPageContent }) {
  let [badge1, badge2, badge3] = content.hero.trustBadges;
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-accent to-background">
      <HeroCircles />

      <div className="relative flex flex-col items-center gap-6 px-8 py-20 md:px-16 lg:px-[120px] md:pt-20 md:pb-16">
        <h1 className="text-4xl md:text-[56px] font-extrabold text-secondary-foreground text-center leading-[1.15] max-w-[800px]">
          {content.hero.title}
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center leading-relaxed max-w-[700px]">
          {content.hero.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/chat"
            className="flex items-center gap-2.5 rounded-[14px] bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_4px_16px_#3B82C440] hover:bg-primary/85 transition-colors"
          >
            {content.hero.cta}
            <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </div>

        <ChatPreview content={content.chatPreview} />

        <div className="flex flex-wrap items-center justify-center gap-8 mt-2">
          <TrustBadge icon={<Check className="w-3.5 h-3.5 text-success" />} bg="bg-success/10" label={badge1} />
          <TrustBadge icon={<Shield className="w-3.5 h-3.5 text-primary" />} bg="bg-secondary" label={badge2} />
          <TrustBadge icon={<UserX className="w-3.5 h-3.5 text-accent-foreground" />} bg="bg-accent" label={badge3} />
        </div>
      </div>
    </section>
  );
}

let stepMeta = [
  {
    num: "1",
    numGradient: "from-[#3B82C4] to-[#1E3A5F]",
    icon: <MessageCircle className="w-7 h-7 text-primary" />,
    iconBg: "bg-secondary shadow-[0_2px_8px_#3B82C420]",
  },
  {
    num: "2",
    numGradient: "from-[#6B9E7A] to-[#4A7A5A]",
    icon: <Search className="w-7 h-7 text-accent-foreground" />,
    iconBg: "bg-accent shadow-[0_2px_8px_#6B9E7A20]",
  },
  {
    num: "3",
    numGradient: "from-[#F5A623] to-[#D4911C]",
    icon: <FileCheck className="w-7 h-7 text-warning" />,
    iconBg: "bg-[#FEF3C7] shadow-[0_2px_8px_#F5A62320]",
  },
];

function HowItWorksSection({ content }: { content: LandingPageContent["howItWorks"] }) {
  return (
    <PageSection id={content.sectionId} className="bg-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Sparkles className="w-3.5 h-3.5" />}
            label={content.badgeLabel}
            className="bg-secondary text-primary"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground"
      />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
        {content.steps.map((step, i) => (
          <Fragment key={stepMeta[i].num}>
            {i > 0 && (
              <ChevronRight className="hidden lg:block w-6 h-6 text-muted-foreground/40 shrink-0" />
            )}
            <div className="flex flex-col items-center gap-5 rounded-[20px] bg-card p-8 shadow-[0_4px_24px_#1E3A5F10] w-full max-w-[340px]">
              <div className={`flex items-center justify-center w-9 h-9 rounded-[18px] bg-gradient-to-b ${stepMeta[i].numGradient}`}>
                <span className="text-[15px] font-bold text-white">{stepMeta[i].num}</span>
              </div>
              <IconBox size="lg" className={`w-14 h-14 rounded-[16px] ${stepMeta[i].iconBg}`}>
                {stepMeta[i].icon}
              </IconBox>
              <h3 className="text-lg font-bold text-secondary-foreground text-center">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground text-center leading-relaxed">{step.desc}</p>
            </div>
          </Fragment>
        ))}
      </div>
    </PageSection>
  );
}

function DataSourcesSection({ content }: { content: LandingPageContent["dataSources"] }) {
  return (
    <PageSection id={content.sectionId} className="bg-gradient-to-b from-secondary via-secondary/40 to-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Database className="w-3.5 h-3.5" />}
            label={content.badgeLabel}
            className="bg-secondary text-primary"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground"
        subtitle={content.subtitle}
        subtitleClassName="text-muted-foreground"
      />

      <div className="flex flex-col md:flex-row justify-center gap-8 w-full">
        <SourceCard
          accentGradient="from-[#3B82C4] to-[#6B9E7A]"
          icon={<BookOpen className="w-[26px] h-[26px] text-primary" />}
          iconBg="bg-secondary"
          title={content.federal.title}
          subtitle={content.federal.subtitle}
          desc={content.federal.desc}
          url="fedlex.admin.ch"
          urlColor="text-primary"
        />
        <SourceCard
          accentGradient="from-[#F5A623] to-[#D4911C]"
          icon={<Landmark className="w-[26px] h-[26px] text-warning" />}
          iconBg="bg-[#FEF3C7]"
          title={content.court.title}
          subtitle={content.court.subtitle}
          desc={content.court.desc}
          url="bger.ch"
          urlColor="text-warning"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
        <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
        <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
      </div>
    </PageSection>
  );
}

let privacyCardMeta = [
  { icon: <HardDrive className="w-6 h-6 text-accent-foreground" />, iconGradient: "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]" },
  { icon: <Flag className="w-6 h-6 text-primary" />, iconGradient: "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]" },
  { icon: <Globe className="w-6 h-6 text-primary" />, iconGradient: "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]" },
];

let privacyCard2Meta = [
  { icon: <ShieldOff className="w-6 h-6 text-warning" />, iconGradient: "from-[#F5A62318] to-[#F5A62308] shadow-[0_2px_8px_#F5A62315]" },
  { icon: <UserX className="w-6 h-6 text-accent-foreground" />, iconGradient: "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]" },
];

function PrivacySection({ content }: { content: LandingPageContent["privacy"] }) {
  return (
    <PageSection id={content.sectionId} className="bg-gradient-to-b from-accent to-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<ShieldCheck className="w-4 h-4" />}
            label={content.badgeLabel}
            className="bg-card text-accent-foreground shadow-[0_2px_8px_#6B9E7A20]"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground font-extrabold tracking-tight"
        subtitle={content.subtitle}
        subtitleClassName="text-muted-foreground text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[1200px]">
        {content.cards.map((c, i) => (
          <FeatureCard
            key={c.title}
            icon={<IconBox className={`bg-gradient-to-b ${privacyCardMeta[i].iconGradient}`}>{privacyCardMeta[i].icon}</IconBox>}
            title={c.title}
            description={c.desc}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[800px]">
        {content.cards2.map((c, i) => (
          <FeatureCard
            key={c.title}
            icon={<IconBox className={`bg-gradient-to-b ${privacyCard2Meta[i].iconGradient}`}>{privacyCard2Meta[i].icon}</IconBox>}
            title={c.title}
            description={c.desc}
          />
        ))}
      </div>
    </PageSection>
  );
}

function FAQSection({ content }: { content: LandingPageContent["faq"] }) {
  return (
    <PageSection id="faq" className="bg-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<HelpCircle className="w-3.5 h-3.5" />}
            label="FAQ"
            className="bg-secondary text-primary"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground"
      />
      <div className="w-full max-w-[760px]">
        <Accordion type="single" collapsible className="w-full">
          {content.items.map((item) => (
            <AccordionItem key={item.value} value={item.value} className="border-border">
              <AccordionTrigger className="text-[15px] font-semibold text-secondary-foreground hover:no-underline hover:text-primary">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] text-muted-foreground leading-relaxed">
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </PageSection>
  );
}

let openSourceCardMeta = [
  { icon: <Database className="w-[22px] h-[22px] text-[#7CB5E3]" />, iconGradient: "from-[#3B82C430] to-[#3B82C410]" },
  { icon: <Bot className="w-[22px] h-[22px] text-[#7CB5E3]" />, iconGradient: "from-[#3B82C430] to-[#3B82C410]" },
  { icon: <Cpu className="w-[22px] h-[22px] text-[#8BC49A]" />, iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]" },
  { icon: <Github className="w-[22px] h-[22px] text-[#8BC49A]" />, iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]" },
  { icon: <Flag className="w-[22px] h-[22px] text-[#F5C06A]" />, iconGradient: "from-[#F5A62330] to-[#F5A62310]" },
  { icon: <Shield className="w-[22px] h-[22px] text-[#F5C06A]" />, iconGradient: "from-[#F5A62330] to-[#F5A62310]" },
];

function OpenSourceSection({ content }: { content: LandingPageContent["openSource"] }) {
  return (
    <PageSection id="open-source" className="bg-gradient-to-b from-[#1E3A5F] to-[#152C4A] gap-14">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Code className="w-4 h-4" />}
            label="Open Source"
            className="bg-white/[0.07] border border-white/[0.13] text-[#7CB5E3]"
          />
        }
        title={content.title}
        titleClassName="text-white font-extrabold tracking-tight"
        subtitle={content.subtitle}
        subtitleClassName="text-[#94B8D9] text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[1200px]">
        {content.cards.map((card, i) => (
          <div
            key={card.title}
            className="flex flex-col gap-3.5 rounded-[16px] bg-white/[0.03] border border-white/[0.07] p-7"
          >
            <div className="flex items-center gap-3">
              <IconBox size="md" className={`w-11 h-11 rounded-[12px] bg-gradient-to-b ${openSourceCardMeta[i].iconGradient}`}>
                {openSourceCardMeta[i].icon}
              </IconBox>
              <h3 className="text-[17px] font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-sm text-[#A8C8E8] leading-[1.6]">{card.desc}</p>
          </div>
        ))}
      </div>

      <a
        href="https://github.com/gartmeier/almalex"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 rounded-[12px] bg-white px-7 py-3.5 text-[15px] font-semibold text-[#1E3A5F] shadow-[0_4px_16px_#00000020] hover:bg-[#F5F5F5] transition-colors"
      >
        <Github className="w-5 h-5" />
        {content.githubCta}
        <ArrowRight className="w-[18px] h-[18px]" />
      </a>
    </PageSection>
  );
}
