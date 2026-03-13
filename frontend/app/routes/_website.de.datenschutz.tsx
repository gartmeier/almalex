import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Datenschutzerklärung | Alma Lex" },
  {
    name: "description",
    content:
      "Datenschutzerklärung von Alma Lex: Erfahre, wie dieses Schweizer Rechts-KI-Showcase mit deinen Daten umgeht. Keine persönlichen Daten, keine Konten, alles lokal.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("de");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Datenschutzerklärung</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4 text-sm">
          Letzte Aktualisierung: März 2026
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">1. Einleitung</h2>
        <p className="mb-4">
          Alma Lex ist ein Showcase-Projekt von Joshua Gartmeier. Diese
          Datenschutzerklärung informiert dich darüber, wie dieses Projekt mit
          Daten umgeht. Kurz gesagt: Deine Unterhaltungen bleiben auf deinem
          Gerät, und wir erheben keine persönlichen Daten.
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
            Nachrichten werden temporär auf Schweizer und EU-Servern
            verarbeitet, um KI-Antworten zu generieren
          </li>
          <li>
            Es werden keine Benutzerkonten erstellt und keine persönlichen Daten
            erhoben
          </li>
          <li>Deine Eingaben werden nicht für Trainingszwecke verwendet</li>
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
          Cookies können für die Spracheinstellung verwendet werden.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">4. Verwendungszweck</h2>
        <p className="mb-4">
          Die minimal anfallenden Daten werden ausschliesslich verwendet für:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>Die Bereitstellung der Showcase-Funktionalität</li>
          <li>Die Generierung von KI-Antworten auf deine Anfragen</li>
          <li>Technische Fehleranalyse und Betriebssicherheit</li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          5. Datenspeicherung und Verarbeitung
        </h2>
        <p className="mb-4">
          Deine Unterhaltungen verlassen deinen Browser nicht dauerhaft.
          Nachrichten werden für die Verarbeitung temporär an Schweizer und
          EU-Server übermittelt. Nach der Generierung der Antwort werden diese
          Daten nicht weiter gespeichert. Es findet kein Training von
          KI-Modellen mit deinen Eingaben statt.
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
          erfolgen über SSL/TLS-verschlüsselte Verbindungen. Die
          Serververarbeitung findet ausschliesslich auf Schweizer und EU-Servern
          statt, die strengen Datenschutzbestimmungen unterliegen.
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
          Weitere rechtliche Informationen findest du im{" "}
          <a href="/de/impressum" className="underline">
            Impressum
          </a>
          .
        </p>
      </div>
    </div>
  );
}
