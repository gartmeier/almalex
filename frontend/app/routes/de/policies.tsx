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
            <p className="text-sm text-muted-foreground mb-4">
              Letzte Aktualisierung: Januar 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Einleitung</h3>
            <p className="mb-4">
              Alma Lex ist ein Demo-Projekt von Joshua Gartmeier. Diese Datenschutzerklärung informiert Sie 
              über den Umgang mit Daten in dieser technischen Demo. Beachten Sie, dass alle Chats öffentlich 
              zugänglich sind.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Datenerhebung</h3>
            <p className="mb-4">Diese Demo speichert:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Chat-Verläufe (öffentlich zugänglich über URL)</li>
              <li>Keine persönlichen Daten oder Benutzerkonten</li>
              <li>Minimale technische Daten für den Betrieb</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Verwendungszweck</h3>
            <p className="mb-4">Die minimalen Daten werden verwendet für:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Bereitstellung der Demo-Funktionalität</li>
              <li>Technische Fehleranalyse</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Datenspeicherung</h3>
            <p className="mb-4">
              Chats sind öffentlich über ihre URL zugänglich und können von jedem eingesehen werden, 
              der den Link kennt. Chats werden automatisch 30 Tage nach der letzten Aktivität gelöscht. 
              Es werden keine persönlichen Daten erhoben oder gespeichert.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Öffentlichkeit der Chats</h3>
            <p className="mb-4">
              Beachten Sie, dass alle Chats öffentlich sind. Jeder, der die URL eines Chats kennt, 
              kann diesen einsehen. Teilen Sie daher keine sensiblen oder persönlichen Informationen 
              in den Chats.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Ihre Kontrolle</h3>
            <p className="mb-4">
              Da keine persönlichen Daten erhoben werden und Chats öffentlich sind, haben Sie volle Kontrolle:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Teilen Sie keine sensiblen Informationen</li>
              <li>Chats werden automatisch nach 30 Tagen Inaktivität gelöscht</li>
              <li>Erstellen Sie einfach einen neuen Chat für neue Konversationen</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Sicherheit</h3>
            <p className="mb-4">
              Datenübertragungen erfolgen über SSL/TLS-verschlüsselte Verbindungen. Bedenken Sie jedoch, 
              dass alle Chats öffentlich über ihre URL zugänglich sind. Teilen Sie daher keine vertraulichen 
              Informationen.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Kontakt</h3>
            <p className="mb-4">
              Bei Fragen zum Datenschutz kontaktieren Sie uns unter:<br />
              E-Mail: hello@gartmeier.dev<br />
              Joshua Gartmeier, Burgdorf, Schweiz
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Nutzungsbedingungen</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Gültig ab: Januar 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Akzeptanz der Bedingungen</h3>
            <p className="mb-4">
              Durch die Nutzung von Alma Lex stimmen Sie diesen Nutzungsbedingungen zu. Wenn Sie nicht 
              einverstanden sind, verwenden Sie unseren Service bitte nicht.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Servicebeschreibung</h3>
            <p className="mb-4">
              Alma Lex ist ein Demo-Projekt von Joshua Gartmeier - eine KI-gestützte Plattform, 
              die rechtliche Informationen basierend auf Schweizer Recht bereitstellt. Dieser Service ist eine 
              Demo, ersetzt keine professionelle Rechtsberatung und begründet kein Mandatsverhältnis.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Nutzungsbeschränkungen</h3>
            <p className="mb-4">Sie verpflichten sich:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Den Service nur für rechtmässige Zwecke zu nutzen</li>
              <li>Keine sensiblen oder persönlichen Informationen zu teilen (Chats sind öffentlich)</li>
              <li>Keine automatisierten Systeme oder Software für den Zugriff zu verwenden</li>
              <li>Die Rechte anderer zu respektieren</li>
              <li>Keine Versuche zu unternehmen, den Service zu hacken oder zu stören</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Geistiges Eigentum</h3>
            <p className="mb-4">
              Alle Inhalte, Marken und Technologien von Alma Lex sind urheberrechtlich geschützt. 
              Sie erhalten eine beschränkte, nicht übertragbare Lizenz zur persönlichen Nutzung des Services.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Haftungsausschluss</h3>
            <p className="mb-4">
              Alma Lex wird "wie besehen" bereitgestellt. Wir übernehmen keine Garantie für:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Die Vollständigkeit oder Richtigkeit der Informationen</li>
              <li>Die Eignung für einen bestimmten Zweck</li>
              <li>Ununterbrochene oder fehlerfreie Verfügbarkeit</li>
            </ul>
            <p className="mb-4">
              Für wichtige rechtliche Entscheidungen konsultieren Sie immer einen qualifizierten Anwalt.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Haftungsbeschränkung</h3>
            <p className="mb-4">
              Da dies ein Demo-Projekt ist, übernimmt Joshua Gartmeier keinerlei Haftung für 
              direkte, indirekte, zufällige oder Folgeschäden. Die Nutzung erfolgt auf eigenes Risiko.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Demo-Nutzung</h3>
            <p className="mb-4">
              Diese Demo kann jederzeit und ohne Vorankündigung geändert oder eingestellt werden. 
              Es besteht kein Anspruch auf dauerhafte Verfügbarkeit.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Änderungen</h3>
            <p className="mb-4">
              Da dies ein Demo-Projekt ist, können Funktionen und Bedingungen jederzeit 
              ohne Ankündigung geändert werden.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">9. Anwendbares Recht</h3>
            <p className="mb-4">
              Diese Bedingungen unterliegen schweizerischem Recht. Gerichtsstand ist Zürich, Schweiz.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">10. Kontakt</h3>
            <p className="mb-4">
              Für Fragen zu diesen Bedingungen:<br />
              E-Mail: hello@gartmeier.dev<br />
              Joshua Gartmeier, Burgdorf, Schweiz
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
