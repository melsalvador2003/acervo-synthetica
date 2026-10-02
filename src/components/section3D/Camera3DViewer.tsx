import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Film } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface Camera3DViewerProps {
  modelUrl?: string;
  className?: string;
  height?: number | string;
  onInteract?: () => void;
}

export const Camera3DViewer: React.FC<Camera3DViewerProps> = ({
  modelUrl = '/models/camera-v1.glb',
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
  const [isRecording, setIsRecording] = useState(true);

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const tallyLightRef = useRef<THREE.PointLight | null>(null);
  const lensFlareLightRef = useRef<THREE.PointLight | null>(null);
  const userInteractingRef = useRef<boolean>(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;

    // 1. Three.js Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera: Isometric 3/4 framing for cinema camera inspection
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

    // 5. Studio Lighting Setup with Warm Cinematic 35mm Reflections
    const ambientLight = new THREE.AmbientLight(0xfffaed, 1.4);
    scene.add(ambientLight);

    // Key Light: High-contrast directional illumination (Tungsten Film Set 3200K)
    const keyLight = new THREE.DirectionalLight(0xfff3e0, 2.7);
    keyLight.position.set(2.5, 3.5, 2.5);
    scene.add(keyLight);

    // Fill Light: Soft amber/sepia cinema studio tone
    const fillLight = new THREE.DirectionalLight(0xfbbf24, 1.3);
    fillLight.position.set(-2.5, 1.5, -2);
    scene.add(fillLight);

    // Rim Light: Golden reflection highlighting camera magazine and chassis bevels
    const rimLight = new THREE.PointLight(0xf59e0b, 2.6, 10);
    rimLight.position.set(2, -1.5, -2);
    scene.add(rimLight);

    // Lens Highlight: Specular flare for the optical glass element
    const lensLight = new THREE.PointLight(0xffedd5, 1.8, 8);
    lensLight.position.set(0, 2.2, 1.2);
    scene.add(lensLight);
    lensFlareLightRef.current = lensLight;

    // Red Tally / 24 FPS Record Indicator Light
    const tallyLight = new THREE.PointLight(0xef4444, 1.5, 4);
    tallyLight.position.set(0, 0, 0.6);
    scene.add(tallyLight);
    tallyLightRef.current = tallyLight;

    // 6. Model Root Group
    const modelGroup = new THREE.Group();
    // Default initial tilt for aesthetic camera product framing (retaining centering around origin)
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
      const targetScale = 1.8 / maxDimension;
      loadedScene.scale.set(targetScale, targetScale, targetScale);
      loadedScene.updateMatrixWorld(true);

      // Precisely center the scaled model at (0, 0, 0)
      const scaledBox = new THREE.Box3().setFromObject(loadedScene);
      const center = scaledBox.getCenter(new THREE.Vector3());
      loadedScene.position.sub(center);
      loadedScene.updateMatrixWorld(true);

      // Enhance PBR materials for optical glass and vintage cinema camera body
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
                mat.roughness = Math.max(0.18, mat.roughness * 0.85);
                mat.metalness = Math.min(0.85, mat.metalness * 1.1 + 0.1);
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
            console.error('GLB camera model loading failed entirely:', fallbackErr);
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
      setIsRecording((prev) => !prev);
      if (tallyLightRef.current) {
        tallyLightRef.current.intensity = isRecording ? 0.2 : 2.2;
      }
      if (lensFlareLightRef.current) {
        // Quick lens flare burst on shutter click
        lensFlareLightRef.current.intensity = 3.2;
        setTimeout(() => {
          if (lensFlareLightRef.current) {
            lensFlareLightRef.current.intensity = 1.8;
          }
        }, 180);
      }

      // Play a vintage cinema 35mm mechanical shutter / motor sound via Web Audio API
      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();

          // Mechanical shutter snap
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'triangle';
          osc1.frequency.setValueAtTime(650, ctx.currentTime);
          osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.08);
          gain1.gain.setValueAtTime(0.12, ctx.currentTime);
          gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          osc1.connect(gain1);
          gain1.connect(ctx.destination);
          osc1.start();
          osc1.stop(ctx.currentTime + 0.08);

          // Second mechanical latch click
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'square';
          osc2.frequency.setValueAtTime(1400, ctx.currentTime + 0.06);
          osc2.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.14);
          gain2.gain.setValueAtTime(0.08, ctx.currentTime + 0.06);
          gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(ctx.currentTime + 0.06);
          osc2.stop(ctx.currentTime + 0.14);
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
      id="camera-3d-viewer"
      className={`relative w-full rounded-3xl overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ height }}
    >
      {/* Pure 3D Canvas Mount Point - completely clean without UI clutter (RULE[AGENTS_md]) */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-0"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        title="Arraste para girar em 360° • Toque na câmera para interagir"
      />

      {/* Minimal Loading Indicator (discreet, fades away on load) */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent pointer-events-none">
          <div className="w-9 h-9 rounded-full border-2 border-amber-500/30 border-t-amber-500 animate-spin flex items-center justify-center">
            <Film className="w-4 h-4 text-[#153833] animate-pulse" />
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
