from dataclasses import dataclass

import requests

LANGUAGE_CODES = {
    "de": "DEU",
    "fr": "FRA",
    "it": "ITA",
    "en": "ENG",
}

SPARQL_ENDPOINT = "https://fedlex.data.admin.ch/sparqlendpoint"
FEDLEX_DATA_HOST = "fedlex.data.admin.ch"
FEDLEX_PUBLIC_HOST = "fedlex.admin.ch"

FETCH_ALL_QUERY = """
PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

SELECT DISTINCT ?srNumber ?title ?abbr ?collectionUrl ?htmlUrl ?xmlUrl ?applicabilityDate ?endApplicabilityDate
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
    OPTIONAL {{ ?collectionExpr jolux:titleShort ?abbr }}
  }}
  
  # Reformat output values
  BIND(STR(?collection) AS ?collectionUrl)
  BIND(STR(?srNotationRaw) AS ?srNumber)

  {sr_filter}
}}
ORDER BY ?srNumber
"""


@dataclass
class Row:
    sr_number: str
    source_url: str
    html_url: str
    xml_url: str
    applicability_date: str
    applicability_end_date: str | None = None
    title: str | None = None
    abbr: str | None = None


def fetch_all(lang: str, sr_number: str | None):
    sr_filter = f'FILTER(?srNumber = "{sr_number}")' if sr_number else ""
    query = FETCH_ALL_QUERY.format(language=LANGUAGE_CODES[lang], sr_filter=sr_filter)

    response = requests.post(
        SPARQL_ENDPOINT,
        data={"query": query},
        headers={"accept": "application/sparql-results+json"},
    )
    response.raise_for_status()
    data = response.json()

    return [
        Row(
            sr_number=item["srNumber"]["value"],
            source_url=_source_url(item, lang),
            html_url=item["htmlUrl"]["value"],
            xml_url=item["xmlUrl"]["value"],
            applicability_date=item["applicabilityDate"]["value"],
            title=_optional_value(item, "title"),
            abbr=_optional_value(item, "abbr"),
            applicability_end_date=_optional_value(item, "endApplicabilityDate"),
        )
        for item in data["results"]["bindings"]
    ]


def _optional_value(item, key) -> str | None:
    return item.get(key, {}).get("value")


def _source_url(item, lang: str) -> str:
    url = item["collectionUrl"]["value"]
    url = url.replace(FEDLEX_DATA_HOST, FEDLEX_PUBLIC_HOST)
    url = url + "/" + lang
    return url
