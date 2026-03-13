import type { MetaFunction } from "react-router";
import { useLanguageRedirect } from "~/hooks/use-language-redirect";

export let meta: MetaFunction = () => [
  { title: "Privacy Policy | Alma Lex" },
  {
    name: "description",
    content:
      "Privacy policy for Alma Lex: learn how this Swiss legal AI showcase handles your data. No personal data, no accounts, everything stays local.",
  },
  { name: "robots", content: "index, follow" },
];

export default function Component() {
  useLanguageRedirect("en");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Privacy Policy</h1>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-muted-foreground mb-4 text-sm">
          Last updated: March 2026
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">1. Introduction</h2>
        <p className="mb-4">
          Alma Lex is a showcase project by Joshua Gartmeier. This privacy
          policy explains how this project handles data. In short: your
          conversations stay on your device, and we do not collect any personal
          data.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">2. Data Collection</h2>
        <p className="mb-4">
          Alma Lex is designed to minimize data collection:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>
            All conversations are stored exclusively on your device (in browser
            storage)
          </li>
          <li>
            Messages are temporarily processed on Swiss and EU servers to
            generate AI responses
          </li>
          <li>
            No user accounts are created and no personal data is collected
          </li>
          <li>Your inputs are not used for training purposes</li>
          <li>
            Minimal technical data (e.g. server logs) is generated during
            operation
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          3. Cookies and Analytics
        </h2>
        <p className="mb-4">
          Alma Lex does not use any analytics or tracking cookies. No
          third-party tracking services are employed. Strictly necessary cookies
          may be used for language preferences.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">4. Purpose of Use</h2>
        <p className="mb-4">
          The minimal data generated is used exclusively for:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>Providing the showcase functionality</li>
          <li>Generating AI responses to your queries</li>
          <li>Technical error analysis and operational reliability</li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">
          5. Data Storage and Processing
        </h2>
        <p className="mb-4">
          Your conversations do not permanently leave your browser. Messages are
          temporarily transmitted to Swiss and EU servers for processing. After
          generating the response, this data is not stored further. No AI models
          are trained with your inputs.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">6. Your Control</h2>
        <p className="mb-4">
          Since all conversations are stored locally on your device, you have
          full control:
        </p>
        <ul className="mb-4 list-disc pl-6">
          <li>Clear your browser data to remove all stored chats</li>
          <li>Start a new conversation at any time</li>
          <li>
            There is no server-side stored data that would need to be deleted
          </li>
        </ul>

        <h2 className="mt-6 mb-3 text-lg font-semibold">7. Security</h2>
        <p className="mb-4">
          All data transfers between your browser and our servers use SSL/TLS
          encrypted connections. Server-side processing takes place exclusively
          on Swiss and EU servers that are subject to strict data protection
          regulations.
        </p>

        <h2 className="mt-6 mb-3 text-lg font-semibold">8. Contact</h2>
        <p className="mb-4">
          For questions regarding data protection, you can reach us at:
          <br />
          Email:{" "}
          <a href="mailto:hello@almalex.ch" className="underline">
            hello@almalex.ch
          </a>
          <br />
          Joshua Gartmeier, Burgdorf, Switzerland
        </p>

        <p className="mt-8 text-sm">
          For more legal information, see our{" "}
          <a href="/en/imprint" className="underline">
            legal notice
          </a>
          .
        </p>
      </div>
    </div>
  );
}
