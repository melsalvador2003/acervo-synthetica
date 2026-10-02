import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAccessibility } from '../context/AccessibilityContext';

interface IridescentOrbProps {
  size?: number;
  className?: string;
  variant?: 'cyan-purple' | 'mint-pink' | 'full-spectrum';
  style?: React.CSSProperties;
  interactive?: boolean;
}

export const IridescentOrb: React.FC<IridescentOrbProps> = ({
  size = 180,
  className = '',
  variant = 'full-spectrum',
  style = {},
  interactive = true,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { reducedMotion } = useAccessibility();

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none ${interactive && !reducedMotion ? 'cursor-grab active:cursor-grabbing' : 'pointer-events-none'} ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {/* Ambient outer glow with gentle breathing and hover flare */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                scale: isHovered ? [1.15, 1.25, 1.18] : [1, 1.12, 0.98, 1.08, 1],
                opacity: isHovered ? 0.9 : [0.5, 0.75, 0.45, 0.7, 0.5],
              }
        }
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration: isHovered ? 2 : 7,
                repeat: Infinity,
                ease: 'easeInOut',
              }
        }
        className="absolute inset-0 rounded-full blur-2xl opacity-60 transition-opacity duration-300"
        style={{
          background:
            variant === 'mint-pink'
              ? 'radial-gradient(circle, rgba(94,234,212,0.75) 0%, rgba(244,114,182,0.55) 70%, transparent 100%)'
              : 'radial-gradient(circle, rgba(129,140,248,0.7) 0%, rgba(236,72,153,0.6) 60%, rgba(45,212,191,0.45) 100%)',
        }}
      />

      {/* 3D Liquid Chrome Sphere with internal rotating iridescent gradient */}
      <motion.div
        animate={
          reducedMotion
            ? undefined
            : {
                scale: isHovered ? 1.04 : 1,
              }
        }
        transition={reducedMotion ? { duration: 0 } : { type: 'spring', damping: 15, stiffness: 200 }}
        className="absolute inset-0 rounded-full shadow-2xl overflow-hidden border border-white/60"
        style={{
          background:
            variant === 'mint-pink'
              ? `
                radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.25) 20%, transparent 45%),
                radial-gradient(circle at 75% 75%, rgba(244, 114, 182, 0.85) 0%, rgba(94, 234, 212, 0.75) 45%, rgba(45, 212, 191, 0.6) 75%, rgba(20, 56, 51, 0.5) 100%),
                radial-gradient(circle at 25% 80%, rgba(94, 234, 212, 0.7) 0%, transparent 65%),
                linear-gradient(135deg, rgba(94, 234, 212, 0.65) 0%, rgba(244, 114, 182, 0.65) 60%, rgba(192, 132, 252, 0.55) 100%)
              `
              : variant === 'cyan-purple'
              ? `
                radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.25) 20%, transparent 45%),
                radial-gradient(circle at 75% 75%, rgba(192, 132, 252, 0.85) 0%, rgba(56, 189, 248, 0.75) 50%, rgba(20, 56, 51, 0.5) 100%),
                radial-gradient(circle at 25% 80%, rgba(129, 140, 248, 0.7) 0%, transparent 65%),
                linear-gradient(135deg, rgba(56, 189, 248, 0.65) 0%, rgba(192, 132, 252, 0.65) 60%, rgba(244, 114, 182, 0.55) 100%)
              `
              : `
                radial-gradient(circle at 32% 28%, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.25) 20%, transparent 45%),
                radial-gradient(circle at 72% 72%, rgba(244, 114, 182, 0.85) 0%, rgba(192, 132, 252, 0.75) 35%, rgba(45, 212, 191, 0.65) 70%, rgba(20, 56, 51, 0.5) 100%),
                radial-gradient(circle at 25% 75%, rgba(56, 189, 248, 0.65) 0%, rgba(94, 234, 212, 0.55) 45%, transparent 75%),
                linear-gradient(135deg, rgba(94, 234, 212, 0.6) 0%, rgba(192, 132, 252, 0.6) 40%, rgba(244, 114, 182, 0.65) 75%, rgba(56, 189, 248, 0.55) 100%)
              `,
          boxShadow:
            isHovered && !reducedMotion
              ? 'inset -12px -16px 30px rgba(15, 38, 34, 0.45), inset 8px 10px 22px rgba(255, 255, 255, 0.9), 0 25px 55px -8px rgba(224, 122, 154, 0.45)'
              : 'inset -10px -14px 26px rgba(15, 38, 34, 0.4), inset 6px 8px 18px rgba(255, 255, 255, 0.8), 0 20px 45px -10px rgba(0, 0, 0, 0.25)',
        }}
      >
        {/* Animated Internal Liquid Sheen - accelerates when hovered */}
        <motion.div
          animate={
            reducedMotion
              ? undefined
              : {
                  rotate: [0, 360],
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: isHovered ? 8 : 24,
                  repeat: Infinity,
                  ease: 'linear',
                }
          }
          className="absolute -inset-full opacity-40 mix-blend-color-dodge pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.45) 0%, rgba(239, 174, 196, 0.2) 40%, transparent 70%)',
          }}
        />

        {/* Curvature Reflection Highlight */}
        <div
          className="absolute inset-1 rounded-full pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 40%, rgba(45, 212, 191, 0.3) 80%, rgba(244, 114, 182, 0.45) 100%)',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Primary Specular Highlight: Soft Curved Luminous Glint (Pure Glowing White) */}
        <motion.div
          data-orb-highlight="true"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: isHovered ? [0, 5, -4, 0] : [0, 3, -2, 1, 0],
                  y: isHovered ? [0, -4, 4, 0] : [0, -2, 2, -1, 0],
                  scale: isHovered ? 1.12 : 1,
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: isHovered ? 3 : 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="absolute top-[13%] left-[17%] w-[32%] h-[19%] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at 42% 42%, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.2) 60%, transparent 80%)',
            filter: 'blur(0.5px)',
            transform: 'rotate(-40deg)',
          }}
        />

        {/* Secondary Pinpoint Specular Glint (Intense Focus Reflection Dot) */}
        <div
          data-orb-highlight="true"
          className="absolute top-[21%] left-[26%] w-[7%] h-[7%] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.85) 45%, transparent 100%)',
            boxShadow: '0 0 6px 1px rgba(255, 255, 255, 0.8)',
          }}
        />

        {/* Delicate Top Arc Rim Light */}
        <div
          data-orb-highlight="true"
          className="absolute inset-[2px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 30% 18%, rgba(255, 255, 255, 0.55) 0%, transparent 35%)',
          }}
        />

        {/* Opposite Translucent Bounce Light (Bottom-Right) */}
        <motion.div
          data-orb-highlight="true"
          animate={
            reducedMotion
              ? undefined
              : {
                  x: isHovered ? [0, -5, 4, 0] : [0, -3, 2, -1, 0],
                  y: isHovered ? [0, 4, -4, 0] : [0, 2, -2, 1, 0],
                  scale: isHovered ? 1.15 : 1,
                }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: isHovered ? 4 : 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }
          }
          className="absolute bottom-[16%] right-[16%] w-[26%] h-[15%] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(165, 243, 252, 0.6) 0%, rgba(244, 114, 182, 0.35) 50%, transparent 80%)',
            filter: 'blur(1.5px)',
            transform: 'rotate(35deg)',
          }}
        />
      </motion.div>
    </div>
  );
};
