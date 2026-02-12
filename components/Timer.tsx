
import React, { useState, useEffect, useRef } from 'react';
import { Square, Loader2 } from 'lucide-react';
import { Task } from '../types';
import { classifyTask } from '../services/geminiService';

interface TimerProps {
  onTaskComplete: (task: Task) => void;
  userCategories: string[];
  persona: string;
}

const Timer: React.FC<TimerProps> = ({ onTaskComplete, userCategories, persona }) => {
  const [isActive, setIsActive] = useState(false);
  const [description, setDescription] = useState('');
  const [elapsed, setElapsed] = useState(0);
  const [isClassifying, setIsClassifying] = useState(false);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive]);

  const handleStop = async () => {
    setIsClassifying(true);
    setIsActive(false);
    const classification = await classifyTask(description, userCategories, persona);
    onTaskComplete({
      id: Date.now().toString(),
      description,
      startTime: Date.now() - (elapsed * 1000),
      endTime: Date.now(),
      duration: elapsed,
      category: classification.category,
      aiImpact: classification.impact
    });
    setDescription('');
    setElapsed(0);
    setIsClassifying(false);
  };

  const formatTime = (s: number) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`glass-card p-12 md:p-20 rounded-[64px] border transition-all duration-700 relative overflow-hidden ${isActive ? 'border-[#f06ed7]/30' : 'border-white/5'}`}>
      {isActive && <div className="absolute inset-0 bg-gradient-to-r from-[#d62300]/5 to-[#f06ed7]/5 animate-pulse" />}
      
      <div className="relative z-10 flex flex-col items-center gap-12 text-center">
        <div className="w-full">
          <input
            type="text" placeholder="Designate Objective..."
            value={description} onChange={(e) => setDescription(e.target.value)}
            disabled={isActive || isClassifying}
            className="w-full text-4xl md:text-6xl font-black bg-transparent text-center border-none outline-none text-[#f4f0ec] placeholder:text-[#885133]/30 tracking-tighter"
          />
        </div>

        <div className="text-8xl md:text-[11rem] font-black text-[#f4f0ec] tabular-nums tracking-tighter leading-none">
          {formatTime(elapsed)}
        </div>

        <div className="flex gap-6 w-full max-w-sm">
          {!isActive ? (
            <button
              onClick={() => description.trim() && setIsActive(true)}
              disabled={!description.trim() || isClassifying}
              className="w-full py-6 rounded-[24px] bg-[#f4f0ec] text-[#0a0807] font-black text-lg hover:bg-[#f06ed7] hover:text-[#f4f0ec] transition-all shadow-2xl disabled:opacity-20 uppercase tracking-widest"
            >
              Start Flow
            </button>
          ) : (
            <button
              onClick={handleStop}
              className="w-full py-6 rounded-[24px] bg-[#d62300] text-[#f4f0ec] font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl uppercase tracking-widest flex items-center justify-center gap-3"
            >
              {isClassifying ? <Loader2 className="animate-spin" /> : <Square fill="currentColor" size={24} />}
              {isClassifying ? 'Analyzing' : 'End Session'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Timer;
