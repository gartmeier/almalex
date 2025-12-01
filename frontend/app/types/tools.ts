export type LegalSearchArgs = {
  query: string;
  source: "federal_law" | "federal_court";
  limit: number;
};

export type ArticleLookupArgs = {
  reference: string;
};

export type DecisionLookupArgs = {
  reference: string;
};

export type SearchResult = {
  id: number;
  source: string;
  title: string;
  text: string;
  url: string;
};
