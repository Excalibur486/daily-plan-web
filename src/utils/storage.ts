import confetti from 'canvas-confetti';
import { TaskItem, HabitItem, DailyReflection, FocusSession, DailyGoalTemplate } from '../types';

export const STORAGE_KEYS = {
  TASKS: 'daily_discipline_tasks_v1',
  HABITS: 'daily_discipline_habits_v1',
  REFLECTIONS: 'daily_discipline_reflections_v1',
  SESSIONS: 'daily_discipline_sessions_v1',
  CUSTOM_QUOTE: 'daily_discipline_custom_quote',
  STREAK_INFO: 'daily_discipline_streak_info',
};

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDateDisplay(dateStr: string): { full: string; weekday: string; dateNum: string } {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  return {
    full: `${y}年${m}月${d}日`,
    weekday: weekdays[date.getDay()],
    dateNum: `${m}月${d}日`,
  };
}

export const MOTIVATIONAL_QUOTES = [
  { text: '自律不是为了感动别人，而是为了在未来的每一个日子里拥有更多选择的自由。', author: '自我激励' },
  { text: '行动是治愈焦虑的唯一良药，种一棵树最好的时间是十年前，其次是现在。', author: '箴言' },
  { text: '所谓优秀，不过是把平凡微小的习惯日复一日坚持做到了极致。', author: '自律手册' },
  { text: '每一滴专注流下的汗水，都会成为浇灌未来梦想的甘霖。', author: '晨间寄语' },
  { text: '日拱一卒无有尽，功不唐捐终入海。', author: '胡适' },
  { text: '不要假装努力，结果不会陪你演戏；踏实走好当下的每一步。', author: '每日提醒' },
  { text: '掌控自己的清晨，就能掌控自己的一天，进而掌控整个人生。', author: '微习惯' },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 't-1',
    title: '完成今日最核心的核心目标（深度工作/重点攻坚）',
    category: 'work',
    priority: 'high',
    completed: false,
    estimatedMinutes: 90,
    timeSlot: '09:00 - 10:30',
    notes: '关闭外部通讯通知，进入心流状态完成主要交付物',
    isTopFocus: true,
  },
  {
    id: 't-2',
    title: '精读专业书籍或英语/技能学习 45 分钟',
    category: 'study',
    priority: 'high',
    completed: false,
    estimatedMinutes: 45,
    timeSlot: '14:30 - 15:15',
    notes: '做好重点笔记，输出知识卡片或行动要点',
    isTopFocus: true,
  },
  {
    id: 't-3',
    title: '有氧或力量训练 30 分钟（散步/慢跑/拉伸）',
    category: 'health',
    priority: 'medium',
    completed: false,
    estimatedMinutes: 30,
    timeSlot: '18:30 - 19:00',
    notes: '出出汗，释放多巴胺，唤醒身体活力',
    isTopFocus: true,
  },
  {
    id: 't-4',
    title: '晨间日程规划与收件箱/待办清单整理',
    category: 'work',
    priority: 'medium',
    completed: true,
    completedAt: '08:30',
    estimatedMinutes: 20,
    timeSlot: '08:30 - 08:50',
    notes: '明确今日重要紧急优先级排序',
    isTopFocus: false,
  },
  {
    id: 't-5',
    title: '睡前远离手机蓝光，进行今日复盘与明日规划',
    category: 'life',
    priority: 'low',
    completed: false,
    estimatedMinutes: 15,
    timeSlot: '22:30 - 22:45',
    notes: '记录今日小确幸与改进项，安心入眠',
    isTopFocus: false,
  },
];

export const INITIAL_HABITS: HabitItem[] = [
  {
    id: 'h-1',
    name: '晨起空腹温开水 500ml',
    icon: 'Droplets',
    targetDaysPerWeek: 7,
    completedDates: [getTodayDateStr()],
    streak: 5,
    category: 'health',
    reminderTime: '07:30',
  },
  {
    id: 'h-2',
    name: '每日深度专注 2 个番茄钟 (50min)',
    icon: 'Flame',
    targetDaysPerWeek: 7,
    completedDates: [],
    streak: 4,
    category: 'work',
    reminderTime: '09:30',
  },
  {
    id: 'h-3',
    name: '阅读/听书学习 30 分钟',
    icon: 'BookOpen',
    targetDaysPerWeek: 6,
    completedDates: [],
    streak: 3,
    category: 'study',
    reminderTime: '20:30',
  },
  {
    id: 'h-4',
    name: '每日运动暴汗 30 分钟',
    icon: 'Activity',
    targetDaysPerWeek: 5,
    completedDates: [],
    streak: 2,
    category: 'health',
    reminderTime: '18:00',
  },
  {
    id: 'h-5',
    name: '23:00 前放下手机准时就寝',
    icon: 'Moon',
    targetDaysPerWeek: 7,
    completedDates: [],
    streak: 6,
    category: 'life',
    reminderTime: '22:45',
  },
];

export const PRESET_TEMPLATES: DailyGoalTemplate[] = [
  {
    id: 'tpl-efficient',
    name: '🚀 职场高效进阶模版',
    description: '专注于高价值交付、番茄钟深度工作与健康平衡',
    tasks: [
      { title: '攻克今日最重要的关键交付物 (OKR核心)', category: 'work', priority: 'high', estimatedMinutes: 90, timeSlot: '09:30 - 11:00', isTopFocus: true, notes: '高价值聚焦' },
      { title: '跨部门/团队关键事项对齐与沟通处理', category: 'work', priority: 'medium', estimatedMinutes: 40, timeSlot: '11:00 - 11:40', isTopFocus: true, notes: '高效同步' },
      { title: '行业前沿/专业领域知识精读', category: 'study', priority: 'medium', estimatedMinutes: 45, timeSlot: '16:00 - 16:45', isTopFocus: true, notes: '持续进化' },
    ],
    habits: [
      { name: '站立工作/久坐拉伸', icon: 'Activity', targetDaysPerWeek: 7, category: 'health', reminderTime: '15:00' },
      { name: '记录今日工作日志与灵感', icon: 'BookOpen', targetDaysPerWeek: 5, category: 'work', reminderTime: '18:00' },
      { name: '每日饮水达标 2000ml', icon: 'Droplets', targetDaysPerWeek: 7, category: 'health', reminderTime: '14:00' },
    ],
  },
  {
    id: 'tpl-study',
    name: '📚 沉浸考研/技能学习模版',
    description: '适用于备考、背单词、刷题复习与专注训练',
    tasks: [
      { title: '高强度核心科目真题演练与深度精讲', category: 'study', priority: 'high', estimatedMinutes: 120, timeSlot: '08:30 - 10:30', isTopFocus: true, notes: '闭卷限时' },
      { title: '重难点知识错题集归纳与二次回顾', category: 'study', priority: 'high', estimatedMinutes: 60, timeSlot: '14:00 - 15:00', isTopFocus: true, notes: '查漏补缺' },
      { title: '外语核心词汇记忆与听力精听 100 词', category: 'study', priority: 'medium', estimatedMinutes: 40, timeSlot: '19:30 - 20:10', isTopFocus: true, notes: '滚动复习' },
    ],
    habits: [
      { name: '早起晨读打卡 30min', icon: 'BookOpen', targetDaysPerWeek: 7, category: 'study', reminderTime: '07:00' },
      { name: '背诵打卡 50 单词', icon: 'Flame', targetDaysPerWeek: 7, category: 'study', reminderTime: '12:30' },
      { name: '晚间复盘今日错题与吸收率', icon: 'Moon', targetDaysPerWeek: 7, category: 'study', reminderTime: '22:00' },
    ],
  },
  {
    id: 'tpl-health',
    name: '🌿 身心自律与活力生活模版',
    description: '规律作息、坚持运动、健康饮食与情绪管理',
    tasks: [
      { title: '全身核心肌肉训练或 5km 燃脂慢跑', category: 'health', priority: 'high', estimatedMinutes: 45, timeSlot: '07:00 - 07:45', isTopFocus: true, notes: '规律心率' },
      { title: '亲手制作一份少油高蛋白健康营养餐', category: 'health', priority: 'medium', estimatedMinutes: 40, timeSlot: '12:00 - 12:40', isTopFocus: true, notes: '均衡营养' },
      { title: '冥想正念深呼吸 15 分钟', category: 'life', priority: 'low', estimatedMinutes: 15, timeSlot: '21:30 - 21:45', isTopFocus: true, notes: '放松大脑神经' },
    ],
    habits: [
      { name: '早起不赖床 (7:00 前)', icon: 'Flame', targetDaysPerWeek: 7, category: 'life', reminderTime: '07:00' },
      { name: '拒绝含糖饮料与高热量宵夜', icon: 'Droplets', targetDaysPerWeek: 7, category: 'health' },
      { name: '户外散步感受阳光与微风', icon: 'Activity', targetDaysPerWeek: 6, category: 'health', reminderTime: '17:30' },
    ],
  },
];

export function triggerConfettiEffect() {
  confetti({
    particleCount: 45,
    spread: 55,
    origin: { y: 0.75 },
    colors: ['#5A6344', '#8C8273', '#DED7C3', '#C2A676', '#727D56', '#A39B8F'],
  });
}

export function triggerGrandCelebration() {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999, colors: ['#5A6344', '#8C8273', '#DED7C3', '#C2A676', '#727D56', '#A39B8F'] };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 40 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}

// LocalStorage helpers
export function loadSavedTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) return INITIAL_TASKS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_TASKS;
  }
}

export function saveTasks(tasks: TaskItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.error('Save tasks failed', e);
  }
}

export function loadSavedHabits(): HabitItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HABITS);
    if (!raw) return INITIAL_HABITS;
    return JSON.parse(raw);
  } catch {
    return INITIAL_HABITS;
  }
}

export function saveHabits(habits: HabitItem[]) {
  try {
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  } catch (e) {
    console.error('Save habits failed', e);
  }
}

export function loadSavedReflections(): Record<string, DailyReflection> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveReflection(reflection: DailyReflection) {
  try {
    const current = loadSavedReflections();
    current[reflection.date] = reflection;
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(current));
  } catch (e) {
    console.error('Save reflection failed', e);
  }
}

export function loadSavedSessions(): FocusSession[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSession(session: FocusSession) {
  try {
    const sessions = loadSavedSessions();
    sessions.unshift(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions.slice(0, 100)));
  } catch (e) {
    console.error('Save session failed', e);
  }
}
