'use client';

import { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Search,
  MoreVertical,
  Paperclip,
  Smile,
  Clock,
  Check,
  CheckCheck
} from 'lucide-react';


interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  isInstructor: boolean;
  attachments?: string[];
}

interface Conversation {
  id: string;
  instructor: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isActive: boolean;
}

export default function MessagesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');

  // Conversations will be populated from database when student enrolls
  const conversations: Conversation[] = [];

  const messages: Message[] = [];

  const filteredConversations = conversations.filter(conversation =>
    conversation.instructor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  return (
    <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-slate-700">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Chat with your instructors</p>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row">
          {/* Conversations List */}
          <div className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-slate-700 flex flex-col">
            {/* Search */}
            <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto max-h-64 lg:max-h-none">
              {filteredConversations.length === 0 ? (
                <div className="p-4 text-center">
                  <MessageSquare className="h-8 w-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`p-3 sm:p-4 border-b border-gray-100 dark:border-slate-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate text-sm sm:text-base">
                            {conversation.instructor}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                            {conversation.lastMessageTime}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <div className="ml-2 flex-shrink-0">
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {selectedConversation ? (
              <>
                {/* Messages Header */}
                <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm sm:text-base">
                          {conversations.find(c => c.id === selectedConversation)?.instructor.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">
                          {conversations.find(c => c.id === selectedConversation)?.instructor}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Instructor</p>
                      </div>
                    </div>
                    <button className="p-1 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">No messages yet</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isInstructor ? 'justify-start' : 'justify-end'}`}
                      >
                        <div className={`max-w-[75%] sm:max-w-xs lg:max-w-md px-3 sm:px-4 py-2 rounded-lg ${
                          message.isInstructor
                            ? 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                            : 'bg-blue-600 text-white'
                        }`}>
                          <p className="text-xs sm:text-sm break-words">{message.content}</p>
                          <div className={`flex items-center justify-between mt-1 text-xs ${
                            message.isInstructor ? 'text-gray-500 dark:text-gray-400' : 'text-blue-100'
                          }`}>
                            <span>{formatTime(message.timestamp)}</span>
                            {!message.isInstructor && (
                              <div className="flex items-center gap-1">
                                {message.isRead ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Message Input */}
                <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <Paperclip className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-300 text-sm sm:text-base"
                      />
                    </div>
                    <button className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
                      <Smile className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500 dark:text-gray-400" />
                    </button>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-1.5 sm:p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 dark:text-gray-500 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-2">Select a conversation</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Choose an instructor to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
