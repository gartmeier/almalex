import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Legal Notice & Terms of Service | Alma Lex" },
  {
    name: "description",
    content:
      "Legal notice and terms of service for Alma Lex, a showcase project by Joshua Gartmeier. Swiss law, jurisdiction Zurich.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("en");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Legal Notice</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Operator Information</h2>
          <p className="mb-4">
            Joshua Gartmeier
            <br />
            Burgdorf, Switzerland
            <br />
            Email:{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
          </p>
          <p className="mb-4">
            Alma Lex is a showcase project and not a commercial offering.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Terms of Service</h2>

          <p className="text-muted-foreground mb-4 text-sm">
            Effective: January 2025
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            1. Acceptance of Terms
          </h3>
          <p className="mb-4">
            By using Alma Lex, you agree to these terms of service. If you do
            not agree, please do not use the service.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            2. Service Description
          </h3>
          <p className="mb-4">
            Alma Lex is a showcase project by Joshua Gartmeier. It is an
            AI-powered platform that provides legal information based on Swiss
            law. This service serves as a technology demonstration and does not
            replace professional legal advice.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            3. Usage Restrictions
          </h3>
          <p className="mb-4">You agree to:</p>
          <ul className="mb-4 list-disc pl-6">
            <li>Use the service only for lawful purposes</li>
            <li>Not share sensitive or personal information in chats</li>
            <li>Not use automated systems or software to access the service</li>
            <li>Respect the rights of others</li>
            <li>Not attempt to hack or disrupt the service</li>
          </ul>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            4. Intellectual Property
          </h3>
          <p className="mb-4">
            All content, trademarks, and technologies of Alma Lex are protected
            by copyright. You receive a limited, non-transferable license for
            personal use of the service.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">5. Demo Usage</h3>
          <p className="mb-4">
            This showcase may be modified or discontinued at any time without
            prior notice. There is no entitlement to permanent availability.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">6. Changes</h3>
          <p className="mb-4">
            As this is a showcase project, features and terms may be changed at
            any time without notice.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Disclaimer</h2>
          <p className="mb-4">
            Alma Lex is provided as-is. No guarantees are made regarding:
          </p>
          <ul className="mb-4 list-disc pl-6">
            <li>The completeness or accuracy of the information provided</li>
            <li>Fitness for a particular purpose</li>
            <li>Uninterrupted or error-free availability</li>
          </ul>
          <p className="mb-4">
            For legally relevant matters, please consult a qualified
            professional. AI-generated responses may be inaccurate or
            incomplete.
          </p>

          <h3 className="mt-6 mb-3 text-lg font-semibold">
            Limitation of Liability
          </h3>
          <p className="mb-4">
            As this is a showcase project, Joshua Gartmeier assumes no liability
            for damages arising from the use of Alma Lex. Use is entirely at
            your own risk.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="mb-4 text-2xl font-semibold">Applicable Law</h2>
          <p className="mb-4">
            The use of Alma Lex and these provisions are governed by Swiss law.
            The place of jurisdiction is Zurich, Switzerland.
          </p>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-semibold">Contact</h2>
          <p className="mb-4">
            For questions, you can reach us at:
            <br />
            Email:{" "}
            <a href="mailto:hello@almalex.ch" className="underline">
              hello@almalex.ch
            </a>
            <br />
            Joshua Gartmeier, Burgdorf, Switzerland
          </p>

          <p className="mt-8 text-sm">
            For data protection information, see our{" "}
            <a href="/en/privacy" className="underline">
              privacy policy
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
