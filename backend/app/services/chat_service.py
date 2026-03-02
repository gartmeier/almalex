from app.db.models import Chat, Chunk
from app.repositories.chat_repository import ChatRepository
from app.repositories.chunk_repository import ChunkRepository
from app.schemas.events import (
    ArticlesEvent,
    ArticleSource,
    DecisionsEvent,
    DecisionSource,
    StatusEvent,
)
from app.services.embedding_service import EmbeddingService
from app.services.llm_service import LLMService


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

    def process_message(self, *, chat_id: str, message: str, lang: str):
        self.chat_repo.get_or_create(chat_id)
        self.chat_repo.save_message(
            chat_id=chat_id,
            role="user",
            content=message,
            content_blocks=[{"type": "text", "text": message}],
        )
        history = self.chat_repo.get_history(chat_id)

        query_embedding = self.embedding_service.embed_text(message)

        yield self._status_line("searching_articles")
        articles = self.chunk_repo.search_chunks(
            query_embedding, message, source_type="article", top_k=12
        )
        yield f"data: {self._build_articles_event(articles).model_dump_json()}\n\n"

        yield self._status_line("searching_decisions")
        decisions = self.chunk_repo.search_chunks(
            query_embedding, message, source_type="decision", top_k=8
        )
        yield f"data: {self._build_decisions_event(decisions).model_dump_json()}\n\n"

        context = self._build_context(articles + decisions)

        yield self._status_line("generating")
        yield from self._generate(
            chat_id=chat_id, history=history, context=context, lang=lang
        )

    def _status_line(self, status: str) -> str:
        return (
            f"data: {StatusEvent(type='status', status=status).model_dump_json()}\n\n"
        )

    def _build_context(self, chunks: list[Chunk]) -> str:
        return "\n---\n".join(f"ID: {c.id}\n\n{c.text}" for c in chunks)

    def _generate(self, *, chat_id: str, history, context: str, lang: str):
        for event in self.llm_service.generate(
            history=history, context=context, lang=lang
        ):
            if event.type == "done":
                self.chat_repo.save_message(
                    chat_id=chat_id,
                    role="assistant",
                    content=event.content,
                    content_blocks=[b.model_dump() for b in event.content_blocks],
                )
            yield f"data: {event.model_dump_json()}\n\n"

    def _build_articles_event(self, chunks: list[Chunk]) -> ArticlesEvent:
        seen: set[int] = set()
        articles: list[ArticleSource] = []
        for c in chunks:
            if c.article_id is None or c.article_id in seen:
                continue
            seen.add(c.article_id)
            a = c.article
            articles.append(
                ArticleSource(
                    article_id=a.id,
                    citation=a.citation,
                    article_number=a.number,
                    act_sr_number=a.act.sr_number,
                    act_abbr=a.act.abbr,
                    act_title=a.act.title,
                )
            )
        return ArticlesEvent(type="articles", articles=articles)

    def _build_decisions_event(self, chunks: list[Chunk]) -> DecisionsEvent:
        seen: set[int] = set()
        decisions: list[DecisionSource] = []
        for c in chunks:
            if c.decision_id is None or c.decision_id in seen:
                continue
            seen.add(c.decision_id)
            d = c.decision
            decisions.append(
                DecisionSource(
                    decision_id=d.id,
                    citation=d.citation,
                    decision_number=d.number,
                    decision_date=str(d.date),
                    html_url=d.html_url,
                )
            )
        return DecisionsEvent(type="decisions", decisions=decisions)
