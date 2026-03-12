import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("fr");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Questions fréquemment posées</h1>
      <p className="mb-8 text-sm text-gray-500">
        Dernière mise à jour : mars 2026
      </p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger aria-label="Qu'est-ce qu'Alma Lex ?">
            Qu'est-ce qu'Alma Lex ?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex est un projet de showcase de Joshua Gartmeier - une
            assistance juridique suisse alimentée par l'IA qui montre comment
            l'IA peut aider avec des questions juridiques sur le droit suisse.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-start">
          <AccordionTrigger>
            Comment démarrer une conversation ?
          </AccordionTrigger>
          <AccordionContent>
            Saisissez simplement votre question dans le champ de saisie en bas
            et appuyez sur Entrée ou cliquez sur le bouton d'envoi. Alma Lex
            vous répondra immédiatement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-questions">
          <AccordionTrigger>
            Quel type de questions puis-je poser ?
          </AccordionTrigger>
          <AccordionContent>
            Vous pouvez poser des questions sur tous les domaines du droit
            suisse, y compris le droit des contrats, le droit du travail, le
            droit du bail, le droit de la famille et plus encore. Alma Lex
            recherche les lois et la jurisprudence suisses pertinentes pour
            vous.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accuracy">
          <AccordionTrigger>
            Quelle est la précision des réponses ?
          </AccordionTrigger>
          <AccordionContent>
            Cette démo utilise la technologie IA et des bases de données
            juridiques suisses à des fins de démonstration. Pour des décisions
            juridiquement contraignantes, vous devriez toujours consulter un
            avocat qualifié.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy">
          <AccordionTrigger aria-label="Mes chats sont-ils privés ?">
            Mes chats sont-ils privés ?
          </AccordionTrigger>
          <AccordionContent>
            Oui, tes chats sont privés et stockés localement sur ton appareil.
            Les messages sont traités temporairement sur des serveurs suisses et
            européens avec des protections strictes de la vie privée. Aucune
            donnée n'est conservée ou utilisée pour l'entraînement.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>
            Dans quelles langues puis-je poser des questions ?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex prend en charge l'allemand, le français et l'anglais. Vous
            pouvez changer la langue à tout moment via le menu des langues dans
            le coin supérieur droit.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="costs">
          <AccordionTrigger>Combien coûte l'utilisation ?</AccordionTrigger>
          <AccordionContent>
            Cette démo est entièrement gratuite. C'est un projet de
            démonstration sans intentions commerciales.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger aria-label="D'où proviennent les informations juridiques ?">
            D'où proviennent les informations juridiques ?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex recherche dans les codes juridiques suisses officiels, y
            compris les décisions du Tribunal fédéral et les législations
            cantonales.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger aria-label="Quelles sont les limites d'Alma Lex ?">
            Quelles sont les limites d'Alma Lex ?
          </AccordionTrigger>
          <AccordionContent>
            Il s'agit d'un projet de showcase et ne remplace pas les conseils
            juridiques professionnels. Alma Lex fournit des orientations
            générales mais ne peut pas tenir compte des nuances spécifiques à
            chaque cas. Pour des questions urgentes ou complexes, consultez un
            professionnel du droit.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>
            Puis-je consulter les conversations précédentes ?
          </AccordionTrigger>
          <AccordionContent>
            Oui, vous pouvez consulter les conversations précédentes. Les chats
            sont stockés localement sur votre appareil et ne sont accessibles
            que depuis cet appareil. Aucun chat n'est stocké sur le serveur.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
