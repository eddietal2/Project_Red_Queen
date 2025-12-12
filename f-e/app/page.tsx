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
              <li className="bg-rq-blue/20 p-6 rounded-lg hover:bg-rq-blue/30 transition-colors duration-300 text-center">
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
                <h3 className="text-xl font-semibold mb-2">Feature One</h3>
                <p>Benefit of feature one with enhanced capabilities.</p>
              </li>
              <li className="bg-rq-blue/20 p-6 rounded-lg hover:bg-rq-blue/30 transition-colors duration-300 text-center">
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
                <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
                <p>Benefit of feature two for better efficiency.</p>
              </li>
              <li className="bg-rq-blue/20 p-6 rounded-lg hover:bg-rq-blue/30 transition-colors duration-300 text-center">
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
                      d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
                <p>Benefit of feature three with advanced tools.</p>
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
