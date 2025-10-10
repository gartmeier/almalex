import click

from app.db.session import SessionLocal
from cli.utils.fedlex import process_fedlex_articles
from cli.utils.sparql import exec_sparql

CURRENT_QUERY = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?srNumber ?language ?title ?abbreviation ?htmlUrl ?xmlUrl ?applicabilityDate ?endApplicabilityDate
WHERE {{
  # Configuration: language
  BIND(<http://publications.europa.eu/resource/authority/language/{language}> AS ?languageUri)

  # Get consolidation that is currently applicable
  ?consolidation a jolux:Consolidation ;
                jolux:dateApplicability ?applicabilityDate ;
                jolux:isRealizedBy ?consoExpr ;
                jolux:isMemberOf ?collection .

  FILTER(xsd:date(?applicabilityDate) <= xsd:date(NOW()))

  # Check if consolidation is still applicable
  OPTIONAL {{ ?consolidation jolux:dateEndApplicability ?endApplicabilityDate }}
  FILTER(!BOUND(?endApplicabilityDate) || xsd:date(?endApplicabilityDate) >= xsd:date(NOW()))

  # Get language-specific expression
  ?consoExpr jolux:language ?languageUri .

  # Get HTML format
  ?consoExpr jolux:isEmbodiedBy ?htmlManif .
  ?htmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/html> ;
             jolux:isExemplifiedBy ?htmlUrl .

  # Get XML format
  ?consoExpr jolux:isEmbodiedBy ?xmlManif .
  ?xmlManif jolux:userFormat <https://fedlex.data.admin.ch/vocabulary/user-format/xml> ;
            jolux:isExemplifiedBy ?xmlUrl .

  # Get SR Number from collection
  ?collection jolux:classifiedByTaxonomyEntry/skos:notation ?srNotationRaw .
  FILTER(datatype(?srNotationRaw) = <https://fedlex.data.admin.ch/vocabulary/notation-type/id-systematique>)

  # Check if collection is still in force
  OPTIONAL {{ ?collection jolux:dateNoLongerInForce ?collectionEndForceDate }}
  OPTIONAL {{ ?collection jolux:dateEndApplicability ?collectionEndApplicabilityDate }}
  FILTER(!BOUND(?collectionEndForceDate) || xsd:date(?collectionEndForceDate) > xsd:date(NOW()))
  FILTER(!BOUND(?collectionEndApplicabilityDate) || xsd:date(?collectionEndApplicabilityDate) >= xsd:date(NOW()))

  # Get title and abbreviation
  OPTIONAL {{
    ?collection jolux:isRealizedBy ?collectionExpr .
    ?collectionExpr jolux:language ?languageUri ;
                    jolux:title ?title .
    OPTIONAL {{ ?collectionExpr jolux:titleShort ?abbreviation }}
  }}

  # Reformat output values
  BIND(STR(?srNotationRaw) AS ?srNumber)
}}
ORDER BY ?srNumber
"""


@click.command(help="Import legal documents from Fedlex (Swiss federal law)")
def load_fedlex():
    db = SessionLocal()

    click.secho("Starting Fedlex import...", fg="green")

    rows = exec_sparql(CURRENT_QUERY.format(language="DEU"))

    for row in rows:
        sr_number = row["srNumber"]["value"]
        law_title = row["title"]["value"]
        law_abbr = row.get("abbreviation", {}).get("value")

        if law_abbr:
            click.echo(f"Processing document: {law_abbr} ({sr_number})")
        else:
            click.echo(f"Processing document: {law_title} ({sr_number})")

        articles_added = process_fedlex_articles(
            db=db,
            html_url=row["htmlUrl"]["value"],
            xml_url=row["xmlUrl"]["value"],
            sr_number=sr_number,
            law_title=law_title,
            law_abbr=law_abbr,
        )

        click.echo(f"  Added {articles_added} articles")

    db.commit()
