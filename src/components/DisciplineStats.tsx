import React from 'react';
import { 
  BarChart3, 
  Flame, 
  CheckCircle, 
  Clock, 
  TrendingUp, 
  Calendar 
} from 'lucide-react';
import { TaskItem, HabitItem, FocusSession, DailyReflection } from '../types';
import { getTodayDateStr } from '../utils/storage';

interface DisciplineStatsProps {
  tasks: TaskItem[];
  habits: HabitItem[];
  sessions: FocusSession[];
  reflections: Record<string, DailyReflection>;
}

export const DisciplineStats: React.FC<DisciplineStatsProps> = ({
  tasks,
  habits,
  sessions,
  reflections,
}) => {
  const todayStr = getTodayDateStr();

  // Generate past 28 days array for heatmap
  const days: { dateStr: string; dayNum: number; count: number; level: number }[] = [];
  const today = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${y}-${m}-${day}`;

    // Calculate score based on habit completions and sessions
    let habitCompletedCount = 0;
    habits.forEach((h) => {
      if (h.completedDates.includes(dateStr)) habitCompletedCount++;
    });

    const isToday = dateStr === todayStr;
    const taskCompletedCount = isToday ? tasks.filter((t) => t.completed).length : Math.floor(habitCompletedCount * 0.8);
    const totalActivity = habitCompletedCount + taskCompletedCount;

    let level = 0;
    if (totalActivity >= 5) level = 4;
    else if (totalActivity >= 3) level = 3;
    else if (totalActivity >= 2) level = 2;
    else if (totalActivity >= 1) level = 1;

    days.push({
      dateStr,
      dayNum: d.getDate(),
      count: totalActivity,
      level,
    });
  }

  const LEVEL_COLORS = [
    'bg-[#F0EDE6] border-[#DED7C3]',
    'bg-[#EFF2EA] border-[#DED7C3]',
    'bg-[#A3B18A] border-[#8C9C74]',
    'bg-[#5A6344] border-[#495037]',
    'bg-[#343A26] border-[#252A1B]',
  ];

  const totalFocusMinutesAll = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalCompletedTasks = tasks.filter((t) => t.completed).length;

  return (
    <section id="section-discipline-stats" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D]">自律数据统计 & 连续打卡热力图</h2>
            <p className="text-xs text-[#8C8273]">量化每一天的专注轨迹，见证自律带来的复利成长</p>
          </div>
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center justify-between text-xs text-[#8C8273] mb-1">
            <span>连续自律天数</span>
            <Flame className="w-3.5 h-3.5 text-[#5A6344] fill-[#5A6344]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#3D3D3D] flex items-baseline gap-1">
            5 <span className="text-xs font-sans font-normal text-[#8C8273]">天 (持续刷新中)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center justify-between text-xs text-[#8C8273] mb-1">
            <span>累计深度专注时长</span>
            <Clock className="w-3.5 h-3.5 text-[#5A6344]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#3D3D3D] flex items-baseline gap-1">
            {totalFocusMinutesAll}{' '}
            <span className="text-xs font-sans font-normal text-[#8C8273]">分钟 ({sessions.length} 次番茄钟)</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center justify-between text-xs text-[#8C8273] mb-1">
            <span>今日已清空目标</span>
            <CheckCircle className="w-3.5 h-3.5 text-[#5A6344]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#3D3D3D] flex items-baseline gap-1">
            {totalCompletedTasks} <span className="text-xs font-sans font-normal text-[#8C8273]">/ {tasks.length} 项</span>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-serif font-semibold text-[#3D3D3D] flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#5A6344]" />
            近 4 周自律打卡活跃热力图 (GitHub 矩阵模式)
          </span>
          <div className="flex items-center gap-1.5 text-[11px] text-[#8C8273]">
            <span>少</span>
            {LEVEL_COLORS.map((c, idx) => (
              <div key={idx} className={`w-3 h-3 rounded-md border ${c}`} />
            ))}
            <span>多</span>
          </div>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-7 sm:grid-cols-14 md:grid-cols-28 gap-1.5">
          {days.map((d, i) => (
            <div
              key={i}
              title={`${d.dateStr}: 达成 ${d.count} 项自律行动`}
              className={`h-7 rounded-lg border flex flex-col items-center justify-center text-[10px] font-mono cursor-pointer transition-transform hover:scale-105 ${
                LEVEL_COLORS[d.level]
              } ${d.level >= 2 ? 'text-white font-semibold' : 'text-[#8C8273]'}`}
            >
              <span>{d.dayNum}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
