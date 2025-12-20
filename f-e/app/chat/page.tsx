'use client';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useEffect, useState, useRef } from "react";
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
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const currentSession = sessions.find(s => s.id === currentSessionId);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    loadSessions();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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

  const renameSession = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      setRenameValue(session.name);
      setSessionToRename(sessionId);
      setIsRenameDialogOpen(true);
    }
    setOpenMenuId(null);
  };

  const confirmRename = () => {
    if (sessionToRename && renameValue.trim()) {
      const updatedSessions = sessions.map(s => s.id === sessionToRename ? { ...s, name: renameValue.trim() } : s);
      saveSessions(updatedSessions);
    }
    setIsRenameDialogOpen(false);
    setSessionToRename(null);
    setRenameValue('');
  };

  const deleteSession = (sessionId: string) => {
    setSessionToDelete(sessionId);
    setIsDeleteDialogOpen(true);
    setOpenMenuId(null);
  };

  const confirmDelete = () => {
    if (sessionToDelete) {
      const updatedSessions = sessions.filter(s => s.id !== sessionToDelete);
      saveSessions(updatedSessions);
      if (sessionToDelete === currentSessionId) {
        if (updatedSessions.length > 0) {
          setCurrentSessionId(updatedSessions[0].id);
        } else {
          createNewSession();
        }
      }
    }
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
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
    <>
      {/* Collapsed Avatar */}
      {!isSidebarOpen && (
        <div className="fixed top-8 left-4 z-20 flex items-center space-x-2">
          <RedQueenAvatar isTalking={isTalking} />
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSidebarOpen(true)}
            className="ml-2"
          >
            →
          </Button>
        </div>
      )}

      <div className="h-[91vh] flex">
        {/* Sidebar - Chat History */}
        <aside className={`dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
        }`}>
          {/* Toggle Button */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full"
            >
              {isSidebarOpen ? '← Collapse' : '→ Expand'}
            </Button>
          </div>
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
                <div key={session.id} className="relative">
                  <div
                    className={`p-2 backdrop-blur-lg bg-white/70 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center ${
                      session.id === currentSessionId ? 'border-2 border-red-500' : ''
                    }`}
                    onClick={() => switchSession(session.id)}
                  >
                    <div>
                      <p className="text-sm truncate">{session.name}</p>
                      <p className="text-xs text-gray-500">{new Date(session.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="text-gray-500 hover:text-gray-700 p-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === session.id ? null : session.id);
                      }}
                    >
                      ⋮
                    </button>
                  </div>
                  {openMenuId === session.id && (
                    <div ref={menuRef} className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-30">
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => renameSession(session.id)}
                      >
                        Rename
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                        onClick={() => deleteSession(session.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                        onClick={() => setOpenMenuId(null)}
                      >
                        Close
                      </button>
                    </div>
                  )}
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
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button onClick={handleSend} disabled={isTalking}>Send</Button>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat session? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rename Dialog */}
      <AlertDialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rename Chat Session</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this chat session.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              placeholder="New session name"
              onKeyDown={(e) => e.key === 'Enter' && confirmRename()}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmRename} disabled={!renameValue.trim()}>
              Rename
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}