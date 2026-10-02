import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Vinyl3DViewer } from './Vinyl3DViewer';

interface Music3DElementProps {
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  speed?: '33' | '45' | '78';
}

export const Music3DElement: React.FC<Music3DElementProps> = ({
  isPlaying = true,
  onTogglePlay,
  speed = '33',
}) => {
  const { reducedMotion } = useAccessibility();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
      {/* Background Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-teal-500/20 via-[#EFAEC4]/25 to-emerald-400/20 blur-3xl pointer-events-none ${
          reducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Pure WebGL 3D Object with Three.js (vinil-v2.glb) - Clean, Zero Overlay UI */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Vinyl3DViewer
          modelUrl="/models/vinil-v2.glb"
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          speed={speed}
          height="100%"
          className="w-full h-full"
        />
      </div>
    </div>
  );
};
