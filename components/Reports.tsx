
import React, { useMemo } from 'react';
import { Task } from '../types';
import { FileText, Calendar, Clock, Award, ChevronRight, BarChart2 } from 'lucide-react';

interface ReportsProps {
  tasks: Task[];
}

interface DayReport {
  date: string;
  totalDuration: number;
  taskCount: number;
  avgImpact: number;
  topCategory: string;
  tasks: Task[];
}

const Reports: React.FC<ReportsProps> = ({ tasks }) => {
  // Group tasks by day
  const dailyReports = useMemo(() => {
    const groups: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      const dateKey = new Date(task.startTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(task);
    });

    return Object.entries(groups).map(([date, dayTasks]): DayReport => {
      const totalDuration = dayTasks.reduce((acc, t) => acc + t.duration, 0);
      const avgImpact = dayTasks.reduce((acc, t) => acc + t.aiImpact, 0) / dayTasks.length;
      
      const catCounts: Record<string, number> = {};
      dayTasks.forEach(t => {
        catCounts[t.category] = (catCounts[t.category] || 0) + 1;
      });
      const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        date,
        totalDuration,
        taskCount: dayTasks.length,
        avgImpact,
        topCategory,
        tasks: dayTasks
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [tasks]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    return `${m}m`;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Performance Reports</h2>
        <p className="text-slate-400 text-sm mt-1">Summarized daily insights and productivity metrics.</p>
      </header>

      {dailyReports.length === 0 ? (
        <div className="glass-card p-16 rounded-3xl border border-white/5 text-center">
          <div className="p-4 bg-white/5 rounded-2xl inline-block mb-4 text-slate-600">
            <FileText size={32} />
          </div>
          <p className="text-slate-500 text-sm font-medium">No reporting data available yet. Start tracking to see daily summaries.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {dailyReports.map((report) => (
            <div key={report.date} className="glass-card rounded-3xl border border-white/5 overflow-hidden group hover:border-violet-500/30 transition-all">
              <div className="p-6 md:p-8 bg-white/[0.02] border-b border-white/5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-violet-600 rounded-xl text-white shadow-lg shadow-violet-900/20">
                      <Calendar size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-white tracking-tight">{report.date}</h3>
                      <p className="text-slate-500 text-xs font-semibold uppercase tracking-wider">{report.taskCount} Sessions Recorded</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Total Effort</p>
                      <div className="flex items-center gap-2 text-white justify-end">
                        <Clock size={14} className="text-violet-400" />
                        <span className="font-bold tabular-nums">{formatDuration(report.totalDuration)}</span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-white/5"></div>
                    <div className="text-right">
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">AI Impact Score</p>
                      <div className="flex items-center gap-2 text-white justify-end">
                        <Award size={14} className="text-emerald-400" />
                        <span className="font-bold tabular-nums">{report.avgImpact.toFixed(1)}<span className="text-[10px] opacity-40 ml-0.5">/10</span></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Top Domain:</span>
                  <span className="px-3 py-1 bg-violet-500/10 text-violet-400 rounded-lg text-xs font-bold border border-violet-500/10">
                    {report.topCategory}
                  </span>
                </div>

                <div className="space-y-3">
                   <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                     <BarChart2 size={14} /> Key Focus Areas
                   </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                     {report.tasks.slice(0, 4).map(task => (
                       <div key={task.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                         <span className="text-xs font-medium text-slate-300 truncate pr-4">{task.description}</span>
                         <span className="text-[10px] font-bold text-slate-500 tabular-nums whitespace-nowrap">{Math.floor(task.duration / 60)}m</span>
                       </div>
                     ))}
                     {report.taskCount > 4 && (
                       <div className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-center">
                         <span className="text-[10px] font-bold text-slate-500 uppercase">+{report.taskCount - 4} more activities</span>
                       </div>
                     )}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reports;
