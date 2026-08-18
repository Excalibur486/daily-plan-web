import React, { useState } from 'react';
import { 
  CalendarClock, 
  Plus, 
  Circle, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Filter,
  Sunrise,
  Sun,
  Sunset
} from 'lucide-react';
import { TaskItem, Category, Priority } from '../types';

interface TimeBlockPlannerProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
}

const CATEGORY_MAP: Record<Category, { label: string; color: string }> = {
  work: { label: '工作', color: 'bg-[#EFF2EA] text-[#5A6344] border-[#DED7C3]' },
  study: { label: '学习', color: 'bg-[#F0EDE6] text-[#6D6357] border-[#DED7C3]' },
  health: { label: '健康', color: 'bg-[#EFF2EA] text-[#444C33] border-[#DED7C3]' },
  life: { label: '生活', color: 'bg-[#F9F7F2] text-[#8C8273] border-[#DED7C3]' },
  hobby: { label: '兴趣', color: 'bg-[#EFF2EA] text-[#5A6344] border-[#DED7C3]' },
  other: { label: '其他', color: 'bg-[#F0EDE6] text-[#8C8273] border-[#DED7C3]' },
};

export const TimeBlockPlanner: React.FC<TimeBlockPlannerProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Category>('work');
  const [priority, setPriority] = useState<Priority>('medium');
  const [timeSlot, setTimeSlot] = useState('10:00 - 11:00');
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);
  const [notes, setNotes] = useState('');

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'pending' && task.completed) return false;
    if (activeFilter === 'completed' && !task.completed) return false;
    if (selectedCategory !== 'all' && task.category !== selectedCategory) return false;
    return true;
  });

  // Group tasks by period
  const morningTasks = filteredTasks.filter((t) => {
    const slot = t.timeSlot || '';
    const hour = parseInt(slot.split(':')[0] || '0', 10);
    return hour >= 5 && hour < 12;
  });

  const afternoonTasks = filteredTasks.filter((t) => {
    const slot = t.timeSlot || '';
    const hour = parseInt(slot.split(':')[0] || '0', 10);
    return hour >= 12 && hour < 18;
  });

  const eveningTasks = filteredTasks.filter((t) => {
    const slot = t.timeSlot || '';
    const hour = parseInt(slot.split(':')[0] || '0', 10);
    return hour >= 18 || hour < 5;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask({
      title: title.trim(),
      category,
      priority,
      timeSlot,
      estimatedMinutes: Number(estimatedMinutes),
      notes: notes.trim() || undefined,
      completed: false,
      isTopFocus: false,
    });
    setTitle('');
    setNotes('');
    setIsAdding(false);
  };

  const renderTaskList = (taskList: TaskItem[], emptyMsg: string) => {
    if (taskList.length === 0) {
      return <div className="text-xs text-[#8C8273] py-3 italic px-2">{emptyMsg}</div>;
    }
    return (
      <div className="space-y-2">
        {taskList.map((task) => {
          const cat = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;
          return (
            <div
              key={task.id}
              className={`group flex items-start justify-between gap-3 p-3 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-[#F0EDE6]/70 border-[#EBE7DF] opacity-75'
                  : 'bg-white hover:bg-[#F9F7F2]/60 border-[#EBE7DF] hover:border-[#DED7C3]'
              }`}
            >
              <div className="flex items-start gap-2.5 min-w-0 flex-1">
                <button
                  id={`btn-toggle-timeline-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-[#8C8273] hover:text-[#5A6344] shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-[#5A6344] fill-[#EFF2EA]" />
                  ) : (
                    <Circle className="w-4 h-4 text-[#DED7C3] hover:text-[#5A6344]" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        task.completed ? 'line-through text-[#8C8273]' : 'text-[#3D3D3D]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${cat.color}`}>
                      {cat.label}
                    </span>
                    {task.priority === 'high' && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#EFF2EA] text-[#8C4A4A] border border-[#DED7C3] font-medium">
                        重要
                      </span>
                    )}
                  </div>
                  {task.notes && (
                    <p className="text-xs text-[#8C8273] mt-1 leading-relaxed">{task.notes}</p>
                  )}
                </div>
              </div>

              {/* Time slot & Delete */}
              <div className="flex items-center gap-2 shrink-0">
                {task.timeSlot && (
                  <span className="text-[11px] font-mono text-[#8C8273] bg-[#F0EDE6] border border-[#DED7C3] px-2 py-0.5 rounded-lg">
                    {task.timeSlot}
                  </span>
                )}
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8273] hover:text-[#9B4A4A] rounded transition-opacity"
                  title="删除日程"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section id="section-timeline-planner" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D]">每日时间线日程</h2>
            <p className="text-xs text-[#8C8273]">按晨间、午间、晚间时间块科学分布计划，专注当下</p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filters */}
          <div className="flex items-center bg-[#F0EDE6] p-1 rounded-xl text-xs font-medium text-[#8C8273] border border-[#DED7C3]">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'all' ? 'bg-white text-[#3D3D3D] shadow-xs font-semibold' : 'hover:text-[#3D3D3D]'
              }`}
            >
              全部 ({tasks.length})
            </button>
            <button
              onClick={() => setActiveFilter('pending')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'pending' ? 'bg-white text-[#3D3D3D] shadow-xs font-semibold' : 'hover:text-[#3D3D3D]'
              }`}
            >
              待办
            </button>
            <button
              onClick={() => setActiveFilter('completed')}
              className={`px-3 py-1 rounded-lg transition-all ${
                activeFilter === 'completed' ? 'bg-white text-[#3D3D3D] shadow-xs font-semibold' : 'hover:text-[#3D3D3D]'
              }`}
            >
              已完成
            </button>
          </div>

          <button
            id="btn-add-schedule-item"
            onClick={() => setIsAdding(!isAdding)}
            className="inline-flex items-center gap-1 text-xs font-medium px-3.5 py-2 rounded-xl bg-[#5A6344] hover:bg-[#495037] text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 添加日程
          </button>
        </div>
      </div>

      {/* Add Task Modal/Panel */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="mb-5 p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="text-xs font-serif font-semibold text-[#3D3D3D] mb-3">排定新日程任务</div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-3">
            <div className="sm:col-span-6">
              <label className="block text-[11px] font-medium text-[#8C8273] mb-1">任务名称</label>
              <input
                type="text"
                placeholder="例如：整理项目需求评审文档"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20"
                autoFocus
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-[#8C8273] mb-1">时间段</label>
              <input
                type="text"
                placeholder="10:00 - 11:30"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-3">
              <label className="block text-[11px] font-medium text-[#8C8273] mb-1">类别分类</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full text-xs px-2.5 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none"
              >
                <option value="work">💼 工作任务</option>
                <option value="study">📚 学习提升</option>
                <option value="health">🏃 运动健康</option>
                <option value="life">🌿 日常生活</option>
                <option value="hobby">🎨 兴趣创作</option>
              </select>
            </div>
            <div className="sm:col-span-12">
              <label className="block text-[11px] font-medium text-[#8C8273] mb-1">备注说明 (可选)</label>
              <input
                type="text"
                placeholder="补充关键产出物、注意事项或分解行动"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none"
              />
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
              className="text-xs px-4 py-1.5 rounded-xl bg-[#5A6344] text-white font-medium hover:bg-[#495037]"
            >
              添加到时间线
            </button>
          </div>
        </form>
      )}

      {/* 3 Blocks: Morning, Afternoon, Evening */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning Block */}
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center gap-2 text-xs font-serif font-semibold text-[#3D3D3D] mb-3 pb-2 border-b border-[#DED7C3]">
            <Sunrise className="w-4 h-4 text-[#5A6344]" />
            <span>晨间时间块 (06:00 - 12:00)</span>
            <span className="ml-auto text-[11px] font-sans font-normal text-[#8C8273]">
              {morningTasks.filter((t) => t.completed).length}/{morningTasks.length}
            </span>
          </div>
          {renderTaskList(morningTasks, '晨间暂无特定排程')}
        </div>

        {/* Afternoon Block */}
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center gap-2 text-xs font-serif font-semibold text-[#3D3D3D] mb-3 pb-2 border-b border-[#DED7C3]">
            <Sun className="w-4 h-4 text-[#5A6344]" />
            <span>午间/下午 (12:00 - 18:00)</span>
            <span className="ml-auto text-[11px] font-sans font-normal text-[#8C8273]">
              {afternoonTasks.filter((t) => t.completed).length}/{afternoonTasks.length}
            </span>
          </div>
          {renderTaskList(afternoonTasks, '下午暂无特定排程')}
        </div>

        {/* Evening Block */}
        <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="flex items-center gap-2 text-xs font-serif font-semibold text-[#3D3D3D] mb-3 pb-2 border-b border-[#DED7C3]">
            <Sunset className="w-4 h-4 text-[#5A6344]" />
            <span>晚间/睡前 (18:00 - 24:00)</span>
            <span className="ml-auto text-[11px] font-sans font-normal text-[#8C8273]">
              {eveningTasks.filter((t) => t.completed).length}/{eveningTasks.length}
            </span>
          </div>
          {renderTaskList(eveningTasks, '晚间暂无特定排程')}
        </div>
      </div>
    </section>
  );
};
