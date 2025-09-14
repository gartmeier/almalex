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
    { title: "Alma Lex - Assistant Juridique Suisse IA Démo" },
    {
      name: "description",
      content:
        "Projet de démonstration de Joshua Gartmeier. Posez des questions juridiques et obtenez des réponses basées sur l'IA du droit fédéral suisse et des décisions de justice. Démonstration gratuite de la technologie IA juridique.",
    },
    {
      property: "og:title",
      content: "Alma Lex - Assistant Juridique Suisse IA Démo",
    },
    {
      property: "og:description",
      content:
        "Projet de démonstration de Joshua Gartmeier. Posez des questions juridiques et obtenez des réponses basées sur l'IA du droit fédéral suisse et des décisions de justice.",
    },
    { property: "og:type", content: "website" },
  ];
};

export default function HomePage() {
  useLanguageRedirect("fr");
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background px-4 py-16 md:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="mr-2 h-4 w-4" />
            Projet de démonstration de Joshua Gartmeier
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Alma Lex
          </h1>
          
          <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
            Assistant Juridique Suisse IA
          </p>
          
          <p className="mx-auto mb-10 max-w-2xl text-lg">
            Découvrez comment l'IA peut transformer la recherche juridique. Posez des questions dans n'importe quelle langue 
            et obtenez des réponses précises avec des citations du droit fédéral suisse et des décisions de justice.
          </p>

          <Link
            to="/chat/new"
            className="inline-flex items-center rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Essayer la démo en direct
          </Link>

          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center">
              <Globe className="mr-1 h-4 w-4" />
              DE / FR / EN
            </span>
            <span className="flex items-center">
              <Shield className="mr-1 h-4 w-4" />
              Aucune inscription requise
            </span>
            <span className="flex items-center">
              <Zap className="mr-1 h-4 w-4" />
              Démo 100% gratuite
            </span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Comment ça marche</h2>
          
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <MessageSquare className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Posez votre question</h3>
              <p className="text-sm text-muted-foreground">
                Tapez votre question juridique en allemand, français ou anglais
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Search className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">L'IA recherche les sources</h3>
              <p className="text-sm text-muted-foreground">
                Recherche dans les bases de données juridiques suisses officielles en temps réel
              </p>
            </div>

            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
              </div>
              <h3 className="mb-2 text-lg font-semibold">Obtenez une réponse précise</h3>
              <p className="text-sm text-muted-foreground">
                Recevez des réponses avec des citations d'articles exacts et des références de cas
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-12 text-center text-3xl font-bold">Sources juridiques réelles</h2>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-6">
              <BookOpen className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-2 text-lg font-semibold">Lois fédérales</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Accès direct au Recueil systématique complet du droit suisse (RS) de Fedlex
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
              <h3 className="mb-2 text-lg font-semibold">Décisions de justice</h3>
              <p className="mb-3 text-sm text-muted-foreground">
                Arrêts du Tribunal fédéral et précédents (ATF) pour des aperçus de jurisprudence
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
                <h3 className="mb-2 font-semibold">Avis important</h3>
                <p className="text-sm text-muted-foreground">
                  Il s'agit d'une démonstration technique. Les chats sont publics et accessibles via URL. 
                  Ne partagez pas d'informations sensibles. Pour de vrais cas juridiques, consultez un avocat qualifié.
                  Les chats sont automatiquement supprimés après 30 jours d'inactivité.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="border-t px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold">À propos de ce projet</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Alma Lex est un projet de démonstration montrant comment l'IA peut rendre les informations 
            juridiques suisses plus accessibles. Construit comme une démonstration technique pour explorer 
            l'intersection du droit et de l'intelligence artificielle.
          </p>
          
          <div className="inline-flex flex-col items-center rounded-lg border bg-muted/30 px-8 py-6">
            <p className="mb-3 text-sm text-muted-foreground">Créé par</p>
            <a
              href="https://www.linkedin.com/in/gartmeier/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xl font-semibold hover:underline"
            >
              Joshua Gartmeier
            </a>
            <p className="mt-1 text-sm text-muted-foreground">Burgdorf, Suisse</p>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/fr/faq"
              className="text-sm font-medium text-primary hover:underline"
            >
              FAQ
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              to="/fr/policies"
              className="text-sm font-medium text-primary hover:underline"
            >
              Confidentialité & Conditions
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
          <h2 className="mb-4 text-2xl font-bold">Prêt à l'essayer ?</h2>
          <p className="mb-6 text-muted-foreground">
            Découvrez l'avenir de la recherche juridique avec l'IA
          </p>
          <Link
            to="/chat/new"
            className="inline-flex items-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90"
          >
            <MessageSquare className="mr-2 h-5 w-5" />
            Démarrer le chat démo
          </Link>
        </div>
      </section>
    </div>
  );
}