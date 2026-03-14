import json
import logging
import time

from openai import OpenAI

from app.core.config import settings
from app.core.types import Language
from app.schemas.query import ExpandedQueries

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """\
You are a multilingual legal search query expander for Swiss law.
Your job: given a user query, produce search variants that maximize BM25 recall.

Rules:
- article_queries: 1-3 German queries (Swiss federal law articles are German-only)
- decision_queries: 1-3 queries in German and/or French (court decisions exist in de+fr)
- Translate the query if it's not already in the target language
- Add legal terminology variants and synonyms (e.g. AG/Aktiengesellschaft, \
GmbH/Gesellschaft mit beschraenkter Haftung, SA/societe anonyme)
- Preserve legal references exactly (OR, ZGB, StGB, article numbers)
- Keep queries concise -- search terms, not full sentences
- Return JSON: {"article_queries": [...], "decision_queries": [...]}
"""


class QueryExpansionService:
    def __init__(self, client: OpenAI):
        self.client = client

    def expand(self, query: str, lang: Language) -> ExpandedQueries:
        try:
            return self._expand(query, lang)
        except Exception:
            logger.exception("Query expansion failed, using original query")
            return ExpandedQueries(article_queries=[query], decision_queries=[query])

    def _expand(self, query: str, lang: Language) -> ExpandedQueries:
        model = settings.query_expansion_model or settings.openai_chat_model
        t0 = time.perf_counter()
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {
                    "role": "user",
                    "content": f"Language: {lang}\nQuery: {query}",
                },
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "expanded_queries",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "article_queries": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                            "decision_queries": {
                                "type": "array",
                                "items": {"type": "string"},
                            },
                        },
                        "required": ["article_queries", "decision_queries"],
                        "additionalProperties": False,
                    },
                },
            },
            temperature=0.3,
        )

        data = json.loads(response.choices[0].message.content)
        result = ExpandedQueries(
            article_queries=data["article_queries"][:3],
            decision_queries=data["decision_queries"][:3],
        )

        if not result.article_queries:
            result.article_queries = [query]
        if not result.decision_queries:
            result.decision_queries = [query]

        if settings.debug:
            elapsed = time.perf_counter() - t0
            logger.info(
                "Query expansion took %.2fs [%s] -> articles=%s, decisions=%s",
                elapsed,
                query,
                result.article_queries,
                result.decision_queries,
            )
        return result
