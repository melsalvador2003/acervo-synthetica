import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Tablet3DViewer } from './Tablet3DViewer';

interface Electronics3DElementProps {
  onInteract?: () => void;
}

export const Electronics3DElement: React.FC<Electronics3DElementProps> = ({ onInteract }) => {
  const { reducedMotion } = useAccessibility();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
      {/* Phosphor Cyan & Emerald Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/25 to-cyan-500/25 blur-3xl pointer-events-none ${
          reducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Pure WebGL 3D Tablet with Three.js (tablet-v2.glb) - Clean, Zero Overlay UI */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Tablet3DViewer
          modelUrl="/models/tablet-v2.glb"
          height="100%"
          className="w-full h-full"
          onInteract={onInteract}
        />
      </div>
    </div>
  );
};

