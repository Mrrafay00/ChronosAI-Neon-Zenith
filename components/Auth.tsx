
import React, { useState } from 'react';
import { BrainCircuit } from 'lucide-react';
import { Account } from '../types';

interface AuthProps {
  onAuth: (name: string) => void;
  knownAccounts: Account[];
  lastUser: string | null;
}

const Auth: React.FC<AuthProps> = ({ onAuth, knownAccounts, lastUser }) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      setTimeout(() => onAuth(name.trim()), 600);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0807] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(240,110,215,0.08),_transparent_70%)]"></div>
      </div>

      <div className="w-full max-w-sm relative z-10 text-center">
        <div className="inline-flex w-24 h-24 bg-[#f06ed7] rounded-[36px] items-center justify-center text-[#f4f0ec] shadow-2xl shadow-[#f06ed7]/20 mb-12">
          <BrainCircuit size={48} />
        </div>
        <h1 className="text-5xl font-black text-[#f4f0ec] tracking-tighter mb-16 italic uppercase">Chronos<span className="text-[#d62300]">AI</span></h1>

        <div className="glass-card p-12 rounded-[48px] border border-white/5">
          <form onSubmit={handleSubmit} className="space-y-10 text-left">
            <div>
              <label className="block text-[10px] font-black text-[#885133] uppercase tracking-[0.3em] mb-4">Operator Link</label>
              <input
                type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="INPUT IDENTITY"
                className="w-full px-6 py-5 bg-black/40 border border-white/5 rounded-[20px] text-[#f4f0ec] font-black text-xs tracking-widest placeholder:text-[#885133]/20 outline-none focus:border-[#f06ed7]/50 transition-all"
                autoFocus
              />
            </div>
            <button
              disabled={!name.trim() || isSubmitting}
              className="w-full py-5 bg-[#f4f0ec] text-[#0a0807] font-black text-xs uppercase tracking-[0.2em] rounded-[20px] shadow-xl hover:bg-[#f06ed7] hover:text-white transition-all disabled:opacity-20"
            >
              {isSubmitting ? 'Syncing...' : 'Initialize Core'}
            </button>
          </form>

          {knownAccounts.length > 0 && (
            <div className="mt-12 pt-10 border-t border-white/5 space-y-4">
              <p className="text-[9px] font-black text-[#885133] uppercase tracking-widest mb-4 text-center italic">Known Signals</p>
              {knownAccounts.slice(0, 2).map(acc => (
                <button
                  key={acc.name} onClick={() => onAuth(acc.name)}
                  className="w-full flex items-center gap-4 p-5 rounded-[20px] bg-[#885133]/5 border border-white/5 hover:bg-[#885133]/10 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#f06ed7]/20 flex items-center justify-center text-[#f06ed7] font-black text-xs">{acc.name[0].toUpperCase()}</div>
                  <span className="font-black text-[#f4f0ec] group-hover:text-[#f06ed7] text-xs uppercase tracking-tight">{acc.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
