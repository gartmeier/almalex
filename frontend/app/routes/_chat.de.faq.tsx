import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("de");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Häufig gestellte Fragen</h1>
      <p className="mb-8 text-sm text-gray-500">
        Letzte Aktualisierung: März 2026
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger aria-label="Was ist Alma Lex?">
            Was ist Alma Lex?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex ist ein Showcase-Projekt von Joshua Gartmeier - eine
            KI-gestützte Schweizer Rechtsassistenz, die zeigt, wie KI bei
            juristischen Fragen zum Schweizer Recht helfen kann.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-start">
          <AccordionTrigger>Wie beginne ich einen Chat?</AccordionTrigger>
          <AccordionContent>
            Geben Sie einfach Ihre Frage in das Eingabefeld unten ein und
            drücken Sie Enter oder klicken Sie auf den Senden-Button. Alma Lex
            wird Ihnen umgehend antworten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-questions">
          <AccordionTrigger>
            Welche Art von Fragen kann ich stellen?
          </AccordionTrigger>
          <AccordionContent>
            Sie können Fragen zu allen Bereichen des Schweizer Rechts stellen,
            einschliesslich Vertragsrecht, Arbeitsrecht, Mietrecht,
            Familienrecht und mehr. Alma Lex durchsucht relevante Schweizer
            Gesetze und Rechtsprechung für Sie.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accuracy">
          <AccordionTrigger>Wie genau sind die Antworten?</AccordionTrigger>
          <AccordionContent>
            Diese Demo nutzt KI-Technologie und Schweizer Rechtsdatenbanken zu
            Demonstrationszwecken. Für rechtlich bindende Entscheidungen sollten
            Sie immer einen qualifizierten Rechtsanwalt konsultieren.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy">
          <AccordionTrigger aria-label="Sind meine Chats privat?">
            Sind meine Chats privat?
          </AccordionTrigger>
          <AccordionContent>
            Ja, deine Chats sind privat und werden lokal auf deinem Gerät
            gespeichert. Nachrichten werden temporär auf Servern in der Schweiz
            und der EU mit strengen Datenschutzbestimmungen verarbeitet. Es
            werden keine Daten gespeichert oder für Trainingszwecke verwendet.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>
            In welchen Sprachen kann ich Fragen stellen?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex unterstützt Deutsch, Französisch und Englisch. Sie können
            die Sprache jederzeit über das Sprachmenü in der oberen rechten Ecke
            ändern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="costs">
          <AccordionTrigger>Was kostet die Nutzung?</AccordionTrigger>
          <AccordionContent>
            Diese Demo ist komplett kostenlos. Es handelt sich um ein
            Showcase-Projekt ohne kommerzielle Absichten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger aria-label="Woher stammen die rechtlichen Informationen?">
            Woher stammen die rechtlichen Informationen?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex durchsucht offizielle Schweizer Gesetzessammlungen,
            einschliesslich Bundesgerichtsentscheide und kantonale
            Gesetzgebungen.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger aria-label="Was sind die Grenzen von Alma Lex?">
            Was sind die Grenzen von Alma Lex?
          </AccordionTrigger>
          <AccordionContent>
            Dies ist ein Showcase-Projekt und ersetzt keine professionelle
            Rechtsberatung. Alma Lex bietet allgemeine Orientierung, kann jedoch
            keine fallbezogenen Nuancen berücksichtigen. Bei dringenden oder
            komplexen Angelegenheiten wenden Sie sich an eine juristische
            Fachperson.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>Kann ich frühere Chats einsehen?</AccordionTrigger>
          <AccordionContent>
            Ja, Sie können frühere Chats einsehen. Chats werden lokal auf Ihrem
            Gerät gespeichert und sind nur von diesem Gerät aus zugänglich.
            Keine Chats werden auf dem Server gespeichert.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
