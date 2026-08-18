import React, { useState } from 'react';
import { 
  Sparkles, 
  Flame, 
  RefreshCw, 
  Calendar, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Layers,
  RotateCcw
} from 'lucide-react';
import { formatDateDisplay, MOTIVATIONAL_QUOTES, getTodayDateStr } from '../utils/storage';

interface HeaderProps {
  completionRate: number;
  completedTasksCount: number;
  totalTasksCount: number;
  completedHabitsCount: number;
  totalHabitsCount: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenTemplates: () => void;
  onResetToday: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completionRate,
  completedTasksCount,
  totalTasksCount,
  completedHabitsCount,
  totalHabitsCount,
  soundEnabled,
  onToggleSound,
  onOpenTemplates,
  onResetToday,
}) => {
  const todayStr = getTodayDateStr();
  const dateInfo = formatDateDisplay(todayStr);

  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentHour = new Date().getHours();
  const greeting = currentHour < 11 ? '早安，开始能量满满的一天' : currentHour < 14 ? '午安，保持专注高效' : currentHour < 19 ? '下午好，继续稳步前进' : '晚安，梳理今日收获';

  const nextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % MOTIVATIONAL_QUOTES.length);
  };

  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <header id="app-header" className="bg-[#F9F7F2]/95 backdrop-blur-md border-b border-[#DED7C3] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3.5">
          {/* Left: App Title, Greeting & Date */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#5A6344] flex items-center justify-center text-white shadow-xs shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-serif font-semibold text-[#3D3D3D] tracking-tight">每日自律督促助手</h1>
                <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3]">
                  <Flame className="w-3 h-3 text-[#5A6344] fill-[#5A6344]" /> 连续自律 5 天
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#8C8273] mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8C8273]" />
                  {dateInfo.full} {dateInfo.weekday}
                </span>
                <span>•</span>
                <span className="text-[#5A6344] font-medium">{greeting}</span>
              </div>
            </div>
          </div>

          {/* Right: Quick Stats & Toolbar Controls */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-between md:justify-end">
            {/* Overall Progress Widget */}
            <div className="flex items-center gap-3 bg-white border border-[#DED7C3] rounded-2xl px-3.5 py-1.5 text-xs shadow-xs">
              <div>
                <div className="text-[#8C8273] text-[11px] uppercase tracking-wider">今日督促进度</div>
                <div className="font-semibold text-[#3D3D3D] flex items-center gap-1.5 text-sm">
                  <span className="text-[#5A6344]">{completionRate}%</span>
                  <span className="text-xs font-normal text-[#8C8273]">
                    (计划 {completedTasksCount}/{totalTasksCount} • 习惯 {completedHabitsCount}/{totalHabitsCount})
                  </span>
                </div>
              </div>
              <div className="w-10 h-10 relative flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[#EBE7DF]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-[#5A6344] transition-all duration-500 ease-out"
                    strokeDasharray={`${completionRate}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-[#5A6344]">{completionRate}%</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-template-modal"
                onClick={onOpenTemplates}
                title="加载计划模版"
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0EDE6] text-[#5A6344] border border-[#DED7C3] transition-colors shadow-xs"
              >
                <Layers className="w-3.5 h-3.5 text-[#5A6344]" />
                <span className="hidden sm:inline">计划模版</span>
              </button>

              <button
                id="btn-reset-today"
                onClick={onResetToday}
                title="重置开启新的一天"
                className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-xl bg-white hover:bg-[#F0EDE6] text-[#5A6344] border border-[#DED7C3] transition-colors shadow-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#5A6344]" />
                <span className="hidden sm:inline">今日重置</span>
              </button>

              <button
                id="btn-toggle-sound"
                onClick={onToggleSound}
                title={soundEnabled ? '关闭音效' : '开启音效'}
                className={`p-1.5 rounded-xl border transition-colors ${
                  soundEnabled 
                    ? 'bg-[#EFF2EA] text-[#5A6344] border-[#DED7C3]' 
                    : 'bg-white text-[#8C8273] border-[#DED7C3]'
                }`}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Motivational Banner */}
        <div className="mt-2.5 pt-2 border-t border-[#EBE7DF] flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 min-w-0 text-[#3D3D3D]">
            <span className="inline-flex items-center gap-1 text-[#5A6344] font-medium bg-[#EFF2EA] px-2 py-0.5 rounded-lg text-[11px] shrink-0 border border-[#DED7C3]">
              <Sparkles className="w-3 h-3 text-[#5A6344]" /> 每日箴言
            </span>
            <p className="truncate italic font-serif text-[#3D3D3D]">“{quote.text}”</p>
            <span className="text-[#8C8273] shrink-0 hidden md:inline">— {quote.author}</span>
          </div>
          <button
            id="btn-next-quote"
            onClick={nextQuote}
            className="text-[#8C8273] hover:text-[#3D3D3D] p-1 rounded-lg hover:bg-[#F0EDE6] transition-colors shrink-0 flex items-center gap-1 text-[11px]"
            title="换一句箴言"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">换一句</span>
          </button>
        </div>
      </div>
    </header>
  );
};
