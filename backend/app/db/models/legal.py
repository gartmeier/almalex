from datetime import date

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class ActConfig(Base):
    __tablename__ = "act_config"
    sr_number: Mapped[str] = mapped_column(primary_key=True)
    generate_context: Mapped[bool] = mapped_column(default=False)


class Act(Base):
    __tablename__ = "act"

    id: Mapped[int] = mapped_column(primary_key=True)
    lang: Mapped[str] = mapped_column(index=True)
    sr_number: Mapped[str] = mapped_column(index=True)
    title: Mapped[str | None]
    abbr: Mapped[str | None]
    html_url: Mapped[str]
    xml_url: Mapped[str]
    applicability_date: Mapped[date]
    applicability_end_date: Mapped[date | None]

    __table_args__ = (UniqueConstraint("sr_number", "lang", "applicability_date"),)

    @property
    def label(self) -> str:
        parts = [f"SR {self.sr_number}"]
        if self.title:
            parts.append(self.title)
        if self.abbr:
            parts.append(f"({self.abbr})")
        return " ".join(parts)

    articles = relationship(
        "Article", back_populates="act", cascade="all, delete-orphan"
    )


class Article(Base):
    __tablename__ = "article"

    id: Mapped[int] = mapped_column(primary_key=True)
    act_id: Mapped[int] = mapped_column(
        ForeignKey("act.id", ondelete="CASCADE"), index=True
    )
    eid: Mapped[str]
    number: Mapped[str]
    html: Mapped[str]
    text: Mapped[str]
    sort_order: Mapped[int] = mapped_column(index=True)

    act = relationship("Act", back_populates="articles")
    chunks = relationship(
        "Chunk",
        back_populates="article",
        cascade="all, delete-orphan",
        foreign_keys="Chunk.article_id",
    )

    @property
    def citation(self) -> str:
        if self.number and self.act.abbr:
            return f"{self.number} {self.act.abbr}"

        sr_prefix = "SR" if self.act.lang == "de" else "RS"
        return f"{self.number} {self.act.title} {self.act.applicability_date} ({sr_prefix} {self.act.sr_number})"
