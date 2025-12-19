'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import RedQueenAvatar from "@/components/RedQueenAvatar";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: string;
}

export default function Chat() {
  const [isTalking, setIsTalking] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [inputValue, setInputValue] = useState('');

  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    loadSessions();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const loadSessions = () => {
    const stored = localStorage.getItem('chatSessions');
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored);
        setSessions(parsed);
        if (parsed.length > 0) {
          setCurrentSessionId(parsed[0].id);
        } else {
          createNewSession();
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        createNewSession();
      }
    } else {
      createNewSession();
    }
  };

  const saveSessions = (newSessions: ChatSession[]) => {
    localStorage.setItem('chatSessions', JSON.stringify(newSessions));
    setSessions(newSessions);
  };

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      name: `Chat ${sessions.length + 1}`,
      messages: [{ role: 'assistant', content: 'Hello! How can I help you today?' }],
      createdAt: new Date().toISOString(),
    };
    const newSessions = [...sessions, newSession];
    saveSessions(newSessions);
    setCurrentSessionId(newSession.id);
  };

  const switchSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  async function handleSend() {
    if (!inputValue.trim() || !currentSession) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const loadingMessage: Message = { role: 'assistant', content: '', isLoading: true };
    const updatedMessages = [...currentSession.messages, userMessage, loadingMessage];
    const updatedSession = { ...currentSession, messages: updatedMessages };
    const updatedSessions = sessions.map(s => s.id === currentSessionId ? updatedSession : s);
    saveSessions(updatedSessions);

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
      const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage]; // Replace loading
      const finalSession = { ...updatedSession, messages: finalMessages };
      const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
      saveSessions(finalSessions);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, there was an error connecting to the AI.' };
      const finalMessages = [...updatedMessages.slice(0, -1), errorMessage];
      const finalSession = { ...updatedSession, messages: finalMessages };
      const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
      saveSessions(finalSessions);
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
          <Button className="w-full" onClick={createNewSession}>New Chat</Button>
        </div>
        {/* Chat History */}
        <div className="flex-1 p-4">
          <h2 className="text-md font-semibold text-white mb-4">Chat Sessions</h2>
          <div className="space-y-2">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`p-2 backdrop-blur-lg bg-white/70 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ${
                  session.id === currentSessionId ? 'border-2 border-red-500' : ''
                }`}
                onClick={() => switchSession(session.id)}
              >
                <p className="text-sm truncate">{session.name}</p>
                <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col">
        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto space-y-4">
            {currentSession?.messages.map((message, index) => (
              <div key={index} className={`p-3 text-black backdrop-blur-lg bg-white/70 rounded-md ${
                message.role === 'assistant' ? 'border-l-4 border-red-500' : 'border-r-4 border-blue-500 text-right'
              }`}>
                {message.isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                    <p className="text-lg">Thinking...</p>
                  </div>
                ) : (
                  <p className="text-lg">{message.content}</p>
                )}
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