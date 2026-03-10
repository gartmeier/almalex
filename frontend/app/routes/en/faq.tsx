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
      <p className="mb-8 text-sm text-gray-500">Last updated: March 2026</p>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="what-is-alma-lex">
          <AccordionTrigger aria-label="What is Alma Lex?">
            What is Alma Lex?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex is a showcase project by Joshua Gartmeier - an AI-powered
            Swiss legal assistance that demonstrates how AI can help with legal
            questions about Swiss law.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-to-start">
          <AccordionTrigger>How do I start a chat?</AccordionTrigger>
          <AccordionContent>
            Simply type your question in the input field at the bottom and press
            Enter or click the send button. Alma Lex will respond to you
            immediately.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="what-questions">
          <AccordionTrigger>What kind of questions can I ask?</AccordionTrigger>
          <AccordionContent>
            You can ask questions about all areas of Swiss law, including
            contract law, employment law, tenancy law, family law, and more.
            Alma Lex searches relevant Swiss laws and case law for you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="accuracy">
          <AccordionTrigger>How accurate are the answers?</AccordionTrigger>
          <AccordionContent>
            This demo uses AI technology and Swiss legal databases for
            demonstration purposes. For legally binding decisions, you should
            always consult a qualified lawyer.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-privacy">
          <AccordionTrigger aria-label="Are my chats private?">
            Are my chats private?
          </AccordionTrigger>
          <AccordionContent>
            Yes, your chats are private and stored locally on your device.
            Messages are processed temporarily on Swiss/EU servers with strict
            privacy protections. No data is retained or used for training.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="languages">
          <AccordionTrigger>
            What languages can I ask questions in?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex supports German, French, and English. You can change the
            language at any time via the language menu in the top right corner.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="costs">
          <AccordionTrigger>How much does it cost to use?</AccordionTrigger>
          <AccordionContent>
            This demo is completely free. It's a showcase project with no
            commercial intentions.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="sources">
          <AccordionTrigger aria-label="Where does the legal information come from?">
            Where does the legal information come from?
          </AccordionTrigger>
          <AccordionContent>
            Alma Lex searches official Swiss legal codes, including Federal
            Court decisions and cantonal legislation.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="limitations">
          <AccordionTrigger aria-label="What are the limitations of Alma Lex?">
            What are the limitations of Alma Lex?
          </AccordionTrigger>
          <AccordionContent>
            This is a showcase project and does not replace professional legal
            advice. Alma Lex provides general guidance but cannot account for
            case-specific nuances. For urgent or complex matters, consult a
            legal professional.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="chat-history">
          <AccordionTrigger>Can I view previous chats?</AccordionTrigger>
          <AccordionContent>
            Yes, you can view previous chats. Chats are stored locally on your
            device and are accessible only from that device. No chats are stored
            on the server.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
