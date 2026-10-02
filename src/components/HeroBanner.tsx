import React, { useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ArrowDown, Award, ArrowUpRight, Sparkles } from 'lucide-react';
import { IridescentOrb } from './IridescentOrb';
import { Category } from '../types';
import { useAccessibility } from '../context/AccessibilityContext';

interface HeroBannerProps {
  onExplore: () => void;
  onOpenWrapped: () => void;
  onSelectCategory?: (category: Category) => void;
}

// Interactive 3D Tilt Card Component for the Header Cards
interface HeaderCardProps {
  children: React.ReactNode;
  className?: string;
  badgeLabel: string;
  category: Category;
  targetSectionId: string;
  initialRotation?: number;
  onSelectCategory?: (category: Category) => void;
}

const HeaderCard: React.FC<HeaderCardProps> = ({
  children,
  className = '',
  badgeLabel,
  category,
  targetSectionId,
  initialRotation = 0,
  onSelectCategory,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });
  const { reducedMotion } = useAccessibility();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for 3D rotation
  const mouseXSpring = useSpring(x, { stiffness: 260, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 260, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-16, 16]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const posX = (e.clientX - rect.left) / rect.width - 0.5;
    const posY = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(posX);
    y.set(posY);
    setGlarePos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleClick = () => {
    if (onSelectCategory) {
      onSelectCategory(category);
    }
    const target = document.getElementById(targetSectionId);
    if (target) {
      target.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        rotateX: reducedMotion ? 0 : rotateX,
        rotateY: reducedMotion ? 0 : rotateY,
        transformStyle: reducedMotion ? 'flat' : 'preserve-3d',
      }}
      animate={
        reducedMotion
          ? { rotateZ: initialRotation, y: 0, scale: 1 }
          : {
              rotateZ: isHovered ? 0 : initialRotation,
              y: isHovered ? -12 : 0,
              scale: isHovered ? 1.05 : 1,
            }
      }
      transition={reducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 25 }}
      className={`relative cursor-pointer select-none group perspective-[1000px] ${className}`}
    >
      {/* Visual content container */}
      <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl transition-shadow duration-300 group-hover:shadow-[0_25px_60px_-15px_rgba(21,56,51,0.35)]">
        {children}

        {/* Dynamic Holographic Specular Glare on Hover */}
        <div
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-30"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.7) 0%, rgba(239,174,196,0.35) 30%, transparent 65%)`,
          }}
        />

        {/* Subtle Iridescent Border Ring */}
        <div className="absolute inset-0 rounded-3xl border border-white/60 pointer-events-none group-hover:border-[#E07A9A]/80 transition-colors duration-300 z-30" />

        {/* Interactive Floating Action Tooltip on Hover */}
        <motion.div
          animate={{
            opacity: isHovered ? 1 : 0,
            y: isHovered ? 0 : 8,
          }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-40 bg-slate-950/90 dark:bg-slate-950/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-xl border border-white/20 flex items-center gap-1.5 text-[11px] font-mono font-bold text-white tracking-wide whitespace-nowrap pointer-events-none"
        >
          <span className="text-white dark:!text-white font-bold">{badgeLabel}</span>
          <ArrowUpRight className="w-3 h-3 text-[#EFAEC4]" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onOpenWrapped,
  onSelectCategory,
}) => {
  const { reducedMotion } = useAccessibility();
  // Track mouse coordinates for dynamic bubble parallax
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // -0.5 to 0.5
    setMouseOffset({ x, y });
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[720px] lg:min-h-[880px] flex flex-col justify-between items-center px-4 sm:px-6 lg:px-8 overflow-x-clip sm:overflow-visible pt-20 sm:pt-28 lg:pt-32 pb-10 sm:pb-12 bg-white text-slate-950 border-b border-slate-200 z-20"
    >
      {/* Ambient Iridescent Lighting & Architectural 64px Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft pastel iridescent gradients on clean white canvas */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(239, 174, 196, 0.45) 0%, transparent 45%), radial-gradient(circle at 85% 30%, rgba(94, 234, 212, 0.35) 0%, transparent 50%), radial-gradient(circle at 50% 85%, rgba(224, 122, 154, 0.25) 0%, transparent 55%)',
          }}
        />

        {/* Architectural 1px grid lines (Swiss modernist exhibition poster layout) */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(to right, #94a3b8 1px, transparent 1px), linear-gradient(to bottom, #94a3b8 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* DYNAMIC INTERACTIVE IRIDESCENT BUBBLES (Scaled for mobile to prevent overflow) */}
      <div className="absolute inset-0 pointer-events-none overflow-x-clip sm:overflow-visible z-20">
        {/* Bubble 1: Top-Left Header Bubble (Reacts to cursor hover & elastic drag) */}
        <motion.div
          className="absolute -top-6 -left-8 sm:-top-6 sm:-left-4 opacity-75 sm:opacity-80 pointer-events-auto z-10 scale-50 sm:scale-80 lg:scale-100 origin-top-left"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: mouseOffset.x * -55,
                  y: mouseOffset.y * -45,
                }
          }
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 25, stiffness: 60 }}
        >
          <motion.div
            drag={!reducedMotion}
            dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
            dragElastic={0.45}
            dragSnapToOrigin
            whileHover={reducedMotion ? undefined : { scale: 1.15 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: [0, 45, -30, 25, -15, 0],
                    y: [0, -35, 25, -45, 20, 0],
                    rotate: [0, 15, -10, 18, -8, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 16,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          >
            <IridescentOrb size={320} variant="full-spectrum" />
          </motion.div>
        </motion.div>

        {/* Bubble 2: Top-Right Floating Bubble */}
        <motion.div
          className="absolute top-4 -right-10 sm:top-12 sm:-right-8 opacity-70 sm:opacity-75 pointer-events-auto z-10 scale-50 sm:scale-80 lg:scale-100 origin-top-right"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: mouseOffset.x * -65,
                  y: mouseOffset.y * -55,
                }
          }
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 22, stiffness: 50 }}
        >
          <motion.div
            drag={!reducedMotion}
            dragConstraints={{ left: -70, right: 70, top: -70, bottom: 70 }}
            dragElastic={0.45}
            dragSnapToOrigin
            whileHover={reducedMotion ? undefined : { scale: 1.15 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: [0, -50, 35, -20, 40, 0],
                    y: [0, 40, -30, 45, -25, 0],
                    rotate: [0, -18, 12, -15, 8, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 19,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          >
            <IridescentOrb size={340} variant="mint-pink" />
          </motion.div>
        </motion.div>

        {/* Bubble 3: Center-Right Floating Pearl Bubble */}
        <motion.div
          className="absolute top-1/2 -right-4 sm:right-12 opacity-65 sm:opacity-70 pointer-events-auto z-10 scale-60 sm:scale-85 lg:scale-100 origin-center hidden xs:block"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: mouseOffset.x * 45,
                  y: mouseOffset.y * 40,
                }
          }
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 20, stiffness: 55 }}
        >
          <motion.div
            drag={!reducedMotion}
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.45}
            dragSnapToOrigin
            whileHover={reducedMotion ? undefined : { scale: 1.2 }}
            whileTap={reducedMotion ? undefined : { scale: 0.92 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: [0, -30, 20, -25, 15, 0],
                    y: [0, 35, -40, 20, -30, 0],
                    rotate: [0, 25, -20, 15, -10, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 13,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          >
            <IridescentOrb size={170} variant="cyan-purple" />
          </motion.div>
        </motion.div>

        {/* Bubble 4: Iridescent Sphere that crosses beyond the section boundary */}
        <motion.div
          className="absolute -bottom-10 sm:-bottom-20 left-2 sm:left-10 lg:left-14 opacity-80 sm:opacity-85 pointer-events-auto z-30 scale-65 sm:scale-90 lg:scale-100 origin-bottom-left"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: mouseOffset.x * -35,
                  y: mouseOffset.y * -30,
                }
          }
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 26, stiffness: 45 }}
        >
          <motion.div
            drag={!reducedMotion}
            dragConstraints={{ left: -50, right: 50, top: -50, bottom: 50 }}
            dragElastic={0.45}
            dragSnapToOrigin
            whileHover={reducedMotion ? undefined : { scale: 1.15 }}
            whileTap={reducedMotion ? undefined : { scale: 0.95 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: [0, 25, -30, 15, -20, 0],
                    y: [0, -20, 18, -15, 10, 0],
                    rotate: [0, -10, 14, -6, 10, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 18,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
            className="cursor-grab active:cursor-grabbing drop-shadow-xl"
          >
            <IridescentOrb size={160} variant="full-spectrum" />
          </motion.div>
        </motion.div>

        {/* Bubble 5: Floating Mid-Air Pearl Bubble */}
        <motion.div
          className="absolute top-20 sm:top-24 left-1/4 sm:left-1/3 opacity-55 pointer-events-auto z-10 scale-60 sm:scale-85 lg:scale-100 origin-center hidden sm:block"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: mouseOffset.x * 30,
                  y: mouseOffset.y * 30,
                }
          }
          transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 18, stiffness: 50 }}
        >
          <motion.div
            drag={!reducedMotion}
            dragConstraints={{ left: -40, right: 40, top: -40, bottom: 40 }}
            dragElastic={0.45}
            dragSnapToOrigin
            whileHover={reducedMotion ? undefined : { scale: 1.25 }}
            whileTap={reducedMotion ? undefined : { scale: 0.9 }}
            animate={
              reducedMotion
                ? undefined
                : {
                    x: [0, 25, -20, 30, -15, 0],
                    y: [0, -25, 30, -20, 15, 0],
                    rotate: [0, 30, -25, 15, -10, 0],
                  }
            }
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: 15,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
            }
          >
            <IridescentOrb size={120} variant="mint-pink" />
          </motion.div>
        </motion.div>
      </div>

      {/* MAIN MONUMENTAL POSTER HERO BODY */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex-1 flex flex-col justify-center my-4 sm:my-8">
        {/* MONUMENTAL KINETIC TYPOGRAPHY LAYER 1: "SYNTHETICA" */}
        <div className="relative w-full text-center select-none overflow-hidden py-1">
          <h1
            id="hero-title-synthetica"
            className="text-[13vw] sm:text-[14.5vw] md:text-[14vw] lg:text-[12.5rem] font-black tracking-tight leading-[0.85] uppercase text-[#153833] dark:!text-white transition-transform duration-500 hover:scale-[1.01]"
            style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
          >
            SYNTHETICA
          </h1>
        </div>

        {/* CENTER OVERLAPPING SCULPTURE & CULTURAL CUTOUTS WITH INTERACTIVE 3D HOVER */}
        <div className="relative w-full my-2 sm:my-4 flex items-center justify-center">
          {/* Central Radial Light Aura */}
          <div
            className="absolute w-64 sm:w-110 h-64 sm:h-110 rounded-full blur-3xl opacity-40 pointer-events-none"
            style={{
              background: 'radial-gradient(circle, #efaec4 0%, #5eead4 50%, transparent 75%)',
            }}
          />

          <div className="relative z-20 flex items-center justify-center gap-4 sm:gap-6">
            {/* Left Photo Pill Cutout (Apple iPod Classic 2001) in Full Natural Color */}
            <div className="hidden lg:block">
              <HeaderCard
                badgeLabel="№ 05 • Eletrônicos"
                category="eletronicos"
                targetSectionId="secao-eletronicos"
                initialRotation={-3}
                onSelectCategory={onSelectCategory}
                className="w-44 h-32"
              >
                <div className="w-full h-full bg-slate-100 relative group overflow-hidden border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=600&q=80"
                    alt="Apple iPod Classic 2001"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </HeaderCard>
            </div>

            {/* Main Center Classical Marble Sculpture in Full Natural Color */}
            <div>
              <HeaderCard
                badgeLabel="№ 04 • Belas Artes"
                category="artes-plasticas"
                targetSectionId="secao-artes-plasticas"
                initialRotation={0}
                onSelectCategory={onSelectCategory}
                className="w-56 xs:w-64 sm:w-80 md:w-96 h-64 xs:h-72 sm:h-88 md:h-100 max-w-[84vw]"
              >
                <div className="w-full h-full bg-slate-900 relative group overflow-hidden border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=900&q=85"
                    alt="Escultura Clássica em Mármore - Belas Artes"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent group-hover:opacity-10 transition-opacity duration-300" />
                </div>
              </HeaderCard>
            </div>

            {/* Right Photo Pill Cutout (Dança Urbana e Contemporânea) in Full Natural Color */}
            <div className="hidden lg:block">
              <HeaderCard
                badgeLabel="№ 01 • Dança"
                category="danca"
                targetSectionId="secao-danca"
                initialRotation={3}
                onSelectCategory={onSelectCategory}
                className="w-44 h-32"
              >
                <div className="w-full h-full bg-slate-100 relative group overflow-hidden border-2 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=600&q=80"
                    alt="Dança Urbana e Contemporânea"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </HeaderCard>
            </div>
          </div>
        </div>

        {/* MONUMENTAL KINETIC TYPOGRAPHY LAYER 2: "MEMÓRIA CULTURAL" */}
        <div className="relative w-full text-center select-none overflow-hidden py-1">
          <h2
            className="text-[9.5vw] xs:text-[10vw] sm:text-[11.5vw] md:text-[11vw] lg:text-[9.5rem] font-black tracking-tight leading-[0.85] uppercase text-[#E07A9A] dark:text-[#EFAEC4] transition-transform duration-500 hover:scale-[1.01]"
            style={{ fontFamily: "'Bebas Neue', 'Anton', sans-serif" }}
          >
            MEMÓRIA CULTURAL
          </h2>
        </div>

        {/* Curatorial Subtitle */}
        <p className="mt-4 sm:mt-6 text-xs sm:text-base md:text-lg text-slate-700 dark:text-slate-200 font-normal text-center max-w-3xl mx-auto leading-relaxed px-4">
          Um acervo digital interativo que investiga as origens, o contexto histórico e o público-alvo de obras essenciais em{' '}
          <strong className="text-[#E07A9A] dark:text-[#EFAEC4] font-bold">Dança, Música, Cinema, Artes Plásticas</strong> e{' '}
          <strong className="text-[#E07A9A] dark:text-[#EFAEC4] font-bold">Eletrônicos</strong>.
        </p>

        {/* Poster Action CTAs in Current Palette (Pine Green & Signature Rose) */}
        <div className="mt-6 sm:mt-8 flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4 relative z-30 w-full px-2 sm:px-4">
          <button
            id="hero-btn-explore"
            onClick={onExplore}
            className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-white bg-[#153833] hover:bg-[#1e4e47] transition-all duration-200 shadow-md hover:shadow-xl active:scale-95 cursor-pointer flex items-center justify-center gap-2 group border border-[#153833]"
          >
            <span>Explorar o Acervo</span>
            <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <button
            id="hero-btn-wrapped"
            onClick={onOpenWrapped}
            className="w-full xs:w-auto px-6 sm:px-8 py-3 sm:py-3.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider text-[#153833] bg-[#EFAEC4] hover:bg-[#eb9bb4] transition-all duration-200 shadow-md hover:shadow-pink-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2 border border-[#E07A9A]"
          >
            <Award className="w-4 h-4" />
            <span>Desbloquear Meu Wrapped</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
};
