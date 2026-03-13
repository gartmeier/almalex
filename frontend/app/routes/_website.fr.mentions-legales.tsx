import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Mentions légales & Conditions d'utilisation | Alma Lex" },
  {
    name: "description",
    content:
      "Mentions légales et conditions d'utilisation d'Alma Lex, un projet vitrine de Joshua Gartmeier. Droit suisse, for juridique Zurich.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("fr");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Mentions légales</h1>

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
            Alma Lex est un projet vitrine et non une offre commerciale.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">
            Conditions d'utilisation
          </h2>

          <p className="text-muted-foreground mb-4 text-sm">
            En vigueur depuis : janvier 2025
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
            Alma Lex est un projet vitrine de Joshua Gartmeier. Il s'agit d'une
            plateforme assistée par IA qui fournit des informations juridiques
            basées sur le droit suisse. Ce service sert de démonstration
            technologique et ne remplace pas un conseil juridique professionnel.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            3. Restrictions d'utilisation
          </h3>
          <p className="mb-4">Vous vous engagez à :</p>
          <ul className="mb-4 list-disc pl-6">
            <li>N'utiliser le service qu'à des fins licites</li>
            <li>
              Ne pas partager d'informations sensibles ou personnelles dans les
              conversations
            </li>
            <li>
              Ne pas utiliser de systèmes automatisés ou de logiciels pour
              accéder au service
            </li>
            <li>Respecter les droits d'autrui</li>
            <li>Ne pas tenter de pirater ou de perturber le service</li>
          </ul>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            4. Propriété intellectuelle
          </h3>
          <p className="mb-4">
            Tous les contenus, marques et technologies d'Alma Lex sont protégés
            par le droit d'auteur. Vous bénéficiez d'une licence limitée, non
            transférable, pour un usage personnel du service.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            5. Utilisation en mode démonstration
          </h3>
          <p className="mb-4">
            Ce projet vitrine peut être modifié ou interrompu à tout moment et
            sans préavis. Aucun droit à une disponibilité permanente ne peut
            être revendiqué.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">6. Modifications</h3>
          <p className="mb-4">
            S'agissant d'un projet vitrine, les fonctionnalités et les
            conditions peuvent être modifiées à tout moment sans préavis.
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
            S'agissant d'un projet vitrine, Joshua Gartmeier décline toute
            responsabilité pour les dommages résultant de l'utilisation d'Alma
            Lex. L'utilisation se fait entièrement à vos propres risques.
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
            Informations sur la protection des données dans notre{" "}
            <a href="/fr/protection-des-donnees" className="underline">
              politique de confidentialité
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
