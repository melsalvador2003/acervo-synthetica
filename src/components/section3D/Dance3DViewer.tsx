import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Sparkles } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface Dance3DViewerProps {
  modelUrl?: string;
  className?: string;
  height?: number | string;
  onInteract?: () => void;
}

export const Dance3DViewer: React.FC<Dance3DViewerProps> = ({
  modelUrl = '/models/dancarina-v1.glb',
  className = '',
  height = 340,
  onInteract,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();

  // Pointer position tracker to distinguish clicks/taps from OrbitControls drags
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isSpotlightActive, setIsSpotlightActive] = useState(true);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const stageSpotlightRef = useRef<THREE.SpotLight | null>(null);
  const stageRimLightRef = useRef<THREE.PointLight | null>(null);
  const userInteractingRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;

    // 1. Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Isometric 3/4 framing for sculptural dance movement
    const width = container.clientWidth || 320;
    const currentHeight = container.clientHeight || 320;
    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 100);
    camera.position.set(0, 0.35, 2.75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High-Fidelity Tone Mapping
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL init error:', e);
      setHasError(true);
      setIsLoading(false);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, currentHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.outline = 'none';
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Orbit Controls (Clean 360° interactive rotation, pinch & scroll zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 1.0;
    controls.maxDistance = 5.0;
    controls.maxPolarAngle = Math.PI * 0.92;
    controls.minPolarAngle = 0.08;
    controls.target.set(0, 0, 0);
    controls.update();

    controls.addEventListener('start', () => {
      userInteractingRef.current = true;
    });
    controls.addEventListener('end', () => {
      userInteractingRef.current = false;
    });

    controlsRef.current = controls;

    // 5. Theatrical Stage Lighting Setup with Rose & Amber Luminescence
    const ambientLight = new THREE.AmbientLight(0xfff5f8, 1.4);
    scene.add(ambientLight);

    // Overhead Key Spotlight: Theatrical follow-spot
    const keySpot = new THREE.SpotLight(0xfff0f5, 2.8, 12, Math.PI / 4, 0.35, 1);
    keySpot.position.set(1.5, 4.0, 2.5);
    scene.add(keySpot);
    stageSpotlightRef.current = keySpot;

    // Fill Light: Soft rose & magenta ballet glow
    const fillLight = new THREE.DirectionalLight(0xf472b6, 1.4);
    fillLight.position.set(-2.5, 2.0, -1.5);
    scene.add(fillLight);

    // Rim Light: Warm amber/gold highlight separating dancer silhouette from background
    const rimLight = new THREE.PointLight(0xfbbf24, 2.4, 10);
    rimLight.position.set(2, -1.2, -2.2);
    scene.add(rimLight);
    stageRimLightRef.current = rimLight;

    // Stage Floor Uplight: Delicate lavender glow
    const floorLight = new THREE.PointLight(0xc084fc, 1.5, 6);
    floorLight.position.set(0, -2.0, 1.0);
    scene.add(floorLight);

    // 6. Model Root Group
    const modelGroup = new THREE.Group();
    // Default initial framing (centered around origin)
    modelGroup.rotation.x = 0.05;
    modelGroup.rotation.y = -0.28;
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Load GLB Model using DRACO Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    setIsLoading(true);
    setHasError(false);

    const setupLoadedScene = (loadedScene: THREE.Group) => {
      // Normalize scale first to fit comfortably and proportionally inside viewport
      const box = new THREE.Box3().setFromObject(loadedScene);
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z) || 1;
      const targetScale = 1.85 / maxDimension;
      loadedScene.scale.set(targetScale, targetScale, targetScale);
      loadedScene.updateMatrixWorld(true);

      // Precisely center the scaled model at (0, 0, 0)
      const scaledBox = new THREE.Box3().setFromObject(loadedScene);
      const center = scaledBox.getCenter(new THREE.Vector3());
      loadedScene.position.sub(center);
      loadedScene.updateMatrixWorld(true);

      // Enhance PBR materials for stage sculptural porcelain & silk textures
      loadedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          if (mesh.material) {
            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((mat) => {
              if (mat instanceof THREE.MeshStandardMaterial) {
                mat.envMapIntensity = 1.3;
                mat.roughness = Math.max(0.2, mat.roughness * 0.9);
                mat.metalness = Math.min(0.85, mat.metalness * 1.05 + 0.05);
                mat.needsUpdate = true;
              }
            });
          }
        }
      });

      modelGroup.add(loadedScene);
      setIsLoading(false);
    };

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;
        setupLoadedScene(gltf.scene);
      },
      undefined,
      (error) => {
        console.warn('Failed to load GLB with local draco, falling back to CDN:', error);
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        gltfLoader.load(
          modelUrl,
          (gltf) => {
            if (isDisposed) return;
            setupLoadedScene(gltf.scene);
            setHasError(false);
          },
          undefined,
          (fallbackErr) => {
            console.error('GLB dancer model loading failed entirely:', fallbackErr);
            if (!isDisposed) {
              setHasError(true);
              setIsLoading(false);
            }
          }
        );
      }
    );

    // 8. Animation & Render Loop
    let animFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Update damping controls
      controls.update();

      // Smooth subtle turntable rotation when user is not actively dragging
      if (modelGroupRef.current && !userInteractingRef.current && !reducedMotion) {
        modelGroupRef.current.rotation.y += delta * 0.35;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth > 0 && newHeight > 0 && cameraRef.current && rendererRef.current) {
          cameraRef.current.aspect = newWidth / newHeight;
          cameraRef.current.updateProjectionMatrix();
          rendererRef.current.setSize(newWidth, newHeight);
        }
      }
    });

    resizeObserver.observe(container);

    // Cleanup
    return () => {
      isDisposed = true;
      cancelAnimationFrame(animFrameId);
      resizeObserver.disconnect();
      dracoLoader.dispose();
      controls.dispose();
      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, reducedMotion]);

  // Pointer down & up for tap detection
  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;

    // If it was a clean stationary click (< 6px movement)
    if (dist < 6) {
      setIsSpotlightActive((prev) => !prev);
      if (stageSpotlightRef.current) {
        stageSpotlightRef.current.intensity = isSpotlightActive ? 1.2 : 3.6;
      }
      if (stageRimLightRef.current) {
        stageRimLightRef.current.intensity = 3.5;
        setTimeout(() => {
          if (stageRimLightRef.current) {
            stageRimLightRef.current.intensity = 2.4;
          }
        }, 250);
      }

      // Play an ethereal stage chime resonant bell via Web Audio API
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();

          // Fundamental harmonic chime
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
          osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4);
          gain1.gain.setValueAtTime(0.1, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.4);

          // Ethereal overtone
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(1320, ctx.currentTime); // E6
          gain2.gain.setValueAtTime(0.06, ctx.currentTime);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start();
          osc2.stop(ctx.currentTime + 0.35);
        }
      } catch {
        // ignore audio errors
      }

      if (onInteract) {
        onInteract();
      }
    }
  };

  return (
    <div
      id="dance-3d-viewer"
      className={`relative w-full rounded-3xl overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ height }}
    >
      {/* Pure 3D Canvas Mount Point - completely clean without UI clutter (RULE[AGENTS_md]) */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-0"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        title="Arraste para girar em 360° • Toque na bailarina para interagir"
      />

      {/* Minimal Loading Indicator (discreet, fades away on load) */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent pointer-events-none">
          <div className="w-9 h-9 rounded-full border-2 border-pink-500/30 border-t-pink-500 animate-spin flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-[#153833] animate-pulse" />
          </div>
        </div>
      )}

      {/* Discreet Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 text-center">
          <p className="text-xs font-mono text-slate-500">Erro ao carregar modelo 3D</p>
        </div>
      )}
    </div>
  );
};
