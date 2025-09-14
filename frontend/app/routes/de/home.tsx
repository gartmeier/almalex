import {
  AlertTriangle,
  BookOpen,
  Globe,
  MessageSquare,
  Scale,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export const meta: MetaFunction = () => {
  return [
    { title: "Alma Lex - Schweizer KI-Rechtsassistent Demo" },
    {
      name: "description",
      content:
        "Demo-Projekt von Joshua Gartmeier. Stellen Sie Rechtsfragen und erhalten Sie KI-gestützte Antworten aus dem Schweizer Bundesrecht und Gerichtsentscheiden. Kostenlose Demonstration der Legal-KI-Technologie.",
    },
    {
      property: "og:title",
      content: "Alma Lex - Schweizer KI-Rechtsassistent Demo",
    },
    {
      property: "og:description",
      content:
        "Demo-Projekt von Joshua Gartmeier. Stellen Sie Rechtsfragen und erhalten Sie KI-gestützte Antworten aus dem Schweizer Bundesrecht und Gerichtsentscheiden.",
    },
    { property: "og:type", content: "website" },
  ];
};

export default function HomePage() {
  useLanguageRedirect("de");

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="from-primary/5 to-background relative overflow-hidden bg-gradient-to-b px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="bg-primary/10 text-primary mb-6 inline-flex items-center rounded-full px-4 py-1.5 text-sm font-medium">
            <Zap className="mr-2 h-4 w-4" />
            Demo-Projekt von Joshua Gartmeier
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Alma Lex
          </h1>

          <p className="text-muted-foreground mb-8 text-xl md:text-2xl">
            Schweizer KI-Rechtsassistent
          </p>

          <p className="mx-auto mb-10 max-w-2xl text-lg">
            Erleben Sie, wie KI die Rechtsrecherche transformieren kann. Stellen
            Sie Fragen in jeder Sprache und erhalten Sie präzise Antworten mit
            Zitaten aus dem Schweizer Bundesrecht und Gerichtsentscheiden.
          </p>

          <Link
            to="/chat/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-8 py-4 text-lg font-semibold transition-all hover:scale-105"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Live-Demo ausprobieren
          </Link>

          <div className="text-muted-foreground mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              DE / FR / EN
            </span>
            <span className="flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              Keine Anmeldung nötig
            </span>
            <span className="flex items-center">
              <Zap className="mr-1 h-4 w-4" />
              100% kostenlose Demo
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            So funktioniert's
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Frage stellen</h3>
              <p className="text-muted-foreground text-sm">
                Geben Sie Ihre Rechtsfrage auf Deutsch, Französisch oder
                Englisch ein
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Search className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                KI durchsucht Quellen
              </h3>
              <p className="text-muted-foreground text-sm">
                Durchsucht offizielle Schweizer Rechtsdatenbanken in Echtzeit
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full">
                  <Scale className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">
                Präzise Antwort erhalten
              </h3>
              <p className="text-muted-foreground text-sm">
                Erhalten Sie Antworten mit exakten Artikelzitaten und
                Fallverweisen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 border-t px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Echte Rechtsquellen
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-background rounded-lg border p-6">
              <BookOpen className="text-primary mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">Bundesgesetze</h3>
              <p className="text-muted-foreground mb-3 text-sm">
                Direkter Zugriff auf die vollständige Systematische
                Rechtssammlung (SR) von Fedlex
              </p>
              <a
                href="https://www.fedlex.admin.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline"
              >
                fedlex.admin.ch →
              </a>
            </div>

            <div className="bg-background rounded-lg border p-6">
              <Scale className="text-primary mb-3 h-8 w-8" />
              <h3 className="mb-2 text-lg font-semibold">Gerichtsentscheide</h3>
              <p className="text-muted-foreground mb-3 text-sm">
                Bundesgerichtsurteile und Präzedenzfälle (BGE) für
                Fallrecht-Einblicke
              </p>
              <a
                href="https://www.bger.ch"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline"
              >
                bger.ch →
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6 dark:border-amber-900 dark:bg-amber-950/30">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 text-amber-600 dark:text-amber-500" />
              <div>
                <h3 className="mb-2 font-semibold">Wichtiger Hinweis</h3>
                <p className="text-muted-foreground text-sm">
                  Dies ist eine technische Demonstration. Chats sind öffentlich
                  und über URL zugänglich. Teilen Sie keine sensiblen
                  Informationen. Für echte Rechtsfälle konsultieren Sie einen
                  qualifizierten Anwalt. Chats werden automatisch nach 30 Tagen
                  Inaktivität gelöscht.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">Über dieses Projekt</h2>
          <p className="text-muted-foreground mb-8 text-lg">
            Alma Lex ist ein Showcase-Projekt, das zeigt, wie KI Schweizer
            Rechtsinformationen zugänglicher machen kann. Entwickelt als
            technische Demonstration, um die Schnittstelle zwischen Recht und
            künstlicher Intelligenz zu erkunden.
          </p>

          <div className="bg-muted/30 inline-flex flex-col items-center rounded-lg border px-8 py-6">
            <p className="text-muted-foreground mb-3 text-sm">Entwickelt von</p>
            <a
              href="https://www.linkedin.com/in/gartmeier/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold hover:underline"
            >
              Joshua Gartmeier
            </a>
            <p className="text-muted-foreground mt-1 text-sm">
              Burgdorf, Schweiz
            </p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/de/faq"
              className="text-primary text-sm font-medium hover:underline"
            >
              FAQ
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/de/policies"
              className="text-primary text-sm font-medium hover:underline"
            >
              Datenschutz & Bedingungen
            </Link>
            <span className="text-muted-foreground">•</span>
            <a
              href="mailto:hello@almalex.ch"
              className="text-primary text-sm font-medium hover:underline"
            >
              Kontakt
            </a>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-primary/5 border-t px-4 py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-2xl font-bold">Bereit zum Ausprobieren?</h2>
          <p className="text-muted-foreground mb-6">
            Erleben Sie die Zukunft der Rechtsrecherche mit KI
          </p>
          <Link
            to="/chat/new"
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center rounded-lg px-6 py-3 font-semibold transition-all"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Demo-Chat starten
          </Link>
        </div>
      </section>
    </div>
  );
}

