import logging
from typing import Iterator

from app.core.config import settings
from app.core.types import Language
from app.db.models import Chat, ChatMessage, Chunk
from app.repositories.chat_repository import ChatRepository
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.events import Error, Event, Source, Sources, Status
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService

logger = logging.getLogger(__name__)


class ChatService:
    def __init__(
        self,
        chat_repo: ChatRepository,
        chunk_repo: ChunkRepository,
        embedding_service: EmbeddingService,
        llm_service: LLMService,
    ):
        self.chat_repo = chat_repo
        self.chunk_repo = chunk_repo
        self.embedding_service = embedding_service
        self.llm_service = llm_service

    def get_chat(self, chat_id: str) -> Chat | None:
        return self.chat_repo.get_with_messages(chat_id)

    def process_message(
        self, *, chat_id: str, message: str, lang: Language
    ) -> Iterator[Event]:
        try:
            yield from self._process_message(
                chat_id=chat_id, message=message, lang=lang
            )
        except Exception as e:
            logger.exception("Error processing message")
            yield Error(type="error", message=str(e))

    def _process_message(
        self, *, chat_id: str, message: str, lang: Language
    ) -> Iterator[Event]:
        self.chat_repo.get_or_create(chat_id)
        self.chat_repo.save_message(
            chat_id=chat_id,
            role="user",
            content=message,
            content_blocks=[{"type": "text", "text": message}],
        )
        history = self.chat_repo.get_history(chat_id)

        query_embedding = self.embedding_service.embed_text(message)

        yield Status(type="status", status="searching")

        articles = self.chunk_repo.search_chunks(
            query_embedding,
            message,
            source_type="article",
            top_k=settings.search_article_top_k,
        )
        decisions = self.chunk_repo.search_chunks(
            query_embedding,
            message,
            source_type="decision",
            top_k=settings.search_decision_top_k,
        )

        yield self._build_sources_event(articles, decisions)

        context = self._build_context(articles + decisions)

        yield Status(type="status", status="generating")
        yield from self._generate(
            chat_id=chat_id, history=history, context=context, lang=lang
        )

    def _build_context(self, chunks: list[Chunk]) -> str:
        return "\n---\n".join(f"ID: {c.id}\n\n{c.text}" for c in chunks)

    def _generate(
        self, *, chat_id: str, history: list[ChatMessage], context: str, lang: Language
    ) -> Iterator[Event]:
        yield from self.llm_service.generate(
            history=history, context=context, lang=lang
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
                    reference=a.citation,
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
                        reference=d.citation,
                        url=d.source_url,
                    )
                )

        return Sources(type="sources", sources=sources)
