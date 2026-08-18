import React, { useState } from 'react';
import { 
  Award, 
  Smile, 
  Sparkles, 
  Star, 
  Save, 
  Check, 
  TrendingUp, 
  BookMarked 
} from 'lucide-react';
import { DailyReflection } from '../types';
import { getTodayDateStr } from '../utils/storage';

interface DailyReflectionProps {
  initialReflection?: DailyReflection;
  onSaveReflection: (reflection: DailyReflection) => void;
  totalFocusMinutes: number;
}

const MOODS = [
  { id: 'great', label: '🔥 突破充实', desc: '状态极佳，超额达成' },
  { id: 'good', label: '😊 稳定自律', desc: '按部就班，稳中有进' },
  { id: 'neutral', label: '😌 平和坦然', desc: '基本完成，心境平稳' },
  { id: 'tired', label: '😴 略显疲惫', desc: '精力透支，需要休整' },
  { id: 'stressed', label: '🌧️ 遇到阻力', desc: '存在拖延，需做调整' },
] as const;

export const DailyReflectionComp: React.FC<DailyReflectionProps> = ({
  initialReflection,
  onSaveReflection,
  totalFocusMinutes,
}) => {
  const todayStr = getTodayDateStr();

  const [mood, setMood] = useState<DailyReflection['mood']>(initialReflection?.mood || 'good');
  const [disciplineScore, setDisciplineScore] = useState<number>(initialReflection?.disciplineScore || 4);
  const [harvest, setHarvest] = useState<string>(initialReflection?.harvest || '');
  const [improvement, setImprovement] = useState<string>(initialReflection?.improvement || '');
  const [gratitude, setGratitude] = useState<string>(initialReflection?.gratitude || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection({
      date: todayStr,
      mood,
      disciplineScore,
      harvest,
      improvement,
      gratitude,
      focusMinutesTotal: totalFocusMinutes,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <section id="section-daily-reflection" className="bg-white rounded-3xl border border-[#DED7C3] p-5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
            <BookMarked className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-serif font-semibold text-[#3D3D3D] flex items-center gap-2">
              每日夜间复盘与自律打分
              <span className="text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3]">
                今日累计专注 {totalFocusMinutes} 分钟
              </span>
            </h2>
            <p className="text-xs text-[#8C8273]">不复盘无自律：记录今日小成就，持续迭代自我进化</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        {/* Mood Selector & Discipline Star Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Mood */}
          <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3]">
            <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-2 flex items-center gap-1.5">
              <Smile className="w-3.5 h-3.5 text-[#5A6344]" />
              今日心流与心情状态
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {MOODS.map((m) => {
                const isSelected = mood === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id)}
                    className={`p-2 rounded-xl text-xs text-left border transition-all ${
                      isSelected
                        ? 'bg-[#EFF2EA] border-[#DED7C3] text-[#5A6344] font-semibold shadow-xs'
                        : 'bg-white border-[#EBE7DF] text-[#8C8273] hover:bg-[#F0EDE6]'
                    }`}
                  >
                    <div className="font-medium text-xs text-[#3D3D3D]">{m.label}</div>
                    <div className="text-[10px] text-[#8C8273] truncate">{m.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Star Rating */}
          <div className="p-4 rounded-2xl bg-[#F9F7F2] border border-[#DED7C3] flex flex-col justify-between">
            <div>
              <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-[#C2A676] fill-[#C2A676]" />
                今日自律执行力自我评分 (1-5星)
              </label>
              <p className="text-[11px] text-[#8C8273] mb-3">诚实面对自己的付出与执行，不苛责也不放任</p>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setDisciplineScore(star)}
                  className="p-1 text-2xl transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`w-7 h-7 ${
                      star <= disciplineScore
                        ? 'text-[#C2A676] fill-[#C2A676] drop-shadow-xs'
                        : 'text-[#DED7C3]'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs font-semibold text-[#3D3D3D] ml-2">
                {disciplineScore === 5
                  ? '🌟 满分极度自律'
                  : disciplineScore === 4
                  ? '✨ 高效执行良好'
                  : disciplineScore === 3
                  ? '👍 基本及格完成'
                  : disciplineScore === 2
                  ? '⚠️ 仍有较多拖延'
                  : '🚨 需紧急调整状态'}
              </span>
            </div>
          </div>
        </div>

        {/* 3 Reflection Textareas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#5A6344]" />
              1. 今日核心收获 / 闪光时刻
            </label>
            <textarea
              rows={3}
              placeholder="今天达成了哪些关键进度？攻克了什么难关？"
              value={harvest}
              onChange={(e) => setHarvest(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-[#DED7C3] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20 bg-white text-[#3D3D3D]"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-[#5A6344]" />
              2. 明日待优化 / 阻碍防范
            </label>
            <textarea
              rows={3}
              placeholder="今天有什么浪费时间的陷阱？明天如何做得更好？"
              value={improvement}
              onChange={(e) => setImprovement(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-[#DED7C3] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20 bg-white text-[#3D3D3D]"
            />
          </div>

          <div>
            <label className="block text-xs font-serif font-semibold text-[#3D3D3D] mb-1 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#5A6344]" />
              3. 今日感恩 / 积极感悟
            </label>
            <textarea
              rows={3}
              placeholder="记录一件让自己心怀感激的人事物或正向微习惯"
              value={gratitude}
              onChange={(e) => setGratitude(e.target.value)}
              className="w-full text-xs p-3 rounded-2xl border border-[#DED7C3] focus:outline-none focus:ring-2 focus:ring-[#5A6344]/20 bg-white text-[#3D3D3D]"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {savedSuccess && (
            <span className="text-xs font-medium text-[#5A6344] flex items-center gap-1">
              <Check className="w-4 h-4" /> 今日复盘已妥善保存！
            </span>
          )}
          <button
            id="btn-save-reflection"
            type="submit"
            className="inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-[#5A6344] hover:bg-[#495037] text-white transition-colors shadow-xs"
          >
            <Save className="w-3.5 h-3.5" /> 保存今日复盘档案
          </button>
        </div>
      </form>
    </section>
  );
};
