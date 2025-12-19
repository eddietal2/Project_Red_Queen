'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RedQueenAvatar from "@/components/RedQueenAvatar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [isTalking, setIsTalking] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Hello! How can I help you today?' }
  ]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  async function handleSend() {
    if (!inputValue.trim()) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTalking(true);

    try {
      const response = await fetch('http://localhost:8000/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputValue }),
      });
      const data = await response.json();
      const assistantMessage: Message = { role: 'assistant', content: data.answer || 'Sorry, I couldn\'t generate a response.' };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, there was an error connecting to the AI.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTalking(false);
    }
  }

  return (
    <div className="h-[91vh] flex">
      {/* Sidebar - Chat History */}
      <aside className="w-64 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Red Queen AI Visualization Section */}
        <div className="mx-auto">
          <RedQueenAvatar isTalking={isTalking} />
        </div>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <Button className="w-full" onClick={() => setMessages([{ role: 'assistant', content: 'Hello! How can I help you today?' }])}>New Chat</Button>
        </div>
        {/* Chat History */}
        <div className="flex-1 p-4">
          <h2 className="text-md font-semibold text-white mb-4">Chat History</h2>
          <div className="space-y-2">
            <div className="p-2 backdrop-blur-lg bg-white/70 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
              <p className="text-sm truncate">Previous Chat 1</p>
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
            {messages.map((message, index) => (
              <div key={index} className={`p-3 text-black backdrop-blur-lg bg-white/70 rounded-md ${
                message.role === 'assistant' ? 'border-l-4 border-red-500' : 'border-r-4 border-blue-500 text-right'
              }`}>
                <p className="text-lg">{message.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="max-w-4xl mx-auto">
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                className="flex-1 backdrop-blur-lg bg-white/70 focus:ring-2 focus:ring-red-500"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <Button onClick={handleSend} disabled={isTalking}>Send</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}