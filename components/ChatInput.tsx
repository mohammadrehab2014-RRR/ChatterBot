
import React, { useState, useRef } from 'react';
import { PaperclipIcon, SendIcon, XIcon } from './Icons';

interface ChatInputProps {
  onSendMessage: (text: string, imageDataUrl: string | null) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading || (!text.trim() && !imagePreview)) return;
    onSendMessage(text, imagePreview);
    setText('');
    handleRemoveImage();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit(event as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-gray-800 p-4 border-t border-gray-700">
      <form onSubmit={handleSubmit} className="relative">
        {imagePreview && (
          <div className="absolute bottom-full left-0 w-full p-2 bg-gray-700 rounded-t-md">
            <div className="relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-20 w-20 object-cover rounded" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition"
              >
                <XIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
        <div className="flex items-center bg-gray-700 rounded-lg p-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question or describe your image..."
            className="w-full bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none resize-none px-2 max-h-32"
            rows={1}
            disabled={isLoading}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
            accept="image/*"
            id="imageUpload"
          />
          <label htmlFor="imageUpload" className="cursor-pointer p-2 text-gray-400 hover:text-white transition">
            <PaperclipIcon className="w-6 h-6" />
          </label>
          <button
            type="submit"
            disabled={isLoading || (!text.trim() && !imagePreview)}
            className="p-2 text-white bg-indigo-600 rounded-full disabled:bg-indigo-400 disabled:cursor-not-allowed hover:bg-indigo-700 transition"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
