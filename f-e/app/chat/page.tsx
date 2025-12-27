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
import { useEffect, useState, useRef, useCallback, useMemo, memo } from "react";
import React from "react";
import RedQueenAvatar from "@/components/RedQueenAvatar";
import Link from "next/link";
import { createPortal } from 'react-dom';
import { Loader2 } from "lucide-react";

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

// Optimized Input component with memoization
const MemoizedInput = memo(React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>((props, ref) => {
  return <Input ref={ref} {...props} />;
}));
MemoizedInput.displayName = 'MemoizedInput';

export default function Chat() {
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [isTalking, setIsTalking] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const latestUserMessageRef = useRef<HTMLDivElement>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [renameValue, setRenameValue] = useState('');
  const [sessionToDelete, setSessionToDelete] = useState<string | null>(null);
  const [sessionToRename, setSessionToRename] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [openMessageMenuId, setOpenMessageMenuId] = useState<string | null>(null);
  const messageMenuRef = useRef<HTMLDivElement>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [messageMenuPosition, setMessageMenuPosition] = useState<{ top: number; left: number } | null>(null);

  const currentSession = useMemo(() => 
    sessions.find(s => s.id === currentSessionId), 
    [sessions, currentSessionId]
  );

  // Memoize placeholder text to prevent unnecessary re-computations
  const inputPlaceholder = useMemo(() => 
    currentSession ? "Type your message..." : "Create a chat session to start",
    [currentSession]
  );

  // Memoized send handler
  const handleSendClick = useCallback(() => {
    handleSend();
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    loadSessions();
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Loading spinner effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Listen for mobile menu toggle from layout
    const handleMobileMenuToggle = (event: CustomEvent) => {
      setIsSidebarOpen(event.detail);
    };
    window.addEventListener('mobileMenuToggle', handleMobileMenuToggle as EventListener);
    return () => {
      window.removeEventListener('mobileMenuToggle', handleMobileMenuToggle as EventListener);
    };
  }, []);

  useEffect(() => {
    // Store sidebar state and notify layout
    localStorage.setItem('sidebarOpen', isSidebarOpen.toString());
    window.dispatchEvent(new CustomEvent('sidebarStateChange'));
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
      if (messageMenuRef.current && !messageMenuRef.current.contains(event.target as Node)) {
        setOpenMessageMenuId(null);
        setMessageMenuPosition(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isTyping && currentSession) {
      const fullMessage = currentSession.messages[currentSession.messages.length - 1]?.content || '';
      if (typingMessage.length < fullMessage.length) {
        const timer = setTimeout(() => {
          setTypingMessage(fullMessage.slice(0, typingMessage.length + 1));
        }, 10); // Adjust speed here
        return () => clearTimeout(timer);
      } else {
        setIsTyping(false);
      }
    }
  }, [isTyping, typingMessage, currentSession]);

  // Scroll to bottom when current session changes
  useEffect(() => {
    if (currentSessionId) {
      scrollToBottom();
    }
  }, [currentSessionId]);

  const loadSessions = () => {
    const stored = localStorage.getItem('chatSessions');
    if (stored) {
      try {
        const parsed: ChatSession[] = JSON.parse(stored);
        setSessions(parsed);
        // Try to get current session ID from localStorage, fallback to first session
        const storedCurrentId = localStorage.getItem('currentSessionId');
        const currentId = (storedCurrentId && parsed.find(s => s.id === storedCurrentId)) 
          ? storedCurrentId 
          : (parsed.length > 0 ? parsed[0].id : '');
        setCurrentSessionId(currentId);
        if (currentId) {
          localStorage.setItem('currentSessionId', currentId);
        }
      } catch (error) {
        console.error('Error loading sessions:', error);
        setSessions([]);
        setCurrentSessionId('');
      }
    } else {
      setSessions([]);
      setCurrentSessionId('');
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
    setIsTransitioning(true);
    setCurrentSessionId(newSession.id);
    localStorage.setItem('currentSessionId', newSession.id);
    
    // Hide messages for 750ms, then show new session
    setTimeout(() => {
      setIsTransitioning(false);
    }, 750);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth'
        });
      }
    }, 900);
  };

  const switchSession = (sessionId: string) => {
    setIsTransitioning(true);
    setCurrentSessionId(sessionId);
    localStorage.setItem('currentSessionId', sessionId);
    
    // Hide messages for 750ms, then scroll to bottom
    setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
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
          setIsTransitioning(true);
          setCurrentSessionId(updatedSessions[0].id);
          localStorage.setItem('currentSessionId', updatedSessions[0].id);
          
          // Hide messages for 750ms, then show new session
          setTimeout(() => {
            setIsTransitioning(false);
          }, 750);
        } else {
          setCurrentSessionId('');
          localStorage.removeItem('currentSessionId');
        }
      }
    }
    setIsDeleteDialogOpen(false);
    setSessionToDelete(null);
  };

  const deleteMessage = (messageIndex: number) => {
    if (currentSession) {
      let indicesToDelete = [messageIndex];
      
      // If deleting a user message, also delete the next assistant message if it exists
      const message = currentSession.messages[messageIndex];
      if (message && message.role === 'user') {
        const nextMessage = currentSession.messages[messageIndex + 1];
        if (nextMessage && nextMessage.role === 'assistant') {
          indicesToDelete.push(messageIndex + 1);
        }
      }
      
      const updatedMessages = currentSession.messages.filter((_, index) => !indicesToDelete.includes(index));
      const updatedSession = { ...currentSession, messages: updatedMessages };
      const updatedSessions = sessions.map(s => s.id === currentSessionId ? updatedSession : s);
      saveSessions(updatedSessions);
    }
    setOpenMessageMenuId(null);
    setMessageMenuPosition(null);
  };

  const clearMessageHighlighting = (messageIndex: number) => {
    if (currentSession && currentSession.messages[messageIndex]) {
      const message = currentSession.messages[messageIndex];
      // Clear any highlighting spans from the message content
      const clearedContent = message.content.replace(/<span class="bg-yellow-300[^>]*>(.*?)<\/span>/g, '$1');
      const updatedMessages = [...currentSession.messages];
      updatedMessages[messageIndex] = { ...message, content: clearedContent };
      const updatedSession = { ...currentSession, messages: updatedMessages };
      const updatedSessions = sessions.map(s => s.id === currentSessionId ? updatedSession : s);
      saveSessions(updatedSessions);
    }
  };

  const editMessage = (messageIndex: number) => {
    if (currentSession) {
      setEditValue(currentSession.messages[messageIndex].content);
      setEditingMessageId(`${messageIndex}`);
    }
    setOpenMessageMenuId(null);
    setMessageMenuPosition(null);
  };

  const saveEdit = async (messageIndex: number) => {
    if (!currentSession || !editValue.trim()) return;

    // Update the user message
    const updatedMessages = [...currentSession.messages];
    updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: editValue.trim() };

    // Remove any subsequent messages (AI response and beyond)
    const trimmedMessages = updatedMessages.slice(0, messageIndex + 1);

    const updatedSession = { ...currentSession, messages: trimmedMessages };
    const updatedSessions = sessions.map(s => s.id === currentSessionId ? updatedSession : s);
    saveSessions(updatedSessions);

    setEditingMessageId(null);
    setEditValue('');

    // Stop any ongoing typing
    setIsTyping(false);
    setTypingMessage('');

    // Send new request
    const loadingMessage: Message = { role: 'assistant', content: '', isLoading: true };
    let finalMessages = [...trimmedMessages, loadingMessage];
    let finalSession = { ...updatedSession, messages: finalMessages };
    const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
    saveSessions(finalSessions);

    setTimeout(() => {
      const messageElement = latestUserMessageRef.current;
      if (messageElement && messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const messageRect = messageElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + (messageRect.top - containerRect.top);
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }, 100);

    try {
      const response = await fetch('http://localhost:8000/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: editValue.trim() }),
      });
      
      // Check if response is JSON with text and audio
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        console.log('Backend response data:', data);
        console.log('Word timings received:', data.word_timings);
        
        if (data.text && data.audio) {
          // Handle text and audio response
          const audioData = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
          const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl); setCurrentAudio(audio); // Track current audio for stopping
          
          // Use precise word timings from backend
          const wordTimings = data.word_timings || [];
          console.log('Word timings array:', wordTimings);
          console.log('Word timings length:', wordTimings.length);
          
          // Log each word timing individually
          wordTimings.forEach((timing: any, index: number) => {
            console.log(`Word timing ${index}: "${timing.word}" from ${timing.start}s to ${timing.end}s`);
          });
          
          let currentWordIndex = -1;
          let audioStarted = false;
          let highlightTimeout: NodeJS.Timeout | null = null;
          
          // Function to highlight a specific word for its duration
          const highlightWord = (wordIndex: number) => {
            if (wordIndex < 0 || wordIndex >= wordTimings.length) return;
            
            currentWordIndex = wordIndex;
            const timing = wordTimings[wordIndex];
            const wordToHighlight = timing.word;
            
            console.log(`Highlighting word ${wordIndex}: "${wordToHighlight}" at audio time ${audio.currentTime.toFixed(3)}s`);
            
            // Clear any existing highlights first
            let highlightedText = data.text_html || data.text;
            highlightedText = highlightedText.replace(/<span class="bg-yellow-300[^>]*>.*?<\/span>/g, (match: string) => {
              return match.replace(/<span[^>]*>(.*?)<\/span>/, '$1');
            });
            
            // Split text into words and whitespace segments to preserve formatting
            const segments = highlightedText.split(/(\s+)/);
            
            // Count occurrences of the target word up to the current word index
            let targetOccurrence = 0;
            for (let i = 0; i <= wordIndex; i++) {
              if (wordTimings[i].word.toLowerCase() === wordToHighlight.toLowerCase()) {
                targetOccurrence++;
              }
            }
            
            console.log(`Looking for occurrence ${targetOccurrence} of "${wordToHighlight}"`);
            
            let currentOccurrence = 0;
            let replacementMade = false;
            
            const highlightedSegments = segments.map((segment: any) => {
              // Only process actual words, not whitespace
              if (!segment.trim()) return segment;
              
              // Remove punctuation for comparison
              const cleanWord = segment.replace(/[.,!?;:""''()]/g, '');
              
              if (cleanWord.toLowerCase() === wordToHighlight.toLowerCase()) {
                currentOccurrence++;
                // Highlight the specific occurrence we're looking for
                if (!replacementMade && currentOccurrence === targetOccurrence) {
                  replacementMade = true;
                  return `<span class="bg-yellow-300 font-semibold text-black">${segment}</span>`;
                }
              }
              return segment;
            });
            
            highlightedText = highlightedSegments.join('');
            
            // Update the message content with highlighting
            const highlightedMessage: Message = { 
              role: 'assistant', 
              content: highlightedText 
            };
            finalMessages = [...finalMessages.slice(0, -1), highlightedMessage];
            finalSession = { ...finalSession, messages: finalMessages };
            const updatedSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
            saveSessions(updatedSessions);
          };
          
          // Function to check and update highlighting based on current audio time
          const checkHighlighting = () => {
            if (!audioStarted || wordTimings.length === 0) {
              console.log('checkHighlighting: audio not started or no word timings');
              return;
            }
            
            const currentTime = audio.currentTime;
            
            // Find the word that should be highlighted at the current time
            let targetWordIndex = -1;
            for (let i = 0; i < wordTimings.length; i++) {
              const timing = wordTimings[i];
              if (currentTime >= timing.start && currentTime < timing.end) {
                targetWordIndex = i;
                break;
              }
            }
            
            console.log(`checkHighlighting: audio time ${currentTime.toFixed(3)}s, target word index: ${targetWordIndex}, current word index: ${currentWordIndex}`);
            
            // If we found a word to highlight and it's different from current
            if (targetWordIndex !== -1 && targetWordIndex !== currentWordIndex) {
              console.log(`Highlighting word change: ${currentWordIndex} -> ${targetWordIndex}`);
              highlightWord(targetWordIndex);
            }
          };
          
          // Start checking for highlighting updates
          const startHighlighting = () => {
            console.log('Starting word highlighting with audio time synchronization');
            console.log('Word timings:', wordTimings);
            
            // Check highlighting every 5ms for ultra-precise synchronization with extremely short words
            highlightTimeout = setInterval(checkHighlighting, 5);
          };
          
          audio.addEventListener('timeupdate', () => {
            // Just for debugging - log occasionally
            if (Math.random() < 0.02) {
              console.log(`Audio time: ${audio.currentTime.toFixed(3)}s`);
            }
          });
          
          // Mark audio as started and begin highlighting sequence
          audio.addEventListener('playing', () => {
            audioStarted = true;
            console.log(`Audio started playing at ${Date.now()}, beginning highlighting synchronization`);
            startHighlighting();
            setIsTalking(true);
          });
          
          // Debug: Log when audio loads
          audio.addEventListener('loadeddata', () => {
            console.log('Audio loaded, duration:', audio.duration);
          });
          
          // Clean up interval when audio ends
          audio.addEventListener('ended', () => {
            if (highlightTimeout) {
              clearInterval(highlightTimeout);
              highlightTimeout = null;
            }
            console.log('Audio ended, stopped highlighting');
            setIsTalking(false);
          });
          
          // Play the audio
          audio.play();
          
          // Clean up the blob URL and listeners after audio ends
          audio.onended = () => {
            // Clear any remaining timeout
            if (highlightTimeout) {
              clearTimeout(highlightTimeout);
              highlightTimeout = null;
            }
            
            // Clear any remaining highlighting
            const finalMessage: Message = { 
              role: 'assistant', 
              content: data.text_html || data.text 
            };
            finalMessages = [...finalMessages.slice(0, -1), finalMessage];
            finalSession = { ...finalSession, messages: finalMessages };
            const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
            saveSessions(finalSessions);
            
            // Clean up
            audio.removeEventListener('timeupdate', () => {});
            URL.revokeObjectURL(audioUrl); setCurrentAudio(null); // Clear current audio reference
            
            setIsTalking(false);
          };
          
          return;
        } else {
          // Handle JSON response (for errors or fallback) - when there's no audio
          const fullAnswer = data.answer || 'Sorry, I couldn\'t generate a response.';
          
          // Check if quota was exceeded
          if (data.quota_exceeded) {
            // Don't show typing animation for quota messages
            const assistantMessage: Message = { role: 'assistant', content: fullAnswer };
            const finalMessages2 = [...finalMessages.slice(0, -1), assistantMessage];
            const finalSession2 = { ...finalSession, messages: finalMessages2 };
            const finalSessions2 = sessions.map(s => s.id === currentSessionId ? finalSession2 : s);
            saveSessions(finalSessions2);
            setIsTalking(false);
            return;
          }
          
          setTypingMessage('');
          setIsTyping(true);
          const assistantMessage: Message = { role: 'assistant', content: fullAnswer };
          const finalMessages2 = [...finalMessages.slice(0, -1), assistantMessage];
          const finalSession2 = { ...finalSession, messages: finalMessages2 };
          const finalSessions2 = sessions.map(s => s.id === currentSessionId ? finalSession2 : s);
          saveSessions(finalSessions2);
          setIsTalking(false);
        }
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, there was an error connecting to the AI.' };
      const finalMessages2 = [...finalMessages.slice(0, -1), errorMessage];
      const finalSession2 = { ...finalSession, messages: finalMessages2 };
      const finalSessions2 = sessions.map(s => s.id === currentSessionId ? finalSession2 : s);
      saveSessions(finalSessions2);
    } finally {
      setIsTalking(false);
    }
  };

  async function handleSend() {
    const inputValue = inputRef.current?.value || '';
    if (!inputValue.trim() || !currentSession) return;

    const userMessage: Message = { role: 'user', content: inputValue };
    const loadingMessage: Message = { role: 'assistant', content: '', isLoading: true };
    const updatedMessages = [...currentSession.messages, userMessage, loadingMessage];
    const updatedSession = { ...currentSession, messages: updatedMessages };
    const updatedSessions = sessions.map(s => s.id === currentSessionId ? updatedSession : s);
    saveSessions(updatedSessions);

    // Clear the input
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setTimeout(() => {
      const messageElement = latestUserMessageRef.current;
      if (messageElement && messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const messageRect = messageElement.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        const scrollTop = container.scrollTop + (messageRect.top - containerRect.top);
        container.scrollTo({ top: scrollTop, behavior: 'smooth' });
      }
    }, 100);

    try {
      const response = await fetch('http://localhost:8000/ai/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputValue }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();

        if (data.text && data.audio) {
          // Handle text and audio response
          const audioData = Uint8Array.from(atob(data.audio), c => c.charCodeAt(0));
          const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
          const audioUrl = URL.createObjectURL(audioBlob);
          const audio = new Audio(audioUrl); setCurrentAudio(audio); // Track current audio for stopping
          
          // Use precise word timings from backend
          const wordTimings = data.word_timings || [];
          console.log('Word timings array:', wordTimings);
          console.log('Word timings length:', wordTimings.length);
          
          // Log each word timing individually
          wordTimings.forEach((timing: any, index: number) => {
            console.log(`Word timing ${index}: "${timing.word}" from ${timing.start}s to ${timing.end}s`);
          });
          
          let currentWordIndex = -1;
          let audioStarted = false;
          let highlightTimeout: NodeJS.Timeout | null = null;
          
          // Function to highlight a specific word for its duration
          const highlightWord = (wordIndex: number) => {
            if (wordIndex < 0 || wordIndex >= wordTimings.length) return;
            
            currentWordIndex = wordIndex;
            const timing = wordTimings[wordIndex];
            const wordToHighlight = timing.word;
            
            console.log(`Highlighting word ${wordIndex}: "${wordToHighlight}" at audio time ${audio.currentTime.toFixed(3)}s`);
            
            // Clear any existing highlights first
            let highlightedText = data.text_html || data.text;
            highlightedText = highlightedText.replace(/<span class="bg-yellow-300[^>]*>.*?<\/span>/g, (match: string) => {
              return match.replace(/<span[^>]*>(.*?)<\/span>/, '$1');
            });
            
            // Split text into words and whitespace segments to preserve formatting
            const segments = highlightedText.split(/(\s+)/);
            
            // Count occurrences of the target word up to the current word index
            let targetOccurrence = 0;
            for (let i = 0; i <= wordIndex; i++) {
              if (wordTimings[i].word.toLowerCase() === wordToHighlight.toLowerCase()) {
                targetOccurrence++;
              }
            }
            
            console.log(`Looking for occurrence ${targetOccurrence} of "${wordToHighlight}"`);
            
            let currentOccurrence = 0;
            let replacementMade = false;
            
            const highlightedSegments = segments.map((segment: any) => {
              // Only process actual words, not whitespace
              if (!segment.trim()) return segment;
              
              // Remove punctuation for comparison
              const cleanWord = segment.replace(/[.,!?;:""''()]/g, '');
              
              if (cleanWord.toLowerCase() === wordToHighlight.toLowerCase()) {
                currentOccurrence++;
                // Highlight the specific occurrence we're looking for
                if (!replacementMade && currentOccurrence === targetOccurrence) {
                  replacementMade = true;
                  return `<span class="bg-yellow-300 font-semibold text-black">${segment}</span>`;
                }
              }
              return segment;
            });
            
            highlightedText = highlightedSegments.join('');
            
            // Update the message content with highlighting
            const highlightedMessage: Message = { 
              role: 'assistant', 
              content: highlightedText 
            };
            const finalMessages = [...updatedMessages.slice(0, -1), highlightedMessage]; // Replace loading
            const finalSession = { ...updatedSession, messages: finalMessages };
            const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
            saveSessions(finalSessions);
          };
          
          // Function to check and update highlighting based on current audio time
          const checkHighlighting = () => {
            if (!audioStarted || wordTimings.length === 0) {
              console.log('checkHighlighting: audio not started or no word timings');
              return;
            }
            
            const currentTime = audio.currentTime;
            
            // Find the word that should be highlighted at the current time
            let targetWordIndex = -1;
            for (let i = 0; i < wordTimings.length; i++) {
              const timing = wordTimings[i];
              if (currentTime >= timing.start && currentTime < timing.end) {
                targetWordIndex = i;
                break;
              }
            }
            
            console.log(`checkHighlighting: audio time ${currentTime.toFixed(3)}s, target word index: ${targetWordIndex}, current word index: ${currentWordIndex}`);
            
            // If we found a word to highlight and it's different from current
            if (targetWordIndex !== -1 && targetWordIndex !== currentWordIndex) {
              console.log(`Highlighting word change: ${currentWordIndex} -> ${targetWordIndex}`);
              highlightWord(targetWordIndex);
            }
          };
          
          // Start checking for highlighting updates
          const startHighlighting = () => {
            console.log('Starting word highlighting with audio time synchronization');
            console.log('Word timings:', wordTimings);
            
            // Check highlighting every 5ms for ultra-precise synchronization with extremely short words
            highlightTimeout = setInterval(checkHighlighting, 5);
          };
          
          audio.addEventListener('timeupdate', () => {
            // Just for debugging - log occasionally
            if (Math.random() < 0.02) {
              console.log(`Audio time: ${audio.currentTime.toFixed(3)}s`);
            }
          });
          
          // Mark audio as started and begin highlighting sequence
          audio.addEventListener('playing', () => {
            audioStarted = true;
            console.log(`Audio started playing at ${Date.now()}, beginning highlighting synchronization`);
            startHighlighting();
            setIsTalking(true);
          });
          
          // Debug: Log when audio loads
          audio.addEventListener('loadeddata', () => {
            console.log('Audio loaded, duration:', audio.duration);
          });
          
          // Clean up interval when audio ends
          audio.addEventListener('ended', () => {
            if (highlightTimeout) {
              clearInterval(highlightTimeout);
              highlightTimeout = null;
            }
            console.log('Audio ended, stopped highlighting');
            setIsTalking(false);
          });
          
          // Play the audio
          audio.play();
          
          // Clean up the blob URL and listeners after audio ends
          audio.onended = () => {
            // Clear any remaining timeout
            if (highlightTimeout) {
              clearTimeout(highlightTimeout);
              highlightTimeout = null;
            }
            
            // Clear any remaining highlighting
            const finalMessage: Message = { 
              role: 'assistant', 
              content: data.text_html || data.text 
            };
            const finalMessages = [...updatedMessages.slice(0, -1), finalMessage]; // Replace loading
            const finalSession = { ...updatedSession, messages: finalMessages };
            const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
            saveSessions(finalSessions);
            
            // Clean up
            audio.removeEventListener('timeupdate', () => {});
            URL.revokeObjectURL(audioUrl); setCurrentAudio(null); // Clear current audio reference
            
            setIsTalking(false);
          };
          
          return;
        } else {
          // Handle other JSON responses (errors or fallback)
          const fullAnswer = data.answer || 'Sorry, I couldn\'t generate a response.';

          // Check if quota was exceeded
          if (data.quota_exceeded) {
            // Don't show typing animation for quota messages
            const assistantMessage: Message = { role: 'assistant', content: fullAnswer };
            const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage]; // Replace loading
            const finalSession = { ...updatedSession, messages: finalMessages };
            const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
            saveSessions(finalSessions);
            setIsTalking(false);
            return;
          }

          setTypingMessage('');
          setIsTyping(true);
          const assistantMessage: Message = { role: 'assistant', content: fullAnswer };
          const finalMessages = [...updatedMessages.slice(0, -1), assistantMessage]; // Replace loading
          const finalSession = { ...updatedSession, messages: finalMessages };
          const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
          saveSessions(finalSessions);
        }
      } else {
        // Handle non-JSON responses
        const errorMessage: Message = { role: 'assistant', content: 'Sorry, unexpected response format.' };
        const finalMessages = [...updatedMessages.slice(0, -1), errorMessage];
        const finalSession = { ...updatedSession, messages: finalMessages };
        const finalSessions = sessions.map(s => s.id === currentSessionId ? finalSession : s);
        saveSessions(finalSessions);
      }
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
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-rq-black">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-red-500 mx-auto mb-4" />
            <p className="text-white text-lg font-medium">Loading Red Queen...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Collapsed Avatar */}
          {!isSidebarOpen && (
            <div className="fixed top-8 left-4 z-20 flex items-center space-x-2 hidden md:flex">
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

      <div className="h-screen flex relative">
        {/* Mobile Overlay Sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />
        )}

        {/* Sidebar - Chat History */}
        <aside className={`bg-rq-black backdrop-blur-lg border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300 ${
          isSidebarOpen
            ? 'fixed md:relative inset-y-0 left-0 z-50 w-80 md:w-64'
            : 'w-0 overflow-hidden'
        }`}>
          {/* Toggle Button */}
          <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full px-3 py-2 text-sm md:text-base"
            >
              {isSidebarOpen ? '← Close' : '☰ Menu'}
            </Button>
          </div>
          {/* Red Queen AI Visualization Section */}
          <div className="mx-auto">
            <RedQueenAvatar isTalking={isTalking} />
          </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Button className="w-full" onClick={createNewSession}>New Chat</Button>
          </div>
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
            <Link href="/disclaimer">
              <Button className="w-full bg-rq-red text-white hover:bg-rq-dark-red">Disclaimer</Button>
            </Link>
          </div>
          {/* Chat History */}
          <div className="flex-1 p-4">
            <h2 className="text-md font-semibold text-white mb-4">Chat Sessions</h2>
            <div className="space-y-2">
              {sessions.length === 0 ? (
                <p className="text-gray-400 text-sm">No chat sessions yet. Click "New Chat" to start.</p>
              ) : (
                sessions.map((session) => (
                  <div key={session.id} className="relative">
                    <div
                      className={`p-2 backdrop-blur-lg bg-white/80 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer flex justify-between items-center ${
                        session.id === currentSessionId ? 'border-2 border-red-500' : ''
                      }`}
                      onClick={() => switchSession(session.id)}
                    >
                      <div>
                        <p className="text-xs font-bold">{session.name}</p>
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
                      <div ref={menuRef} className="absolute right-0 mt-1 w-32 bg-white border border-gray-300 rounded shadow-lg z-[9999]">
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
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Collapsed Avatar - Mobile Optimized */}
        {!isSidebarOpen && (
          <div className="fixed top-4 left-4 z-30 flex items-center space-x-2 md:hidden">
            {/* <RedQueenAvatar isTalking={isTalking} /> */}
            {/* <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="ml-2 px-3 py-2 text-sm"
            >
              ☰
            </Button> */}
          </div>
        )}

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-4rem)]">

          {/* Chat Messages */}
          <div ref={messagesContainerRef} className="flex-1 p-3 pt-8 sm:p-4 overflow-y-auto pb-20 md:pb-4">
            <div className={`max-w-4xl mx-auto space-y-3 sm:space-y-4 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
              {currentSession ? (
                currentSession.messages.map((message, index) => {
                  const isLastAIMessage = message.role === 'assistant' && index === currentSession.messages.findLastIndex(m => m.role === 'assistant');
                  const isLatestUserMessage = message.role === 'user' && index === currentSession.messages.findLastIndex(m => m.role === 'user');
                  return (
                  <div key={index} ref={isLatestUserMessage ? latestUserMessageRef : undefined} className={`p-3 sm:p-4 text-white backdrop-blur-lg bg-black/70 rounded-md relative z-10 transition-all duration-200 text-sm sm:text-base ${
                    message.role === 'assistant' ? `border-l-4 border-red-500 hover:bg-black/90 hover:border-red-600 hover:shadow-md ${isLastAIMessage ? 'mb-80' : ''}` : 'border-r-4 border-blue-500 text-right hover:bg-black/90 hover:border-blue-600 hover:shadow-md md:max-w-[50%] md:ml-auto'
                  }`}>
                    {message.isLoading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-lg">Thinking...</p>
                      </div>
                    ) : editingMessageId === `${index}` ? (
                      <div className="flex space-x-2">
                        <MemoizedInput
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') saveEdit(index);
                            if (e.key === 'Escape') setEditingMessageId(null);
                          }}
                          className="flex-1"
                          autoFocus
                        />
                        <Button onClick={() => saveEdit(index)} size="sm">Save</Button>
                        <Button onClick={() => setEditingMessageId(null)} variant="outline" size="sm">Cancel</Button>
                      </div>
                    ) : (
                      <>
                        {message.role === 'user' && (
                          <button
                            className="absolute top-2 left-2 text-gray-500 hover:text-gray-700 p-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              const rect = e.currentTarget.getBoundingClientRect();
                              setMessageMenuPosition({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
                              setOpenMessageMenuId(openMessageMenuId === `${index}` ? null : `${index}`);
                            }}
                          >
                            ⋮
                          </button>
                        )}
                        {message.role === 'assistant' && (
                          <div className="flex items-center space-x-2 mb-2 border-b-2 border-[#99999920] pb-2">
                            <button
                              className="px-3 py-1 text-xs text-black bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              onClick={async () => {
                                const textToCopy = message.content.replace(/<[^>]*>/g, ''); // Remove HTML tags
                                
                                try {
                                  // Try modern Clipboard API first
                                  if (navigator.clipboard && navigator.clipboard.writeText) {
                                    await navigator.clipboard.writeText(textToCopy);
                                  } else {
                                    // Fallback for older browsers
                                    const textArea = document.createElement('textarea');
                                    textArea.value = textToCopy;
                                    textArea.style.position = 'fixed';
                                    textArea.style.left = '-999999px';
                                    textArea.style.top = '-999999px';
                                    document.body.appendChild(textArea);
                                    textArea.focus();
                                    textArea.select();
                                    document.execCommand('copy');
                                    document.body.removeChild(textArea);
                                  }
                                  
                                  setCopySuccess(`${index}`);
                                  setTimeout(() => setCopySuccess(null), 2000);
                                } catch (error) {
                                  console.error('Failed to copy text:', error);
                                  // Could show an error message to user here
                                }
                              }}
                              title="Copy message"
                            >
                              {copySuccess === `${index}` ? '✅ Copied!' : '📋 Copy'}
                            </button>
                            <button
                              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() => {
                                if (currentAudio) {
                                  currentAudio.pause();
                                  currentAudio.currentTime = 0;
                                  setIsTalking(false);
                                  setCurrentAudio(null);
                                }
                                // Clear highlighting from this specific message
                                clearMessageHighlighting(index);
                              }}
                              disabled={!currentAudio}
                              title="Stop audio playback"
                            >
                              🔇 Stop Audio
                            </button>
                            <h1 className="flex font-semibold text-lg ml-auto text-yellow-500" style={{ fontFamily: 'Dancing Script, cursive' }} >Red Queen</h1>
                          </div>
                        )}
                        <div className={`text-sm ${message.role === 'user' ? 'ml-8' : ''}`}>
                          {message.role === 'assistant' && index === currentSession.messages.length - 1 && isTyping
                            ? typingMessage + (typingMessage.length < message.content.length ? '|' : '')
                            : message.content.includes('<span') || message.content.includes('<br>')
                              ? <div dangerouslySetInnerHTML={{ __html: message.content }} />
                              : message.content
                          }
                        </div>
                      </>
                    )}
                  </div>
                  );
                })
              ) : (
                <div className="text-center py-8 sm:py-12 lg:mt-20 bg-white/10 backdrop-blur-lg rounded-md px-4 sm:px-6">
                  <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-500 via-yellow-500 to-black bg-clip-text text-transparent mt-4">Welcome to Red Queen AI</h2>
                  <p className="text-white mt-2 text-sm sm:text-base">Create a new chat session to get started with your AI assistant.</p>
                  <Button className="mt-4 red-button" onClick={createNewSession}>Start New Chat</Button>
                </div>
              )}
            </div>
          </div>

          {/* Input Area - Fixed on Mobile */}
          <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-rq-black backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 p-3 sm:p-4 z-10">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-2 sm:gap-3">
                <MemoizedInput
                  ref={inputRef}
                  type="text"
                  placeholder={inputPlaceholder}
                  className="flex-1 min-h-[44px] sm:min-h-[48px] bg-white/90 focus:bg-white focus:ring-2 focus:ring-red-500 px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base"
                  defaultValue=""
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={!currentSession}
                />
                <Button
                  onClick={handleSend}
                  disabled={isTalking || !currentSession}
                  className="h-[44px] w-[44px] sm:h-[48px] sm:w-[48px] shrink-0 hover:bg-red-600 hover:shadow-md transition-all duration-200 hover:scale-105"
                >
                  Send
                </Button>
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
            <MemoizedInput
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

      {openMessageMenuId && messageMenuPosition && createPortal(
        <div
          ref={messageMenuRef}
          className="fixed w-32 bg-white border border-gray-300 rounded shadow-lg z-[9999]"
          style={{ top: messageMenuPosition!.top, left: messageMenuPosition!.left }}
        >
          {/* <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              const index = parseInt(openMessageMenuId!);
              editMessage(index);
            }}
          >
            Edit
          </button> */}
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
            onClick={() => {
              const index = parseInt(openMessageMenuId!);
              deleteMessage(index);
            }}
          >
            Delete
          </button>
          <button
            className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => {
              setOpenMessageMenuId(null);
              setMessageMenuPosition(null);
            }}
          >
            Close
          </button>
        </div>,
        document.body
      )}
        </>
      )}
    </>
  );
}




