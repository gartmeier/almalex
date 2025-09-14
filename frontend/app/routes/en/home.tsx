import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { 
  Scale, 
  Search, 
  MessageSquare, 
  AlertTriangle,
  Globe,
  Zap,
  BookOpen,
  Shield
} from "lucide-react";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export const meta: MetaFunction = () => {
  return [
    { title: "Alma Lex - Swiss Legal AI Assistant Demo" },
    {
      name: "description",
      content:
        "Demo project by Joshua Gartmeier. Ask legal questions and get AI-powered answers from Swiss Federal Law and Court decisions. Free showcase of legal AI technology.",
    },
    {
      property: "og:title",
      content: "Alma Lex - Swiss Legal AI Assistant Demo",
    },
    {
      property: "og:description",
      content:
        "Demo project by Joshua Gartmeier. Ask legal questions and get AI-powered answers from Swiss Federal Law and Court decisions.",
    },
    { property: "og:type", content: "website" },
  ];
};

export default function HomePage() {
  useLanguageRedirect("en");
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="mr-2 h-4 w-4" />
            Demo Project by Joshua Gartmeier
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Alma Lex
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Swiss Legal AI Assistant
          </p>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg">
            Experience how AI can transform legal research. Ask questions in any language 
            and get precise answers with citations from Swiss Federal Law and Court decisions.
          </p>

          <Link
            to="/chat/new"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Try the Live Demo
          </Link>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              DE / FR / EN
            </span>
            <span className="flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              No Login Required
            </span>
            <span className="flex items-center">
              <Zap className="mr-1 h-4 w-4" />
              100% Free Demo
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">How It Works</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Ask Your Question</h3>
              <p className="text-sm text-muted-foreground">
                Type your legal question in German, French, or English
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">AI Searches Sources</h3>
              <p className="text-sm text-muted-foreground">
                Searches official Swiss legal databases in real-time
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Get Precise Answer</h3>
              <p className="text-sm text-muted-foreground">
                Receive answers with exact article citations and case references
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Real Legal Sources</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-6">
              <BookOpen className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Federal Laws</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Direct access to the complete Swiss legal code from Fedlex (SR)
              </p>
              <a
                href="https://www.fedlex.admin.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                fedlex.admin.ch →
              </a>
            </div>

            <div className="rounded-lg border bg-background p-6">
              <Scale className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Court Decisions</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Federal Court rulings and precedents (BGE) for case law insights
              </p>
              <a
                href="https://www.bger.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-primary hover:underline"
              >
                bger.ch →
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h3 className="mb-2 font-semibold">Important Notice</h3>
                <p className="text-sm text-muted-foreground">
                  This is a technical demonstration. Chats are public and accessible via URL. 
                  Do not share sensitive information. For real legal matters, consult a qualified lawyer.
                  Chats are automatically deleted after 30 days of inactivity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">About This Project</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Alma Lex is a showcase project demonstrating how AI can make Swiss legal 
            information more accessible. Built as a technical demonstration to explore 
            the intersection of law and artificial intelligence.
          </p>
          
          <div className="inline-flex flex-col items-center rounded-lg border bg-muted/30 px-8 py-6">
            <p className="mb-3 text-sm text-muted-foreground">Built by</p>
            <a
              href="https://www.linkedin.com/in/gartmeier/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold hover:underline"
            >
              Joshua Gartmeier
            </a>
            <p className="mt-1 text-sm text-muted-foreground">Burgdorf, Switzerland</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/en/faq"
              className="text-sm font-medium text-primary hover:underline"
            >
              FAQ
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/en/policies"
              className="text-sm font-medium text-primary hover:underline"
            >
              Privacy & Terms
            </Link>
            <span className="text-muted-foreground">•</span>
            <a
              href="mailto:hello@almalex.ch"
              className="text-sm font-medium text-primary hover:underline"
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="border-t bg-primary/5 px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Ready to Try It?</h2>
          <p className="mb-6 text-muted-foreground">
            Experience the future of legal research with AI
          </p>
          <Link
            to="/chat/new"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Start Demo Chat
          </Link>
        </div>
      </section>
    </div>
  );
}