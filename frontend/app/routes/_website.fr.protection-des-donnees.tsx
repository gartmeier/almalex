import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Politique de confidentialité | Alma Lex" },
  {
    name: "description",
    content:
      "Politique de confidentialité d'Alma Lex, une IA juridique suisse gratuite et open source. Aucun compte, aucun stockage sur serveur, tout reste local.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("fr");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Politique de confidentialité</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4 text-sm">
          Dernière mise à jour : mars 2026
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">1. Introduction</h2>
        <p className="mb-4">
          Alma Lex est une IA juridique suisse gratuite et open source,
          exploitée par Joshua Gartmeier. La présente politique de
          confidentialité vous informe sur la manière dont Alma Lex traite vos
          données. En résumé : vos conversations restent sur votre appareil.
          Nous ne collectons aucune donnée personnelle et aucune connexion n'est
          requise.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          2. Collecte de données
        </h2>
        <p className="mb-4">
          Alma Lex est conçu pour minimiser la collecte de données :
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            Toutes les conversations sont stockées exclusivement en local sur
            votre appareil (dans le stockage du navigateur)
          </li>
          <li>
            Les messages sont envoyés aux serveurs suisses et européens pour
            traitement, puis supprimés
          </li>
          <li>
            Aucun compte utilisateur n'est créé et aucune donnée personnelle
            n'est collectée
          </li>
          <li>Vos saisies ne sont pas utilisées pour l'entraînement de l'IA</li>
          <li>
            Des données techniques minimales (p. ex. journaux serveur) sont
            générées lors du fonctionnement
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          3. Cookies et analyse
        </h2>
        <p className="mb-4">
          Alma Lex n'utilise aucun cookie d'analyse ou de suivi. Aucun service
          de suivi tiers n'est employé. Des cookies strictement nécessaires
          peuvent être utilisés pour la préférence de langue et le choix du
          thème.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          4. Finalité de l'utilisation
        </h2>
        <p className="mb-4">
          Les données minimales collectées sont exclusivement utilisées pour :
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>La mise à disposition des fonctionnalités d'Alma Lex</li>
          <li>La génération de réponses IA à vos requêtes</li>
          <li>L'analyse technique des erreurs et la sécurité opérationnelle</li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          5. Stockage et traitement des données
        </h2>
        <p className="mb-4">
          Vos conversations ne sont pas stockées sur nos serveurs. Les messages
          sont transmis aux serveurs suisses (Infomaniak, centre de données à
          Genève) et à un serveur européen (Finlande) pour traitement. Après la
          génération de la réponse, ces données sont supprimées. Aucun
          entraînement de modèles IA n'est effectué avec vos saisies. Aucun
          service cloud américain n'est utilisé.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">6. Votre contrôle</h2>
        <p className="mb-4">
          Comme toutes les conversations sont stockées localement sur votre
          appareil, vous gardez le contrôle total :
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            Supprimez les données de votre navigateur pour effacer toutes les
            conversations enregistrées
          </li>
          <li>Démarrez une nouvelle conversation à tout moment</li>
          <li>
            Il n'existe aucune donnée stockée côté serveur qui nécessiterait une
            suppression
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">7. Sécurité</h2>
        <p className="mb-4">
          Tous les transferts de données entre votre navigateur et nos serveurs
          s'effectuent via des connexions chiffrées SSL/TLS. Les modèles d'IA
          fonctionnent chez Infomaniak à Genève (Suisse). L'application
          elle-même fonctionne sur un serveur dédié en Finlande (UE). Les deux
          emplacements sont soumis à des réglementations strictes en matière de
          protection des données.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">8. Contact</h2>
        <p className="mb-4">
          Pour toute question relative à la protection des données, vous pouvez
          nous contacter :
          <br />
          E-mail :{" "}
          <a href="mailto:hello@almalex.ch" className="underline">
            hello@almalex.ch
          </a>
          <br />
          Joshua Gartmeier, Burgdorf, Suisse
        </p>

        <p className="mt-8 text-sm">
          Pour plus d'informations juridiques, consultez les{" "}
          <a href="/fr/conditions-utilisation" className="underline">
            conditions d'utilisation
          </a>
          .
        </p>
      </div>
    </div>
  );
}
