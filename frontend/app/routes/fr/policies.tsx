import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("fr");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Politiques</h1>

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Politique de confidentialité</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Dernière mise à jour : Janvier 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Introduction</h3>
            <p className="mb-4">
              Alma Lex est un projet de démonstration de Joshua Gartmeier. Cette politique de confidentialité 
              vous informe sur la gestion des données dans cette démo technique. Veuillez noter que tous les 
              chats sont publiquement accessibles.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Collecte de données</h3>
            <p className="mb-4">Cette démo stocke :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Historiques de chat (publiquement accessibles via URL)</li>
              <li>Aucune donnée personnelle ou compte utilisateur</li>
              <li>Données techniques minimales pour le fonctionnement</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Finalité d'utilisation</h3>
            <p className="mb-4">Les données minimales sont utilisées pour :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Fournir la fonctionnalité de démonstration</li>
              <li>Analyse technique des erreurs</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Stockage des données</h3>
            <p className="mb-4">
              Les chats sont publiquement accessibles via leur URL et peuvent être consultés par quiconque 
              connaît le lien. Les chats sont automatiquement supprimés 30 jours après la dernière activité. 
              Aucune donnée personnelle n'est collectée ou stockée.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Nature publique des chats</h3>
            <p className="mb-4">
              Veuillez noter que tous les chats sont publics. Toute personne connaissant l'URL d'un chat 
              peut le consulter. Ne partagez donc pas d'informations sensibles ou personnelles 
              dans les chats.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Votre contrôle</h3>
            <p className="mb-4">
              Comme aucune donnée personnelle n'est collectée et que les chats sont publics, vous avez le contrôle total :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ne partagez pas d'informations sensibles</li>
              <li>Les chats sont automatiquement supprimés après 30 jours d'inactivité</li>
              <li>Créez simplement un nouveau chat pour de nouvelles conversations</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Sécurité</h3>
            <p className="mb-4">
              Les transmissions de données se font via des connexions cryptées SSL/TLS. Cependant, gardez à l'esprit 
              que tous les chats sont publiquement accessibles via leur URL. Ne partagez donc pas d'informations 
              confidentielles.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Contact</h3>
            <p className="mb-4">
              Pour toute question concernant la confidentialité, contactez-nous à :<br />
              E-mail : hello@gartmeier.dev<br />
              Joshua Gartmeier, Suisse
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Conditions d'utilisation</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              En vigueur depuis : Janvier 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Acceptation des conditions</h3>
            <p className="mb-4">
              En utilisant Alma Lex, vous acceptez ces conditions d'utilisation. Si vous n'êtes pas 
              d'accord, veuillez ne pas utiliser notre service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Description du service</h3>
            <p className="mb-4">
              Alma Lex est un projet de démonstration de Joshua Gartmeier - une plateforme alimentée par l'IA 
              qui fournit des informations juridiques basées sur le droit suisse. Ce service est une 
              démo, ne remplace pas les conseils juridiques professionnels et n'établit pas de relation client-avocat.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Restrictions d'utilisation</h3>
            <p className="mb-4">Vous vous engagez à :</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Utiliser le service uniquement à des fins légales</li>
              <li>Ne pas partager d'informations sensibles ou personnelles (les chats sont publics)</li>
              <li>Ne pas utiliser de systèmes automatisés ou de logiciels pour accéder au service</li>
              <li>Respecter les droits d'autrui</li>
              <li>Ne pas tenter de pirater ou de perturber le service</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Propriété intellectuelle</h3>
            <p className="mb-4">
              Tout le contenu, les marques et les technologies d'Alma Lex sont protégés par le droit d'auteur. 
              Vous recevez une licence limitée et non transférable pour un usage personnel du service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Clause de non-responsabilité</h3>
            <p className="mb-4">
              Alma Lex est fourni "tel quel". Nous ne garantissons pas :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>L'exhaustivité ou l'exactitude des informations</li>
              <li>L'adéquation à un usage particulier</li>
              <li>La disponibilité ininterrompue ou sans erreur</li>
            </ul>
            <p className="mb-4">
              Pour des décisions juridiques importantes, consultez toujours un avocat qualifié.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Limitation de responsabilité</h3>
            <p className="mb-4">
              Comme il s'agit d'un projet de démonstration, Joshua Gartmeier n'assume aucune responsabilité pour 
              les dommages directs, indirects, accessoires ou consécutifs. L'utilisation se fait à vos propres risques.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Utilisation de la démo</h3>
            <p className="mb-4">
              Cette démo peut être modifiée ou interrompue à tout moment sans préavis. 
              Il n'y a aucune garantie de disponibilité permanente.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Modifications</h3>
            <p className="mb-4">
              Comme il s'agit d'un projet de démonstration, les fonctionnalités et les conditions peuvent 
              être modifiées à tout moment sans préavis.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">9. Droit applicable</h3>
            <p className="mb-4">
              Ces conditions sont régies par le droit suisse. Le tribunal compétent est celui de Zurich, Suisse.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">10. Contact</h3>
            <p className="mb-4">
              Pour toute question concernant ces conditions :<br />
              E-mail : hello@gartmeier.dev<br />
              Joshua Gartmeier, Suisse
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}