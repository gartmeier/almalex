import type { MetaFunction } from "react-router";
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

export let meta: MetaFunction = () => [
  { title: "Alma Lex - Schweizer Rechts-KI | OR, ZGB & StGB einfach erklärt" },
  {
    name: "description",
    content:
      "Kostenlose Schweizer Rechts-KI: Stelle Fragen zu OR, ZGB, StGB oder Bundesgerichtsentscheiden und erhalte quellenbasierte Antworten. Ohne Anmeldung.",
  },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Alma Lex - Schweizer Rechts-KI für OR, ZGB & Bundesgerichtsentscheide" },
  {
    property: "og:description",
    content:
      "Rechtsfragen einfach beantwortet: Frag die Schweizer Rechts-KI zu OR, ZGB oder Bundesgerichtsurteilen. Quellenbasiert, kostenlos und ohne Login.",
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "de_CH" },
  { property: "og:locale:alternate", content: "fr_CH" },
  { property: "og:locale:alternate", content: "en_US" },
  { property: "og:site_name", content: "Alma Lex" },
  { property: "og:url", content: "https://almalex.ch/de" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Alma Lex - Schweizer Rechts-KI für OR, ZGB & Bundesgerichtsentscheide" },
  {
    name: "twitter:description",
    content:
      "Rechtsfragen einfach beantwortet: Frag die Schweizer Rechts-KI zu OR, ZGB oder Bundesgerichtsurteilen. Quellenbasiert, kostenlos und ohne Login.",
  },
  { tagName: "link", rel: "canonical", href: "https://almalex.ch/de" },
  { tagName: "link", rel: "alternate", hrefLang: "de-CH", href: "https://almalex.ch/de" },
  { tagName: "link", rel: "alternate", hrefLang: "fr-CH", href: "https://almalex.ch/fr" },
  { tagName: "link", rel: "alternate", hrefLang: "en", href: "https://almalex.ch/en" },
  { tagName: "link", rel: "alternate", hrefLang: "x-default", href: "https://almalex.ch/de" },
];

let jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Alma Lex",
  url: "https://almalex.ch",
  description:
    "Kostenlose Schweizer Rechts-KI. Beantwortet Rechtsfragen zu Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB) und Bundesgerichtsentscheiden mit Quellenangaben.",
  applicationCategory: "LegalApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
    availability: "https://schema.org/InStock",
  },
  inLanguage: ["de-CH", "fr-CH", "en"],
  isAccessibleForFree: true,
  author: {
    "@type": "Organization",
    name: "Alma Lex",
    url: "https://almalex.ch",
  },
};

let faqItems = [
  { value: "what-is", q: "Was ist Alma Lex?", a: "Alma Lex ist eine kostenlose Schweizer Rechts-KI. Sie durchsucht Bundesrecht und Bundesgerichtsentscheide und beantwortet deine Rechtsfragen verständlich und mit Quellenangaben. Ohne Anmeldung." },
  { value: "how-to-start", q: "Wie beginne ich einen Chat?", a: "Gib einfach deine Frage ins Eingabefeld ein und drück Enter. Alma Lex antwortet dir sofort. Kein Account und keine Anmeldung nötig." },
  { value: "what-questions", q: "Welche Fragen kann ich stellen?", a: "Du kannst Fragen zu allen Bereichen des Schweizer Rechts stellen, etwa zum Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB), Mietrecht, Arbeitsrecht oder Familienrecht. Alma Lex durchsucht Bundesgesetze und tausende Bundesgerichtsentscheide." },
  { value: "sources", q: "Woher stammen die Informationen?", a: "Alma Lex nutzt ausschliesslich offizielle Schweizer Rechtsquellen: die Systematische Rechtssammlung (fedlex.admin.ch) und Bundesgerichtsentscheide (bger.ch). Dieselben Quellen, die auch an Uni und Berufsschule verwendet werden." },
  { value: "accuracy", q: "Wie genau sind die Antworten?", a: "Jede Antwort enthält Quellenangaben zu den verwendeten Gesetzesartikeln und Urteilen. Alma Lex bietet eine gute erste Orientierung, ersetzt aber keine professionelle Rechtsberatung. Bei konkreten Rechtsfällen immer eine Fachperson beiziehen." },
  { value: "privacy", q: "Sind meine Daten sicher?", a: "Ja. Chatverläufe bleiben lokal in deinem Browser. Die KI-Modelle laufen bei Infomaniak, einem Schweizer Anbieter mit Rechenzentrum in Genf. Die Anwendung selbst läuft auf einem Server in Finnland. Deine Eingaben werden weder gespeichert noch für KI-Training verwendet." },
  { value: "costs", q: "Was kostet die Nutzung?", a: "Alma Lex ist komplett kostenlos. Ohne versteckte Kosten, ohne Abo, ohne Werbung." },
  { value: "open-source", q: "Ist Alma Lex Open Source?", a: "Ja, der vollständige Quellcode ist öffentlich auf GitHub verfügbar. Jede Zeile Code, von der KI-Pipeline bis zum Frontend, kann eingesehen werden." },
  { value: "limitations", q: "Was sind die Grenzen?", a: "Alma Lex ersetzt keine professionelle Rechtsberatung. Die Antworten bieten eine erste Orientierung, berücksichtigen aber nicht alle fallbezogenen Nuancen. Bei konkreten Rechtsfällen solltest du eine Fachperson beiziehen." },
  { value: "languages", q: "In welchen Sprachen kann ich Fragen stellen?", a: "Du kannst deine Fragen auf Deutsch stellen. Die Rechtsquellen sind ebenfalls auf Deutsch verfügbar. Weitere Sprachen sind in Planung." },
];

let faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

export default function LandingPage() {
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
      <Hero />
      <HowItWorks />
      <DataSources />
      <Privacy />
      <FAQ />
      <OpenSource />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-secondary via-accent to-background">
      <HeroCircles />

      <div className="relative flex flex-col items-center gap-6 px-8 py-20 md:px-[120px] md:pt-20 md:pb-16">
        <h1 className="text-4xl md:text-[56px] font-extrabold text-secondary-foreground text-center leading-[1.15] max-w-[800px]">
          Schweizer Recht verstehen.{"\n"}In Sekunden.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center leading-relaxed max-w-[700px]">
          Stell deine Rechtsfrage zum Obligationenrecht (OR), Zivilgesetzbuch (ZGB)
          oder zu Bundesgerichtsentscheiden und erhalte in Sekunden eine quellenbasierte Antwort.
          Kostenlos und ohne Anmeldung.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="/chat"
            className="flex items-center gap-2.5 rounded-[14px] bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-[0_4px_16px_#3B82C440] hover:bg-primary/85 transition-colors"
          >
            Jetzt Frage stellen
            <ArrowRight className="w-[18px] h-[18px]" />
          </a>
        </div>

        <ChatPreview />

        <div className="flex flex-wrap items-center justify-center gap-8 mt-2">
          <TrustBadge icon={<Check className="w-3.5 h-3.5 text-success" />} bg="bg-success/10" label="100% kostenlos" />
          <TrustBadge icon={<Shield className="w-3.5 h-3.5 text-primary" />} bg="bg-secondary" label="KI aus der Schweiz" />
          <TrustBadge icon={<UserX className="w-3.5 h-3.5 text-accent-foreground" />} bg="bg-accent" label="Keine Anmeldung nötig" />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, bg, label }: { icon: React.ReactNode; bg: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <IconBox size="sm" className={bg}>{icon}</IconBox>
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
  );
}

function ChatPreview() {
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
        <p className="text-sm text-primary-foreground">
          Wie lange ist die Kündigungsfrist bei einem Mietvertrag?
        </p>
      </div>
      <div className="self-start rounded-[16px_16px_16px_4px] bg-muted px-[18px] py-3.5 flex flex-col gap-2 max-w-[480px]">
        <p className="text-sm text-foreground leading-relaxed">
          Gemäss Art. 266c OR beträgt die Kündigungsfrist für Wohnräume mindestens drei Monate, jeweils auf einen ortsüblichen Termin...
        </p>
        <div className="flex items-center gap-1.5">
          <FileText className="w-3 h-3 text-primary" />
          <span className="text-xs font-medium text-primary">Quelle: OR Art. 266c</span>
        </div>
      </div>
    </div>
  );
}

function HowItWorks() {
  let steps = [
    {
      num: "1",
      numGradient: "from-[#3B82C4] to-[#1E3A5F]",
      icon: <MessageCircle className="w-7 h-7 text-primary" />,
      iconBg: "bg-secondary shadow-[0_2px_8px_#3B82C420]",
      title: "Frage stellen",
      desc: "Stell deine Rechtsfrage in normaler Sprache, egal ob zu OR, ZGB oder einem konkreten Fall.",
    },
    {
      num: "2",
      numGradient: "from-[#6B9E7A] to-[#4A7A5A]",
      icon: <Search className="w-7 h-7 text-accent-foreground" />,
      iconBg: "bg-accent shadow-[0_2px_8px_#6B9E7A20]",
      title: "Quellen durchsuchen",
      desc: "Die KI durchsucht Bundesrecht und tausende Bundesgerichtsentscheide in Sekunden.",
    },
    {
      num: "3",
      numGradient: "from-[#F5A623] to-[#D4911C]",
      icon: <FileCheck className="w-7 h-7 text-warning" />,
      iconBg: "bg-[#FEF3C7] shadow-[0_2px_8px_#F5A62320]",
      title: "Antwort erhalten",
      desc: "Du erhältst eine verständliche Antwort mit direkten Verweisen auf Gesetzesartikel und Urteile.",
    },
  ];

  return (
    <PageSection id="so-funktionierts" className="bg-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Sparkles className="w-3.5 h-3.5" />}
            label="So funktioniert's"
            className="bg-secondary text-primary"
          />
        }
        title="In drei Schritten zur Antwort"
        titleClassName="text-secondary-foreground"
      />
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 w-full">
        {steps.map((step, i) => (
          <>
            {i > 0 && (
              <ChevronRight key={`arrow-${i}`} className="hidden lg:block w-6 h-6 text-muted-foreground/40 shrink-0" />
            )}
            <div key={step.num} className="flex flex-col items-center gap-5 rounded-[20px] bg-card p-8 shadow-[0_4px_24px_#1E3A5F10] w-full max-w-[340px]">
              <div className={`flex items-center justify-center w-9 h-9 rounded-[18px] bg-gradient-to-b ${step.numGradient}`}>
                <span className="text-[15px] font-bold text-white">{step.num}</span>
              </div>
              <IconBox size="lg" className={`w-14 h-14 rounded-[16px] ${step.iconBg}`}>
                {step.icon}
              </IconBox>
              <h3 className="text-lg font-bold text-secondary-foreground text-center">{step.title}</h3>
              <p className="text-[15px] text-muted-foreground text-center leading-relaxed max-w-[280px]">{step.desc}</p>
            </div>
          </>
        ))}
      </div>
    </PageSection>
  );
}

function DataSources() {
  return (
    <PageSection id="datenquellen" className="bg-gradient-to-b from-secondary via-secondary/40 to-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<Database className="w-3.5 h-3.5" />}
            label="Datenquellen"
            className="bg-secondary text-primary"
          />
        }
        title="Gestützt auf offizielle Rechtsquellen"
        titleClassName="text-secondary-foreground"
        subtitle="Alma Lex nutzt ausschliesslich offizielle Schweizer Rechtsquellen. Dieselben, die auch an Uni und Berufsschule verwendet werden."
        subtitleClassName="text-muted-foreground"
      />

      <div className="flex flex-col md:flex-row justify-center gap-8 w-full">
        <SourceCard
          accentGradient="from-[#3B82C4] to-[#6B9E7A]"
          icon={<BookOpen className="w-[26px] h-[26px] text-primary" />}
          iconBg="bg-secondary"
          title="Bundesrecht"
          subtitle="Systematische Rechtssammlung"
          desc="Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB) und weitere Bundesgesetze aus der offiziellen Systematischen Rechtssammlung. Vollständig durchsuchbar und stets aktuell."
          url="fedlex.admin.ch"
          urlColor="text-primary"
        />
        <SourceCard
          accentGradient="from-[#F5A623] to-[#D4911C]"
          icon={<Landmark className="w-[26px] h-[26px] text-warning" />}
          iconBg="bg-[#FEF3C7]"
          title="Bundesgerichtsentscheide"
          subtitle="Leitentscheide & Urteile"
          desc="Leitentscheide und Urteile des Schweizerischen Bundesgerichts, durchsuchbar nach Rechtsgebiet, Thema und Gesetzesartikel."
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
  icon: React.ReactNode;
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

function Privacy() {
  let cards = [
    { icon: <HardDrive className="w-6 h-6 text-accent-foreground" />, iconGradient: "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]", title: "Keine Speicherung", desc: "Deine Chatverläufe bleiben lokal in deinem Browser. Nichts wird auf unseren Servern gespeichert." },
    { icon: <Flag className="w-6 h-6 text-primary" />, iconGradient: "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]", title: "KI aus Genf", desc: "Die KI-Modelle laufen bei Infomaniak, einem Schweizer Cloud-Anbieter mit Rechenzentrum in Genf." },
    { icon: <Globe className="w-6 h-6 text-primary" />, iconGradient: "from-[#3B82C418] to-[#3B82C408] shadow-[0_2px_8px_#3B82C415]", title: "Server in Europa", desc: "Die Anwendung läuft auf einem eigenen Server in Finnland. Keine US-Cloud, alle Daten bleiben in Europa." },
  ];
  let cards2 = [
    { icon: <ShieldOff className="w-6 h-6 text-warning" />, iconGradient: "from-[#F5A62318] to-[#F5A62308] shadow-[0_2px_8px_#F5A62315]", title: "Kein KI-Training", desc: "Deine Eingaben werden nie zum Trainieren von KI-Modellen verwendet." },
    { icon: <UserX className="w-6 h-6 text-accent-foreground" />, iconGradient: "from-[#6B9E7A18] to-[#6B9E7A08] shadow-[0_2px_8px_#6B9E7A15]", title: "Kein Login nötig", desc: "Einfach loslegen. Kein Account, keine E-Mail, keine persönlichen Daten nötig." },
  ];

  return (
    <PageSection id="datenschutz" className="bg-gradient-to-b from-accent to-background">
      <SectionHeader
        badge={
          <SectionBadge
            icon={<ShieldCheck className="w-4 h-4" />}
            label="Datenschutz & Sicherheit"
            className="bg-card text-accent-foreground shadow-[0_2px_8px_#6B9E7A20]"
          />
        }
        title="Deine Daten gehören dir."
        titleClassName="text-secondary-foreground font-extrabold tracking-tight"
        subtitle="Kein Tracking, keine Cookies, keine versteckten Kosten. Privatsphäre ist kein Feature, sondern Grundprinzip."
        subtitleClassName="text-muted-foreground text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[1200px]">
        {cards.map((c) => (
          <FeatureCard
            key={c.title}
            icon={<IconBox className={`bg-gradient-to-b ${c.iconGradient}`}>{c.icon}</IconBox>}
            title={c.title}
            description={c.desc}
          />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[800px]">
        {cards2.map((c) => (
          <FeatureCard
            key={c.title}
            icon={<IconBox className={`bg-gradient-to-b ${c.iconGradient}`}>{c.icon}</IconBox>}
            title={c.title}
            description={c.desc}
          />
        ))}
      </div>
    </PageSection>
  );
}

function FAQ() {
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
        title="Häufig gestellte Fragen"
        titleClassName="text-secondary-foreground"
      />
      <div className="w-full max-w-[760px]">
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item) => (
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

function OpenSource() {
  let techCards = [
    { icon: <Database className="w-[22px] h-[22px] text-[#7CB5E3]" />, iconGradient: "from-[#3B82C430] to-[#3B82C410]", title: "Schweizer Rechtsdatenbank", desc: "Basierend auf Schweizer Bundesrecht und Bundesgerichtsentscheiden. Die KI durchsucht aktuelle Quellen vor jeder Antwort." },
    { icon: <Bot className="w-[22px] h-[22px] text-[#7CB5E3]" />, iconGradient: "from-[#3B82C430] to-[#3B82C410]", title: "Open-Source KI-Modelle", desc: "Mehrere Modelle zur Auswahl: GPT-OSS 120B, Qwen3, Llama 3.3, Apertus 70B und Mistral Small 3.2." },
    { icon: <Cpu className="w-[22px] h-[22px] text-[#8BC49A]" />, iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]", title: "Präzise juristische Suche", desc: "BGE-Multilingual-Gemma2 für semantische Suche. BGE-Reranker-v2-m3 für präzises Ranking der Suchergebnisse." },
    { icon: <Github className="w-[22px] h-[22px] text-[#8BC49A]" />, iconGradient: "from-[#6B9E7A30] to-[#6B9E7A10]", title: "Quellcode auf GitHub", desc: "Vollständiger Quellcode öffentlich verfügbar. Beiträge, Issues und Feedback willkommen." },
    { icon: <Flag className="w-[22px] h-[22px] text-[#F5C06A]" />, iconGradient: "from-[#F5A62330] to-[#F5A62310]", title: "KI-Hosting in der Schweiz", desc: "Alle KI-Modelle laufen bei Infomaniak in Genf. Keine Daten verlassen die Schweiz für die Verarbeitung." },
    { icon: <Shield className="w-[22px] h-[22px] text-[#F5C06A]" />, iconGradient: "from-[#F5A62330] to-[#F5A62310]", title: "Unabhängig von Big Tech", desc: "Kein OpenAI, kein Google, kein Microsoft. Ausschliesslich offene Modelle und eigene Infrastruktur." },
  ];

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
        title="Vollständig quelloffen."
        titleClassName="text-white font-extrabold tracking-tight"
        subtitle="Alma Lex ist eine kostenlose Open-Source Rechts-KI aus der Schweiz. Jede Zeile Code ist öffentlich auf GitHub einsehbar."
        subtitleClassName="text-[#94B8D9] text-lg max-w-[560px]"
        className="max-w-[700px]"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-[1200px]">
        {techCards.map((card) => (
          <div
            key={card.title}
            className="flex flex-col gap-3.5 rounded-[16px] bg-white/[0.03] border border-white/[0.07] p-7"
          >
            <div className="flex items-center gap-3">
              <IconBox size="md" className={`w-11 h-11 rounded-[12px] bg-gradient-to-b ${card.iconGradient}`}>
                {card.icon}
              </IconBox>
              <h3 className="text-[17px] font-bold text-white">{card.title}</h3>
            </div>
            <p className="text-sm text-[#94B8D9] leading-[1.6]">{card.desc}</p>
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
        Quellcode auf GitHub ansehen
        <ArrowRight className="w-[18px] h-[18px]" />
      </a>
    </PageSection>
  );
}
