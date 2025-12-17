'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Chat() {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="h-[91vh] flex">
      {/* Sidebar - Chat History */}
      <aside className="w-64 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Red Queen AI Visualization Section */}
        <div className="p-4 border-b bg-black border-gray-200 dark:border-gray-700 text-center">
          <h1 className="text-lg font-bold text-white mb-2">Red Queen AI</h1>
          <div className="flex justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="#999"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-12 h-12 text-rq-red"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
              />
            </svg>
          </div>
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button className="w-full">New Chat</Button>
        </div>
        <div className="flex-1 p-4">
          <h2 className="text-sm font-semibold text-white mb-2">Chat History</h2>
          <div className="space-y-2">
            <div className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <p className="text-sm truncate">Previous Chat 1</p>
            </div>
            <div className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <p className="text-sm truncate">Previous Chat 2</p>
            </div>
            {/* Add more mock chats */}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Mock messages */}
            <div className="flex justify-start">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow max-w-xs">
                <p className="text-sm">Hello! How can I help you today?</p>
              </div>
            </div>
            <div className="flex justify-end">
              <div className="bg-blue-500 text-white p-3 rounded-lg shadow max-w-xs">
                <p className="text-sm">Tell me about Resident Evil lore.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}