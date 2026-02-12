
import React, { useState } from 'react';
import { CheckCircle, Circle, Trash2, Sparkles, X, Loader2 } from 'lucide-react';
import { PlannedTask } from '../types';
import { professionalizeTask } from '../services/geminiService';

interface TaskPlannerProps {
  plannedTasks: PlannedTask[];
  onUpdate: (tasks: PlannedTask[]) => void;
  onClose: () => void;
  persona: string;
}

const TaskPlanner: React.FC<TaskPlannerProps> = ({ plannedTasks, onUpdate, onClose, persona }) => {
  const [input, setInput] = useState('');
  const [isRefining, setIsRefining] = useState<string | null>(null);

  const addTask = async () => {
    if (!input.trim()) return;
    const newTask: PlannedTask = {
      id: Date.now().toString(),
      text: input.trim(),
      completed: false,
      createdAt: Date.now()
    };
    onUpdate([...plannedTasks, newTask]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    onUpdate(plannedTasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    onUpdate(plannedTasks.filter(t => t.id !== id));
  };

  const refineTask = async (id: string, currentText: string) => {
    setIsRefining(id);
    const professionalText = await professionalizeTask(currentText, persona);
    onUpdate(plannedTasks.map(t => t.id === id ? { ...t, text: professionalText } : t));
    setIsRefining(null);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-[#0a0807]/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="w-full max-w-2xl glass-card rounded-[48px] border border-white/5 flex flex-col max-h-[85vh] overflow-hidden shadow-[0_0_100px_rgba(240,110,215,0.1)]">
        <div className="p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h2 className="text-2xl font-black text-[#f4f0ec] tracking-tighter uppercase italic">Mission Planner</h2>
            <p className="text-[#885133] text-[9px] font-black uppercase tracking-[0.3em] mt-1">Refining for: {persona.toUpperCase()}</p>
          </div>
          <button onClick={onClose} className="p-3 bg-white/5 rounded-2xl text-[#885133] hover:text-[#f4f0ec] hover:bg-white/10 transition-all"><X size={24} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-8">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Draft new objective..."
              className="w-full bg-black/40 border border-white/10 rounded-[24px] py-6 px-8 text-[#f4f0ec] font-black uppercase tracking-widest outline-none focus:border-[#f06ed7]/50 transition-all"
            />
            <button 
              onClick={addTask}
              className="absolute right-4 top-1/2 -translate-y-1/2 px-6 py-3 bg-[#f06ed7] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
            >
              Append
            </button>
          </div>

          <div className="space-y-4">
            {plannedTasks.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-[#885133] text-xs font-black uppercase tracking-[0.4em] italic opacity-30">Awaiting telemetric directives...</p>
              </div>
            ) : (
              plannedTasks.map((task) => (
                <div 
                  key={task.id} 
                  className={`flex items-center gap-6 p-6 rounded-[24px] border border-white/5 bg-white/[0.01] group transition-all ${task.completed ? 'opacity-40 grayscale' : 'hover:border-[#f06ed7]/20 hover:bg-white/[0.03]'}`}
                >
                  <button onClick={() => toggleTask(task.id)} className="text-[#f06ed7] shrink-0">
                    {task.completed ? <CheckCircle size={28} /> : <Circle size={28} className="text-[#885133]/50 group-hover:text-[#f06ed7]" />}
                  </button>
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-black uppercase tracking-widest transition-all ${task.completed ? 'line-through text-[#885133]' : 'text-[#f4f0ec]'}`}>
                      {task.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => refineTask(task.id, task.text)}
                      disabled={isRefining === task.id || task.completed}
                      className="p-3 bg-[#885133]/10 text-[#f4f0ec] hover:text-[#f06ed7] rounded-xl transition-all"
                      title="Professionalize Objective"
                    >
                      {isRefining === task.id ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                    </button>
                    <button 
                      onClick={() => removeTask(task.id)}
                      className="p-3 bg-[#d62300]/10 text-[#d62300] hover:bg-[#d62300] hover:text-white rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="p-10 border-t border-white/5 bg-black/20 flex items-center justify-between">
          <div className="text-[10px] font-black text-[#885133] uppercase tracking-widest">
            {plannedTasks.filter(t => t.completed).length}/{plannedTasks.length} Completed
          </div>
          <button 
            onClick={onClose}
            className="px-8 py-4 bg-[#f4f0ec] text-[#0a0807] rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-[#f06ed7] hover:text-white transition-all"
          >
            Deploy Focus
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskPlanner;
