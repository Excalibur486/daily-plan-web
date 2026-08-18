export type Priority = 'high' | 'medium' | 'low';

export type Category = 'study' | 'work' | 'health' | 'life' | 'hobby' | 'other';

export interface TaskItem {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  completed: boolean;
  completedAt?: string;
  estimatedMinutes?: number;
  timeSlot?: string; // e.g. "09:00 - 10:30"
  notes?: string;
  isTopFocus?: boolean; // top 3 priority for today
}

export interface HabitItem {
  id: string;
  name: string;
  icon: string; // lucide icon identifier
  targetDaysPerWeek: number;
  completedDates: string[]; // ['2026-08-17', ...]
  streak: number;
  category: Category;
  reminderTime?: string;
}

export interface DailyReflection {
  date: string; // YYYY-MM-DD
  mood: 'great' | 'good' | 'neutral' | 'tired' | 'stressed';
  disciplineScore: number; // 1 - 5
  harvest: string; // 今日收获/成就
  improvement: string; // 改进空间
  gratitude: string; // 每日感恩/心得
  focusMinutesTotal: number;
}

export interface FocusSession {
  id: string;
  taskId?: string;
  taskTitle?: string;
  durationMinutes: number;
  completedAt: string;
  soundUsed?: string;
}

export interface DailyGoalTemplate {
  id: string;
  name: string;
  description: string;
  tasks: Omit<TaskItem, 'id' | 'completed' | 'completedAt'>[];
  habits: Omit<HabitItem, 'id' | 'completedDates' | 'streak'>[];
}
