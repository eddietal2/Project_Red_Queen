"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";

export default function Disclaimer() {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };
  return (
    <div className="min-h-screen bg-rq-black text-gray-900 dark:text-white px-4 py-8 backdrop-blur-lg bg-rq-black/10 dark:bg-rq-black/20">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-8 md:p-12">
          <div className="text-center mb-8">
            <AlertTriangle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Disclaimer</h1>
            <div className="w-24 h-1 bg-red-500 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold text-red-600 dark:text-red-400">&copy;</span> All fictional lore, characters, names ("Red Queen," "Umbrella"), and plot details are the copyrighted and trademarked intellectual property of Capcom Co., Ltd. and are used here for commentary, criticism, and transformative educational purposes only.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              This project is not affiliated with, endorsed by, or sponsored by Capcom. No claim of ownership is made over the source materials used for the RAG knowledge base.
            </p>
            <p className="text-gray-700 dark:text-gray-300 font-medium">
              This is for educational use only.
            </p>
          </div>

          <div className="text-center mt-10">
            <Button
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center gap-2 mx-auto"
            >
              <X className="h-5 w-5" />
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}