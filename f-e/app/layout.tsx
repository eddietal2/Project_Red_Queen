'use client';

import type { Metadata } from "next";
import { Exo_2, Fira_Code, Jura, Dancing_Script } from 'next/font/google';
import { usePathname } from 'next/navigation';
import BackButton from "./components/BackButton";
import ParallaxBackground from "./components/ParallaxBackground";
import "./globals.css";
import Footer from "./components/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { transform } from "next/dist/build/swc/generated-native";
import { useEffect, useState } from "react";
import RedQueenAvatar from "@/components/RedQueenAvatar";

const dancing_script = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing_script',
});

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

const jura = Jura({
  subsets: ['latin'],
  variable: '--font-jura',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    
    // Set the page title
    document.title = 'RedQueen.AI';
    
    // Prevent mobile zoom on input focus
    const viewport = document.querySelector('meta[name="viewport"]');
    if (!viewport) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';
      document.head.appendChild(meta);
    } else {
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    }

    // Listen for sidebar state changes from chat component
    const handleSidebarStateChange = () => {
      const stored = localStorage.getItem('sidebarOpen');
      if (stored !== null) {
        setIsMobileMenuOpen(JSON.parse(stored));
      }
    };
    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    // Initial load
    handleSidebarStateChange();
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const toggleMobileMenu = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    // Store in localStorage to communicate with chat component
    localStorage.setItem('mobileMenuOpen', newState.toString());
    // Dispatch custom event to notify chat component
    window.dispatchEvent(new CustomEvent('mobileMenuToggle', { detail: newState }));
  };
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${jura.variable} ${dancing_script.variable} min-h-screen font-jura`}
        style={{
          backgroundImage: 'url(/images/the_hive_visual.jpg)',
          backgroundPosition: 'bottom',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          backgroundColor: '#000000', // Fallback to black if image fails
          imageRendering: 'crisp-edges', // Improves sharpness on scaling
        }}
      >
        <ParallaxBackground />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-5 bg-gradient-to-b from-transparent to-rq-black"></div>
        <div className="relative z-10">
          {/* Navigation */}
          <nav
            role="navigation"
            className="bg-black/40 backdrop-blur-lg shadow-md py-4 px-4 fixed top-0 w-full z-20 border-b border-rq-red/20"
          >
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="flex items-center">
                <BackButton />
                <div className="md:hidden items-center flex">
                  {/* Placeholder for RedQueenAvatar - component not found */}
                  <RedQueenAvatar isTalking={true} size={65}/>
                  <div className="w-8 h-8 bg-rq-red rounded-full"></div>
                </div>
                  <h1 className="text-xl text-yellow-500 font-semibold" style={{ fontFamily: 'Dancing Script, cursive' }}>
                    RedQueen.AI
                  </h1>
              </div>
              <div className="flex items-center">
                {/* Desktop: Show disclaimer, Mobile: Show menu button (only on chat page) */}
                <div className="hidden md:block">
                  <Link href="/disclaimer">
                    <Button className="bg-rq-red text-white hover:bg-red-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl">
                      Disclaimer
                    </Button>
                  </Link>
                </div>
                {pathname === '/chat' && (
                  <div className="md:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleMobileMenu}
                      className="px-3 py-2 text-sm"
                    >
                      {isMobileMenuOpen ? '✕' : '☰'}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </nav>
          <main className="pt-16">{children}</main>
          {/* Footer Section */}
          <div className="backdrop-blur-lg bg-rq-black/90">
            <Footer />
          </div>
        </div>
      </body>
    </html>
  );
}
