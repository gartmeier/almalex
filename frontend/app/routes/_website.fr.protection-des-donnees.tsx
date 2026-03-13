import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Politique de confidentialité | Alma Lex" },
  {
    name: "description",
    content:
      "Politique de confidentialité d'Alma Lex : découvrez comment ce showcase d'IA juridique suisse traite vos données. Aucune donnée personnelle, aucun compte, tout reste local.",
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
          Alma Lex est un projet vitrine de Joshua Gartmeier. La présente
          politique de confidentialité vous informe sur la manière dont ce
          projet traite les données. En résumé : vos conversations restent sur
          votre appareil et nous ne collectons aucune donnée personnelle.
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
            Les messages sont temporairement traités sur des serveurs suisses et
            européens afin de générer les réponses IA
          </li>
          <li>
            Aucun compte utilisateur n'est créé et aucune donnée personnelle
            n'est collectée
          </li>
          <li>Vos saisies ne sont pas utilisées à des fins d'entraînement</li>
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
          peuvent être utilisés pour la préférence de langue.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          4. Finalité de l'utilisation
        </h2>
        <p className="mb-4">
          Les données minimales collectées sont exclusivement utilisées pour :
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>La mise à disposition de la fonctionnalité vitrine</li>
          <li>La génération de réponses IA à vos requêtes</li>
          <li>L'analyse technique des erreurs et la sécurité opérationnelle</li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          5. Stockage et traitement des données
        </h2>
        <p className="mb-4">
          Vos conversations ne quittent pas votre navigateur de manière
          permanente. Les messages sont temporairement transmis à des serveurs
          suisses et européens pour traitement. Après la génération de la
          réponse, ces données ne sont pas conservées. Aucun entraînement de
          modèles IA n'est effectué avec vos saisies.
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
          s'effectuent via des connexions chiffrées SSL/TLS. Le traitement côté
          serveur a lieu exclusivement sur des serveurs suisses et européens,
          soumis à des réglementations strictes en matière de protection des
          données.
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
          <a href="/fr/mentions-legales" className="underline">
            mentions légales
          </a>
          .
        </p>
      </div>
    </div>
  );
}
