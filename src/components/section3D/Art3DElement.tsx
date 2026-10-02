import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Statue3DViewer } from './Statue3DViewer';

interface Art3DElementProps {
  onInteract?: () => void;
}

export const Art3DElement: React.FC<Art3DElementProps> = ({ onInteract }) => {
  const { reducedMotion } = useAccessibility();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
      {/* Museum Gallery Sky & Azure Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500/20 via-cyan-400/25 to-indigo-400/20 blur-3xl pointer-events-none ${
          reducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Pure WebGL 3D Classical & Neoconcrete Statue with Three.js (estatua-v2.glb) - Clean, Zero Overlay UI */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Statue3DViewer
          modelUrl="/models/estatua-v2.glb"
          height="100%"
          className="w-full h-full"
          onInteract={onInteract}
        />
      </div>
    </div>
  );
};
