import React, { useState, useRef } from 'react';
import { Heart, Share2, ArrowUpRight, MessageSquare } from 'lucide-react';
import { ArchiveItem } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';
import { handleImageFallback } from '../utils/imageFallback';

interface Card3DProps {
  item: ArchiveItem;
  onOpenArticle: (item: ArchiveItem) => void;
  onLike: (id: string, e: React.MouseEvent) => void;
  onShare: (item: ArchiveItem, e: React.MouseEvent) => void;
  accentColor?: string;
}

export const Card3D: React.FC<Card3DProps> = ({
  item,
  onOpenArticle,
  onLike,
  onShare,
  accentColor = '#EFAEC4',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);
  const { reducedMotion } = useAccessibility();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle 3D tilt calculation
    const rotX = ((y - centerY) / centerY) * -8;
    const rotY = ((x - centerX) / centerX) * 8;

    setRotateX(rotX);
    setRotateY(rotY);
    setGlarePosition({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    if (!reducedMotion) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'danca':
        return 'Dança';
      case 'musica':
        return 'Música';
      case 'cinema':
        return 'Cinema';
      case 'artes-plasticas':
        return 'Artes Plásticas';
      case 'eletronicos':
        return 'Eletrônicos';
      default:
        return cat;
    }
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenArticle(item)}
      className={`group relative cursor-pointer select-none rounded-3xl p-0.5 ${reducedMotion ? 'transition-none' : 'transition-transform duration-200 ease-out'} h-full flex flex-col`}
      style={{
        perspective: reducedMotion ? 'none' : 1000,
      }}
    >
      {/* 3D Transform Container styled as an Editorial Poster Card */}
      <div
        className={`relative overflow-hidden rounded-[24px] bg-white dark:bg-[#14211e] border-2 border-slate-200 dark:border-white/10 group-hover:border-[#153833] dark:group-hover:border-[#EFAEC4] shadow-sm hover:shadow-2xl ${reducedMotion ? 'transition-none' : 'transition-all duration-300'} flex flex-col h-full justify-between`}
        style={{
          transform: !reducedMotion && isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px) scale(1.02)`
            : 'none',
          transformStyle: reducedMotion ? 'flat' : 'preserve-3d',
          boxShadow: isHovered
            ? '0 24px 48px -12px rgba(21, 56, 51, 0.18), 0 0 24px -4px rgba(239, 174, 196, 0.35)'
            : '0 4px 14px -3px rgba(0, 0, 0, 0.05)',
        }}
      >
        {/* Holographic Glare Overlay */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 ${reducedMotion ? 'hidden' : 'transition-opacity duration-300'}`}
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, 0.8) 0%, rgba(239, 174, 196, 0.25) 35%, transparent 70%)`,
          }}
        />

        {/* Cover Image with Swiss Poster Framing */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 border-b border-slate-200 shrink-0">
          <img
            src={item.coverUrl}
            alt={item.title}
            referrerPolicy="no-referrer"
            onError={(e) => handleImageFallback(e, item.id, item.category)}
            className={`w-full h-full object-cover ${reducedMotion ? 'transition-none' : 'transition-transform duration-700 ease-out group-hover:scale-108 filter group-hover:contrast-105'}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

          {/* Editorial Top Coordinate Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span
              className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-[#0a1f1c] dark:!text-[#0a1f1c] shadow-md backdrop-blur-md border border-white/40"
              style={{ backgroundColor: accentColor }}
            >
              {getCategoryLabel(item.category)}
            </span>

            <div className="flex items-center gap-1.5">
              {item.hasCompletedRead && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-600 dark:bg-[#E07A9A] text-white dark:text-[#0c2521] shadow-xs">
                  ✓ Lido
                </span>
              )}
              {item.isFavorite && (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold bg-amber-500 text-white shadow-xs" title="Salvo no seu acervo">
                  ★ Salvo
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-950/90 text-white backdrop-blur-md border border-white/20 shadow-xs">
                [{item.decade} • {item.year}]
              </span>
            </div>
          </div>

          {/* Floating Media Format Pill in Lower Corner */}
          <div className="absolute bottom-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase bg-black/75 text-[#EFAEC4] backdrop-blur-md border border-white/20 shadow-xs truncate max-w-[200px] inline-block">
              {item.mediaFormat}
            </span>
          </div>
        </div>

        {/* Content Details - Standardized heights for 100% equal card sizing */}
        <div className="p-5 text-slate-900 dark:text-slate-100 flex flex-col flex-1 justify-between">
          <div className="flex flex-col">
            {/* Standardized Title Container: 2-line max height so 1-line and 2-line titles reserve identical space */}
            <div className="h-14 sm:h-16 flex items-start overflow-hidden">
              <h3
                className="text-2xl sm:text-[1.7rem] font-black tracking-tight text-[#153833] dark:!text-[#EFAEC4] group-hover:text-[#E07A9A] transition-colors leading-[1.08] uppercase line-clamp-2"
                style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
                title={item.title}
              >
                {item.title}
              </h3>
            </div>

            {/* Standardized Author/Role row */}
            <p className="text-xs font-mono font-bold text-slate-600 dark:text-slate-300 uppercase mt-1 truncate h-4 leading-4">
              {item.creator} — <span className="text-slate-400 dark:text-slate-400 font-normal">{item.role}</span>
            </p>

            {/* Standardized Curatorial Quote Box */}
            <div className="mt-3 h-14 flex items-center bg-slate-50 dark:bg-black/30 px-3 py-2 rounded-xl border border-slate-200/80 dark:border-white/10 overflow-hidden">
              <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed italic">
                "{item.curatorialNotes}"
              </p>
            </div>
          </div>

          {/* Highlights & Historical Context Snippet */}
          <div className="pt-2.5 mt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-[11px] h-8 shrink-0">
            <span className="truncate max-w-[170px] text-slate-500 dark:text-slate-400 font-mono text-[10px]">
              USO: <span className="text-slate-900 dark:text-white font-bold">{item.historicalUse.slice(0, 24)}...</span>
            </span>

            <div className="flex items-center gap-1 text-[#153833] dark:!text-[#EFAEC4] font-bold group-hover:text-[#E07A9A] group-hover:translate-x-1 transition-all shrink-0">
              <span className="font-mono text-[10px] uppercase">Dossiê</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Interactive Actions Footer (Likes, Comments, Shares) - Fixed to bottom */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 dark:border-white/10 text-xs mt-auto h-10 shrink-0">
            <div className="flex items-center gap-2.5">
              {/* Like button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onLike(item.id, e);
                }}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all cursor-pointer ${
                  item.isLiked
                    ? 'bg-[#EFAEC4] text-[#0c2521] border border-[#E07A9A]'
                    : 'bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-black/50 border border-slate-200 dark:border-white/10'
                }`}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    item.isLiked ? 'fill-[#0c2521] text-[#0c2521]' : 'text-slate-500 dark:text-slate-400'
                  }`}
                />
                <span>{item.likesCount}</span>
              </button>

              {/* Comments count */}
              <div className="flex items-center gap-1 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{item.comments?.length || 0}</span>
              </div>
            </div>

            {/* Share action */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onShare(item, e);
              }}
              className="p-1.5 rounded-full text-slate-500 hover:text-[#153833] dark:hover:text-[#EFAEC4] hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="Copiar link da obra"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
