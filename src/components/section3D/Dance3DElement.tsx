import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Dance3DViewer } from './Dance3DViewer';

interface Dance3DElementProps {
  onInteract?: () => void;
}

export const Dance3DElement: React.FC<Dance3DElementProps> = ({ onInteract }) => {
  const { reducedMotion } = useAccessibility();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
      {/* Theatrical Rose & Lavender Stage Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500/20 via-purple-400/25 to-rose-400/20 blur-3xl pointer-events-none ${
          reducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Pure WebGL 3D Dancer Sculpture with Three.js (dancarina-v1.glb) - Clean, Zero Overlay UI */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Dance3DViewer
          modelUrl="/models/dancarina-v1.glb"
          height="100%"
          className="w-full h-full"
          onInteract={onInteract}
        />
      </div>
    </div>
  );
};
