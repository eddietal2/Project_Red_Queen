import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-rq-light-blue dark:bg-rq-black">
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
      <section
        role="region"
        aria-label="Features"
        className="py-16 px-4 bg-rq-black dark:bg-rq-light-blue text-white"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Features
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <li className="text-center">
              <h3 className="text-xl font-semibold mb-2">Feature One</h3>
              <p>Benefit of feature one.</p>
            </li>
            <li className="text-center">
              <h3 className="text-xl font-semibold mb-2">Feature Two</h3>
              <p>Benefit of feature two.</p>
            </li>
            <li className="text-center">
              <h3 className="text-xl font-semibold mb-2">Feature Three</h3>
              <p>Benefit of feature three.</p>
            </li>
          </ul>
        </div>
      </section>

      {/* About Section */}
      <section
        role="region"
        aria-label="About"
        className="py-16 px-4 bg-rq-blue dark:bg-rq-black text-white"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">About This Software</h2>
          <p className="text-lg mb-6">
            This software helps you achieve your goals with ease.
          </p>
          <a
            href="#"
            className="text-blue-600 underline"
          >
            Learn More
          </a>
          <img
            src="/about-image.png"
            alt="About illustration"
            className="mt-8 mx-auto w-64 h-64 object-cover rounded-lg"
          />
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
