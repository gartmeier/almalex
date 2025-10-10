import requests

LANGUAGE_DE = "DEU"


def exec_sparql(query):
    response = requests.post(
        "https://fedlex.data.admin.ch/sparqlendpoint",
        data={"query": query},
        headers={"accept": "application/sparql-results+json"},
    )
    response.raise_for_status()
    return response.json()["results"]["bindings"]
