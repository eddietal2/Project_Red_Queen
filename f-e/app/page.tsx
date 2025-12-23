import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-rq-black">

      {/* Hero Section */}
      <header role="banner" className="flex items-center text-white min-h-[60vh] sm:min-h-[80vh] px-4">
        <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12 shad text-center rounded-lg bg-black/80 backdrop-blur-lg hover:bg-red-900/10 hover:scale-105 transition-all duration-300 hover:shadow-xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl text-white text-yellow-500 font-bold mb-4 typewriter"  style={{ fontFamily: 'Dancing Script, cursive' }}>
            Welcome to RedQueen.AI.
            </h1>
          <p className="text-base sm:text-lg mb-6 text-white">
            AI Agent for discovering Resident Evil Lore.
          </p>
          <Link href="/chat">
            <Button className="red-button text-white hover:bg-rq-dark-red hover:scale-105 hover:shadow-lg transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4">
              Start Chat
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <div className="backdrop-blur-lg bg-rq-red/10 p-4 sm:p-6 lg:p-8 m-4 sm:m-8 lg:m-32 shadow-lg rounded-lg">
        <section
          role="region"
          aria-label="Features"
          className="py-8 sm:py-12 lg:py-16 px-4 text-white"
        >
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl text-yellow-500 font-bold text-center mb-8 sm:mb-12" style={{ fontFamily: 'Dancing Script, cursive' }}>
              Features
            </h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              <li className="bg-black/80 p-4 sm:p-6 rounded-lg border border-rq-red/30 bg-rq-red/80 backdrop-blur-lg hover:bg-red-900/10 hover:scale-105 transition-all duration-300 hover:shadow-xl text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl text-yellow-500 font-semibold mb-2">Red Queen AI Emulation</h3>
                <p className="text-sm sm:text-base">An AI system that embodies the Red Queen from Resident Evil, providing intelligent, character-consistent interactions and responses.</p>
              </li>
              <li className="bg-black/80 p-4 sm:p-6 rounded-lg border border-rq-red/30 bg-rq-red/80 backdrop-blur-lg hover:bg-red-900/10 hover:scale-105 transition-all duration-300 hover:shadow-xl text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl text-yellow-500 font-semibold mb-2">Resident Evil Lore Discovery</h3>
                <p className="text-sm sm:text-base">Leverage the Red Queen AI to delve into and discover comprehensive Resident Evil lore, offering detailed insights and answers to your questions.</p>
              </li>
              <li className="bg-black/80 p-4 sm:p-6 rounded-lg border border-rq-red/30 bg-rq-red/80 backdrop-blur-lg hover:bg-red-900/10 hover:scale-105 transition-all duration-300 hover:shadow-xl text-center">
                <div className="mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mx-auto text-rq-red"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375"
                    />
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl text-yellow-500 font-semibold mb-2">RAG-Powered AI Agent</h3>
                <p className="text-sm sm:text-base">Built on Retrieval-Augmented Generation (RAG) and AI agent technology, integrated with vector databases for seamless knowledge retrieval and generation.</p>
              </li>
            </ul>
          </div>
        </section>
      </div>

      {/* About Section */}
      <section
        role="region"
        aria-label="About"
        className="py-8 sm:py-12 lg:py-16 px-4 bg-rq-blue text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl text-yellow-500 font-bold mb-6 sm:mb-8" style={{ fontFamily: 'Dancing Script, cursive' }}>About This Software</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center gap-2">
                  <img src="/icons/nextjs-icon.svg" alt="NextJS" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  <img src="/icons/react-icon.svg" alt="React" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">NextJS</strong> - React framework for server-side rendering and full-stack development.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center gap-2">
                  <img src="/icons/python-icon.svg" alt="Python" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  <img src="/icons/django-icon.svg" alt="Django" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">Django</strong> - Python web framework for rapid backend development.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center gap-2">
                  <img src="/icons/google-icon.svg" alt="Google" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  <img src="/icons/google-gemini-icon.svg" alt="Gemini" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">Gemini 2.5 Flash</strong> - Advanced AI model for fast and accurate language processing.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center">
                  <img src="/icons/llamaindex-icon.svg" alt="Llama Index" className="tech-icon scale-300 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">Llama Index (for RAG)</strong> - Framework for building retrieval-augmented generation applications.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center gap-2">
                  <img src="/icons/tailwindcss-icon.svg" alt="TailwindCSS" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                  <img src="/icons/shadcn-icon.svg" alt="Shadcn" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">TailwindCSS & Shadcn</strong> - Utility-first CSS framework and component library for modern UI.
              </li>
            </div>
            <div className="backdrop-blur-lg bg-black/60 rounded-xl hover:shadow-xl hover:bg-red-900/10 hover:border-rq-red/50 hover:scale-105 transition-all duration-300">
              <li className="bg-rq-black/60 p-4 sm:p-6 rounded-xl border border-[#999] shadow-lg min-h-48 sm:min-h-56 lg:min-h-64 flex flex-col justify-center">
                <div className="mb-4 flex justify-center">
                  <img src="/icons/chroma-icon.svg" alt="ChromaDB" className="tech-icon w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
                </div>
                <strong className="text-yellow-500 text-sm sm:text-base">ChromaDB</strong> - Vector database for efficient AI and embedding storage.
              </li>
            </div>
          </ul>
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
