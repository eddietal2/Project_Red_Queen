import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-rq-black">
      {/* Hero Section */}
      <header role="banner" className="flex items-center text-white min-h-[80vh] px-4 bg-rq-red">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg mb-6">
            Discover amazing features and start your journey today.
          </p>
          <Link href="/chat">
            <Button className="bg-rq-blue text-white hover:bg-rq-dark-red">
              Start Chat
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <div className="backdrop-blur-lg bg-rq-red/10 p-8 lg:m-32 shadow-lg rounded-lg">
        <section
          role="region"
          aria-label="Features"
          className="py-16 px-4 text-white"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              Features
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <li className="bg-rq-blue/20 p-6 rounded-lg border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-blue/30 hover:border-rq-red/50 transition-all duration-300 text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">RAG-Powered Chatbot</h3>
                <p>Leveraging Gemini LLM and Llama Index for factually accurate, character-consistent responses embodying the Red Queen persona.</p>
              </li>
              <li className="bg-rq-blue/20 p-6 rounded-lg border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-blue/30 hover:border-rq-red/50 transition-all duration-300 text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Decoupled Architecture</h3>
                <p>Django backend for AI logic and data management, paired with a modern frontend for responsive, high-performance UI.</p>
              </li>
              <li className="bg-rq-blue/20 p-6 rounded-lg border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-blue/30 hover:border-rq-red/50 transition-all duration-300 text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-12 h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Vector Database Integration</h3>
                <p>ChromaDB for efficient storage and retrieval of curated lore, ensuring accurate and consistent AI responses.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section
        role="region"
        aria-label="About"
        className="py-16 px-4 bg-rq-blue text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">About This Software</h2>
          <p className="text-lg mb-8">
            This software helps you achieve your goals with ease, built using modern technologies.
          </p>
          <h3 className="text-xl font-semibold mb-4">Technologies Used</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/nextjs-icon.svg" alt="NextJS" className="tech-icon w-12 h-12 mx-auto" />
                  <img src="/icons/react-icon.svg" alt="React" className="tech-icon w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">NextJS</strong> - React framework for server-side rendering and full-stack development.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/python-icon.svg" alt="Python" className="tech-icon w-12 h-12 mx-auto" />
                  <img src="/icons/django-icon.svg" alt="Django" className="tech-icon w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">Django</strong> - Python web framework for rapid backend development.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/google-icon.svg" alt="Google" className="tech-icon w-12 h-12 mx-auto" />
                  <img src="/icons/google-gemini-icon.svg" alt="Gemini" className="tech-icon w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">Gemini 2.5 Flash</strong> - Advanced AI model for fast and accurate language processing.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/llamaindex-icon.svg" alt="Llama Index" className="tech-icon scale-300 w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">Llama Index (for RAG)</strong> - Framework for building retrieval-augmented generation applications.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/tailwindcss-icon.svg" alt="TailwindCSS" className="tech-icon w-12 h-12 mx-auto" />
                  <img src="/icons/shadcn-icon.svg" alt="Shadcn" className="tech-icon w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">TailwindCSS & Shadcn</strong> - Utility-first CSS framework and component library for modern UI.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-rq-black/90 rounded-xl">
              <li className="bg-rq-black/60 p-6 rounded-xl border border-rq-red/30 shadow-lg hover:shadow-xl hover:bg-rq-black/80 hover:border-rq-red/50 transition-all duration-300 min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex">
                  <img src="/icons/chroma-icon.svg" alt="ChromaDB" className="tech-icon w-12 h-12 mx-auto" />
                </div>
                <strong className="text-rq-red">ChromaDB</strong> - Vector database for efficient AI and embedding storage.
              </li>
            </div>
          </ul>
          <a
            href="#"
            className="text-rq-red underline hover:text-rq-dark-red"
          >
            Learn More
          </a>
        </div>
      </section>
    </div>
  );
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
};
