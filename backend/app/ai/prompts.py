TITLE_PROMPT = """\
Your task is to generate a concise, descriptive title for a conversation based on the user's first message. The title should:

1. Be between 3-7 words long
2. Capture the main topic or intent of the message
3. Use plain language without technical jargon unless the query is explicitly technical
4. Avoid using quotes or special characters
5. Start with a capital letter
6. Not include "chat about" or similar phrases - focus on the subject matter directly
7. Transform questions into topic statements where appropriate

Based on the user's first message: "{user_message}", generate an appropriate title for this conversation.
Respond with ONLY the title text, nothing else.
"""
