import type { MetaFunction } from "react-router";
import type { LandingPageContent } from "~/components/website/landing-page";
import { LandingPage } from "~/components/website/landing-page";

export let meta: MetaFunction = () => [
  { title: "Alma Lex - Schweizer Rechts-KI | OR, ZGB & StGB einfach erklärt" },
  {
    name: "description",
    content:
      "Kostenlose Schweizer Rechts-KI: Stelle Fragen zu OR, ZGB, StGB oder Bundesgerichtsentscheiden und erhalte quellenbasierte Antworten. Ohne Anmeldung.",
  },
  { name: "robots", content: "index, follow" },
  {
    property: "og:title",
    content:
      "Alma Lex - Schweizer Rechts-KI für OR, ZGB & Bundesgerichtsentscheide",
  },
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
  { property: "og:image", content: "https://almalex.ch/og-image-de.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  {
    property: "og:image:alt",
    content:
      "Alma Lex - Schweizer Rechts-KI: Schweizer Recht verstehen, in Sekunden.",
  },
  { name: "twitter:card", content: "summary_large_image" },
  {
    name: "twitter:title",
    content:
      "Alma Lex - Schweizer Rechts-KI für OR, ZGB & Bundesgerichtsentscheide",
  },
  {
    name: "twitter:description",
    content:
      "Rechtsfragen einfach beantwortet: Frag die Schweizer Rechts-KI zu OR, ZGB oder Bundesgerichtsurteilen. Quellenbasiert, kostenlos und ohne Login.",
  },
  { name: "twitter:image", content: "https://almalex.ch/og-image-de.png" },
  { tagName: "link", rel: "canonical", href: "https://almalex.ch/de" },
  {
    tagName: "link",
    rel: "alternate",
    hrefLang: "de-CH",
    href: "https://almalex.ch/de",
  },
  {
    tagName: "link",
    rel: "alternate",
    hrefLang: "fr-CH",
    href: "https://almalex.ch/fr",
  },
  {
    tagName: "link",
    rel: "alternate",
    hrefLang: "en",
    href: "https://almalex.ch/en",
  },
  {
    tagName: "link",
    rel: "alternate",
    hrefLang: "x-default",
    href: "https://almalex.ch/de",
  },
];

let content: LandingPageContent = {
  jsonLd: {
    description:
      "Kostenlose Schweizer Rechts-KI. Beantwortet Rechtsfragen zu Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB) und Bundesgerichtsentscheiden mit Quellenangaben.",
    featureList: [
      "Schweizer Bundesrecht durchsuchen",
      "Bundesgerichtsentscheide durchsuchen",
      "Quellenbasierte KI-Antworten",
      "Keine Anmeldung nötig",
      "Open Source",
    ],
  },
  hero: {
    title: (
      <>
        Schweizer Recht verstehen.
        <br />
        In Sekunden.
      </>
    ),
    subtitle:
      "Stell deine Rechtsfrage zum Obligationenrecht (OR), Zivilgesetzbuch (ZGB) oder zu Bundesgerichtsentscheiden und erhalte in Sekunden eine quellenbasierte Antwort. Kostenlos und ohne Anmeldung.",
    cta: "Jetzt Frage stellen",
    trustBadges: [
      "100% kostenlos",
      "KI aus der Schweiz",
      "Keine Anmeldung nötig",
    ],
  },
  chatPreview: {
    userMessage: "Wie lange ist die Kündigungsfrist bei einem Mietvertrag?",
    botResponse:
      "Gemäss Art. 266c OR beträgt die Kündigungsfrist für Wohnräume mindestens drei Monate, jeweils auf einen ortsüblichen Termin...",
    sourceLabel: "Quelle: OR Art. 266c",
  },
  howItWorks: {
    sectionId: "so-funktionierts",
    badgeLabel: "So funktioniert's",
    title: "In drei Schritten zur Antwort",
    steps: [
      {
        title: "Frage stellen",
        desc: "Stell deine Rechtsfrage in normaler Sprache, egal ob zu OR, ZGB oder einem konkreten Fall.",
      },
      {
        title: "Quellen durchsuchen",
        desc: "Die KI durchsucht Bundesrecht und tausende Bundesgerichtsentscheide in Sekunden.",
      },
      {
        title: "Antwort erhalten",
        desc: "Du erhältst eine verständliche Antwort mit direkten Verweisen auf Gesetzesartikel und Urteile.",
      },
    ],
  },
  dataSources: {
    sectionId: "datenquellen",
    badgeLabel: "Datenquellen",
    title: "Gestützt auf offizielle Rechtsquellen",
    subtitle:
      "Alma Lex nutzt ausschliesslich offizielle Schweizer Rechtsquellen. Dieselben, die auch an Uni und Berufsschule verwendet werden.",
    federal: {
      title: "Bundesrecht",
      subtitle: "Systematische Rechtssammlung",
      desc: "Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB) und weitere Bundesgesetze aus der offiziellen Systematischen Rechtssammlung. Vollständig durchsuchbar und stets aktuell.",
    },
    court: {
      title: "Bundesgerichtsentscheide",
      subtitle: "Leitentscheide & Urteile",
      desc: "Leitentscheide und Urteile des Schweizerischen Bundesgerichts, durchsuchbar nach Rechtsgebiet, Thema und Gesetzesartikel.",
    },
  },
  privacy: {
    sectionId: "datenschutz",
    badgeLabel: "Datenschutz & Sicherheit",
    title: "Deine Daten gehören dir.",
    subtitle:
      "Kein Tracking, keine Cookies, keine versteckten Kosten. Privatsphäre ist kein Feature, sondern Grundprinzip.",
    cards: [
      {
        title: "Keine Speicherung",
        desc: "Deine Chatverläufe bleiben lokal in deinem Browser. Nichts wird auf unseren Servern gespeichert.",
      },
      {
        title: "KI aus Genf",
        desc: "Die KI-Modelle laufen bei Infomaniak, einem Schweizer Cloud-Anbieter mit Rechenzentrum in Genf.",
      },
      {
        title: "Server in Europa",
        desc: "Die Anwendung läuft auf einem eigenen Server in Finnland. Keine US-Cloud, alle Daten bleiben in Europa.",
      },
    ],
    cards2: [
      {
        title: "Kein KI-Training",
        desc: "Deine Eingaben werden nie zum Trainieren von KI-Modellen verwendet.",
      },
      {
        title: "Kein Login nötig",
        desc: "Einfach loslegen. Kein Account, keine E-Mail, keine persönlichen Daten nötig.",
      },
    ],
  },
  faq: {
    title: "Häufig gestellte Fragen",
    items: [
      {
        value: "what-is",
        q: "Was ist Alma Lex?",
        a: "Alma Lex ist eine kostenlose Schweizer Rechts-KI. Sie durchsucht Bundesrecht und Bundesgerichtsentscheide und beantwortet deine Rechtsfragen verständlich und mit Quellenangaben. Ohne Anmeldung.",
      },
      {
        value: "how-to-start",
        q: "Wie beginne ich einen Chat?",
        a: "Gib einfach deine Frage ins Eingabefeld ein und drück Enter. Alma Lex antwortet dir sofort. Kein Account und keine Anmeldung nötig.",
      },
      {
        value: "what-questions",
        q: "Welche Fragen kann ich stellen?",
        a: "Du kannst Fragen zu allen Bereichen des Schweizer Rechts stellen, etwa zum Obligationenrecht (OR), Zivilgesetzbuch (ZGB), Strafgesetzbuch (StGB), Mietrecht, Arbeitsrecht oder Familienrecht. Alma Lex durchsucht Bundesgesetze und tausende Bundesgerichtsentscheide.",
      },
      {
        value: "sources",
        q: "Woher stammen die Informationen?",
        a: "Alma Lex nutzt ausschliesslich offizielle Schweizer Rechtsquellen: die Systematische Rechtssammlung (fedlex.admin.ch) und Bundesgerichtsentscheide (bger.ch). Dieselben Quellen, die auch an Uni und Berufsschule verwendet werden.",
      },
      {
        value: "accuracy",
        q: "Wie genau sind die Antworten?",
        a: "Jede Antwort enthält Quellenangaben zu den verwendeten Gesetzesartikeln und Urteilen. Alma Lex bietet eine gute erste Orientierung, ersetzt aber keine professionelle Rechtsberatung. Bei konkreten Rechtsfällen immer eine Fachperson beiziehen.",
      },
      {
        value: "privacy",
        q: "Sind meine Daten sicher?",
        a: "Ja. Chatverläufe bleiben lokal in deinem Browser. Die KI-Modelle laufen bei Infomaniak, einem Schweizer Anbieter mit Rechenzentrum in Genf. Die Anwendung selbst läuft auf einem Server in Finnland. Deine Eingaben werden weder gespeichert noch für KI-Training verwendet.",
      },
      {
        value: "costs",
        q: "Was kostet die Nutzung?",
        a: "Alma Lex ist komplett kostenlos. Ohne versteckte Kosten, ohne Abo, ohne Werbung.",
      },
      {
        value: "open-source",
        q: "Ist Alma Lex Open Source?",
        a: "Ja, der vollständige Quellcode ist öffentlich auf GitHub verfügbar. Jede Zeile Code, von der KI-Pipeline bis zum Frontend, kann eingesehen werden.",
      },
      {
        value: "limitations",
        q: "Was sind die Grenzen?",
        a: "Alma Lex ersetzt keine professionelle Rechtsberatung. Die Antworten bieten eine erste Orientierung, berücksichtigen aber nicht alle fallbezogenen Nuancen. Bei konkreten Rechtsfällen solltest du eine Fachperson beiziehen.",
      },
      {
        value: "languages",
        q: "In welchen Sprachen kann ich Fragen stellen?",
        a: "Du kannst deine Fragen auf Deutsch stellen. Die Rechtsquellen sind ebenfalls auf Deutsch verfügbar. Weitere Sprachen sind in Planung.",
      },
    ],
  },
  openSource: {
    title: "Vollständig quelloffen.",
    subtitle:
      "Alma Lex ist eine kostenlose Open-Source Rechts-KI aus der Schweiz. Jede Zeile Code ist öffentlich auf GitHub einsehbar.",
    cards: [
      {
        title: "Schweizer Rechtsdatenbank",
        desc: "Basierend auf Schweizer Bundesrecht und Bundesgerichtsentscheiden. Die KI durchsucht aktuelle Quellen vor jeder Antwort.",
      },
      {
        title: "Open-Source KI-Modelle",
        desc: "Mehrere Modelle zur Auswahl: GPT-OSS 120B, Qwen3, Llama 3.3, Apertus 70B und Mistral Small 3.2.",
      },
      {
        title: "Präzise juristische Suche",
        desc: "BGE-Multilingual-Gemma2 für semantische Suche. BGE-Reranker-v2-m3 für präzises Ranking der Suchergebnisse.",
      },
      {
        title: "Quellcode auf GitHub",
        desc: "Vollständiger Quellcode öffentlich verfügbar. Beiträge, Issues und Feedback willkommen.",
      },
      {
        title: "KI-Hosting in der Schweiz",
        desc: "Alle KI-Modelle laufen bei Infomaniak in Genf. Keine Daten verlassen die Schweiz für die Verarbeitung.",
      },
      {
        title: "Unabhängig von Big Tech",
        desc: "Kein OpenAI, kein Google, kein Microsoft. Ausschliesslich offene Modelle und eigene Infrastruktur.",
      },
    ],
    githubCta: "Quellcode auf GitHub ansehen",
  },
};

export default function DeLandingPage() {
  return <LandingPage content={content} />;
}
