import React, { useState } from 'react';
import { 
  Flame, 
  Plus, 
  Check, 
  Droplets, 
  BookOpen, 
  Activity, 
  Moon, 
  Sun, 
  Coffee, 
  Heart, 
  Smile, 
  Zap, 
  Trash2,
  Trophy
} from 'lucide-react';
import { HabitItem, Category } from '../types';
import { getTodayDateStr } from '../utils/storage';

interface HabitGridProps {
  habits: HabitItem[];
  onToggleHabit: (id: string) => void;
  onAddHabit: (habit: Omit<HabitItem, 'id' | 'completedDates' | 'streak'>) => void;
  onDeleteHabit: (id: string) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Droplets: <Droplets className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Moon: <Moon className="w-4 h-4" />,
  Sun: <Sun className="w-4 h-4" />,
  Coffee: <Coffee className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Smile: <Smile className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
};

export const HabitGrid: React.FC<HabitGridProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
  onDeleteHabit,
}) => {
  const todayStr = getTodayDateStr();
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('Flame');
  const [newTargetDays, setNewTargetDays] = useState(7);
  const [newCategory, setNewCategory] = useState<Category>('health');

  const completedTodayCount = habits.filter((h) => h.completedDates.includes(todayStr)).length;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    onAddHabit({
      name: newName.trim(),
      icon: newIcon,
      targetDaysPerWeek: Number(newTargetDays),
      category: newCategory,
    });
    setNewName('');
    setIsAdding(false);
  };

  return (
    <section id="section-daily-habits" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D] flex items-center gap-2">
              每日自律习惯打卡
              <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3]">
                已打卡 {completedTodayCount}/{habits.length}
              </span>
            </h2>
            <p className="text-xs text-[#8C8273]">坚持微习惯，让优秀成为一种自驱的肌肉记忆</p>
          </div>
        </div>

        {!isAdding && (
          <button
            id="btn-add-habit"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-medium px-3.5 py-2 rounded-xl bg-white hover:bg-[#F0EDE6] text-[#5A6344] border border-[#DED7C3] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 自定义习惯
          </button>
        )}
      </div>

      {/* Add Habit Form */}
      {isAdding && (
        <form onSubmit={handleAddSubmit} className="mb-4 p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="text-xs font-semibold text-[#3D3D3D] mb-2 font-serif">添加新的每日自律习惯</div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2.5">
            <input
              type="text"
              placeholder="习惯名称（如：每日冥想10分钟、每日记账）"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="sm:col-span-6 text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20"
              autoFocus
            />
            <div className="sm:col-span-3 flex items-center gap-1 bg-white rounded-xl border border-[#DED7C3] px-2.5 py-1.5">
              <span className="text-xs text-[#8C8273]">图标:</span>
              <select
                value={newIcon}
                onChange={(e) => setNewIcon(e.target.value)}
                className="text-xs bg-transparent focus:outline-none w-full text-[#3D3D3D]"
              >
                <option value="Flame">🔥 动力</option>
                <option value="Droplets">💧 饮水</option>
                <option value="BookOpen">📖 学习</option>
                <option value="Activity">🏃 运动</option>
                <option value="Moon">🌙 早睡</option>
                <option value="Sun">☀️ 早起</option>
                <option value="Coffee">☕ 咖啡</option>
                <option value="Heart">❤️ 心态</option>
                <option value="Zap">⚡ 敏捷</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex items-center gap-1 bg-white rounded-xl border border-[#DED7C3] px-2.5 py-1.5">
              <span className="text-xs text-[#8C8273]">每周:</span>
              <select
                value={newTargetDays}
                onChange={(e) => setNewTargetDays(Number(e.target.value))}
                className="text-xs bg-transparent focus:outline-none w-full text-[#3D3D3D]"
              >
                <option value={7}>7天 (每天)</option>
                <option value={6}>6天</option>
                <option value={5}>5天 (工作日)</option>
                <option value={4}>4天</option>
                <option value={3}>3天</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs px-3 py-1.5 rounded-xl text-[#8C8273] hover:bg-[#EBE7DF]"
            >
              取消
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-1.5 rounded-xl bg-[#5A6344] text-white font-medium hover:bg-[#495037] shadow-xs"
            >
              确认添加
            </button>
          </div>
        </form>
      )}

      {/* Habit Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {habits.map((habit) => {
          const isDoneToday = habit.completedDates.includes(todayStr);

          return (
            <div
              key={habit.id}
              className={`group relative flex items-center justify-between p-3.5 rounded-2xl border transition-all ${
                isDoneToday
                  ? 'bg-[#EFF2EA] border-[#DED7C3] shadow-xs'
                  : 'bg-white hover:bg-[#F9F7F2]/60 border-[#EBE7DF] hover:border-[#DED7C3]'
              }`}
            >
              {/* Left Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                    isDoneToday
                      ? 'bg-[#5A6344] text-white shadow-xs'
                      : 'bg-[#F0EDE6] text-[#5A6344] border border-[#DED7C3]'
                  }`}
                >
                  {ICON_MAP[habit.icon] || <Flame className="w-4 h-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <h3
                    className={`text-xs sm:text-sm font-semibold truncate ${
                      isDoneToday ? 'text-[#444C33] font-bold' : 'text-[#3D3D3D]'
                    }`}
                  >
                    {habit.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#8C8273]">
                    <span className="flex items-center gap-0.5 text-[#5A6344] font-medium">
                      <Flame className="w-3 h-3 fill-[#5A6344] text-[#5A6344]" />
                      连击 {habit.streak + (isDoneToday ? 1 : 0)} 天
                    </span>
                    <span>•</span>
                    <span>目标 {habit.targetDaysPerWeek}天/周</span>
                  </div>
                </div>
              </div>

              {/* Right: Check-in button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  id={`btn-toggle-habit-${habit.id}`}
                  onClick={() => onToggleHabit(habit.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                    isDoneToday
                      ? 'bg-[#5A6344] text-white shadow-xs hover:bg-[#495037]'
                      : 'bg-[#F0EDE6] hover:bg-[#E5E0D5] text-[#5A6344] border border-[#DED7C3]'
                  }`}
                >
                  {isDoneToday ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> 已打卡
                    </>
                  ) : (
                    '点击打卡'
                  )}
                </button>

                <button
                  onClick={() => onDeleteHabit(habit.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8273] hover:text-[#9B4A4A] rounded transition-opacity"
                  title="删除习惯"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-6 border-2 border-dashed border-[#DED7C3] rounded-2xl bg-[#F9F7F2]/50">
          <p className="text-xs text-[#8C8273]">尚未添加自律习惯</p>
          <button
            onClick={() => setIsAdding(true)}
            className="mt-2 text-xs text-[#5A6344] font-medium hover:underline"
          >
            + 立即添加第一个习惯
          </button>
        </div>
      )}
    </section>
  );
};
