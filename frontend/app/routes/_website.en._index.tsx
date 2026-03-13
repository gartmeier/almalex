import type { MetaFunction } from "react-router";
import type { LandingPageContent } from "~/components/website/landing-page";
import { LandingPage } from "~/components/website/landing-page";

export let meta: MetaFunction = () => [
  { title: "Alma Lex - Swiss Legal AI | Ask Questions About Swiss Law" },
  {
    name: "description",
    content:
      "Free Swiss legal AI: Ask questions about the Swiss Code of Obligations (OR), Civil Code (ZGB), Criminal Code (StGB) or Federal Court decisions and get source-backed answers. No login required.",
  },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Alma Lex - Swiss Legal AI for OR, ZGB & Federal Court Decisions" },
  {
    property: "og:description",
    content:
      "Swiss law questions answered: Ask the Swiss legal AI about OR, ZGB or Federal Court rulings. Source-backed, free, and no login required.",
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "en_US" },
  { property: "og:locale:alternate", content: "de_CH" },
  { property: "og:locale:alternate", content: "fr_CH" },
  { property: "og:site_name", content: "Alma Lex" },
  { property: "og:url", content: "https://almalex.ch/en" },
  { property: "og:image", content: "https://almalex.ch/og-image-en.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Alma Lex - Swiss Legal AI: Understand Swiss law in seconds." },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Alma Lex - Swiss Legal AI for OR, ZGB & Federal Court Decisions" },
  {
    name: "twitter:description",
    content:
      "Swiss law questions answered: Ask the Swiss legal AI about OR, ZGB or Federal Court rulings. Source-backed, free, and no login required.",
  },
  { name: "twitter:image", content: "https://almalex.ch/og-image-en.png" },
  { tagName: "link", rel: "canonical", href: "https://almalex.ch/en" },
  { tagName: "link", rel: "alternate", hrefLang: "de-CH", href: "https://almalex.ch/de" },
  { tagName: "link", rel: "alternate", hrefLang: "fr-CH", href: "https://almalex.ch/fr" },
  { tagName: "link", rel: "alternate", hrefLang: "en", href: "https://almalex.ch/en" },
  { tagName: "link", rel: "alternate", hrefLang: "x-default", href: "https://almalex.ch/de" },
];

let content: LandingPageContent = {
  jsonLd: {
    description:
      "Free Swiss legal AI. Answers legal questions about the Code of Obligations (OR), Civil Code (ZGB), Criminal Code (StGB) and Federal Court decisions with source references.",
    featureList: [
      "Swiss federal law search",
      "Federal Court decision search",
      "Source-backed AI answers",
      "No registration required",
      "Open source",
    ],
  },
  hero: {
    title: (
      <>
        Understand Swiss Law.
        <br />
        In Seconds.
      </>
    ),
    subtitle:
      "Ask your legal question about the Code of Obligations (OR), Civil Code (ZGB) or Federal Court decisions and get a source-backed answer in seconds. Free and without registration.",
    cta: "Ask a Question",
    trustBadges: ["100% free", "AI hosted in Switzerland", "No login required"],
  },
  chatPreview: {
    userMessage: "What is the notice period for a residential lease?",
    botResponse:
      "According to Art. 266c OR, the notice period for residential leases is at least three months, effective on a locally customary date...",
    sourceLabel: "Source: OR Art. 266c",
  },
  howItWorks: {
    sectionId: "how-it-works",
    badgeLabel: "How It Works",
    title: "Three steps to your answer",
    steps: [
      { title: "Ask your question", desc: "Type your legal question in plain language, whether about OR, ZGB, or a specific case." },
      { title: "Sources are searched", desc: "The AI searches federal law and thousands of Federal Court decisions in seconds." },
      { title: "Get your answer", desc: "You receive a clear answer with direct references to legal provisions and court rulings." },
    ],
  },
  dataSources: {
    sectionId: "data-sources",
    badgeLabel: "Data Sources",
    title: "Built on official legal sources",
    subtitle: "Alma Lex uses exclusively official Swiss legal sources. The same ones used at universities and law schools.",
    federal: {
      title: "Federal Law",
      subtitle: "Classified Compilation of Federal Legislation",
      desc: "Code of Obligations (OR), Civil Code (ZGB), Criminal Code (StGB) and other federal statutes from the official Classified Compilation. Fully searchable and always up to date.",
    },
    court: {
      title: "Federal Court Decisions",
      subtitle: "Leading Cases & Rulings",
      desc: "Leading cases and rulings of the Swiss Federal Court, searchable by area of law, topic, and legal provision.",
    },
  },
  privacy: {
    sectionId: "privacy",
    badgeLabel: "Privacy & Security",
    title: "Your data belongs to you.",
    subtitle: "No tracking, no cookies, no hidden costs. Privacy is not a feature, it is a core principle.",
    cards: [
      { title: "No data stored", desc: "Your chat histories stay locally in your browser. Nothing is stored on our servers." },
      { title: "AI hosted in Geneva", desc: "The AI models run at Infomaniak, a Swiss cloud provider with a datacenter in Geneva." },
      { title: "Server in Europe", desc: "The application runs on a dedicated server in Finland. No US cloud, all data stays in Europe." },
    ],
    cards2: [
      { title: "No AI training", desc: "Your inputs are never used to train AI models." },
      { title: "No login needed", desc: "Just get started. No account, no email, no personal data required." },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      { value: "what-is", q: "What is Alma Lex?", a: "Alma Lex is a free Swiss legal AI. It searches federal law and Federal Court decisions to answer your legal questions clearly and with source references. No login required." },
      { value: "how-to-start", q: "How do I start a chat?", a: "Simply type your question into the input field and press Enter. Alma Lex will respond immediately. No account or login needed." },
      { value: "what-questions", q: "What kind of questions can I ask?", a: "You can ask questions about any area of Swiss law, such as the Code of Obligations (OR), Civil Code (ZGB), Criminal Code (StGB), tenancy law, employment law, or family law. Alma Lex searches federal statutes and thousands of Federal Court decisions." },
      { value: "sources", q: "Where does the information come from?", a: "Alma Lex uses exclusively official Swiss legal sources: the Classified Compilation of Federal Legislation (fedlex.admin.ch) and Federal Court decisions (bger.ch). The same sources used at universities and law schools." },
      { value: "accuracy", q: "How accurate are the answers?", a: "Every answer includes references to the relevant legal provisions and court rulings. Alma Lex provides a solid first orientation but does not replace professional legal advice. For specific legal matters, always consult a qualified professional." },
      { value: "privacy", q: "Is my data safe?", a: "Yes. Chat histories stay locally in your browser. The AI models run at Infomaniak, a Swiss cloud provider with a datacenter in Geneva. The application itself runs on a server in Finland. Your inputs are neither stored nor used for AI training." },
      { value: "costs", q: "What does it cost?", a: "Alma Lex is completely free. No hidden costs, no subscription, no ads." },
      { value: "open-source", q: "Is Alma Lex open source?", a: "Yes, the complete source code is publicly available on GitHub. Every line of code, from the AI pipeline to the frontend, can be inspected." },
      { value: "limitations", q: "What are the limitations?", a: "Alma Lex does not replace professional legal advice. The answers provide a first orientation but may not account for all case-specific nuances. For specific legal matters, you should consult a qualified professional." },
      { value: "languages", q: "In which languages can I ask questions?", a: "You can ask your questions in English. The legal sources are available in German. Additional language support is planned." },
    ],
  },
  openSource: {
    title: "Fully open source.",
    subtitle: "Alma Lex is a free, open-source legal AI from Switzerland. Every line of code is publicly available on GitHub.",
    cards: [
      { title: "Swiss Legal Database", desc: "Built on Swiss federal law and Federal Court decisions. The AI searches current sources before every answer." },
      { title: "Open-Source AI Models", desc: "Multiple models to choose from: GPT-OSS 120B, Qwen3, Llama 3.3, Apertus 70B, and Mistral Small 3.2." },
      { title: "Precise Legal Search", desc: "BGE-Multilingual-Gemma2 for semantic search. BGE-Reranker-v2-m3 for precise ranking of search results." },
      { title: "Source Code on GitHub", desc: "Complete source code publicly available. Contributions, issues, and feedback welcome." },
      { title: "AI Hosted in Switzerland", desc: "All AI models run at Infomaniak in Geneva. No data leaves Switzerland for processing." },
      { title: "Independent of Big Tech", desc: "No OpenAI, no Google, no Microsoft. Exclusively open models and self-hosted infrastructure." },
    ],
    githubCta: "View Source Code on GitHub",
  },
};

export default function EnglishLandingPage() {
  return <LandingPage content={content} />;
}
