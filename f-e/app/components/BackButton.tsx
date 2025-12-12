'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BackButton() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  return (
    <Link href="/">
      <button className="mr-4 text-white hover:text-gray-700 dark:hover:text-gray-300 flex items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 mr-1"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
          />
        </svg>
      </button>
    </Link>
  );
}