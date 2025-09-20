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

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger>Qu'est-ce qu'Alma Lex ?</AccordionTrigger>
          <AccordionContent>
            Alma Lex est un projet de démonstration de Joshua Gartmeier - une
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
          <AccordionTrigger>Mes chats sont-ils privés ?</AccordionTrigger>
          <AccordionContent>
            Non, les chats sont publics. Toute personne ayant l'URL peut voir le
            chat. Ne partagez donc pas d'informations sensibles. Les chats sont
            automatiquement supprimés 30 jours après le dernier message. En tant
            que projet de démonstration, aucune donnée personnelle n'est
            collectée.
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
          <AccordionTrigger>
            D'où proviennent les informations juridiques ?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex recherche dans les sources juridiques officielles suisses,
            y compris le Recueil systématique (RS), les décisions du Tribunal
            fédéral et les législations cantonales.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger>
            Quelles sont les limites d'Alma Lex ?
          </AccordionTrigger>
          <AccordionContent>
            Il s'agit d'une démo technique et ne remplace pas les conseils
            juridiques professionnels. Pour de vrais cas juridiques, vous
            devriez toujours consulter un avocat qualifié.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>
            Puis-je consulter les conversations précédentes ?
          </AccordionTrigger>
          <AccordionContent>
            Oui, les chats sont accessibles via leur URL. Notez que toute
            personne ayant le lien peut voir le chat. Les chats sont
            automatiquement supprimés 30 jours après le dernier message.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
