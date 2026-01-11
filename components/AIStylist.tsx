import React, { useState } from 'react';
import { getAIRecommendation } from '../services/geminiService';

interface Props {
  onClose: () => void;
}

export const AIStylist: React.FC<Props> = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    const result = await getAIRecommendation(query);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="bg-white w-80 md:w-96 rounded-2xl shadow-2xl border border-rose-100 overflow-hidden flex flex-col">
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 p-4 flex justify-between items-center text-white">
        <h3 className="font-serif font-bold flex items-center gap-2">
          ✨ Virtual Stylist
        </h3>
        <button onClick={onClose} className="hover:text-rose-200">
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
      
      <div className="p-4 h-64 overflow-y-auto bg-rose-50">
        {!response && !loading && (
          <p className="text-gray-500 text-sm text-center mt-10">
            Hi! I'm your personal stylist. Ask me for saree recommendations for a wedding, or the best facial for your skin type!
          </p>
        )}
        {loading && (
           <div className="flex justify-center items-center h-full space-x-2">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
           </div>
        )}
        {response && !loading && (
          <div className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
             <p className="text-gray-700 text-sm">{response}</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t bg-white">
        <form onSubmit={handleAsk} className="flex gap-2">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for advice..."
            className="flex-1 text-sm border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-rose-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-rose-600 text-white px-3 py-2 rounded-md hover:bg-rose-700 disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </form>
      </div>
    </div>
  );
};