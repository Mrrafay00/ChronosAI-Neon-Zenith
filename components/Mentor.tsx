
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot } from 'lucide-react';
import { getMentorAdvice } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

interface MentorProps {
  proactiveMessage?: string | null;
  onClearProactive: () => void;
}

const Mentor: React.FC<MentorProps> = ({ proactiveMessage, onClearProactive }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Operator.\nI am your Neural Mentor.\nHow can we optimize your flow today?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (proactiveMessage) {
      const cleanMsg = proactiveMessage.replace(/\*\*/g, '');
      setMessages(prev => [...prev, { role: 'model', text: `SYNC COMPLETE:\n${cleanMsg}` }]);
      setIsOpen(true);
      onClearProactive();
    }
  }, [proactiveMessage]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await getMentorAdvice(userMsg, messages);
      const cleanResponse = response.replace(/\*\*/g, '');
      setMessages(prev => [...prev, { role: 'model', text: cleanResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Temporal glitch.\nPlease re-sync." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-6 pointer-events-none">
      {isOpen && (
        <div className="w-[340px] sm:w-[400px] h-[550px] glass-card rounded-[48px] border border-[#f06ed7]/10 shadow-2xl flex flex-col overflow-hidden pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-500">
          <div className="p-6 bg-white/[0.03] border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-2xl bg-[#f06ed7] flex items-center justify-center text-white shadow-xl">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="text-xs font-black text-[#f4f0ec] leading-none tracking-widest uppercase">Chronos Coach</h3>
                <span className="text-[9px] text-[#885133] font-black uppercase tracking-[0.3em] mt-1 inline-block">Direct Link</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 text-[#885133] hover:text-[#f4f0ec] transition-colors"><X size={20} /></button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-6 py-5 rounded-[24px] text-xs leading-relaxed whitespace-pre-line shadow-sm font-medium tracking-tight ${
                  msg.role === 'user' 
                    ? 'bg-[#f4f0ec] text-[#0a0807] rounded-tr-none font-black uppercase tracking-widest' 
                    : 'bg-[#885133]/10 border border-white/5 text-[#f4f0ec] rounded-tl-none italic'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[#885133]/10 p-5 rounded-[24px] rounded-tl-none flex gap-1.5 animate-pulse">
                  <div className="w-1.5 h-1.5 bg-[#f06ed7] rounded-full"></div>
                  <div className="w-1.5 h-1.5 bg-[#f06ed7] rounded-full"></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 border-t border-white/5 bg-[#0a0807]/40">
            <div className="relative flex items-center">
              <input 
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Coach..."
                className="w-full bg-black/40 border border-white/10 rounded-[20px] py-5 pl-6 pr-14 text-xs text-[#f4f0ec] font-black uppercase tracking-widest outline-none focus:border-[#f06ed7]/40 transition-all"
              />
              <button 
                onClick={handleSend} disabled={!input.trim() || isLoading}
                className="absolute right-2 p-3 bg-[#f06ed7] text-white rounded-xl hover:scale-105 transition-all disabled:opacity-20 shadow-lg shadow-[#f06ed7]/20"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`pointer-events-auto p-6 rounded-[32px] shadow-2xl transition-all duration-500 transform hover:scale-105 active:scale-95 group ${
          isOpen ? 'bg-[#0a0807] border border-white/10 text-[#f06ed7]' : 'bg-[#f06ed7] text-white shadow-[#f06ed7]/20'
        }`}
      >
        <div className="relative">
          {proactiveMessage && !isOpen && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#d62300] rounded-full ring-4 ring-[#0a0807] animate-ping"></span>
          )}
          {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
        </div>
      </button>
    </div>
  );
};

export default Mentor;
