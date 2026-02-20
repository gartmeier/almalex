import asyncio
import csv
from typing import Any

import click
from datasets import load_dataset
from openai import AsyncOpenAI

from app.core.config import settings

QA_PROMPT = """You are an expert in {course_name} and address legal issues in a structured, exam-style manner.
Assume Swiss law applies unless specifically mentioned; if the course context justifies, address legal issues beyond Swiss law as well.
Use precise legal language and formal "Sie" when answering.
Do NOT state any disclaimer or refer to the need for external legal advice.
Do NOT request the user to consult laws or to research on their own.
Offer focused legal analyses and individualized advice.
Speak directly and authoritatively without mentioning that your response is merely for general information.
Incorporate Swiss-specific legal terminology.
If you have discovered relevant legal considerations (Erwägungen), respond with a concise, clear legal analysis.
Cite only from your identified considerations.
Always cite the specific legal provision, explicitly indicating paragraphs (Abs.), numbers (Ziff.), or letters (lit.) where available (e.g., "'Art. 74 Abs. 2 Ziff. 2 OR", "Art. 336 lit. a StGB"). Avoid general references (such as 'Art. 3 ZGB') without mentioning the specific paragraph, number, or letter, if applicable.
If no relevant considerations are found, explicitly state that no pertinent information is available.
If you do have reliable sources, share practical guidance or insights from them.
Respond in the same language as the question.
If the question specifically requests a short answer, provide a concise response.
If the prompt asks you to analyze a specific case provided in the exam, but the text or details of that case have not been provided in the prompt, explicitly flag that the required case material is missing.

Question: {question}

Answer:"""

BATCH_SIZE = 20

client = AsyncOpenAI(
    api_key=settings.infomaniak_api_key,
    base_url=f"https://api.infomaniak.com/1/ai/{settings.infomaniak_chat_product_id}/openai/v1",
)

Row = dict[str, Any]


@click.command("eval")
@click.option(
    "--model", default=None, help="Model to use (defaults to infomaniak_chat_model)"
)
@click.option("--output", "-o", default="eval_results.csv", help="Output CSV file")
@click.option("--limit", "-n", type=int, default=None, help="Limit number of questions")
def eval_command(model: str | None, output: str, limit: int | None):
    effective_model = model or settings.infomaniak_chat_model
    results = asyncio.run(run_eval(effective_model, limit))

    click.echo(f"Writing {len(results)} results to {output}")

    with open(output, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)


async def run_eval(model: str, limit: int | None) -> list[dict[str, str]]:
    data = load_dataset("LEXam-Benchmark/LEXam", "open_question")

    rows = [r for r in data["test"] if r["jurisdiction"] == "Swiss"]  # type: ignore
    if limit:
        rows = rows[:limit]

    results = []
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        batch_results = await process_batch(batch, model)
        results.extend(batch_results)
        click.echo(f"Processed {len(results)}/{len(rows)} questions")

    return results


async def process_batch(rows: list[Row], model: str) -> list[Row]:
    tasks = [process_row(row, model) for row in rows]
    return await asyncio.gather(*tasks)


async def process_row(row: Row, model: str) -> Row:
    prompt = QA_PROMPT.format(course_name=row["course"], question=row["question"])
    response = await client.chat.completions.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=4096,
    )
    return {
        "id": row["id"],
        "question": row["question"],
        "gold_answer": row["answer"],
        "model_answer": response.choices[0].message.content or "",
    }
