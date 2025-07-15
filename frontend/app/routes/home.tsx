import { Link } from "react-router";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [
    { title: "Alma Lex - AI-Powered Swiss Legal Assistant" },
    { 
      name: "description", 
      content: "Advanced AI legal assistant built with RAG technology for Swiss Federal Law and court decisions. Created by legal professionals showcasing expertise in AI, embeddings, and modern web development." 
    },
    { property: "og:title", content: "Alma Lex - AI-Powered Swiss Legal Assistant" },
    { 
      property: "og:description", 
      content: "Advanced AI legal assistant built with RAG technology for Swiss Federal Law and court decisions. Try our live demo with 10 free messages per week." 
    },
    { property: "og:type", content: "website" },
  ];
};

export default function HomePage() {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            Alma Lex
          </h1>
          <p className="text-xl text-muted-foreground">
            AI-Powered Swiss Legal Assistant
          </p>
        </div>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          <h3>The Team</h3>
          <p>
            <strong>Alexandra Telychko</strong>, a practicing lawyer, identified a gap in legal technology while working on complex Swiss legal cases. She envisioned an AI assistant that could navigate the intricate landscape of Swiss Federal Law and court decisions. <strong>Guillaume Ruch</strong> brought business acumen and strategic thinking to transform this vision into a viable product concept. <strong>Joshua Gartmeier</strong> architected and built the technical foundation, implementing cutting-edge RAG technology to make this ambitious idea a reality.
          </p>

          <h3>The Vision</h3>
          <p>
            Alma Lex represents our answer to the challenge of making Swiss legal knowledge accessible through AI. We built a sophisticated chatbot that leverages ChatGPT combined with our comprehensive vector store containing the entire Swiss Federal Law and Federal Court Decisions, embedded using OpenAI's latest technology. This Retrieval-Augmented Generation (RAG) system provides accurate legal assistance backed by authoritative Swiss legal sources—a technical achievement that demonstrates our ability to work with complex datasets and modern AI architectures.
          </p>

          <h3>From Idea to Reality</h3>
          <p>
            What excites us most about this project is how we transformed an abstract idea into a working product using cutting-edge AI technology. We strategically chose to release Alma Lex as a live demonstration of our capabilities—proving we can take complex concepts and ship real solutions. This isn't just a prototype; it's a fully functional AI system that users can interact with today.
          </p>

          <h3>Technical Implementation</h3>
          <p>
            Building Alma Lex required deep expertise in modern AI infrastructure. We implemented a complete RAG pipeline: processing and embedding the entire Swiss legal corpus using OpenAI's embedding models, building a vector database with Postgres and pgvector, and integrating OpenAI's completion APIs for contextual responses. This technical stack demonstrates our fluency with AI fundamentals: embeddings, vector similarity search, prompt engineering, and API integration.
          </p>
          
          <h3>Demo Limitations</h3>
          <p>
            Users get <strong>10 messages per week</strong> to experience the AI legal assistant. We deliberately chose not to allow users to sign up. These were intentional design decisions to position this as a demonstration rather than a full-featured product—showcasing our technical capabilities while maintaining focus on the core AI functionality.
          </p>

          <h3>Vision for Enhancement</h3>
          <p>
            We envision extending this demonstration with powerful features that would showcase a complete legal research platform:
          </p>
          <ul>
            <li><strong>Process Transparency:</strong> Show users what the AI is doing behind the scenes—translating queries, searching the database, and processing results in real-time</li>
            <li><strong>Source Document Display:</strong> Present the actual Swiss legal documents and court cases used to generate each response, eliminating the need to manually look up articles and court cases</li>
            <li><strong>Interactive References:</strong> Link specific claims in AI responses directly to their source passages in Swiss Federal Law and court decisions</li>
          </ul>


          <div className="text-center not-prose mt-8">
            <Link 
              to="/chat/new"
              className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
            >
              Try the Live Demo
            </Link>
          </div>
        </article>

        <footer className="text-center text-muted-foreground text-sm mt-12">
          <p>
            Created by Alexandra Telychko, Guillaume Ruch, and Joshua Gartmeier
          </p>
        </footer>
      </div>
    </div>
  );
}
