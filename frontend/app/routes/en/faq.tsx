import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("en");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Frequently Asked Questions</h1>
      
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger>What is Alma Lex?</AccordionTrigger>
          <AccordionContent>
            Alma Lex is a demo project by Joshua Gartmeier - an AI-powered Swiss legal 
            assistance that demonstrates how AI can help with legal questions about Swiss law.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-start">
          <AccordionTrigger>How do I start a chat?</AccordionTrigger>
          <AccordionContent>
            Simply type your question in the input field at the bottom and press Enter 
            or click the send button. Alma Lex will respond to you immediately.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-questions">
          <AccordionTrigger>What kind of questions can I ask?</AccordionTrigger>
          <AccordionContent>
            You can ask questions about all areas of Swiss law, including contract law, 
            employment law, tenancy law, family law, and more. Alma Lex searches relevant 
            Swiss laws and case law for you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accuracy">
          <AccordionTrigger>How accurate are the answers?</AccordionTrigger>
          <AccordionContent>
            This demo uses AI technology and Swiss legal databases for demonstration purposes. 
            For legally binding decisions, you should always consult a qualified lawyer.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy">
          <AccordionTrigger>Are my chats private?</AccordionTrigger>
          <AccordionContent>
            No, chats are public. Anyone with the URL can view the chat. 
            Therefore, do not share sensitive information. Chats are automatically deleted 
            30 days after the last message. As a demo project, no personal data is collected.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>What languages can I ask questions in?</AccordionTrigger>
          <AccordionContent>
            Alma Lex supports German, French, and English. You can change the language 
            at any time via the language menu in the top right corner.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="costs">
          <AccordionTrigger>How much does it cost to use?</AccordionTrigger>
          <AccordionContent>
            This demo is completely free. It's a showcase project 
            with no commercial intentions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger>Where does the legal information come from?</AccordionTrigger>
          <AccordionContent>
            Alma Lex searches official Swiss legal sources, including the Systematic 
            Collection (SR), Federal Court decisions, and cantonal legislation.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger>What are the limitations of Alma Lex?</AccordionTrigger>
          <AccordionContent>
            This is a technical demo and does not replace professional legal advice. 
            For real legal cases, you should always consult a qualified lawyer.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>Can I view previous chats?</AccordionTrigger>
          <AccordionContent>
            Yes, chats are accessible via their URL. Note that anyone with the link 
            can view the chat. Chats are automatically deleted 30 days after 
            the last message.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
