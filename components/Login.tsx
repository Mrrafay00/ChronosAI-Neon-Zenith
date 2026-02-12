
import React, { useState } from 'react';
import { BrainCircuit, ArrowRight, Sparkles, ShieldCheck, UserPlus, LogIn as LogInIcon, User } from 'lucide-react';
import { Account } from '../types';

interface AuthProps {
  onAuth: (name: string) => void;
  knownAccounts: Account[];
  lastUser: string | null;
}

type AuthMode = 'signup' | 'login' | 'welcome';

const AVATAR_COLORS = [
  'bg-indigo-500', 'bg-emerald-500', 'bg-rose-500', 'bg-amber-500', 'bg-violet-500', 'bg-sky-500'
];

const Auth: React.FC<AuthProps> = ({ onAuth, knownAccounts, lastUser }) => {
  const [mode, setMode] = useState<AuthMode>(lastUser ? 'welcome' : (knownAccounts.length > 0 ? 'login' : 'signup'));
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsSubmitting(true);
      setTimeout(() => {
        onAuth(name.trim());
        setIsSubmitting(false);
      }, 600);
    }
  };

  const handleQuickLogin = (accountName: string) => {
    setIsSubmitting(true);
    setTimeout(() => {
      onAuth(accountName);
      setIsSubmitting(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/30 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200/30 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md relative animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 text-white mb-4">
            <BrainCircuit size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-800">
            Chronos<span className="text-indigo-600">AI</span>
          </h1>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[40px] shadow-2xl shadow-slate-200/60 border border-slate-100">
          
          {/* Welcome Back View */}
          {mode === 'welcome' && (
            <div className="animate-in fade-in zoom-in duration-300">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-inner">
                  <User size={40} />
                </div>
                <h2 className="text-2xl font-bold text-slate-800">Welcome back!</h2>
                <p className="text-slate-500 mt-1">Ready to resume your deep work?</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => lastUser && handleQuickLogin(lastUser)}
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-100 active:scale-[0.98]"
                >
                  {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Continue as ${lastUser?.split(' ')[0]}`}
                </button>
                <button
                  onClick={() => setMode(knownAccounts.length > 0 ? 'login' : 'signup')}
                  className="w-full bg-slate-50 hover:bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold transition-all"
                >
                  Use a different account
                </button>
              </div>
            </div>
          )}

          {/* Login / Signup Tabs */}
          {mode !== 'welcome' && (
            <>
              <div className="flex bg-slate-50 p-1.5 rounded-2xl mb-8">
                <button 
                  onClick={() => setMode('signup')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'signup' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <UserPlus size={16} /> Sign Up
                </button>
                <button 
                  onClick={() => setMode('login')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${mode === 'login' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                >
                  <LogInIcon size={16} /> Log In
                </button>
              </div>

              {mode === 'signup' ? (
                <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                  <div>
                    <label className="block text-slate-700 font-bold mb-2 ml-1" htmlFor="name">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!name.trim() || isSubmitting}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                  </button>
                </form>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                  {knownAccounts.length > 0 ? (
                    <div className="space-y-3">
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest ml-1 mb-4">Saved Accounts</p>
                      {knownAccounts.map((acc, idx) => (
                        <button
                          key={acc.name}
                          onClick={() => handleQuickLogin(acc.name)}
                          className="w-full flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50 transition-all group"
                        >
                          <div className={`w-10 h-10 rounded-xl ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold`}>
                            {acc.name.charAt(0)}
                          </div>
                          <span className="font-bold text-slate-700 group-hover:text-indigo-600">{acc.name}</span>
                          <ArrowRight size={18} className="ml-auto text-slate-200 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-slate-400">No accounts found on this device.</p>
                      <button onClick={() => setMode('signup')} className="text-indigo-600 font-bold mt-2 hover:underline">Create one now</button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
            <ShieldCheck size={14} />
            <span>Secure Enterprise-grade Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
