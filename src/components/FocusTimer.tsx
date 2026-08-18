import React, { useState, useEffect, useRef } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Coffee,
  CloudRain,
  Waves,
  Headphones,
  Radio
} from 'lucide-react';
import { TaskItem, FocusSession } from '../types';
import { 
  playTimerFinishChime, 
  playSuccessChime, 
  startAmbientNoise, 
  stopAmbientNoise, 
  setAmbientVolume 
} from '../utils/audio';

interface FocusTimerProps {
  tasks: TaskItem[];
  onSessionComplete: (session: FocusSession) => void;
  soundEnabled: boolean;
}

const PRESET_DURATIONS = [
  { label: '标准番茄', minutes: 25 },
  { label: '深度沉浸', minutes: 45 },
  { label: '极速冲刺', minutes: 15 },
  { label: '短暂休息', minutes: 5 },
];

const AMBIENT_OPTIONS = [
  { id: 'none', label: '静音专注', icon: VolumeX },
  { id: 'rain', label: '细雨淅沥', icon: CloudRain },
  { id: 'waves', label: '潮汐海浪', icon: Waves },
  { id: 'brown', label: '深空褐噪', icon: Headphones },
  { id: 'whitenoise', label: '经典白噪', icon: Radio },
];

export const FocusTimer: React.FC<FocusTimerProps> = ({
  tasks,
  onSessionComplete,
  soundEnabled,
}) => {
  const [selectedDuration, setSelectedDuration] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [ambientSound, setAmbientSound] = useState<string>('none');
  const [ambientVol, setAmbientVol] = useState<number>(0.2);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selectedTask = tasks.find((t) => t.id === selectedTaskId);
  const totalSeconds = selectedDuration * 60;
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Handle countdown
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      handleComplete();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  // Ambient sound handling
  useEffect(() => {
    if (isActive && ambientSound !== 'none') {
      startAmbientNoise(ambientSound as 'rain' | 'waves' | 'brown' | 'whitenoise', ambientVol);
    } else {
      stopAmbientNoise();
    }
    return () => {
      stopAmbientNoise();
    };
  }, [isActive, ambientSound]);

  const handleVolumeChange = (v: number) => {
    setAmbientVol(v);
    setAmbientVolume(v);
  };

  const handleSelectPreset = (minutes: number) => {
    setIsActive(false);
    setSelectedDuration(minutes);
    setTimeLeft(minutes * 60);
    stopAmbientNoise();
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
    stopAmbientNoise();
  };

  const handleComplete = () => {
    setIsActive(false);
    stopAmbientNoise();
    if (soundEnabled) {
      playTimerFinishChime();
    }
    onSessionComplete({
      id: `session-${Date.now()}`,
      taskId: selectedTask?.id,
      taskTitle: selectedTask?.title || '专注心流时刻',
      durationMinutes: selectedDuration,
      completedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      soundUsed: ambientSound,
    });
    setTimeLeft(selectedDuration * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <section id="section-focus-timer" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <Timer className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D]">专注时钟 & 白噪音</h2>
            <p className="text-xs text-[#8C8273]">进入单任务深度心流状态，摆脱外界干扰</p>
          </div>
        </div>

        {/* Presets */}
        <div className="flex items-center gap-1.5 bg-[#F0EDE6] p-1 rounded-xl border border-[#DED7C3]">
          {PRESET_DURATIONS.map((preset) => (
            <button
              key={preset.minutes}
              onClick={() => handleSelectPreset(preset.minutes)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                selectedDuration === preset.minutes
                  ? 'bg-white text-[#5A6344] shadow-xs font-semibold'
                  : 'text-[#8C8273] hover:text-[#3D3D3D]'
              }`}
            >
              {preset.label} ({preset.minutes}m)
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Interactive Circular Countdown */}
        <div className="md:col-span-5 flex flex-col items-center justify-center py-2">
          <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-[#EBE7DF]"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                className="stroke-[#5A6344] transition-all duration-300 ease-linear"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - progressPercent / 100)}
                strokeLinecap="round"
                fill="none"
              />
            </svg>

            {/* Centered digits */}
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl sm:text-5xl font-serif font-bold tracking-tight text-[#3D3D3D]">
                {timeFormatted}
              </span>
              <span className="text-xs font-medium text-[#5A6344] mt-1 uppercase tracking-widest">
                {isActive ? '专注中 • FLOW' : '准备就绪'}
              </span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 mt-4">
            <button
              id="btn-timer-toggle"
              onClick={handleToggleTimer}
              className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-xs ${
                isActive
                  ? 'bg-[#8C8273] hover:bg-[#72695C] text-white'
                  : 'bg-[#5A6344] hover:bg-[#495037] text-white'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-4 h-4" /> 暂停
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" /> 开始专注
                </>
              )}
            </button>

            <button
              id="btn-timer-reset"
              onClick={handleReset}
              className="p-2.5 rounded-xl border border-[#DED7C3] text-[#8C8273] hover:bg-[#F0EDE6] transition-colors"
              title="重置"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              id="btn-timer-finish"
              onClick={handleComplete}
              className="p-2.5 rounded-xl bg-[#EFF2EA] border border-[#DED7C3] text-[#5A6344] hover:bg-[#E2E8DA] transition-colors"
              title="提前结算并记录"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right: Task binding & Ambient sound synthesizer */}
        <div className="md:col-span-7 space-y-4">
          {/* Link Task */}
          <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
            <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#5A6344]" />
              关联当前要攻克的任务目标
            </label>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-[#DED7C3] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20 text-[#3D3D3D]"
            >
              <option value="">🎯 自由专注 / 独立心流</option>
              {tasks
                .filter((t) => !t.completed)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.isTopFocus ? '🔥 [核心] ' : ''}
                    {t.title}
                  </option>
                ))}
            </select>
          </div>

          {/* Ambient Sound Synthesizer */}
          <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-serif font-semibold text-[#3D3D3D] flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-[#5A6344]" />
                沉浸式环境音效 (Web Audio 原生合成)
              </span>
              {ambientSound !== 'none' && (
                <div className="flex items-center gap-1.5 text-[11px] text-[#8C8273]">
                  <span>音量:</span>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={ambientVol}
                    onChange={(e) => handleVolumeChange(Number(e.target.value))}
                    className="w-16 accent-[#5A6344] h-1"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {AMBIENT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isCurrent = ambientSound === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setAmbientSound(opt.id)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                      isCurrent
                        ? 'bg-[#EFF2EA] text-[#5A6344] border-[#DED7C3] font-semibold'
                        : 'bg-white text-[#8C8273] border-[#EBE7DF] hover:bg-[#F0EDE6]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
