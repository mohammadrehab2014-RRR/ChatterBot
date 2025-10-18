
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, Sender, ChatSession } from './types';
import ChatMessageComponent from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import { runQuery } from './services/geminiService';
import ChatHistory from './components/ChatHistory';
import { HistoryIcon } from './components/Icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [history, setHistory] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (text: string, imageDataUrl: string | null) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: Sender.User,
      text,
      image: imageDataUrl || undefined,
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const botResponseText = await runQuery(text, imageDataUrl);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: botResponseText,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: Sender.Bot,
        text: 'Sorry, something went wrong. Please try again.',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleNewChat = () => {
    if (messages.length > 0) {
      setHistory(prev => [...prev, messages]);
    }
    setMessages([]);
    setIsHistoryOpen(false);
  };

  const handleLoadSession = (session: ChatSession) => {
    if (messages.length > 0 && JSON.stringify(messages) !== JSON.stringify(session)) {
      setHistory(prev => [...prev, messages]);
    }
    setMessages(session);
    setIsHistoryOpen(false);
  };
  
  const WelcomeScreen = () => (
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">ChatterBot</h1>
        <p className="text-xl text-gray-300">Your AI-powered learning companion.</p>
        <p className="text-gray-400 mt-2">Ask questions about Math, Science, English, Hindi, or upload an image of your problem!</p>
      </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden">
      {isHistoryOpen && (
        <ChatHistory 
          history={history} 
          onLoadSession={handleLoadSession} 
          onNewChat={handleNewChat}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
      
      <header className="bg-gray-800/50 backdrop-blur-sm p-4 border-b border-gray-700 flex justify-between items-center z-10">
        <button onClick={() => setIsHistoryOpen(true)} className="p-2 hover:bg-gray-700 rounded-full transition">
          <HistoryIcon className="w-6 h-6 text-white"/>
        </button>
        <h1 className="text-2xl font-bold text-white">ChatterBot</h1>
        <div className="w-10"></div>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        {messages.length === 0 ? <div className="h-full flex items-center justify-center"><WelcomeScreen/></div> : (
          <>
            {messages.map((msg) => (
              <ChatMessageComponent key={msg.id} message={msg} />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="px-4 py-3 rounded-2xl bg-gray-700 text-gray-200 rounded-bl-none">
                      <div className="flex items-center space-x-2">
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                          <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
                      </div>
                  </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </main>
      
      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default App;
