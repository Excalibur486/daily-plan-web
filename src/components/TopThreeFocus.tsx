import React, { useState } from 'react';
import { Target, CheckCircle2, Circle, Clock, Tag, Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { TaskItem, Category } from '../types';

interface TopThreeFocusProps {
  tasks: TaskItem[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Partial<TaskItem>) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<TaskItem>) => void;
}

const CATEGORY_MAP: Record<Category, { label: string; bg: string; text: string }> = {
  work: { label: '工作', bg: 'bg-[#EFF2EA] border-[#DED7C3]', text: 'text-[#5A6344]' },
  study: { label: '学习', bg: 'bg-[#F0EDE6] border-[#DED7C3]', text: 'text-[#6D6357]' },
  health: { label: '健康', bg: 'bg-[#EFF2EA] border-[#DED7C3]', text: 'text-[#444C33]' },
  life: { label: '生活', bg: 'bg-[#F9F7F2] border-[#DED7C3]', text: 'text-[#8C8273]' },
  hobby: { label: '兴趣', bg: 'bg-[#EFF2EA] border-[#DED7C3]', text: 'text-[#5A6344]' },
  other: { label: '其他', bg: 'bg-[#F0EDE6] border-[#DED7C3]', text: 'text-[#8C8273]' },
};

export const TopThreeFocus: React.FC<TopThreeFocusProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onUpdateTask,
}) => {
  const topTasks = tasks.filter((t) => t.isTopFocus).slice(0, 3);
  const completedCount = topTasks.filter((t) => t.completed).length;

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editMinutes, setEditMinutes] = useState(30);
  const [editCategory, setEditCategory] = useState<Category>('work');

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Category>('work');
  const [newMinutes, setNewMinutes] = useState(45);

  const startEdit = (task: TaskItem) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditMinutes(task.estimatedMinutes || 30);
    setEditCategory(task.category);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    onUpdateTask(id, {
      title: editTitle.trim(),
      estimatedMinutes: Number(editMinutes),
      category: editCategory,
    });
    setEditingId(null);
  };

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      priority: 'high',
      completed: false,
      estimatedMinutes: Number(newMinutes),
      isTopFocus: true,
      timeSlot: '09:00 - 10:00',
    });
    setNewTitle('');
    setIsAdding(false);
  };

  return (
    <section id="section-top-three" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D] flex items-center gap-2">
              今日核心三件事 (Top 3 必须完成)
              <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3]">
                已达成 {completedCount}/{topTasks.length}
              </span>
            </h2>
            <p className="text-xs text-[#8C8273]">艾维·利时间管理法：每日聚焦 3 个最高杠杆目标，绝不拖延</p>
          </div>
        </div>

        {topTasks.length < 3 && !isAdding && (
          <button
            id="btn-add-top-task"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1 text-xs font-medium px-3.5 py-2 rounded-xl bg-[#5A6344] hover:bg-[#495037] text-white transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> 设定核心目标
          </button>
        )}
      </div>

      {/* Adding Form */}
      {isAdding && (
        <form onSubmit={handleAddNew} className="mb-4 p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
          <div className="text-xs font-semibold text-[#3D3D3D] mb-2 font-serif">添加第 {topTasks.length + 1} 个核心聚焦目标</div>
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 mb-2.5">
            <input
              type="text"
              placeholder="明确、具体的任务内容（如：完成商业企划案初稿）"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-6 text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20 focus:border-[#5A6344]"
              autoFocus
            />
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as Category)}
              className="sm:col-span-3 text-xs px-2.5 py-2 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20"
            >
              <option value="work">💼 工作攻坚</option>
              <option value="study">📚 学习考证</option>
              <option value="health">🏃 身心健康</option>
              <option value="life">🌿 生活秩序</option>
              <option value="hobby">🎨 兴趣创作</option>
            </select>
            <div className="sm:col-span-3 flex items-center bg-white rounded-xl border border-[#DED7C3] px-2.5">
              <Clock className="w-3.5 h-3.5 text-[#8C8273] mr-1.5" />
              <input
                type="number"
                min="10"
                max="300"
                step="5"
                value={newMinutes}
                onChange={(e) => setNewMinutes(Number(e.target.value))}
                className="w-full text-xs py-2 text-[#3D3D3D] focus:outline-none"
              />
              <span className="text-[11px] text-[#8C8273]">分钟</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs px-3 py-1.5 rounded-xl text-[#8C8273] hover:bg-[#EBE7DF] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="text-xs px-4 py-1.5 rounded-xl bg-[#5A6344] text-white font-medium hover:bg-[#495037] transition-colors shadow-xs"
            >
              确认添加
            </button>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-2.5">
        {topTasks.map((task, index) => {
          const catInfo = CATEGORY_MAP[task.category] || CATEGORY_MAP.other;
          const isEditing = editingId === task.id;

          if (isEditing) {
            return (
              <div key={task.id} className="p-3.5 bg-[#F9F7F2] border border-[#DED7C3] rounded-2xl">
                <div className="flex flex-col sm:flex-row gap-2 items-center">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D]"
                  />
                  <div className="flex items-center gap-2 shrink-0">
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as Category)}
                      className="text-xs px-2 py-1.5 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D]"
                    >
                      <option value="work">工作</option>
                      <option value="study">学习</option>
                      <option value="health">健康</option>
                      <option value="life">生活</option>
                      <option value="hobby">兴趣</option>
                    </select>
                    <input
                      type="number"
                      value={editMinutes}
                      onChange={(e) => setEditMinutes(Number(e.target.value))}
                      className="w-16 text-xs px-2 py-1.5 bg-white rounded-xl border border-[#DED7C3] text-[#3D3D3D]"
                      min="5"
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="p-1.5 bg-[#5A6344] text-white rounded-lg hover:bg-[#495037]"
                      title="保存"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-1.5 bg-[#EBE7DF] text-[#3D3D3D] rounded-lg hover:bg-[#DED7C3]"
                      title="取消"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={task.id}
              className={`group flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl border transition-all ${
                task.completed
                  ? 'bg-[#F9F7F2] border-[#EBE7DF] opacity-75'
                  : 'bg-white hover:bg-[#F9F7F2]/60 border-[#EBE7DF] hover:border-[#DED7C3] shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {/* Ranking Tag */}
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif font-bold shrink-0 ${
                    task.completed
                      ? 'bg-[#DED7C3] text-[#8C8273]'
                      : index === 0
                      ? 'bg-[#5A6344] text-white'
                      : index === 1
                      ? 'bg-[#727D56] text-white'
                      : 'bg-[#8C8273] text-white'
                  }`}
                >
                  #{index + 1}
                </div>

                {/* Checkbox */}
                <button
                  id={`btn-toggle-top-${task.id}`}
                  onClick={() => onToggleTask(task.id)}
                  className="text-[#8C8273] hover:text-[#5A6344] transition-colors shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-[#5A6344] fill-[#EFF2EA]" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#DED7C3] hover:text-[#5A6344]" />
                  )}
                </button>

                {/* Title & Category */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm font-medium transition-all ${
                        task.completed ? 'line-through text-[#8C8273]' : 'text-[#3D3D3D]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-md border font-medium ${catInfo.bg} ${catInfo.text}`}>
                      {catInfo.label}
                    </span>
                  </div>
                  {task.notes && (
                    <p className="text-xs text-[#8C8273] mt-0.5 truncate">{task.notes}</p>
                  )}
                </div>
              </div>

              {/* Right: Estimated time & Actions */}
              <div className="flex items-center gap-2 shrink-0">
                {task.estimatedMinutes && (
                  <span className="flex items-center gap-1 text-xs text-[#8C8273] bg-[#F0EDE6] border border-[#DED7C3] px-2.5 py-1 rounded-lg">
                    <Clock className="w-3 h-3 text-[#8C8273]" />
                    {task.estimatedMinutes}m
                  </span>
                )}
                <button
                  onClick={() => startEdit(task)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8273] hover:text-[#3D3D3D] rounded transition-opacity"
                  title="编辑"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#8C8273] hover:text-[#9B4A4A] rounded transition-opacity"
                  title="删除"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}

        {topTasks.length === 0 && (
          <div className="text-center py-6 border-2 border-dashed border-[#DED7C3] rounded-2xl bg-[#F9F7F2]/50">
            <p className="text-xs text-[#8C8273]">今日暂未设立核心三件事</p>
            <button
              onClick={() => setIsAdding(true)}
              className="mt-2 text-xs text-[#5A6344] font-medium hover:underline"
            >
              + 立即设定今日最重要的 3 个目标
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
