
import React from 'react';
import { Task } from '../types';
import { List, Calendar, ChevronRight } from 'lucide-react';

interface HistoryProps {
  tasks: Task[];
}

const History: React.FC<HistoryProps> = ({ tasks }) => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return s > 0 ? `${m}m ${s}s` : `${m}m`;
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="glass-card rounded-[48px] border border-white/5 overflow-hidden">
      <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-[#f06ed7]/10 rounded-2xl text-[#f06ed7]">
            <List size={20} />
          </div>
          <h3 className="font-black text-[#f4f0ec] text-lg uppercase tracking-tight">Timeline</h3>
        </div>
        <div className="flex items-center gap-2 text-[#885133] text-[10px] font-black uppercase tracking-[0.2em]">
          <Calendar size={14} />
          <span>Telemetric History</span>
        </div>
      </div>
      
      <div className="divide-y divide-white/5">
        {tasks.length === 0 ? (
          <div className="p-24 text-center">
            <p className="text-[#885133] text-xs font-black uppercase tracking-widest italic opacity-40">Awaiting focus telemetry...</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-8 hover:bg-white/[0.02] transition-all flex items-center justify-between group">
              <div className="flex items-center gap-6">
                <div className="w-1.5 h-10 bg-[#885133]/20 rounded-full group-hover:bg-[#f06ed7] transition-all duration-500"></div>
                <div>
                  <div className="flex items-center gap-4">
                    <h4 className="font-black text-[#f4f0ec] text-base group-hover:text-white transition-colors tracking-tight">
                      {task.description.toUpperCase()}
                    </h4>
                    <span className="px-3 py-1 bg-[#f06ed7]/10 text-[#f06ed7] rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#f06ed7]/20">
                      {task.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-[#885133] text-[10px] mt-2 font-black uppercase tracking-[0.2em]">
                    <span className="tabular-nums">{formatDate(task.startTime)}</span>
                    <span className="text-[#d62300]/70 italic">RANK: {task.aiImpact}/10</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-8">
                <span className="text-2xl font-black text-[#f4f0ec] tabular-nums tracking-tighter">
                  {formatDuration(task.duration)}
                </span>
                <ChevronRight className="text-[#885133] group-hover:text-[#f06ed7] transition-all" size={20} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default History;
