import React from 'react';

interface SectionDividerProps {
  fromColor?: string;
  toColor?: string;
  variant?: 'curve' | 'wave' | 'tilt' | 'slant';
}

export const SectionDivider: React.FC<SectionDividerProps> = () => {
  return (
    <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 select-none pointer-events-none">
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-slate-200" />
        <div className="w-1.5 h-1.5 rounded-full bg-[#EFAEC4]" />
        <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-slate-200 to-transparent" />
      </div>
    </div>
  );
};
