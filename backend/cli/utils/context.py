from app.core.clients import anthropic_client, openai_client

_PREFIX_DE = "<document>\n{document_text}\n</document>\nHier ist der Abschnitt, den wir im gesamten Dokument platzieren möchten."
_SUFFIX_DE = "<chunk>\n{chunk_text}\n</chunk>\nBitte gebe einen kurzen, prägnanten Kontext an, um diesen Abschnitt innerhalb des Gesamtdokuments einzuordnen und die Suche nach diesem Abschnitt zu verbessern. Antworte nur mit dem prägnanten Kontext und nichts anderem."

_PREFIX_FR = "<document>\n{document_text}\n</document>\nVoici la section que nous souhaitons situer dans le document complet."
_SUFFIX_FR = "<chunk>\n{chunk_text}\n</chunk>\nVeuillez fournir un contexte court et concis pour situer cette section dans le document global et améliorer la recherche de cette section. Répondez uniquement avec le contexte concis et rien d'autre."

_PREFIX_IT = "<document>\n{document_text}\n</document>\nEcco la sezione che vogliamo collocare nell'intero documento."
_SUFFIX_IT = "<chunk>\n{chunk_text}\n</chunk>\nSi prega di fornire un contesto breve e conciso per collocare questa sezione all'interno del documento complessivo e migliorare la ricerca di questa sezione. Rispondere solo con il contesto conciso e nient'altro."

_PREFIX_EN = "<document>\n{document_text}\n</document>\nHere is the section we want to situate within the overall document."
_SUFFIX_EN = "<chunk>\n{chunk_text}\n</chunk>\nPlease provide a short, concise context to situate this section within the overall document and improve search for this section. Respond only with the concise context and nothing else."

CONTEXT_PROMPTS = {
    "de": (_PREFIX_DE, _SUFFIX_DE),
    "fr": (_PREFIX_FR, _SUFFIX_FR),
    "it": (_PREFIX_IT, _SUFFIX_IT),
    "en": (_PREFIX_EN, _SUFFIX_EN),
}


def generate_context_openai(
    document_text: str, chunk_text: str, lang: str = "de"
) -> str:
    prefix, suffix = CONTEXT_PROMPTS[lang]
    input_ = (
        prefix.format(document_text=document_text)
        + "\n"
        + suffix.format(chunk_text=chunk_text)
    )
    response = openai_client.chat.completions.create(
        model="mistral3",
        messages=[{"role": "user", "content": input_}],
    )
    return response.choices[0].message.content


def generate_context_anthropic(
    document_text: str, chunk_text: str, lang: str = "de"
) -> str:
    prefix, suffix = CONTEXT_PROMPTS[lang]
    message = anthropic_client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=200,
        messages=[
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": prefix.format(document_text=document_text),
                        "cache_control": {"type": "ephemeral"},
                    },
                    {
                        "type": "text",
                        "text": suffix.format(chunk_text=chunk_text),
                    },
                ],
            }
        ],
    )
    return message.content[0].text
