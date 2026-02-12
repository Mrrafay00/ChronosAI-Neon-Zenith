
import React, { useState, useEffect } from 'react';
import Timer from './components/Timer';
import Dashboard from './components/Dashboard';
import History from './components/History';
import Auth from './components/Auth';
import Mentor from './components/Mentor';
import TaskPlanner from './components/TaskPlanner';
import { Task, Account, PlannedTask } from './types';
import { getWeeklyInsights, getMotivationalTrigger } from './services/geminiService';
import { LayoutDashboard, BrainCircuit, Settings, FileText, Plus, Volume2, PlusCircle, Trash2, Menu, X as CloseIcon } from 'lucide-react';

const DEFAULT_CATEGORIES = ['Core Projects', 'Administrative', 'Professional Growth'];
const DEFAULT_GOAL = 4 * 3600;

const App: React.FC = () => {
  const [user, setUser] = useState<Account | null>(null);
  const [knownAccounts, setKnownAccounts] = useState<Account[]>([]);
  const [lastUser, setLastUser] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [plannedTasks, setPlannedTasks] = useState<PlannedTask[]>([]);
  const [isPlannerOpen, setIsPlannerOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [insights, setInsights] = useState<string>('Initializing neural link...');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'settings'>('dashboard');
  const [mentorProactiveMsg, setMentorProactiveMsg] = useState<string | null>(null);

  // Settings Temp States
  const [newCat, setNewCat] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('chronos_accounts');
    const last = localStorage.getItem('chronos_last_user');
    const active = localStorage.getItem('chronos_active_session');
    if (saved) setKnownAccounts(JSON.parse(saved));
    if (last) setLastUser(last);
    if (active && saved) {
      const found = JSON.parse(saved).find((a: any) => a.name === active);
      if (found) {
        setUser(found);
        const t = localStorage.getItem(`chronos_tasks_${found.name}`);
        const p = localStorage.getItem(`chronos_planned_${found.name}`);
        if (t) setTasks(JSON.parse(t));
        if (p) setPlannedTasks(JSON.parse(p));
      }
    }
  }, []);

  const handleAuth = (name: string) => {
    const existing = knownAccounts.find(a => a.name === name);
    const account: Account = existing || { 
      name, 
      createdAt: Date.now(), 
      avatarColor: 'bg-[#885133]',
      persona: 'Lead Professional',
      categories: DEFAULT_CATEGORIES, 
      dailyFocusGoal: DEFAULT_GOAL 
    };
    if (!existing) {
      const newKnown = [...knownAccounts, account];
      setKnownAccounts(newKnown);
      localStorage.setItem('chronos_accounts', JSON.stringify(newKnown));
    }
    setUser(account);
    localStorage.setItem('chronos_active_session', name);
    localStorage.setItem('chronos_last_user', name);
    const t = localStorage.getItem(`chronos_tasks_${name}`);
    const p = localStorage.getItem(`chronos_planned_${name}`);
    setTasks(t ? JSON.parse(t) : []);
    setPlannedTasks(p ? JSON.parse(p) : []);
  };

  const updateAccount = (updates: Partial<Account>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    const updatedKnown = knownAccounts.map(a => a.name === user.name ? updatedUser : a);
    setKnownAccounts(updatedKnown);
    localStorage.setItem('chronos_accounts', JSON.stringify(updatedKnown));
  };

  const handleTaskComplete = async (t: Task) => {
    const newTasks = [t, ...tasks];
    setTasks(newTasks);
    localStorage.setItem(`chronos_tasks_${user!.name}`, JSON.stringify(newTasks));
    const mot = await getMotivationalTrigger(t);
    setMentorProactiveMsg(mot);
  };

  const handlePlannedUpdate = (newPlanned: PlannedTask[]) => {
    setPlannedTasks(newPlanned);
    if (user) {
      localStorage.setItem(`chronos_planned_${user.name}`, JSON.stringify(newPlanned));
    }
  };

  useEffect(() => {
    if (tasks.length > 0) {
      getWeeklyInsights(tasks).then(setInsights);
    }
  }, [tasks]);

  const navItems = [
    { id: 'dashboard', label: 'MONITOR', icon: LayoutDashboard },
    { id: 'history', label: 'ARCHIVE', icon: FileText },
    { id: 'settings', label: 'CONFIG', icon: Settings }
  ];

  if (!user) return <Auth onAuth={handleAuth} knownAccounts={knownAccounts} lastUser={lastUser} />;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-x-hidden relative">
      <Mentor proactiveMessage={mentorProactiveMsg} onClearProactive={() => setMentorProactiveMsg(null)} />
      
      {isPlannerOpen && (
        <TaskPlanner 
          plannedTasks={plannedTasks} 
          onUpdate={handlePlannedUpdate} 
          onClose={() => setIsPlannerOpen(false)} 
          persona={user.persona}
        />
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-[#0a0807]/95 backdrop-blur-2xl lg:hidden flex flex-col p-10 animate-in fade-in duration-300">
          <div className="flex justify-between items-center mb-16">
            <h1 className="text-2xl font-black text-[#f4f0ec] tracking-tighter italic">CHRONOS<span className="text-[#d62300]">AI</span></h1>
            <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 bg-[#885133]/20 rounded-2xl text-[#f4f0ec]">
              <CloseIcon size={24} />
            </button>
          </div>
          <nav className="flex-1 space-y-6">
            {navItems.map(t => (
              <button
                key={t.id} 
                onClick={() => { setActiveTab(t.id as any); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-6 px-8 py-8 rounded-[32px] text-lg font-black tracking-[0.2em] transition-all border ${activeTab === t.id ? 'bg-[#f06ed7] text-[#f4f0ec] border-[#f06ed7] shadow-2xl' : 'text-[#885133] border-white/5'}`}
              >
                <t.icon size={24} /> {t.label}
              </button>
            ))}
          </nav>
          <div className="mt-auto glass-card p-8 rounded-[40px] flex items-center justify-between border-white/10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#885133] flex items-center justify-center text-[#f4f0ec] font-black">{user.name[0]}</div>
              <div className="font-black text-[#f4f0ec] text-sm uppercase tracking-tighter">{user.name}</div>
            </div>
            <button onClick={() => { localStorage.removeItem('chronos_active_session'); setUser(null); }} className="p-3 text-[#d62300] font-black uppercase text-[10px] tracking-widest">Logout</button>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-80 flex-col bg-[#0a0807]/80 border-r border-white/5 p-10 h-screen sticky top-0">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-12 h-12 bg-[#f06ed7] rounded-2xl flex items-center justify-center text-[#f4f0ec] shadow-xl shadow-[#f06ed7]/20">
            <BrainCircuit size={24} />
          </div>
          <h1 className="text-2xl font-black text-[#f4f0ec] tracking-tighter italic">CHRONOS<span className="text-[#d62300]">AI</span></h1>
        </div>

        <nav className="flex-1 space-y-3">
          {navItems.map(t => (
            <button
              key={t.id} onClick={() => setActiveTab(t.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-[20px] text-[11px] font-black tracking-widest transition-all ${activeTab === t.id ? 'bg-[#f4f0ec] text-[#0a0807] shadow-xl' : 'text-[#885133] hover:text-[#f4f0ec] hover:bg-white/5'}`}
            >
              <t.icon size={18} /> {t.label}
            </button>
          ))}
        </nav>

        <div className="mt-auto glass-card p-6 rounded-[32px] border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl bg-[#885133] flex items-center justify-center text-[#f4f0ec] font-black`}>{user.name[0]}</div>
            <div className="flex-1 truncate font-black text-[#f4f0ec] text-xs tracking-tight">{user.name.toUpperCase()}</div>
          </div>
          <button onClick={() => { localStorage.removeItem('chronos_active_session'); setUser(null); }} className="w-full py-4 bg-[#d62300]/10 text-[#d62300] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#d62300]/20 transition-all">TERMINATE SESSION</button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="lg:hidden flex items-center justify-between p-6 sticky top-0 bg-[#0a0807]/80 backdrop-blur-xl z-[100] border-b border-white/5">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-[#f06ed7] rounded-xl flex items-center justify-center text-[#f4f0ec] shadow-lg shadow-[#f06ed7]/10">
             <BrainCircuit size={20} />
           </div>
           <h1 className="text-lg font-black text-[#f4f0ec] tracking-tighter italic">CHRONOS</h1>
        </div>
        <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 bg-white/5 rounded-xl text-[#f4f0ec] hover:bg-[#f06ed7] transition-all">
          <Menu size={24} />
        </button>
      </div>

      <main className="flex-1 p-6 md:p-8 lg:p-16 max-w-7xl mx-auto w-full">
        <header className="flex items-center justify-between mb-12 md:mb-20">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-[#f4f0ec] tracking-tighter uppercase leading-none">{activeTab}</h2>
            <p className="text-[#885133] font-black text-[10px] tracking-[0.2em] mt-2">SYSTEM STATUS: OPTIMAL</p>
          </div>
          <button 
            onClick={() => setIsPlannerOpen(true)}
            className="w-14 h-14 bg-[#f4f0ec] text-[#0a0807] rounded-2xl flex items-center justify-center hover:bg-[#f06ed7] hover:text-white transition-all shadow-xl"
          >
            <Plus size={24} />
          </button>
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-12 md:space-y-16">
            <Timer onTaskComplete={handleTaskComplete} userCategories={user.categories} persona={user.persona} />
            <div className="glass-card p-8 md:p-10 rounded-[48px] border-l-2 border-l-[#f06ed7]">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-black text-[#f06ed7] uppercase tracking-[0.3em]">Neural Directive</span>
                <Volume2 className="text-[#885133]" size={16} />
              </div>
              <p className="text-xl md:text-2xl font-medium text-[#f4f0ec] leading-tight tracking-tight italic">"{insights}"</p>
            </div>
            <Dashboard tasks={tasks} categories={user.categories} dailyGoal={user.dailyFocusGoal} />
          </div>
        )}

        {activeTab === 'history' && <History tasks={tasks} />}
        
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-10 md:space-y-12">
            <div className="glass-card p-8 md:p-12 rounded-[48px] border-l-2 border-l-[#f4f0ec]">
              <h3 className="text-sm font-black text-[#f4f0ec] mb-6 md:mb-8 tracking-[0.2em] uppercase italic">Professional Identity</h3>
              <p className="text-[10px] md:text-xs text-[#885133] font-black mb-6 uppercase tracking-widest leading-relaxed">
                Defining your role allows the AI to use appropriate terminology when professionalizing your tasks.
              </p>
              <input 
                type="text"
                value={user.persona}
                onChange={(e) => updateAccount({ persona: e.target.value })}
                placeholder="e.g. Lead Software Architect"
                className="w-full bg-black/40 border border-white/10 rounded-[20px] py-5 px-8 text-[#f4f0ec] font-black uppercase tracking-widest outline-none focus:border-[#f06ed7]/50"
              />
            </div>

            <div className="glass-card p-8 md:p-12 rounded-[48px] border-l-2 border-l-[#f06ed7]">
              <h3 className="text-sm font-black text-[#f4f0ec] mb-6 md:mb-8 tracking-[0.2em] uppercase italic">Mission Nexus (Projects)</h3>
              <p className="text-[10px] md:text-xs text-[#885133] font-black mb-10 uppercase tracking-widest leading-relaxed">
                Add the specific projects or work areas you want the AI to track.
              </p>
              
              <div className="space-y-4 mb-10">
                {user.categories.map(c => (
                  <div key={c} className="flex items-center justify-between p-5 bg-white/[0.02] border border-white/5 rounded-[24px] group">
                    <span className="text-xs font-black text-[#f4f0ec] uppercase tracking-widest">{c}</span>
                    <button 
                      onClick={() => updateAccount({ categories: user.categories.filter(x => x !== c) })}
                      className="p-2 text-[#885133] hover:text-[#d62300] transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              <div className="relative">
                <input 
                  type="text"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCat.trim()) {
                      updateAccount({ categories: [...user.categories, newCat.trim()] });
                      setNewCat('');
                    }
                  }}
                  placeholder="DEPLOY NEW PROJECT CONTEXT..."
                  className="w-full bg-black/20 border border-white/5 rounded-[20px] py-5 pl-8 pr-16 text-[10px] font-black text-[#f4f0ec] uppercase tracking-widest outline-none focus:border-[#f06ed7]/50"
                />
                <button 
                  onClick={() => {
                    if (newCat.trim()) {
                      updateAccount({ categories: [...user.categories, newCat.trim()] });
                      setNewCat('');
                    }
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-[#f06ed7]"
                >
                  <PlusCircle size={24} />
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
