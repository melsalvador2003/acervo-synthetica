import React from 'react';
import { Accessibility } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

export const AccessibilityFloatingButton: React.FC = () => {
  const { togglePanel, isOpenPanel } = useAccessibility();

  return (
    <div className="fixed bottom-5 left-5 z-40 flex items-center gap-2 group">
      <button
        type="button"
        onClick={togglePanel}
        aria-label="Abrir opções de acessibilidade (atalho Alt + A)"
        aria-expanded={isOpenPanel}
        aria-haspopup="dialog"
        title="Acessibilidade: Ajuste de fonte, contraste e audiodescrição (Alt + A)"
        className="w-12 h-12 rounded-full bg-[#153833] text-white shadow-xl shadow-[#153833]/25 border border-white/40 flex items-center justify-center hover:bg-[#1c4d46] hover:scale-105 active:scale-95 transition-all cursor-pointer focus-visible:ring-4 focus-visible:ring-amber-400 focus-visible:outline-none"
      >
        <Accessibility className="w-6 h-6 text-[#EFAEC4]" aria-hidden="true" />
      </button>

      {/* Floating helpful badge on hover or focus */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-slate-900/90 backdrop-blur-md text-white text-[11px] font-semibold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none shadow-lg border border-white/10">
        Acessibilidade <span className="text-amber-300 font-mono font-normal">Alt+A</span>
      </span>
    </div>
  );
};
