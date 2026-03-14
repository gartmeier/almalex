import logging
import time

import cohere
import sentry_sdk

from app.core.config import settings
from app.db.models import Chunk

logger = logging.getLogger(__name__)


class RerankerService:
    def __init__(self, client: cohere.ClientV2):
        self.client = client

    def rerank(self, query: str, chunks: list[Chunk], top_n: int) -> list[Chunk]:
        if not chunks or top_n >= len(chunks):
            return chunks

        try:
            t0 = time.perf_counter()
            response = self.client.rerank(
                query=query,
                documents=[c.text for c in chunks],
                model=settings.cohere_rerank_model,
                top_n=top_n,
            )
            logger.info(
                "Rerank took %.2fs (%d -> %d chunks)",
                time.perf_counter() - t0,
                len(chunks),
                top_n,
            )
            return [chunks[r.index] for r in response.results]
        except Exception:
            logger.warning("Reranking failed, returning original chunks", exc_info=True)
            sentry_sdk.capture_exception()
            return chunks
