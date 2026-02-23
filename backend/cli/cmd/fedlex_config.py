import click
from sqlalchemy import func, select

from app.db.models import Act, ActConfig, Article, ArticleChunk
from app.db.session import SessionLocal


@click.command(name="configure-act")
@click.option("--sr-number", required=True)
@click.option("--context/--no-context", default=True)
def configure_act(sr_number: str, context: bool):
    with SessionLocal() as db:
        config = db.get(ActConfig, sr_number)
        if config:
            config.generate_context = context
        else:
            db.add(ActConfig(sr_number=sr_number, generate_context=context))
        db.commit()
        click.echo(f"SR {sr_number}: generate_context={context}")


@click.command(name="act-status")
@click.option("--sr-number")
@click.option("--lang", default=None)
def act_status(sr_number: str | None, lang: str | None):
    with SessionLocal() as db:
        q = select(Act)
        if sr_number:
            q = q.where(Act.sr_number == sr_number)
        if lang:
            q = q.where(Act.lang == lang)
        acts = db.scalars(q.order_by(Act.sr_number, Act.lang)).all()

        with_context_sq = (
            select(Article.act_id, func.count().label("cnt"))
            .where(Article.context.isnot(None))
            .group_by(Article.act_id)
            .subquery()
        )
        with_embeddings_sq = select(ArticleChunk.article_id).distinct().subquery()
        articles_with_emb_sq = (
            select(Article.act_id, func.count().label("cnt"))
            .join(with_embeddings_sq, Article.id == with_embeddings_sq.c.article_id)
            .group_by(Article.act_id)
            .subquery()
        )

        ctx_counts = {
            row.act_id: row.cnt for row in db.execute(select(with_context_sq)).all()
        }
        emb_counts = {
            row.act_id: row.cnt
            for row in db.execute(select(articles_with_emb_sq)).all()
        }

        configs = {c.sr_number: c for c in db.scalars(select(ActConfig)).all()}

        header = f"{'sr_number':<12} {'lang':<5} {'date':<12} {'articles':>8} {'ctx':>6} {'emb':>6} {'gen_ctx':>8}"
        click.echo(header)
        click.echo("-" * len(header))
        for act in acts:
            n_articles = len(act.articles)
            n_ctx = ctx_counts.get(act.id, 0)
            n_emb = emb_counts.get(act.id, 0)
            gen_ctx = configs.get(
                act.sr_number, ActConfig(generate_context=False)
            ).generate_context
            click.echo(
                f"{act.sr_number:<12} {act.lang:<5} {str(act.applicability_date):<12}"
                f" {n_articles:>8} {n_ctx:>6} {n_emb:>6} {str(gen_ctx):>8}"
            )
