import React from 'react';
import { useAccessibility } from '../../context/AccessibilityContext';
import { Camera3DViewer } from './Camera3DViewer';

interface Cinema3DElementProps {
  onInteract?: () => void;
}

export const Cinema3DElement: React.FC<Cinema3DElementProps> = ({ onInteract }) => {
  const { reducedMotion } = useAccessibility();

  return (
    <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center select-none">
      {/* Warm Golden Film Sepia Ambient Glow */}
      <div
        className={`absolute inset-0 rounded-full bg-gradient-to-tr from-amber-500/20 via-yellow-400/25 to-orange-500/20 blur-3xl pointer-events-none ${
          reducedMotion ? '' : 'animate-pulse'
        }`}
      />

      {/* Pure WebGL 3D 35mm Cinema Camera with Three.js (camera-v1.glb) - Clean, Zero Overlay UI */}
      <div className="relative w-full h-full flex items-center justify-center">
        <Camera3DViewer
          modelUrl="/models/camera-v1.glb"
          height="100%"
          className="w-full h-full"
          onInteract={onInteract}
        />
      </div>
    </div>
  );
};
