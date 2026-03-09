import logging
from typing import Iterator

from app.core.config import settings
from app.core.types import Language
from app.db.models import Chunk
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.chat import Message
from app.schemas.events import Error, Event, Source, Sources
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(
        self,
        chunk_repo: ChunkRepository,
        embedding_service: EmbeddingService,
        llm_service: LLMService,
    ):
        self.chunk_repo = chunk_repo
        self.embedding_service = embedding_service
        self.llm_service = llm_service

    def process_message(
        self, *, messages: list[Message], lang: Language
    ) -> Iterator[Event]:
        try:
            yield from self._process_message(messages=messages, lang=lang)
        except Exception as e:
            logger.exception("Error processing message")
            yield Error(type="error", message=str(e))

    def _process_message(
        self, *, messages: list[Message], lang: Language
    ) -> Iterator[Event]:
        query = messages[-1].content
        query_embedding = self.embedding_service.embed_text(query)

        articles = self.chunk_repo.search_chunks(
            query_embedding,
            query,
            source_type="article",
            top_k=settings.search_article_top_k,
        )
        decisions = self.chunk_repo.search_chunks(
            query_embedding,
            query,
            source_type="decision",
            top_k=settings.search_decision_top_k,
        )

        yield self._build_sources_event(articles, decisions)

        context = self._build_context(articles + decisions)

        yield from self._generate(messages=messages, context=context, lang=lang)

    def _build_context(self, chunks: list[Chunk]) -> str:
        return "\n---\n".join(f"ID: {c.id}\n\n{c.text}" for c in chunks)

    def _generate(
        self, *, messages: list[Message], context: str, lang: Language
    ) -> Iterator[Event]:
        yield from self.llm_service.generate(
            messages=messages, context=context, lang=lang
        )

    def _build_sources_event(
        self, article_chunks: list[Chunk], decision_chunks: list[Chunk]
    ) -> Sources:
        seen_articles: set[int] = set()
        seen_decisions: set[int] = set()
        sources: list[Source] = []

        for c in article_chunks:
            if c.article_id is None or c.article_id in seen_articles:
                continue
            seen_articles.add(c.article_id)
            a = c.article
            sources.append(
                Source(
                    id=str(a.id),
                    citation=a.citation,
                    url=a.source_url,
                )
            )

        for c in decision_chunks:
            if c.decision_id is None or c.decision_id in seen_decisions:
                continue
            seen_decisions.add(c.decision_id)
            d = c.decision
            if d.source_url:
                sources.append(
                    Source(
                        id=str(d.id),
                        citation=d.citation,
                        url=d.source_url,
                    )
                )

        return Sources(type="sources", sources=sources)
