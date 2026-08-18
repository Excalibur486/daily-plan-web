import React from 'react';
import { X, Layers, Check, Sparkles, ArrowRight } from 'lucide-react';
import { PRESET_TEMPLATES } from '../utils/storage';
import { DailyGoalTemplate } from '../types';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate: (template: DailyGoalTemplate) => void;
}

export const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onApplyTemplate,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs">
      <div className="bg-[#F9F7F2] rounded-3xl border border-[#DED7C3] shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#DED7C3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#EFF2EA] text-[#5A6344] border border-[#DED7C3] flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-serif font-bold text-[#3D3D3D]">选择并加载每日自律高效模版</h3>
              <p className="text-xs text-[#8C8273]">一键导入经过验证的时间块与自律习惯方案</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#8C8273] hover:text-[#3D3D3D] rounded-xl hover:bg-[#EBE7DF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-3 overflow-y-auto flex-1">
          {PRESET_TEMPLATES.map((tpl) => (
            <div
              key={tpl.id}
              className="p-4 rounded-2xl bg-white border border-[#DED7C3] hover:border-[#5A6344] transition-all group shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                  <h4 className="text-sm font-serif font-semibold text-[#3D3D3D] group-hover:text-[#5A6344] transition-colors">
                    {tpl.name}
                  </h4>
                  <p className="text-xs text-[#8C8273] mt-0.5">{tpl.description}</p>
                </div>
                <button
                  onClick={() => {
                    onApplyTemplate(tpl);
                    onClose();
                  }}
                  className="inline-flex items-center justify-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl bg-[#5A6344] hover:bg-[#495037] text-white transition-colors shrink-0 shadow-xs"
                >
                  <span>应用此模版</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Tasks Preview */}
              <div className="mt-3 pt-3 border-t border-[#EBE7DF] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-serif font-semibold text-[#3D3D3D] text-[11px]">包含核心目标:</span>
                  <ul className="mt-1 space-y-1 text-[#8C8273]">
                    {tpl.tasks.map((t, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#5A6344]" />
                        <span className="truncate">{t.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-serif font-semibold text-[#3D3D3D] text-[11px]">配套自律习惯:</span>
                  <ul className="mt-1 space-y-1 text-[#8C8273]">
                    {tpl.habits.map((h, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#727D56]" />
                        <span className="truncate">{h.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-[#F0EDE6] border-t border-[#DED7C3] text-center text-xs text-[#8C8273]">
          应用模版将保留当前已有历史打卡，并注入推荐的精选计划与习惯列表。
        </div>
      </div>
    </div>
  );
};
