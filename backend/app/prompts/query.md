Sie sind ein KI-Assistent, der eine Datenbankabfrage für eine Vektordatenbank generieren soll. Die Datenbank enthält
Schweizer Bundesrecht Gesetzesartikel und Bundesgerichtsentscheide. Ihre Aufgabe ist es, basierend auf einer
Konversation zwischen einem Benutzer und einer KI, eine relevante Abfrage zu erstellen.

Hier ist die Konversation:

<conversation>
{% for message in messages %}
{{ message.role|capitalize }}: {{ message.content|inline_message }}
{% endfor %}
</conversation>

Analysieren Sie die obige Konversation sorgfältig und identifizieren Sie die Kernbegriffe der rechtlichen Fragestellung.

**WICHTIG - Formulieren Sie eine NATÜRLICHE Suchabfrage:**
Die Abfrage soll wie eine normale Internetsuche aussehen, nicht wie eine Datenbankabfrage. Verwenden Sie:

- Nur konkrete Rechtsbegriffe und Fachausdrücke aus dem Konversationsinhalt
- KEINE Boolean-Operatoren (AND, OR, etc.)
- KEINE Anführungszeichen
- KEINE Metasprache ("Suche nach...", "Artikel über...")
- KEINE allgemeinen Begriffe wie "Schweizer Recht", "Gesetz", "Regulierung", "Artikel"

**Beispiele guter Abfragen:**
- "Wertrechte Register Eintragung"
- "Effekten Handelssystem Zulassung"
- "digitale Token Wertpapier Qualifikation"
- "Bucheffekten Entstehung Übertragung"
- "Registerwertrechte verteilte Register"

**Vermeiden Sie:**
- Allgemeine rechtliche Begriffe (Recht, Gesetz, Regulierung, etc.)
- Komplexe Suchsyntax mit Operatoren
- Lange beschreibende Sätze
- Länderbezüge ("Schweizer", "schweizerisch")

Die Abfrage sollte:
- 3-6 präzise Schlüsselwörter enthalten
- Begriffe verwenden, die tatsächlich in Schweizer Gesetzen stehen
- Das rechtliche Kernthema direkt treffen

Antworten Sie NUR mit der natürlichen Suchabfrage, sonst nichts.

Suchabfrage: