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
            <p className="text-sm text-muted-foreground mb-4">
              Last updated: January 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Introduction</h3>
            <p className="mb-4">
              Alma Lex is a demo project by Joshua Gartmeier. This privacy policy informs you 
              about data handling in this technical demo. Please note that all chats are publicly 
              accessible.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Data Collection</h3>
            <p className="mb-4">This demo stores:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Chat histories (publicly accessible via URL)</li>
              <li>No personal data or user accounts</li>
              <li>Minimal technical data for operation</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Purpose of Use</h3>
            <p className="mb-4">The minimal data is used for:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Providing demo functionality</li>
              <li>Technical error analysis</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Data Storage</h3>
            <p className="mb-4">
              Chats are publicly accessible via their URL and can be viewed by anyone who 
              knows the link. Chats are automatically deleted 30 days after the last activity. 
              No personal data is collected or stored.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Public Nature of Chats</h3>
            <p className="mb-4">
              Please note that all chats are public. Anyone who knows the URL of a chat 
              can view it. Therefore, do not share sensitive or personal information 
              in the chats.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Your Control</h3>
            <p className="mb-4">
              Since no personal data is collected and chats are public, you have full control:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Don't share sensitive information</li>
              <li>Chats are automatically deleted after 30 days of inactivity</li>
              <li>Simply create a new chat for new conversations</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Security</h3>
            <p className="mb-4">
              Data transmissions occur via SSL/TLS encrypted connections. However, keep in mind 
              that all chats are publicly accessible via their URL. Therefore, do not share confidential 
              information.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Contact</h3>
            <p className="mb-4">
              For questions about privacy, contact us at:<br />
              Email: hello@gartmeier.dev<br />
              Joshua Gartmeier, Switzerland
            </p>
          </div>
        </section>

        <section>
          <h2 className="mb-6 text-2xl font-semibold">Terms of Service</h2>
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <p className="text-sm text-muted-foreground mb-4">
              Effective from: January 2025
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">1. Acceptance of Terms</h3>
            <p className="mb-4">
              By using Alma Lex, you agree to these terms of service. If you do not 
              agree, please do not use our service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">2. Service Description</h3>
            <p className="mb-4">
              Alma Lex is a demo project by Joshua Gartmeier - an AI-powered platform 
              that provides legal information based on Swiss law. This service is a 
              demo, does not replace professional legal advice, and does not establish an attorney-client relationship.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">3. Usage Restrictions</h3>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use the service only for lawful purposes</li>
              <li>Not share sensitive or personal information (chats are public)</li>
              <li>Not use automated systems or software to access the service</li>
              <li>Respect the rights of others</li>
              <li>Not attempt to hack or disrupt the service</li>
            </ul>

            <h3 className="text-lg font-semibold mt-6 mb-3">4. Intellectual Property</h3>
            <p className="mb-4">
              All content, brands, and technologies of Alma Lex are copyright protected. 
              You receive a limited, non-transferable license for personal use of the service.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">5. Disclaimer</h3>
            <p className="mb-4">
              Alma Lex is provided "as is". We do not guarantee:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The completeness or accuracy of information</li>
              <li>Suitability for a particular purpose</li>
              <li>Uninterrupted or error-free availability</li>
            </ul>
            <p className="mb-4">
              For important legal decisions, always consult a qualified lawyer.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">6. Limitation of Liability</h3>
            <p className="mb-4">
              As this is a demo project, Joshua Gartmeier assumes no liability for 
              direct, indirect, incidental, or consequential damages. Use is at your own risk.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">7. Demo Usage</h3>
            <p className="mb-4">
              This demo may be modified or discontinued at any time without notice. 
              There is no guarantee of permanent availability.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">8. Changes</h3>
            <p className="mb-4">
              As this is a demo project, features and terms may be changed at any time 
              without notice.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">9. Applicable Law</h3>
            <p className="mb-4">
              These terms are governed by Swiss law. The place of jurisdiction is Zurich, Switzerland.
            </p>

            <h3 className="text-lg font-semibold mt-6 mb-3">10. Contact</h3>
            <p className="mb-4">
              For questions about these terms:<br />
              Email: hello@gartmeier.dev<br />
              Joshua Gartmeier, Switzerland
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}