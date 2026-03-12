import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("de");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Richtlinien</h1>

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Datenschutzerklärung</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4 text-sm">
              Letzte Aktualisierung: März 2026
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">1. Einleitung</h3>
            <p className="mb-4">
              Alma Lex ist ein Showcase-Projekt von Joshua Gartmeier. Diese
              Datenschutzerklärung informiert dich über den Umgang mit Daten in
              diesem Showcase. Nachrichten werden nur auf deinem Gerät
              gespeichert.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              2. Datenerhebung
            </h3>
            <p className="mb-4">Dieser Showcase speichert:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Alle Unterhaltungen bleiben auf deinem Gerät gespeichert</li>
              <li>
                Nachrichten werden temporär auf Schweizer/EU-Servern verarbeitet
              </li>
              <li>
                Es werden keine Benutzerinformationen gespeichert oder für
                Trainingszwecke verwendet
              </li>
              <li>Keine persönlichen Daten oder Benutzerkonten</li>
              <li>Minimale technische Daten für den Betrieb</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              3. Verwendungszweck
            </h3>
            <p className="mb-4">Die minimalen Daten werden verwendet für:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Bereitstellung der Showcase-Funktionalität</li>
              <li>Generierung von KI-Antworten</li>
              <li>Technische Fehleranalyse</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              4. Datenspeicherung
            </h3>
            <p className="mb-4">
              Alle Unterhaltungen bleiben auf deinem Gerät gespeichert.
              Nachrichten werden temporär auf Schweizer/EU-Servern mit strengen
              Datenschutzbestimmungen verarbeitet. Es werden keine Daten
              gespeichert oder für Trainingszwecke verwendet.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              5. Ihre Kontrolle
            </h3>
            <p className="mb-4">
              Da keine persönlichen Daten erhoben werden und alle Unterhaltungen
              auf Ihrem Gerät verbleiben, haben Sie volle Kontrolle:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Löschen Sie Ihre Browser-Daten, um Chats zu entfernen</li>
              <li>Unterhaltungen bleiben auf Ihrem Gerät</li>
              <li>Erstellen Sie jederzeit einen neuen Chat</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">5. Sicherheit</h3>
            <p className="mb-4">
              Datenübertragungen erfolgen über SSL/TLS-verschlüsselte
              Verbindungen. Alle Unterhaltungen bleiben auf deinem Gerät, und
              Nachrichten werden temporär auf Schweizer/EU-Servern mit strengen
              Datenschutzbestimmungen verarbeitet.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">6. Kontakt</h3>
            <p className="mb-4">
              Bei Fragen zum Datenschutz kontaktieren Sie uns unter:
              <br />
              E-Mail: hello@almalex.ch
              <br />
              Joshua Gartmeier, Burgdorf, Schweiz
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Nutzungsbedingungen</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4 text-sm">
              Gültig ab: Januar 2025
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              1. Akzeptanz der Bedingungen
            </h3>
            <p className="mb-4">
              Durch die Nutzung von Alma Lex stimmen Sie diesen
              Nutzungsbedingungen zu. Wenn Sie nicht einverstanden sind,
              verwenden Sie unseren Service bitte nicht.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              2. Servicebeschreibung
            </h3>
            <p className="mb-4">
              Alma Lex ist ein Showcase-Projekt von Joshua Gartmeier - eine
              KI-gestützte Plattform, die rechtliche Informationen basierend auf
              Schweizer Recht bereitstellt. Dieser Service ist ein Showcase und
              ersetzt keine professionelle Beratung.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              3. Nutzungsbeschränkungen
            </h3>
            <p className="mb-4">Sie verpflichten sich:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Den Service nur für rechtmässige Zwecke zu nutzen</li>
              <li>
                Keine sensiblen oder persönlichen Informationen in Chats zu
                teilen
              </li>
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

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              4. Geistiges Eigentum
            </h3>
            <p className="mb-4">
              Alle Inhalte, Marken und Technologien von Alma Lex sind
              urheberrechtlich geschützt. Sie erhalten eine beschränkte, nicht
              übertragbare Lizenz zur persönlichen Nutzung des Services.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              5. Haftungsausschluss
            </h3>
            <p className="mb-4">
              Alma Lex wird "wie besehen" bereitgestellt. Wir übernehmen keine
              Garantie für:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Die Vollständigkeit oder Richtigkeit der Informationen</li>
              <li>Die Eignung für einen bestimmten Zweck</li>
              <li>Ununterbrochene oder fehlerfreie Verfügbarkeit</li>
            </ul>
            <p className="mb-4">
              Für wichtige Angelegenheiten konsultiere eine Fachperson.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              6. Haftungsbeschränkung
            </h3>
            <p className="mb-4">
              Da dies ein Showcase-Projekt ist, übernimmt Joshua Gartmeier
              keinerlei Haftung für Schäden. Die Nutzung erfolgt auf eigenes
              Risiko.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">7. Demo-Nutzung</h3>
            <p className="mb-4">
              Dieser Showcase kann jederzeit und ohne Vorankündigung geändert
              oder eingestellt werden. Es besteht kein Anspruch auf dauerhafte
              Verfügbarkeit.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">8. Änderungen</h3>
            <p className="mb-4">
              Da dies ein Showcase-Projekt ist, können Funktionen und
              Bedingungen jederzeit ohne Ankündigung geändert werden.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              9. Anwendbares Recht
            </h3>
            <p className="mb-4">
              Diese Bedingungen unterliegen schweizerischem Recht. Gerichtsstand
              ist Zürich, Schweiz.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">10. Kontakt</h3>
            <p className="mb-4">
              Für Fragen zu diesen Bedingungen:
              <br />
              E-Mail: hello@almalex.ch
              <br />
              Joshua Gartmeier, Burgdorf, Schweiz
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
