"""Prompts for generating chat session titles."""


def build_title_prompt(user_message: str) -> str:
    """Generate a concise title for a chat session.

    Args:
        user_message: First user message in the conversation

    Returns:
        Formatted prompt for title generation
    """
    return f"""Du bist ein KI-Assistent, der Konversationstitel erstellt. Deine Aufgabe ist es, einen prägnanten, beschreibenden Titel
für eine Konversation basierend auf der ersten Nachricht des Benutzers zu generieren.

Befolge diese Richtlinien:

1. Der Titel soll zwischen 3-7 Wörtern lang sein
2. Erfasse das Hauptthema oder die Absicht der Nachricht
3. Verwende einfache Sprache ohne Fachjargon, ausser die Anfrage ist ausdrücklich technisch
4. Verwende keine Anführungszeichen oder Sonderzeichen
5. Beginne mit einem Grossbuchstaben
6. Verwende nicht "Konversation über" oder ähnliche Wendungen - fokussiere direkt auf den Gegenstand
7. Wandle Fragen wo angebracht in Themenaussagen um
8. Erstelle den Titel in derselben Sprache wie die Nachricht des Benutzers

Basierend auf der ersten Nachricht des Benutzers: "{user_message}", generiere einen passenden Titel für diese
Konversation.

Antworte NUR mit dem Titeltext, sonst nichts."""
