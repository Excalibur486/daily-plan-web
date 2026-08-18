import React, { useState, useEffect } from 'react';
import { 
  Header 
} from './components/Header';
import { 
  TopThreeFocus 
} from './components/TopThreeFocus';
import { 
  HabitGrid 
} from './components/HabitGrid';
import { 
  TimeBlockPlanner 
} from './components/TimeBlockPlanner';
import { 
  FocusTimer 
} from './components/FocusTimer';
import { 
  DailyReflectionComp 
} from './components/DailyReflection';
import { 
  DisciplineStats 
} from './components/DisciplineStats';
import { 
  TemplateModal 
} from './components/TemplateModal';
import { 
  TaskItem, 
  HabitItem, 
  DailyReflection, 
  FocusSession, 
  DailyGoalTemplate 
} from './types';
import {
  loadSavedTasks,
  saveTasks,
  loadSavedHabits,
  saveHabits,
  loadSavedReflections,
  saveReflection,
  loadSavedSessions,
  saveSession,
  getTodayDateStr,
  triggerConfettiEffect,
  triggerGrandCelebration,
} from './utils/storage';
import { playSuccessChime } from './utils/audio';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Flame, 
  Timer, 
  LineChart 
} from 'lucide-react';

export default function App() {
  const todayStr = getTodayDateStr();

  // Primary State
  const [tasks, setTasks] = useState<TaskItem[]>(() => loadSavedTasks());
  const [habits, setHabits] = useState<HabitItem[]>(() => loadSavedHabits());
  const [reflections, setReflections] = useState<Record<string, DailyReflection>>(() =>
    loadSavedReflections()
  );
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadSavedSessions());

  // UI state
  const [activeTab, setActiveTab] = useState<'all' | 'planner' | 'habits' | 'timer' | 'stats'>('all');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);

  // Sync with localStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  // Overall Completion Calculations
  const completedTasks = tasks.filter((t) => t.completed);
  const totalTasks = tasks.length;

  const completedHabits = habits.filter((h) => h.completedDates.includes(todayStr));
  const totalHabits = habits.length;

  const totalItems = totalTasks + totalHabits;
  const totalCompleted = completedTasks.length + completedHabits.length;
  const completionRate = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  // Sound & Confetti trigger on completion
  const handleToggleTask = (id: string) => {
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const willBeCompleted = !t.completed;
          if (willBeCompleted) {
            if (soundEnabled) playSuccessChime();
            triggerConfettiEffect();
          }
          return {
            ...t,
            completed: willBeCompleted,
            completedAt: willBeCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : undefined,
          };
        }
        return t;
      });

      // Check if all are completed now
      const allDone = next.length > 0 && next.every((t) => t.completed);
      if (allDone) {
        triggerGrandCelebration();
      }

      return next;
    });
  };

  const handleAddTask = (newTask: Partial<TaskItem>) => {
    const task: TaskItem = {
      id: `t-${Date.now()}`,
      title: newTask.title || '新计划项',
      category: newTask.category || 'work',
      priority: newTask.priority || 'medium',
      completed: false,
      estimatedMinutes: newTask.estimatedMinutes || 30,
      timeSlot: newTask.timeSlot || '10:00 - 11:00',
      notes: newTask.notes,
      isTopFocus: newTask.isTopFocus || false,
    };
    setTasks((prev) => [task, ...prev]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const handleToggleHabit = (id: string) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id === id) {
          const hasDone = h.completedDates.includes(todayStr);
          let newDates: string[];
          let newStreak = h.streak;

          if (hasDone) {
            newDates = h.completedDates.filter((d) => d !== todayStr);
            newStreak = Math.max(0, newStreak - 1);
          } else {
            newDates = [...h.completedDates, todayStr];
            newStreak = newStreak + 1;
            if (soundEnabled) playSuccessChime();
            triggerConfettiEffect();
          }
          return { ...h, completedDates: newDates, streak: newStreak };
        }
        return h;
      })
    );
  };

  const handleAddHabit = (newHabit: Omit<HabitItem, 'id' | 'completedDates' | 'streak'>) => {
    const habit: HabitItem = {
      ...newHabit,
      id: `h-${Date.now()}`,
      completedDates: [],
      streak: 0,
    };
    setHabits((prev) => [...prev, habit]);
  };

  const handleDeleteHabit = (id: string) => {
    setHabits((prev) => prev.filter((h) => h.id !== id));
  };

  const handleSessionComplete = (session: FocusSession) => {
    saveSession(session);
    setSessions((prev) => [session, ...prev]);
    triggerConfettiEffect();
  };

  const handleSaveReflection = (reflection: DailyReflection) => {
    saveReflection(reflection);
    setReflections((prev) => ({ ...prev, [reflection.date]: reflection }));
  };

  const handleApplyTemplate = (tpl: DailyGoalTemplate) => {
    const generatedTasks: TaskItem[] = tpl.tasks.map((t, idx) => ({
      ...t,
      id: `tpl-t-${Date.now()}-${idx}`,
      completed: false,
    }));
    const generatedHabits: HabitItem[] = tpl.habits.map((h, idx) => ({
      ...h,
      id: `tpl-h-${Date.now()}-${idx}`,
      completedDates: [],
      streak: 0,
    }));

    setTasks(generatedTasks);
    setHabits((prev) => [...prev, ...generatedHabits]);
    triggerConfettiEffect();
  };

  const handleResetToday = () => {
    if (window.confirm('确定要重置今日所有任务打卡状态，开启全新的一天吗？')) {
      setTasks((prev) => prev.map((t) => ({ ...t, completed: false, completedAt: undefined })));
      setHabits((prev) =>
        prev.map((h) => ({
          ...h,
          completedDates: h.completedDates.filter((d) => d !== todayStr),
        }))
      );
    }
  };

  const todaySessions = sessions.filter((s) => s.completedAt.includes(':'));
  const totalFocusMinutesToday = todaySessions.reduce((acc, s) => acc + s.durationMinutes, 0);

  return (
    <div className="min-h-screen bg-[#F9F7F2] text-[#3D3D3D] flex flex-col font-sans selection:bg-[#5A6344] selection:text-white">
      {/* Top Header */}
      <Header
        completionRate={completionRate}
        completedTasksCount={completedTasks.length}
        totalTasksCount={totalTasks}
        completedHabitsCount={completedHabits.length}
        totalHabitsCount={totalHabits}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenTemplates={() => setIsTemplateModalOpen(true)}
        onResetToday={handleResetToday}
      />

      {/* Navigation Subheader / View Tabs */}
      <nav id="view-tabs" className="bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#DED7C3] sticky top-[73px] z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar">
            <button
              id="tab-all"
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'all'
                  ? 'bg-[#5A6344] text-white shadow-xs'
                  : 'text-[#8C8273] hover:text-[#3D3D3D] hover:bg-[#EBE7DF]'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              全景自律面板
            </button>

            <button
              id="tab-planner"
              onClick={() => setActiveTab('planner')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'planner'
                  ? 'bg-[#5A6344] text-white shadow-xs'
                  : 'text-[#8C8273] hover:text-[#3D3D3D] hover:bg-[#EBE7DF]'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              核心三件事与日程
            </button>

            <button
              id="tab-habits"
              onClick={() => setActiveTab('habits')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'habits'
                  ? 'bg-[#5A6344] text-white shadow-xs'
                  : 'text-[#8C8273] hover:text-[#3D3D3D] hover:bg-[#EBE7DF]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              自律习惯打卡 ({completedHabits.length}/{totalHabits})
            </button>

            <button
              id="tab-timer"
              onClick={() => setActiveTab('timer')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'timer'
                  ? 'bg-[#5A6344] text-white shadow-xs'
                  : 'text-[#8C8273] hover:text-[#3D3D3D] hover:bg-[#EBE7DF]'
              }`}
            >
              <Timer className="w-3.5 h-3.5" />
              专注时钟 & 白噪音
            </button>

            <button
              id="tab-stats"
              onClick={() => setActiveTab('stats')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === 'stats'
                  ? 'bg-[#5A6344] text-white shadow-xs'
                  : 'text-[#8C8273] hover:text-[#3D3D3D] hover:bg-[#EBE7DF]'
              }`}
            >
              <LineChart className="w-3.5 h-3.5" />
              打卡热力图与复盘
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {activeTab === 'all' && (
          <>
            {/* Top Row: Top 3 Most Important Tasks & Habit Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-6 space-y-6">
                <TopThreeFocus
                  tasks={tasks}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onDeleteTask={handleDeleteTask}
                  onUpdateTask={handleUpdateTask}
                />
              </div>
              <div className="lg:col-span-6 space-y-6">
                <HabitGrid
                  habits={habits}
                  onToggleHabit={handleToggleHabit}
                  onAddHabit={handleAddHabit}
                  onDeleteHabit={handleDeleteHabit}
                />
              </div>
            </div>

            {/* Time Block Timeline Planner */}
            <TimeBlockPlanner
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />

            {/* Focus Timer with Web Audio */}
            <FocusTimer
              tasks={tasks}
              onSessionComplete={handleSessionComplete}
              soundEnabled={soundEnabled}
            />

            {/* Daily Evening Reflection */}
            <DailyReflectionComp
              initialReflection={reflections[todayStr]}
              onSaveReflection={handleSaveReflection}
              totalFocusMinutes={totalFocusMinutesToday}
            />

            {/* Analytics & Heatmap */}
            <DisciplineStats
              tasks={tasks}
              habits={habits}
              sessions={sessions}
              reflections={reflections}
            />
          </>
        )}

        {activeTab === 'planner' && (
          <div className="space-y-6">
            <TopThreeFocus
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
              onUpdateTask={handleUpdateTask}
            />
            <TimeBlockPlanner
              tasks={tasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        )}

        {activeTab === 'habits' && (
          <div className="space-y-6">
            <HabitGrid
              habits={habits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
              onDeleteHabit={handleDeleteHabit}
            />
            <DisciplineStats
              tasks={tasks}
              habits={habits}
              sessions={sessions}
              reflections={reflections}
            />
          </div>
        )}

        {activeTab === 'timer' && (
          <div className="space-y-6">
            <FocusTimer
              tasks={tasks}
              onSessionComplete={handleSessionComplete}
              soundEnabled={soundEnabled}
            />
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <DailyReflectionComp
              initialReflection={reflections[todayStr]}
              onSaveReflection={handleSaveReflection}
              totalFocusMinutes={totalFocusMinutesToday}
            />
            <DisciplineStats
              tasks={tasks}
              habits={habits}
              sessions={sessions}
              reflections={reflections}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#DED7C3] bg-[#F9F7F2] py-5 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-[#8C8273] flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>每日自律计划督促助手 • 积跬步以至千里</span>
          <span className="text-[#8C8273]/80">数据自动保存在本地浏览器中，安心使用</span>
        </div>
      </footer>

      {/* Template Modal */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onApplyTemplate={handleApplyTemplate}
      />
    </div>
  );
}
