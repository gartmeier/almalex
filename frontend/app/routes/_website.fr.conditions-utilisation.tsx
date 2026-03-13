import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Conditions d'utilisation | Alma Lex" },
  {
    name: "description",
    content:
      "Conditions d'utilisation d'Alma Lex, une IA juridique suisse gratuite et open source de Joshua Gartmeier. Droit suisse, for juridique Zurich.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("fr");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Conditions d'utilisation</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Informations sur l'exploitant
          </h2>
          <p className="mb-4">
            Joshua Gartmeier
            <br />
            Burgdorf, Suisse
            <br />
            E-mail :{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
          </p>
          <p className="mb-4">
            Alma Lex est une IA juridique suisse gratuite et open source. Le
            code source est librement accessible. Il ne s'agit pas d'une offre
            commerciale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Conditions d'utilisation
          </h2>

          <p className="text-muted-foreground mb-4 text-sm">
            En vigueur depuis : mars 2026
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            1. Acceptation des conditions
          </h3>
          <p className="mb-4">
            En utilisant Alma Lex, vous acceptez les présentes conditions
            d'utilisation. Si vous n'êtes pas d'accord, veuillez ne pas utiliser
            le service.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            2. Description du service
          </h3>
          <p className="mb-4">
            Alma Lex est une IA juridique gratuite et open source, exploitée par
            Joshua Gartmeier. Elle fournit des informations juridiques basées
            sur le droit suisse. Les modèles d'IA fonctionnent chez Infomaniak à
            Genève (Suisse), l'application sur un serveur dédié en Finlande
            (UE). Alma Lex ne remplace pas un conseil juridique professionnel.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            3. Restrictions d'utilisation
          </h3>
          <p className="mb-4">Vous vous engagez à :</p>
          <ul className="mb-4 list-disc pl-6">
            <li>N'utiliser le service qu'à des fins licites</li>
            <li>
              Ne pas utiliser de systèmes automatisés ou de logiciels pour
              accéder au service
            </li>
            <li>Respecter les droits d'autrui</li>
            <li>Ne pas tenter de pirater ou de perturber le service</li>
          </ul>
          <p className="mb-4">
            Vous pouvez partager des informations personnelles dans les
            conversations si vous le souhaitez. Veuillez noter que les messages
            sont envoyés à nos serveurs pour traitement. Après la réponse, ils
            sont supprimés.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            4. Propriété intellectuelle
          </h3>
          <p className="mb-4">
            Tous les contenus, marques et technologies d'Alma Lex sont protégés
            par le droit d'auteur. Le code source est librement accessible. Vous
            bénéficiez d'une licence limitée, non transférable, pour un usage
            personnel du service.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            5. Service gratuit
          </h3>
          <p className="mb-4">
            Alma Lex est un service gratuit. Aucun droit à une disponibilité
            permanente ne peut être revendiqué. Le service peut être modifié ou
            interrompu à tout moment et sans préavis.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">6. Modifications</h3>
          <p className="mb-4">
            Les fonctionnalités et les conditions peuvent être modifiées à tout
            moment sans préavis. La version actuelle des conditions
            d'utilisation est toujours disponible sur cette page.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Clause de non-responsabilité
          </h2>
          <p className="mb-4">
            Alma Lex est fourni sans garantie. Aucune garantie n'est accordée
            quant :
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>
              À l'exhaustivité ou à l'exactitude des informations fournies
            </li>
            <li>À l'adéquation à un usage particulier</li>
            <li>À une disponibilité ininterrompue ou exempte d'erreurs</li>
          </ul>
          <p className="mb-4">
            Pour toute question juridique, veuillez consulter un professionnel
            qualifié. Les réponses générées par IA peuvent être erronées ou
            incomplètes.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            Limitation de responsabilité
          </h3>
          <p className="mb-4">
            Joshua Gartmeier décline toute responsabilité pour les dommages
            résultant de l'utilisation d'Alma Lex. L'utilisation se fait
            entièrement à vos propres risques.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Droit applicable</h2>
          <p className="mb-4">
            L'utilisation d'Alma Lex et les présentes dispositions sont soumises
            au droit suisse. Le for juridique est Zurich, Suisse.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
          <p className="mb-4">
            Pour toute question, vous pouvez nous contacter :
            <br />
            E-mail :{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
            <br />
            Joshua Gartmeier, Burgdorf, Suisse
          </p>

          <p className="mt-8 text-sm">
            Informations sur la protection des données sur notre{" "}
            <a href="/fr/protection-des-donnees" className="underline">
              page de confidentialité
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
