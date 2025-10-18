
import React from 'react';
import { ChatSession } from '../types';
import { XIcon, PlusIcon } from './Icons';

interface ChatHistoryProps {
  history: ChatSession[];
  onLoadSession: (session: ChatSession) => void;
  onNewChat: () => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ history, onLoadSession, onNewChat, onClose }) => {
  return (
    <div className="absolute top-0 left-0 h-full w-full md:w-80 bg-gray-800 z-20 shadow-lg flex flex-col p-4 transform transition-transform">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-700">
            <h2 className="text-xl font-bold">Chat History</h2>
            <button onClick={onClose} className="p-1 hover:bg-gray-700 rounded-full">
                <XIcon className="w-6 h-6"/>
            </button>
        </div>
        <button 
            onClick={onNewChat}
            className="flex items-center justify-center gap-2 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition mb-4"
        >
            <PlusIcon className="w-5 h-5"/>
            New Chat
        </button>
        <div className="flex-grow overflow-y-auto">
            {history.length === 0 ? (
                <p className="text-gray-400 text-center mt-4">No past conversations.</p>
            ) : (
                <ul>
                    {history.slice().reverse().map((session, index) => (
                        <li key={history.length - 1 - index} className="mb-2">
                            <button
                                onClick={() => onLoadSession(session)}
                                className="w-full text-left p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition truncate"
                            >
                                <span className="font-medium">Conversation {history.length - index}</span>
                                <p className="text-sm text-gray-400 truncate">{session[0]?.text || 'Image Query'}</p>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  );
};

export default ChatHistory;
