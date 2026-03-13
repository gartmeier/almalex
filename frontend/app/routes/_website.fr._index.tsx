import type { MetaFunction } from "react-router";
import type { LandingPageContent } from "~/components/website/landing-page";
import { LandingPage } from "~/components/website/landing-page";

export let meta: MetaFunction = () => [
  { title: "Alma Lex - IA juridique suisse | CO, CC & CP expliqués simplement" },
  {
    name: "description",
    content:
      "IA juridique suisse gratuite : posez vos questions sur le CO, CC, CP ou les arrêts du Tribunal fédéral et obtenez des réponses sourcées. Sans inscription.",
  },
  { name: "robots", content: "index, follow" },
  { property: "og:title", content: "Alma Lex - IA juridique suisse pour le CO, CC & les arrêts du Tribunal fédéral" },
  {
    property: "og:description",
    content:
      "Questions juridiques, réponses claires : interrogez l'IA juridique suisse sur le CO, CC ou les arrêts du Tribunal fédéral. Sourcé, gratuit et sans inscription.",
  },
  { property: "og:type", content: "website" },
  { property: "og:locale", content: "fr_CH" },
  { property: "og:locale:alternate", content: "de_CH" },
  { property: "og:locale:alternate", content: "en_US" },
  { property: "og:site_name", content: "Alma Lex" },
  { property: "og:url", content: "https://almalex.ch/fr" },
  { property: "og:image", content: "https://almalex.ch/og-image-fr.png" },
  { property: "og:image:width", content: "1200" },
  { property: "og:image:height", content: "630" },
  { property: "og:image:alt", content: "Alma Lex - IA juridique suisse : Comprendre le droit suisse en quelques secondes." },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "Alma Lex - IA juridique suisse pour le CO, CC & les arrêts du Tribunal fédéral" },
  {
    name: "twitter:description",
    content:
      "Questions juridiques, réponses claires : interrogez l'IA juridique suisse sur le CO, CC ou les arrêts du Tribunal fédéral. Sourcé, gratuit et sans inscription.",
  },
  { name: "twitter:image", content: "https://almalex.ch/og-image-fr.png" },
  { tagName: "link", rel: "canonical", href: "https://almalex.ch/fr" },
  { tagName: "link", rel: "alternate", hrefLang: "de-CH", href: "https://almalex.ch/de" },
  { tagName: "link", rel: "alternate", hrefLang: "fr-CH", href: "https://almalex.ch/fr" },
  { tagName: "link", rel: "alternate", hrefLang: "en", href: "https://almalex.ch/en" },
  { tagName: "link", rel: "alternate", hrefLang: "x-default", href: "https://almalex.ch/de" },
];

let content: LandingPageContent = {
  jsonLd: {
    description:
      "IA juridique suisse gratuite. Répond aux questions juridiques sur le Code des obligations (CO), le Code civil (CC), le Code pénal (CP) et les arrêts du Tribunal fédéral avec références aux sources.",
    featureList: [
      "Recherche dans le droit fédéral suisse",
      "Recherche dans les arrêts du Tribunal fédéral",
      "Réponses IA avec références aux sources",
      "Sans inscription",
      "Open source",
    ],
  },
  hero: {
    title: (
      <>
        Comprendre le droit suisse.
        <br />
        En quelques secondes.
      </>
    ),
    subtitle:
      "Posez votre question sur le Code des obligations (CO), le Code civil (CC) ou sur un arrêt du Tribunal fédéral et obtenez en quelques secondes une réponse sourcée. Gratuit et sans inscription.",
    cta: "Poser une question",
    trustBadges: ["100 % gratuit", "IA depuis la Suisse", "Aucune inscription requise"],
  },
  chatPreview: {
    userMessage: "Quel est le délai de résiliation pour un bail d'habitation ?",
    botResponse:
      "Selon l'art. 266c CO, le délai de résiliation pour les habitations est d'au moins trois mois, pour le terme fixé par l'usage local...",
    sourceLabel: "Source : CO art. 266c",
  },
  howItWorks: {
    sectionId: "comment-ca-marche",
    badgeLabel: "Comment ça marche",
    title: "Trois étapes vers la réponse",
    steps: [
      { title: "Poser une question", desc: "Posez votre question juridique en langage courant, que ce soit sur le CO, le CC ou un cas concret." },
      { title: "Recherche dans les sources", desc: "L'IA parcourt le droit fédéral et des milliers d'arrêts du Tribunal fédéral en quelques secondes." },
      { title: "Obtenir la réponse", desc: "Vous recevez une réponse claire avec des renvois directs aux articles de loi et aux arrêts." },
    ],
  },
  dataSources: {
    sectionId: "sources-de-donnees",
    badgeLabel: "Sources de données",
    title: "Fondé sur des sources juridiques officielles",
    subtitle:
      "Alma Lex utilise exclusivement des sources juridiques suisses officielles. Les mêmes que celles utilisées à l'université et en formation professionnelle.",
    federal: {
      title: "Droit fédéral",
      subtitle: "Recueil systématique du droit fédéral",
      desc: "Code des obligations (CO), Code civil (CC), Code pénal (CP) et autres lois fédérales issus du Recueil systématique officiel. Entièrement consultable et toujours à jour.",
    },
    court: {
      title: "Arrêts du Tribunal fédéral",
      subtitle: "Arrêts de principe et jugements",
      desc: "Arrêts de principe et jugements du Tribunal fédéral suisse, consultables par domaine juridique, thème et article de loi.",
    },
  },
  privacy: {
    sectionId: "protection-des-donnees",
    badgeLabel: "Protection des données et sécurité",
    title: "Vos données vous appartiennent.",
    subtitle:
      "Pas de tracking, pas de cookies, pas de frais cachés. La vie privée n'est pas une fonctionnalité, c'est un principe fondamental.",
    cards: [
      { title: "Aucun stockage", desc: "Vos conversations restent localement dans votre navigateur. Rien n'est enregistré sur nos serveurs." },
      { title: "IA depuis Genève", desc: "Les modèles d'IA tournent chez Infomaniak, un hébergeur cloud suisse avec centre de données à Genève." },
      { title: "Serveur en Europe", desc: "L'application tourne sur un serveur dédié en Finlande. Pas de cloud américain, toutes les données restent en Europe." },
    ],
    cards2: [
      { title: "Pas d'entraînement IA", desc: "Vos saisies ne sont jamais utilisées pour entraîner des modèles d'IA." },
      { title: "Aucune inscription requise", desc: "Commencez directement. Pas de compte, pas d'e-mail, pas de données personnelles nécessaires." },
    ],
  },
  faq: {
    title: "Questions fréquentes",
    items: [
      { value: "what-is", q: "Qu'est-ce qu'Alma Lex ?", a: "Alma Lex est une IA juridique suisse gratuite. Elle parcourt le droit fédéral et les arrêts du Tribunal fédéral pour répondre à vos questions juridiques de manière compréhensible, avec références aux sources. Sans inscription." },
      { value: "how-to-start", q: "Comment lancer une conversation ?", a: "Saisissez simplement votre question dans le champ de texte et appuyez sur Entrée. Alma Lex vous répond immédiatement. Aucun compte ni inscription nécessaire." },
      { value: "what-questions", q: "Quelles questions puis-je poser ?", a: "Vous pouvez poser des questions sur tous les domaines du droit suisse, par exemple le Code des obligations (CO), le Code civil (CC), le Code pénal (CP), le droit du bail, le droit du travail ou le droit de la famille. Alma Lex parcourt les lois fédérales et des milliers d'arrêts du Tribunal fédéral." },
      { value: "sources", q: "D'où proviennent les informations ?", a: "Alma Lex utilise exclusivement des sources juridiques suisses officielles : le Recueil systématique du droit fédéral (fedlex.admin.ch) et les arrêts du Tribunal fédéral (bger.ch). Les mêmes sources utilisées à l'université et en formation professionnelle." },
      { value: "accuracy", q: "Quelle est la fiabilité des réponses ?", a: "Chaque réponse contient les références aux articles de loi et aux arrêts utilisés. Alma Lex offre une bonne première orientation, mais ne remplace pas un conseil juridique professionnel. Pour des cas concrets, consultez toujours un ou une spécialiste." },
      { value: "privacy", q: "Mes données sont-elles en sécurité ?", a: "Oui. Les conversations restent localement dans votre navigateur. Les modèles d'IA tournent chez Infomaniak, un hébergeur suisse avec centre de données à Genève. L'application elle-même tourne sur un serveur en Finlande. Vos saisies ne sont ni enregistrées ni utilisées pour l'entraînement de l'IA." },
      { value: "costs", q: "Combien coûte l'utilisation ?", a: "Alma Lex est entièrement gratuit. Sans frais cachés, sans abonnement, sans publicité." },
      { value: "open-source", q: "Alma Lex est-il open source ?", a: "Oui, le code source complet est disponible publiquement sur GitHub. Chaque ligne de code, du pipeline IA au frontend, peut être consultée." },
      { value: "limitations", q: "Quelles sont les limites ?", a: "Alma Lex ne remplace pas un conseil juridique professionnel. Les réponses offrent une première orientation, mais ne prennent pas en compte toutes les nuances propres à chaque cas. Pour des situations concrètes, consultez un ou une spécialiste." },
      { value: "languages", q: "Dans quelles langues puis-je poser des questions ?", a: "Vous pouvez poser vos questions en français. Les sources juridiques sont également disponibles en français. D'autres langues sont prévues." },
    ],
  },
  openSource: {
    title: "Entièrement open source.",
    subtitle:
      "Alma Lex est une IA juridique open source gratuite, faite en Suisse. Chaque ligne de code est consultable publiquement sur GitHub.",
    cards: [
      { title: "Base de données juridique suisse", desc: "Fondée sur le droit fédéral suisse et les arrêts du Tribunal fédéral. L'IA parcourt les sources actuelles avant chaque réponse." },
      { title: "Modèles d'IA open source", desc: "Plusieurs modèles au choix : GPT-OSS 120B, Qwen3, Llama 3.3, Apertus 70B et Mistral Small 3.2." },
      { title: "Recherche juridique précise", desc: "BGE-Multilingual-Gemma2 pour la recherche sémantique. BGE-Reranker-v2-m3 pour un classement précis des résultats." },
      { title: "Code source sur GitHub", desc: "Code source complet disponible publiquement. Contributions, issues et retours bienvenus." },
      { title: "Hébergement IA en Suisse", desc: "Tous les modèles d'IA tournent chez Infomaniak à Genève. Aucune donnée ne quitte la Suisse pour le traitement." },
      { title: "Indépendant des Big Tech", desc: "Pas d'OpenAI, pas de Google, pas de Microsoft. Exclusivement des modèles ouverts et une infrastructure propre." },
    ],
    githubCta: "Voir le code source sur GitHub",
  },
};

export default function FrLandingPage() {
  return <LandingPage content={content} />;
}
