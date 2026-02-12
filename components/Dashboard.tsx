
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Task } from '../types';
import { Clock, TrendingUp, Target, Activity } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  categories: string[];
  dailyGoal: number;
}

const PALETTE = ['#f06ed7', '#d62300', '#f4f0ec', '#885133'];

const Dashboard: React.FC<DashboardProps> = ({ tasks, categories, dailyGoal }) => {
  const categoryColors = useMemo(() => {
    const map: Record<string, string> = {};
    categories.forEach((cat, idx) => {
      map[cat] = PALETTE[idx % PALETTE.length];
    });
    return map;
  }, [categories]);

  const todayTasks = useMemo(() => {
    const today = new Date().toDateString();
    return tasks.filter(t => new Date(t.startTime).toDateString() === today);
  }, [tasks]);

  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    categories.forEach(cat => counts[cat] = 0);
    todayTasks.forEach(task => {
      counts[task.category] = (counts[task.category] || 0) + task.duration;
    });
    return Object.entries(counts)
      .filter(([_, val]) => val > 0)
      .map(([name, value]) => ({ name, value: Math.round(value / 60) }));
  }, [todayTasks, categories]);

  const stats = useMemo(() => {
    const totalSec = todayTasks.reduce((acc, t) => acc + t.duration, 0);
    const avgImpact = todayTasks.length > 0 ? todayTasks.reduce((acc, t) => acc + t.aiImpact, 0) / todayTasks.length : 0;
    return {
      totalHours: (totalSec / 3600).toFixed(1),
      impactScore: avgImpact.toFixed(1),
      goalProgress: Math.min(100, (totalSec / dailyGoal) * 100)
    };
  }, [todayTasks, dailyGoal]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="glass-card p-8 rounded-[40px] flex flex-col items-center justify-center border-t-2 border-t-[#f06ed7]">
        <div className="relative w-32 h-32 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="64" cy="64" r="56" stroke="rgba(244,240,236,0.03)" strokeWidth="6" fill="transparent" />
            <circle
              cx="64" cy="64" r="56" stroke="#f06ed7" strokeWidth="6" fill="transparent"
              strokeDasharray={351} strokeDashoffset={351 - (351 * stats.goalProgress) / 100}
              className="transition-all duration-1000" strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-[#f4f0ec]">{Math.round(stats.goalProgress)}%</span>
          </div>
        </div>
        <p className="text-[#885133] text-[9px] font-black uppercase tracking-[0.2em]">Goal Status</p>
      </div>

      <div className="glass-card p-8 rounded-[40px] border-l-2 border-l-[#d62300] flex flex-col justify-center">
        <Clock className="text-[#d62300] mb-3" size={18} />
        <p className="text-[#885133] text-[9px] font-black uppercase tracking-[0.2em] mb-1">Time Logged</p>
        <p className="text-3xl font-black text-[#f4f0ec] tracking-tighter">{stats.totalHours}H</p>
      </div>

      <div className="glass-card p-8 rounded-[40px] border-l-2 border-l-[#885133] flex flex-col justify-center">
        <Target className="text-[#885133] mb-3" size={18} />
        <p className="text-[#885133] text-[9px] font-black uppercase tracking-[0.2em] mb-1">Session Count</p>
        <p className="text-3xl font-black text-[#f4f0ec] tracking-tighter">{todayTasks.length}</p>
      </div>

      <div className="glass-card p-8 rounded-[40px] border-l-2 border-l-[#f06ed7] flex flex-col justify-center">
        <TrendingUp className="text-[#f06ed7] mb-3" size={18} />
        <p className="text-[#885133] text-[9px] font-black uppercase tracking-[0.2em] mb-1">Impact Rank</p>
        <p className="text-3xl font-black text-[#f4f0ec] tracking-tighter">{stats.impactScore}</p>
      </div>

      <div className="md:col-span-4 glass-card p-10 rounded-[48px] border border-white/5">
        <div className="flex items-center gap-3 mb-10">
          <Activity className="text-[#f06ed7]" size={18} />
          <h3 className="font-black text-[#f4f0ec] text-sm tracking-widest uppercase">Temporal Distribution</h3>
        </div>
        <div className="h-80">
          {categoryData.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <p className="text-[#885133] text-xs font-black uppercase tracking-widest italic opacity-40">Awaiting data for prismatic visualization...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0807', 
                    borderRadius: '16px', 
                    border: '1px solid rgba(244,240,236,0.1)', 
                    color: '#f4f0ec', 
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    fontSize: '10px',
                    letterSpacing: '0.1em'
                  }} 
                  itemStyle={{ color: '#f4f0ec' }}
                  formatter={(value: number) => [`${value} MIN`, 'DURATION']}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  formatter={(value) => <span className="text-[#885133] text-[10px] font-black uppercase tracking-widest ml-1">{value}</span>}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
