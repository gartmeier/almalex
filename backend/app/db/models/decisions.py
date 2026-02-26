from datetime import date

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class DecisionFile(Base):
    __tablename__ = "decision_file"

    file: Mapped[str] = mapped_column(primary_key=True)
    spider: Mapped[str] = mapped_column(index=True)
    checksum: Mapped[str | None]
    decision_id: Mapped[int | None] = mapped_column(
        ForeignKey("decision.id", ondelete="SET NULL")
    )

    decision = relationship("Decision")


class Decision(Base):
    __tablename__ = "decision"

    id: Mapped[int] = mapped_column(primary_key=True)
    lang: Mapped[str] = mapped_column(index=True)
    spider: Mapped[str] = mapped_column(index=True)
    number: Mapped[str]
    title: Mapped[dict] = mapped_column(JSONB)
    text: Mapped[str]
    html_url: Mapped[str | None]
    pdf_url: Mapped[str | None]
    date: Mapped[date]

    chunks = relationship(
        "Chunk", back_populates="decision", cascade="all, delete-orphan"
    )

    __table_args__ = (UniqueConstraint("spider", "number"),)

    @property
    def citation(self) -> str:
        return f"{self.number} ({self.date.year})"
