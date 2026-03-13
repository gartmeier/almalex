import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Nutzungsbedingungen | Alma Lex" },
  {
    name: "description",
    content:
      "Nutzungsbedingungen von Alma Lex, einer kostenlosen, quelloffenen Schweizer Rechts-KI von Joshua Gartmeier. Schweizer Recht, Gerichtsstand Zürich.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("de");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Nutzungsbedingungen</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Angaben zum Betreiber</h2>
          <p className="mb-4">
            Joshua Gartmeier
            <br />
            Burgdorf, Schweiz
            <br />
            E-Mail:{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
          </p>
          <p className="mb-4">
            Alma Lex ist eine kostenlose, quelloffene Schweizer Rechts-KI. Der
            Quellcode ist offen einsehbar. Es handelt sich nicht um ein
            kommerzielles Angebot.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Nutzungsbedingungen</h2>

          <p className="text-muted-foreground mb-4 text-sm">
            Gültig ab: März 2026
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            1. Akzeptanz der Bedingungen
          </h3>
          <p className="mb-4">
            Durch die Nutzung von Alma Lex stimmst du diesen Nutzungsbedingungen
            zu. Falls du nicht einverstanden bist, nutze den Service bitte
            nicht.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            2. Servicebeschreibung
          </h3>
          <p className="mb-4">
            Alma Lex ist eine kostenlose, quelloffene Rechts-KI, betrieben von
            Joshua Gartmeier. Sie stellt rechtliche Informationen basierend auf
            Schweizer Recht bereit. Die KI-Modelle laufen bei Infomaniak in Genf
            (Schweiz), die Anwendung auf einem eigenen Server in Finnland (EU).
            Alma Lex ersetzt keine professionelle Rechtsberatung.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            3. Nutzungsbeschränkungen
          </h3>
          <p className="mb-4">Du verpflichtest dich:</p>
          <ul className="mb-4 list-disc pl-6">
            <li>Den Service nur für rechtmässige Zwecke zu nutzen</li>
            <li>
              Keine automatisierten Systeme oder Software für den Zugriff zu
              verwenden
            </li>
            <li>Die Rechte anderer zu respektieren</li>
            <li>
              Keine Versuche zu unternehmen, den Service zu hacken oder zu
              stören
            </li>
          </ul>
          <p className="mb-4">
            Du kannst persönliche Informationen in Chats teilen, wenn du
            möchtest. Beachte aber, dass Nachrichten zur Verarbeitung an unsere
            Server gesendet werden. Nach der Antwort werden sie dort verworfen.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            4. Geistiges Eigentum
          </h3>
          <p className="mb-4">
            Alle Inhalte, Marken und Technologien von Alma Lex sind
            urheberrechtlich geschützt. Der Quellcode ist quelloffen verfügbar.
            Du erhältst eine beschränkte, nicht übertragbare Lizenz zur
            persönlichen Nutzung des Services.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            5. Kostenloser Service
          </h3>
          <p className="mb-4">
            Alma Lex ist ein kostenloses Angebot. Es besteht kein Anspruch auf
            dauerhafte Verfügbarkeit. Der Service kann jederzeit und ohne
            Vorankündigung geändert oder eingestellt werden.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">6. Änderungen</h3>
          <p className="mb-4">
            Funktionen und Bedingungen können jederzeit ohne Ankündigung
            geändert werden. Die aktuelle Version der Nutzungsbedingungen
            findest du immer auf dieser Seite.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Haftungsausschluss</h2>
          <p className="mb-4">
            Alma Lex wird ohne Gewähr bereitgestellt. Es wird keine Garantie
            übernommen für:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              Die Vollständigkeit oder Richtigkeit der bereitgestellten
              Informationen
            </li>
            <li>Die Eignung für einen bestimmten Zweck</li>
            <li>Ununterbrochene oder fehlerfreie Verfügbarkeit</li>
          </ul>
          <p className="mb-4">
            Für rechtlich relevante Angelegenheiten konsultiere bitte eine
            qualifizierte Fachperson. Die KI-generierten Antworten können
            fehlerhaft oder unvollständig sein.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            Haftungsbeschränkung
          </h3>
          <p className="mb-4">
            Joshua Gartmeier übernimmt keinerlei Haftung für Schäden, die aus
            der Nutzung von Alma Lex entstehen. Die Nutzung erfolgt vollständig
            auf eigenes Risiko.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Anwendbares Recht</h2>
          <p className="mb-4">
            Die Nutzung von Alma Lex und diese Bestimmungen unterliegen
            schweizerischem Recht. Gerichtsstand ist Zürich, Schweiz.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Kontakt</h2>
          <p className="mb-4">
            Bei Fragen erreichst du uns unter:
            <br />
            E-Mail:{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
            <br />
            Joshua Gartmeier, Burgdorf, Schweiz
          </p>

          <p className="mt-8 text-sm">
            Informationen zum Datenschutz findest du auf der{" "}
            <a href="/de/datenschutz" className="underline">
              Datenschutz-Seite
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
