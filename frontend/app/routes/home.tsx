import type { MetaFunction } from "react-router";
import { Link } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Alma Lex - Swiss Legal AI Assistant" },
    {
      name: "description",
      content:
        "Ask legal questions in German and get precise answers with citations from Swiss Federal Law and Federal Court decisions. Built by Joshua Gartmeier.",
    },
    {
      property: "og:title",
      content: "Alma Lex - Swiss Legal AI Assistant",
    },
    {
      property: "og:description",
      content:
        "Ask legal questions in German and get precise answers with citations from Swiss Federal Law and Federal Court decisions. Built by Joshua Gartmeier.",
    },
    { property: "og:type", content: "website" },
  ];
};

export default function HomePage() {
  return (
    <div className="min-h-screen px-4 py-12 pb-24">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold">Alma Lex</h1>
          <p className="text-muted-foreground text-xl">
            Swiss Legal AI Assistant
          </p>
        </div>

        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2>What It Does</h2>
          <p>
            Ask legal questions in German and get precise answers with citations from Swiss Federal Law and Federal Court decisions.
          </p>
          <p>
            Unlike ChatGPT, Alma Lex searches the actual legal sources:
          </p>
          <ul>
            <li><strong>Federal laws</strong> from <a href="https://www.fedlex.admin.ch/de/cc/internal-law/1" target="_blank" rel="noopener noreferrer">Fedlex</a></li>
            <li><strong>Federal court cases</strong> from <a href="https://search.bger.ch/ext/eurospider/live/de/php/clir/http/index_atf.php?lang=de" target="_blank" rel="noopener noreferrer">BGE</a></li>
          </ul>

          <h2>How It Works</h2>
          <ol>
            <li><strong>Ask your question</strong> - "Was ist die Verjährungsfrist für Vertragsansprüche?"</li>
            <li><strong>AI searches</strong> Swiss legal database for relevant articles and cases</li>
            <li><strong>Get precise answer</strong> with exact citations: "According to Article 127 OR..."</li>
          </ol>

          <h2>Try It Now</h2>
          <p>
            <strong>Demo limitations</strong>: 10 messages per week to demonstrate the system.
          </p>
          <p className="text-sm text-muted-foreground">
            Conversations stored temporarily for demo purposes. No personal information collected. For informational use only - not legal advice.
          </p>


        </article>
      </div>

      {/* Fixed bottom bar with demo button */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-4 z-50">
        <div className="mx-auto max-w-4xl text-center">
          <Link
            to="/chat/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-lg px-8 py-3 font-semibold transition-colors mb-3"
          >
            Try the Live Demo
          </Link>
          <p className="text-sm text-muted-foreground">
            Built by <a href="https://www.linkedin.com/in/gartmeier/" target="_blank" rel="noopener noreferrer" className="text-foreground hover:underline font-medium">Joshua Gartmeier</a> • Follow the development story on LinkedIn
          </p>
        </div>
      </div>
    </div>
  );
}
