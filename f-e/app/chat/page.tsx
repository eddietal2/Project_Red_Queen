'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RedQueenAvatar from "@/components/RedQueenAvatar";

export default function Chat() {
  const [isTalking, setIsTalking] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  function handleSend() {
    // demo: trigger talking for 1.5s
    setIsTalking(true);
    setTimeout(() => setIsTalking(false), 1500);
  }

  return (
    <div className="h-[91vh] flex">
      {/* Sidebar - Chat History */}
      <aside className="w-64 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Red Queen AI Visualization Section */}
        <div className="mx-auto">
          <RedQueenAvatar  />
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
              <Button onClick={handleSend}>Send</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}