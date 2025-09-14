import { Link } from "react-router";
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
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger>Was ist Alma Lex?</AccordionTrigger>
          <AccordionContent>
            Alma Lex ist ein Demo-Projekt von Joshua Gartmeier - eine KI-gestützte Schweizer 
            Rechtsassistenz, die zeigt, wie AI bei juristischen Fragen zum Schweizer Recht helfen kann.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-start">
          <AccordionTrigger>Wie beginne ich einen Chat?</AccordionTrigger>
          <AccordionContent>
            Geben Sie einfach Ihre Frage in das Eingabefeld unten ein und drücken Sie Enter 
            oder klicken Sie auf den Senden-Button. Alma Lex wird Ihnen umgehend antworten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-questions">
          <AccordionTrigger>Welche Art von Fragen kann ich stellen?</AccordionTrigger>
          <AccordionContent>
            Sie können Fragen zu allen Bereichen des Schweizer Rechts stellen, einschliesslich 
            Vertragsrecht, Arbeitsrecht, Mietrecht, Familienrecht und mehr. Alma Lex durchsucht 
            relevante Schweizer Gesetze und Rechtsprechung für Sie.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accuracy">
          <AccordionTrigger>Wie genau sind die Antworten?</AccordionTrigger>
          <AccordionContent>
            Diese Demo nutzt KI-Technologie und Schweizer Rechtsdatenbanken zu Demonstrationszwecken. 
            Für rechtlich bindende Entscheidungen sollten Sie immer einen qualifizierten 
            Rechtsanwalt konsultieren.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy">
          <AccordionTrigger>Sind meine Chats privat?</AccordionTrigger>
          <AccordionContent>
            Nein, Chats sind öffentlich. Jeder, der die URL kennt, kann den Chat einsehen. 
            Teilen Sie daher keine sensiblen Informationen. Chats werden automatisch 30 Tage 
            nach der letzten Nachricht gelöscht. Als Demo-Projekt werden keine persönlichen 
            Daten erhoben.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>In welchen Sprachen kann ich Fragen stellen?</AccordionTrigger>
          <AccordionContent>
            Alma Lex unterstützt Deutsch, Französisch und Englisch. Sie können die Sprache 
            jederzeit über das Sprachmenü in der oberen rechten Ecke ändern.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="costs">
          <AccordionTrigger>Was kostet die Nutzung?</AccordionTrigger>
          <AccordionContent>
            Diese Demo ist komplett kostenlos. Es handelt sich um ein Showcase-Projekt 
            ohne kommerzielle Absichten.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger>Woher stammen die rechtlichen Informationen?</AccordionTrigger>
          <AccordionContent>
            Alma Lex durchsucht offizielle Schweizer Rechtsquellen, einschliesslich der 
            Systematischen Rechtssammlung (SR), Bundesgerichtsentscheide und kantonale Gesetzgebungen.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger>Was sind die Grenzen von Alma Lex?</AccordionTrigger>
          <AccordionContent>
            Dies ist eine technische Demo und ersetzt keine professionelle Rechtsberatung. 
            Für echte rechtliche Fälle sollten Sie immer einen qualifizierten Anwalt konsultieren.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>Kann ich frühere Chats einsehen?</AccordionTrigger>
          <AccordionContent>
            Ja, Chats sind über ihre URL zugänglich. Beachten Sie, dass jeder mit dem Link 
            den Chat einsehen kann. Chats werden automatisch 30 Tage nach der letzten 
            Nachricht gelöscht.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
