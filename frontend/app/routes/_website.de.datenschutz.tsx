import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Datenschutz | Alma Lex" },
  {
    name: "description",
    content:
      "Datenschutzerklärung von Alma Lex, einer kostenlosen, quelloffenen Schweizer Rechts-KI. Keine Konten, keine Speicherung auf Servern, alles lokal.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("de");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Datenschutz</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4 text-sm">
          Letzte Aktualisierung: März 2026
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">1. Einleitung</h2>
        <p className="mb-4">
          Alma Lex ist eine kostenlose, quelloffene Schweizer Rechts-KI,
          betrieben von Joshua Gartmeier. Diese Seite informiert dich darüber,
          wie Alma Lex mit deinen Daten umgeht. Kurz gesagt: Deine
          Unterhaltungen bleiben auf deinem Gerät. Wir erheben keine
          persönlichen Daten und es ist kein Login nötig.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">2. Datenerhebung</h2>
        <p className="mb-4">
          Alma Lex ist so aufgebaut, dass möglichst wenig Daten anfallen:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            Alle Unterhaltungen werden ausschliesslich lokal auf deinem Gerät
            gespeichert (im Browser-Speicher)
          </li>
          <li>
            Nachrichten werden zur Verarbeitung an Schweizer und EU-Server
            gesendet und danach verworfen
          </li>
          <li>
            Es werden keine Benutzerkonten erstellt und keine persönlichen Daten
            erhoben
          </li>
          <li>Deine Eingaben werden nicht für KI-Training verwendet</li>
          <li>
            Minimale technische Daten (z.B. Server-Logs) fallen beim Betrieb an
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          3. Cookies und Analyse
        </h2>
        <p className="mb-4">
          Alma Lex verwendet keine Analyse- oder Tracking-Cookies. Es werden
          keine Drittanbieter-Tracking-Dienste eingesetzt. Technisch notwendige
          Cookies können für die Spracheinstellung und das gewählte Farbschema
          verwendet werden.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">4. Verwendungszweck</h2>
        <p className="mb-4">
          Die minimal anfallenden Daten werden ausschliesslich verwendet für:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>Die Bereitstellung der Alma Lex Funktionalität</li>
          <li>Die Generierung von KI-Antworten auf deine Anfragen</li>
          <li>Technische Fehleranalyse und Betriebssicherheit</li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          5. Datenspeicherung und Verarbeitung
        </h2>
        <p className="mb-4">
          Deine Unterhaltungen werden nicht auf unseren Servern gespeichert.
          Nachrichten werden zur Verarbeitung an Schweizer Server (Infomaniak,
          Rechenzentrum in Genf) und einen EU-Server (Finnland) übermittelt.
          Nach der Generierung der Antwort werden diese Daten verworfen. Es
          findet kein Training von KI-Modellen mit deinen Eingaben statt. Es
          werden keine US-Cloud-Dienste eingesetzt.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">6. Deine Kontrolle</h2>
        <p className="mb-4">
          Da alle Unterhaltungen lokal auf deinem Gerät liegen, hast du die
          volle Kontrolle:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            Lösche deine Browser-Daten, um alle gespeicherten Chats zu entfernen
          </li>
          <li>Starte jederzeit eine neue Unterhaltung</li>
          <li>
            Es gibt keine serverseitig gespeicherten Daten, die gelöscht werden
            müssten
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">7. Sicherheit</h2>
        <p className="mb-4">
          Alle Datenübertragungen zwischen deinem Browser und unseren Servern
          erfolgen über SSL/TLS-verschlüsselte Verbindungen. Die KI-Modelle
          laufen bei Infomaniak in Genf (Schweiz). Die Anwendung selbst läuft
          auf einem eigenen Server in Finnland (EU). Beide Standorte unterliegen
          strengen Datenschutzbestimmungen.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">8. Kontakt</h2>
        <p className="mb-4">
          Bei Fragen zum Datenschutz erreichst du uns unter:
          <br />
          E-Mail:{" "}
          <a href="mailto:hello@almalex.ch" className="underline">
            hello@almalex.ch
          </a>
          <br />
          Joshua Gartmeier, Burgdorf, Schweiz
        </p>

        <p className="mt-8 text-sm">
          Weitere rechtliche Informationen findest du in den{" "}
          <a href="/de/nutzungsbedingungen" className="underline">
            Nutzungsbedingungen
          </a>
          .
        </p>
      </div>
    </div>
  );
}
