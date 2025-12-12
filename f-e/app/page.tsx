

import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section */}
      <header role="banner" className="flex items-center bg-blue-600 text-white min-h-[80vh] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to Our Platform</h1>
          <p className="text-lg mb-6">
            Discover amazing features and start your journey today.
          </p>
          <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100">
            Start Chat
          </button>
        </div>
      </header>

      {/* Features Section */}
      <section
        role="region"
        aria-label="Features"
        className="py-16 px-4 bg-white"
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
        className="py-16 px-4 bg-gray-50"
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
