import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export default function Component() {
  useLanguageRedirect("en");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Policies</h1>

      <div className="space-y-12">
        <section>
          <h2 className="mb-6 text-2xl font-semibold">Privacy Policy</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4 text-sm">
              Last updated: March 2026
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">1. Introduction</h3>
            <p className="mb-4">
              Alma Lex is a showcase project by Joshua Gartmeier. This privacy
              policy informs you about data handling in this showcase. Messages
              are stored only on your device.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              2. Data Collection
            </h3>
            <p className="mb-4">This showcase stores:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>All conversations remain stored on your device</li>
              <li>Messages are processed temporarily on Swiss/EU servers</li>
              <li>No user information is retained or used for training</li>
              <li>No personal data or user accounts</li>
              <li>Minimal technical data for operation</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              3. Purpose of Use
            </h3>
            <p className="mb-4">The minimal data is used for:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Providing showcase functionality</li>
              <li>Generating AI responses</li>
              <li>Technical error analysis</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">4. Data Storage</h3>
            <p className="mb-4">
              All conversations remain stored on your device. Messages are
              processed temporarily on Swiss/EU servers with strict privacy
              protections. No data is retained or used for training.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">5. Your Control</h3>
            <p className="mb-4">
              Since no personal data is collected and all conversations remain
              stored on your device, you have full control:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>Clear your browser data to remove chats</li>
              <li>Conversations remain on your device</li>
              <li>Create a new chat at any time</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">5. Security</h3>
            <p className="mb-4">
              Data transmissions occur via SSL/TLS encrypted connections. All
              conversations remain stored on your device, and messages are
              processed temporarily on Swiss/EU servers with strict privacy
              protections.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">6. Contact</h3>
            <p className="mb-4">
              For questions about privacy, contact us at:
              <br />
              Email: hello@almalex.ch
              <br />
              Joshua Gartmeier, Burgdorf, Switzerland
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Terms of Service</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-muted-foreground mb-4 text-sm">
              Effective from: January 2025
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              1. Acceptance of Terms
            </h3>
            <p className="mb-4">
              By using Alma Lex, you agree to these terms of service. If you do
              not agree, please do not use our service.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              2. Service Description
            </h3>
            <p className="mb-4">
              Alma Lex is a showcase project by Joshua Gartmeier - an AI-powered
              platform that provides legal information based on Swiss law. This
              service is a showcase and does not replace professional advice.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              3. Usage Restrictions
            </h3>
            <p className="mb-4">You agree to:</p>
            <ul className="mb-4 list-disc pl-6">
              <li>Use the service only for lawful purposes</li>
              <li>Not share sensitive or personal information in chats</li>
              <li>
                Not use automated systems or software to access the service
              </li>
              <li>Respect the rights of others</li>
              <li>Not attempt to hack or disrupt the service</li>
            </ul>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              4. Intellectual Property
            </h3>
            <p className="mb-4">
              All content, brands, and technologies of Alma Lex are copyright
              protected. You receive a limited, non-transferable license for
              personal use of the service.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">5. Disclaimer</h3>
            <p className="mb-4">
              Alma Lex is provided "as is". We do not guarantee:
            </p>
            <ul className="mb-4 list-disc pl-6">
              <li>The completeness or accuracy of information</li>
              <li>Suitability for a particular purpose</li>
              <li>Uninterrupted or error-free availability</li>
            </ul>
            <p className="mb-4">
              For important matters, consult a professional.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              6. Limitation of Liability
            </h3>
            <p className="mb-4">
              As this is a showcase project, Joshua Gartmeier assumes no
              liability for damages. Use is at your own risk.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">7. Demo Usage</h3>
            <p className="mb-4">
              This showcase may be modified or discontinued at any time without
              notice. There is no guarantee of permanent availability.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">8. Changes</h3>
            <p className="mb-4">
              As this is a showcase project, features and terms may be changed
              at any time without notice.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">
              9. Applicable Law
            </h3>
            <p className="mb-4">
              These terms are governed by Swiss law. The place of jurisdiction
              is Zurich, Switzerland.
            </p>

            <h3 className="mt-6 mb-3 text-lg font-semibold">10. Contact</h3>
            <p className="mb-4">
              For questions about these terms:
              <br />
              Email: hello@almalex.ch
              <br />
              Joshua Gartmeier, Burgdorf, Switzerland
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
