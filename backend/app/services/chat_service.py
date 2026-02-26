from app.db.models import Chat, Chunk
from app.repositories.chat_repository import ChatRepository
from app.repositories.chunk_repository import ChunkRepository
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
        chunks = self._retrieve(message)
        context = self._build_context(chunks)
        yield from self._generate(
            chat_id=chat_id, history=history, context=context, lang=lang
        )

    def _retrieve(self, query: str) -> list[Chunk]:
        query_embedding = self.embedding_service.embed_text(query)
        articles = self.chunk_repo.search_chunks(
            query_embedding, query, source_type="article", top_k=12
        )
        decisions = self.chunk_repo.search_chunks(
            query_embedding, query, source_type="decision", top_k=8
        )
        return articles + decisions

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
