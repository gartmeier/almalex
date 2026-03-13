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
import type { ReactNode } from "react";
import { Fragment } from "react";
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
  chatPreview: {
    userMessage: string;
    botResponse: string;
    sourceLabel: string;
  };
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
    cards: [
      CardContent,
      CardContent,
      CardContent,
      CardContent,
      CardContent,
      CardContent,
    ];
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

function TrustBadge({
  icon,
  bg,
  label,
}: {
  icon: ReactNode;
  bg: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <IconBox size="sm" className={bg}>
        {icon}
      </IconBox>
      <span className="text-muted-foreground text-sm font-medium">{label}</span>
    </div>
  );
}

function ChatPreview({
  content,
}: {
  content: LandingPageContent["chatPreview"];
}) {
  return (
    <div className="bg-card shadow-card-lg mt-4 flex w-full max-w-[680px] flex-col gap-4 rounded-[20px] p-6">
      <div className="flex items-center gap-3">
        <IconBox size="sm" className="bg-secondary h-9 w-9 rounded-2xl">
          <Bot className="text-primary h-5 w-5" />
        </IconBox>
        <span className="text-foreground text-base font-semibold">
          Alma Lex
        </span>
        <div className="bg-success h-2 w-2 rounded-full" />
      </div>
      <div className="bg-primary self-end rounded-[16px_16px_4px_16px] px-[18px] py-3">
        <p className="text-primary-foreground text-sm">{content.userMessage}</p>
      </div>
      <div className="bg-muted flex max-w-[480px] flex-col gap-2 self-start rounded-[16px_16px_16px_4px] px-[18px] py-3.5">
        <p className="text-foreground text-sm leading-relaxed">
          {content.botResponse}
        </p>
        <div className="flex items-center gap-1.5">
          <FileText className="text-primary h-3 w-3" />
          <span className="text-primary text-xs font-medium">
            {content.sourceLabel}
          </span>
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
    <div className="bg-card shadow-card flex w-full max-w-[520px] flex-col overflow-hidden rounded-[20px]">
      <div className={`h-[5px] bg-gradient-to-r ${accentGradient}`} />
      <div className="flex flex-col gap-5 p-7">
        <div className="flex items-center gap-4">
          <IconBox className={iconBg}>{icon}</IconBox>
          <div className="flex flex-col gap-1">
            <h3 className="text-secondary-foreground text-xl font-bold">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm font-medium">
              {subtitle}
            </p>
          </div>
        </div>
        <p className="text-muted-foreground text-base leading-[1.6]">{desc}</p>
        <div className="bg-muted flex w-fit items-center gap-2 rounded-xl px-4 py-2">
          <ExternalLink className={`h-3.5 w-3.5 ${urlColor}`} />
          <span className={`text-sm font-medium ${urlColor}`}>{url}</span>
        </div>
      </div>
    </div>
  );
}

function Hero({ content }: { content: LandingPageContent }) {
  let [badge1, badge2, badge3] = content.hero.trustBadges;
  return (
    <section className="from-secondary via-accent to-background relative overflow-hidden bg-gradient-to-br">
      <HeroCircles />

      <div className="relative flex flex-col items-center gap-6 px-8 py-20 md:px-16 md:pt-20 md:pb-16 lg:px-[120px]">
        <h1 className="text-secondary-foreground max-w-[800px] text-center text-4xl leading-[1.15] font-extrabold md:text-[56px]">
          {content.hero.title}
        </h1>
        <p className="text-muted-foreground max-w-[700px] text-center text-lg leading-relaxed md:text-xl">
          {content.hero.subtitle}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/chat"
            className="bg-primary text-primary-foreground shadow-button-primary hover:bg-primary/85 flex items-center gap-2.5 rounded-2xl px-8 py-4 text-base font-semibold transition-colors"
          >
            {content.hero.cta}
            <ArrowRight className="h-[18px] w-[18px]" />
          </a>
        </div>

        <ChatPreview content={content.chatPreview} />

        <div className="mt-2 flex flex-wrap items-center justify-center gap-8">
          <TrustBadge
            icon={<Check className="text-success h-3.5 w-3.5" />}
            bg="bg-success/10"
            label={badge1}
          />
          <TrustBadge
            icon={<Shield className="text-primary h-3.5 w-3.5" />}
            bg="bg-secondary"
            label={badge2}
          />
          <TrustBadge
            icon={<UserX className="text-accent-foreground h-3.5 w-3.5" />}
            bg="bg-accent"
            label={badge3}
          />
        </div>
      </div>
    </section>
  );
}

let stepMeta = [
  {
    num: "1",
    numGradient: "from-[#3B82C4] to-[#1E3A5F]",
    icon: <MessageCircle className="text-primary h-7 w-7" />,
    iconBg: "bg-secondary shadow-[0_2px_8px_#3B82C420]",
  },
  {
    num: "2",
    numGradient: "from-[#6B9E7A] to-[#4A7A5A]",
    icon: <Search className="text-accent-foreground h-7 w-7" />,
    iconBg: "bg-accent shadow-[0_2px_8px_#6B9E7A20]",
  },
  {
    num: "3",
    numGradient: "from-[#F5A623] to-[#D4911C]",
    icon: <FileCheck className="text-warning h-7 w-7" />,
    iconBg: "bg-[#FEF3C7] shadow-[0_2px_8px_#F5A62320]",
  },
];

function HowItWorksSection({
  content,
}: {
  content: LandingPageContent["howItWorks"];
}) {
  return (
    <PageSection id={content.sectionId} className="bg-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Sparkles className="h-3.5 w-3.5" />}
            label={content.badgeLabel}
            className="bg-secondary text-primary"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground"
      />
      <div className="grid w-full max-w-[1200px] grid-cols-1 items-stretch justify-items-center gap-x-4 gap-y-8 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {content.steps.map((step, i) => (
          <Fragment key={stepMeta[i].num}>
            {i > 0 && (
              <ChevronRight className="text-muted-foreground/40 mt-[56px] hidden h-6 w-6 shrink-0 self-center lg:flex" />
            )}
            <div className="flex w-full max-w-[360px] min-w-0 flex-col items-center">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-b ${stepMeta[i].numGradient} mb-5`}
              >
                <span className="text-base font-bold text-white">
                  {stepMeta[i].num}
                </span>
              </div>
              <div className="bg-card shadow-card-sm flex w-full flex-1 flex-col items-center gap-5 rounded-[20px] p-8">
                <IconBox
                  size="lg"
                  className={`h-14 w-14 rounded-2xl ${stepMeta[i].iconBg}`}
                >
                  {stepMeta[i].icon}
                </IconBox>
                <h3 className="text-secondary-foreground text-center text-lg font-bold">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-center text-base leading-relaxed break-words">
                  {step.desc}
                </p>
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </PageSection>
  );
}

function DataSourcesSection({
  content,
}: {
  content: LandingPageContent["dataSources"];
}) {
  return (
    <PageSection
      id={content.sectionId}
      className="from-secondary via-secondary/40 to-background bg-gradient-to-b"
    >
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Database className="h-3.5 w-3.5" />}
            label={content.badgeLabel}
            className="bg-secondary text-primary"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground"
        subtitle={content.subtitle}
        subtitleClassName="text-muted-foreground"
      />

      <div className="flex w-full flex-col justify-center gap-8 md:flex-row">
        <SourceCard
          accentGradient="from-[#3B82C4] to-[#6B9E7A]"
          icon={<BookOpen className="text-primary h-[26px] w-[26px]" />}
          iconBg="bg-secondary"
          title={content.federal.title}
          subtitle={content.federal.subtitle}
          desc={content.federal.desc}
          url="fedlex.admin.ch"
          urlColor="text-primary"
        />
        <SourceCard
          accentGradient="from-[#F5A623] to-[#D4911C]"
          icon={<Landmark className="text-warning h-[26px] w-[26px]" />}
          iconBg="bg-[#FEF3C7]"
          title={content.court.title}
          subtitle={content.court.subtitle}
          desc={content.court.desc}
          url="bger.ch"
          urlColor="text-warning"
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="bg-muted-foreground/30 h-1.5 w-1.5 rounded-full" />
        <div className="bg-primary/40 h-1.5 w-1.5 rounded-full" />
        <div className="bg-muted-foreground/30 h-1.5 w-1.5 rounded-full" />
      </div>
    </PageSection>
  );
}

let privacyCardMeta = [
  {
    icon: <HardDrive className="text-accent-foreground h-6 w-6" />,
    iconGradient:
      "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]",
  },
  {
    icon: <Flag className="text-primary h-6 w-6" />,
    iconGradient:
      "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]",
  },
  {
    icon: <Globe className="text-primary h-6 w-6" />,
    iconGradient:
      "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]",
  },
];

let privacyCard2Meta = [
  {
    icon: <ShieldOff className="text-warning h-6 w-6" />,
    iconGradient:
      "from-[#F5A62318] to-[#F5A62308] shadow-[0_2px_8px_#F5A62315]",
  },
  {
    icon: <UserX className="text-accent-foreground h-6 w-6" />,
    iconGradient:
      "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]",
  },
];

function PrivacySection({
  content,
}: {
  content: LandingPageContent["privacy"];
}) {
  return (
    <PageSection
      id={content.sectionId}
      className="from-accent to-background bg-gradient-to-b"
    >
      <SectionHeader
        badge={
          <SectionBadge
            icon={<ShieldCheck className="h-4 w-4" />}
            label={content.badgeLabel}
            className="bg-card text-accent-foreground shadow-sm"
          />
        }
        title={content.title}
        titleClassName="text-secondary-foreground font-extrabold tracking-tight"
        subtitle={content.subtitle}
        subtitleClassName="text-muted-foreground text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-3">
        {content.cards.map((c, i) => (
          <FeatureCard
            key={c.title}
            icon={
              <IconBox
                className={`bg-gradient-to-b ${privacyCardMeta[i].iconGradient}`}
              >
                {privacyCardMeta[i].icon}
              </IconBox>
            }
            title={c.title}
            description={c.desc}
          />
        ))}
      </div>
      <div className="grid w-full max-w-[800px] grid-cols-1 gap-5 md:grid-cols-2">
        {content.cards2.map((c, i) => (
          <FeatureCard
            key={c.title}
            icon={
              <IconBox
                className={`bg-gradient-to-b ${privacyCard2Meta[i].iconGradient}`}
              >
                {privacyCard2Meta[i].icon}
              </IconBox>
            }
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
            icon={<HelpCircle className="h-3.5 w-3.5" />}
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
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-border"
            >
              <AccordionTrigger className="text-secondary-foreground hover:text-primary text-base font-semibold hover:no-underline">
                {item.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
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
  {
    icon: <Database className="h-[22px] w-[22px] text-[#7CB5E3]" />,
    iconGradient: "from-[#3B82C430] to-[#3B82C410]",
  },
  {
    icon: <Bot className="h-[22px] w-[22px] text-[#7CB5E3]" />,
    iconGradient: "from-[#3B82C430] to-[#3B82C410]",
  },
  {
    icon: <Cpu className="h-[22px] w-[22px] text-[#8BC49A]" />,
    iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]",
  },
  {
    icon: <Github className="h-[22px] w-[22px] text-[#8BC49A]" />,
    iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]",
  },
  {
    icon: <Flag className="h-[22px] w-[22px] text-[#F5C06A]" />,
    iconGradient: "from-[#F5A62330] to-[#F5A62310]",
  },
  {
    icon: <Shield className="h-[22px] w-[22px] text-[#F5C06A]" />,
    iconGradient: "from-[#F5A62330] to-[#F5A62310]",
  },
];

function OpenSourceSection({
  content,
}: {
  content: LandingPageContent["openSource"];
}) {
  return (
    <PageSection
      id="open-source"
      className="gap-14 bg-gradient-to-b from-[#1E3A5F] to-[#152C4A]"
    >
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Code className="h-4 w-4" />}
            label="Open Source"
            className="border border-white/[0.13] bg-white/[0.07] text-[#7CB5E3]"
          />
        }
        title={content.title}
        titleClassName="text-white font-extrabold tracking-tight"
        subtitle={content.subtitle}
        subtitleClassName="text-[#94B8D9] text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid w-full max-w-[1200px] grid-cols-1 gap-5 md:grid-cols-2">
        {content.cards.map((card, i) => (
          <div
            key={card.title}
            className="flex flex-col gap-3.5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-7"
          >
            <div className="flex items-center gap-3">
              <IconBox
                size="md"
                className={`h-11 w-11 rounded-2xl bg-gradient-to-b ${openSourceCardMeta[i].iconGradient}`}
              >
                {openSourceCardMeta[i].icon}
              </IconBox>
              <h3 className="text-lg font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-sm leading-[1.6] text-[#A8C8E8]">{card.desc}</p>
          </div>
        ))}
      </div>

      <a
        href="https://github.com/gartmeier/almalex"
        target="_blank"
        rel="noopener noreferrer"
        className="shadow-button flex items-center gap-1.5 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-[#1E3A5F] transition-colors hover:bg-[#F5F5F5] sm:gap-2.5 sm:px-7 sm:py-3.5 sm:text-base"
      >
        <Github className="h-5 w-5" />
        {content.githubCta}
        <ArrowRight className="h-[18px] w-[18px]" />
      </a>
    </PageSection>
  );
}
