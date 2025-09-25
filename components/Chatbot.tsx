'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  Minimize2,
  Maximize2,
  Trash2,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Debug logging
  useEffect(() => {
    console.log('Chatbot component mounted, isOpen:', isOpen);
  }, [isOpen]);

  // Get current page context
  const getPageContext = () => {
    const pageContexts: { [key: string]: string } = {
      '/': 'Homepage - Main landing page with course overview and features',
      '/login': 'Login page - Student authentication portal',
      '/student': 'Student Dashboard - Overview of progress, stats, and recent activity',
      '/student/modules': 'Course Modules - Interactive coding lessons and exercises',
      '/student/projects': 'Projects - Hands-on coding projects with different difficulty levels',
      '/student/assignments': 'Assignments - View and submit course assignments',
      '/student/messages': 'Messages - Communication with instructors and peers',
      '/student/guidance': 'Guidance - Learning resources, screen time management, and focus sessions',
      '/student/account': 'Account Settings - Profile management, theme settings, and preferences',
      '/student/schedule': 'Schedule - View upcoming classes and events',
      '/instructor': 'Instructor Dashboard - Teaching tools and student management',
      '/admin': 'Admin Dashboard - Platform administration and management',
      '/team': 'Team page - Information about the Coasted Code team',
      '/contact': 'Contact page - Get in touch with support',
      '/courses': 'Courses page - Browse available courses',
      '/programs': 'Programs page - Educational programs and tracks',
      '/tracks': 'Learning tracks - Structured learning paths'
    };

    // Find the best matching context
    for (const [path, context] of Object.entries(pageContexts)) {
      if (pathname.startsWith(path)) {
        return context;
      }
    }
    
    return `Current page: ${pathname} - General application page`;
  };

  // Load conversation history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot-conversation');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages).map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading conversation history:', error);
      }
    } else {
      // Add welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: 'Hi! I\'m your Coasted Code AI assistant. I can help you with questions about the platform, course materials, assignments, and more. How can I assist you today?',
        timestamp: new Date()
      }]);
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatbot-conversation', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chatbot opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Prepare conversation history for API
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          conversationHistory,
          pageContext: getPageContext(),
          currentPath: pathname
        }),
      });

      const data = await response.json();
      console.log('Chatbot - API response:', data);

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        console.error('Chatbot - API error:', data.error);
        
        // Handle fallback responses more gracefully
        if (data.fallback) {
          let fallbackContent = data.response || "I'm currently experiencing some technical difficulties. Please try again in a few moments, or feel free to contact our support team for immediate assistance. You can also check our FAQ section or browse through the course materials while I'm getting back online! 😊";
          
          if (data.quotaExceeded && !data.response) {
            fallbackContent = "I've reached my daily limit for AI responses. Don't worry though! You can still:\n\n• Browse our course materials and modules\n• Check your assignments and progress\n• Contact our support team directly\n• Try again tomorrow when my quota resets\n\nI'm here to help in other ways while I recharge! 💪";
          }
          
          const fallbackMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: fallbackContent,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, fallbackMessage]);
        } else {
          throw new Error(data.error || 'Failed to get response');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again or contact support if the problem persists.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearConversation = () => {
    setMessages([{
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your Coasted Code AI assistant. I can help you with questions about the platform, course materials, assignments, and more. How can I assist you today?',
      timestamp: new Date()
    }]);
    localStorage.removeItem('chatbot-conversation');
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center justify-center group z-[9999] border-2 border-white"
        aria-label="Open AI Assistant"
        style={{ zIndex: 9999 }}
      >
        <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
        <div className="absolute -top-2 -right-2 w-5 h-5 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
        <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          AI Assistant
        </span>
      </button>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
      isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
    }`}>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Assistant</h3>
              <p className="text-xs text-blue-100">Coasted Code Helper</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={clearConversation}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Clear conversation"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onToggle}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.role === 'user' && (
                    <div className="w-8 h-8 bg-gray-300 dark:bg-slate-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 dark:border-slate-700">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about Coasted Code..."
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                Powered by <Sparkles className="w-3 h-3 inline mx-1" /> Gemini AI
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
