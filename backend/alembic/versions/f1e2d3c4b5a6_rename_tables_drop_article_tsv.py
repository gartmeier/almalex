"""rename acts/articles/article_embedding tables, drop article text_search_vector

Revision ID: f1e2d3c4b5a6
Revises: e1f2a3b4c5d6
Create Date: 2026-02-22

"""

from typing import Sequence, Union

from alembic import op

revision: str = "f1e2d3c4b5a6"
down_revision: Union[str, None] = "e1f2a3b4c5d6"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.drop_index("idx_articles_text_search_vector", table_name="articles")
    op.drop_column("articles", "text_search_vector")

    op.drop_index("idx_article_embedding_tsv", table_name="article_embedding")
    op.rename_table("article_embedding", "article_chunk")
    op.create_index(
        "idx_article_chunk_tsv",
        "article_chunk",
        ["text_search_vector"],
        postgresql_using="gin",
    )

    op.rename_table("articles", "article")
    op.rename_table("acts", "act")


def downgrade() -> None:
    op.rename_table("act", "acts")
    op.rename_table("article", "articles")

    op.drop_index("idx_article_chunk_tsv", table_name="article_chunk")
    op.rename_table("article_chunk", "article_embedding")
    op.create_index(
        "idx_article_embedding_tsv",
        "article_embedding",
        ["text_search_vector"],
        postgresql_using="gin",
    )

    op.execute(
        "ALTER TABLE articles ADD COLUMN text_search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', text)) STORED"
    )
    op.create_index(
        "idx_articles_text_search_vector",
        "articles",
        ["text_search_vector"],
        postgresql_using="gin",
    )
