import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Disc3 } from 'lucide-react';
import { useAccessibility } from '../../context/AccessibilityContext';

interface Vinyl3DViewerProps {
  modelUrl?: string;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  speed?: '33' | '45' | '78';
  className?: string;
  height?: number | string;
}

export const Vinyl3DViewer: React.FC<Vinyl3DViewerProps> = ({
  modelUrl = '/models/vinil-v2.glb',
  isPlaying = false,
  onTogglePlay,
  speed = '33',
  className = '',
  height = 340,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { reducedMotion } = useAccessibility();

  // Dynamic Refs to guarantee requestAnimationFrame always reads current props
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  // Pointer position tracker for clean click vs drag OrbitControls disambiguation
  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [spinAxis, setSpinAxis] = useState<'z' | 'y' | 'x'>('z');

  // References to Three.js internal objects
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);

  // Initialize Three.js Scene
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let isDisposed = false;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera with isometric framing
    const width = container.clientWidth || 320;
    const currentHeight = container.clientHeight || 320;
    const camera = new THREE.PerspectiveCamera(40, width / currentHeight, 0.1, 100);
    camera.position.set(0, 0.45, 2.75);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // 3. WebGL Renderer with High Quality PBR Tone Mapping
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
    renderer.toneMappingExposure = 1.25;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.outline = 'none';
    rendererRef.current = renderer;

    container.replaceChildren(renderer.domElement);

    // 4. Orbit Controls (Clean 360° interactive rotation and pinch/scroll zoom)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.rotateSpeed = 0.85;
    controls.zoomSpeed = 0.9;
    controls.minDistance = 1.1;
    controls.maxDistance = 5.5;
    controls.maxPolarAngle = Math.PI * 0.95;
    controls.minPolarAngle = 0.05;
    controls.target.set(0, 0, 0);
    controls.update();
    controlsRef.current = controls;

    // 5. Studio PBR Lighting Setup for realistic vinyl sheen
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(2.5, 3.5, 2.5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x5eead4, 1.1);
    fillLight.position.set(-2.5, 1.5, -2);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xefaec4, 2.8, 12);
    rimLight.position.set(2, -1.5, -2);
    scene.add(rimLight);

    const accentLight = new THREE.PointLight(0xffffff, 1.5, 8);
    accentLight.position.set(0, 2.5, 0.8);
    scene.add(accentLight);

    // 6. Model Holder Group (centered at origin)
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // 7. Load GLB Model using DRACO Loader
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/draco/');

    const gltfLoader = new GLTFLoader();
    gltfLoader.setDRACOLoader(dracoLoader);

    setIsLoading(true);
    setHasError(false);

    gltfLoader.load(
      modelUrl,
      (gltf) => {
        if (isDisposed) return;

        const loadedScene = gltf.scene;

        // Normalize scale to fit cleanly inside viewport
        const box = new THREE.Box3().setFromObject(loadedScene);
        const size = box.getSize(new THREE.Vector3());
        const maxDimension = Math.max(size.x, size.y, size.z) || 1;
        const targetScale = 1.55 / maxDimension;
        loadedScene.scale.set(targetScale, targetScale, targetScale);
        loadedScene.updateMatrixWorld(true);

        // Center precisely at (0, 0, 0)
        const scaledBox = new THREE.Box3().setFromObject(loadedScene);
        const center = scaledBox.getCenter(new THREE.Vector3());
        loadedScene.position.sub(center);
        loadedScene.updateMatrixWorld(true);

        // Detect best spin axis for disc
        if (Math.abs(size.x - size.y) < Math.abs(size.x - size.z)) {
          setSpinAxis('z');
        } else {
          setSpinAxis('y');
        }

        // Refine materials for rich vinyl sheen & specular reflections
        loadedScene.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh;
            mesh.castShadow = true;
            mesh.receiveShadow = true;

            if (mesh.material) {
              const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
              materials.forEach((mat) => {
                if (mat instanceof THREE.MeshStandardMaterial) {
                  mat.envMapIntensity = 1.2;
                  mat.roughness = Math.max(0.15, mat.roughness * 0.9);
                  mat.metalness = Math.min(0.9, mat.metalness * 1.1 + 0.1);
                  mat.needsUpdate = true;
                }
              });
            }
          }
        });

        modelGroup.add(loadedScene);
        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('Failed to load GLB model with local draco:', error);
        // Fallback to Google Draco CDN
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
        gltfLoader.load(
          modelUrl,
          (gltf) => {
            if (isDisposed) return;
            const loadedScene = gltf.scene;
            const box = new THREE.Box3().setFromObject(loadedScene);
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z) || 1;
            const scale = 1.55 / maxDim;
            loadedScene.scale.set(scale, scale, scale);
            loadedScene.updateMatrixWorld(true);
            const scaledBox = new THREE.Box3().setFromObject(loadedScene);
            const center = scaledBox.getCenter(new THREE.Vector3());
            loadedScene.position.sub(center);
            loadedScene.updateMatrixWorld(true);
            modelGroup.add(loadedScene);
            setIsLoading(false);
            setHasError(false);
          },
          undefined,
          (fallbackErr) => {
            console.error('Fallback also failed:', fallbackErr);
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
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Controls damping update
      controls.update();

      // Rotate model smoothly when audio is playing
      if (modelGroupRef.current && isPlayingRef.current) {
        const currentSpeed = speedRef.current;
        const rpmFactor = currentSpeed === '78' ? 2.6 : currentSpeed === '45' ? 1.6 : 1.2;
        const spinSpeed = delta * 2.2 * rpmFactor;

        if (spinAxis === 'z') {
          modelGroupRef.current.rotation.z += spinSpeed;
        } else if (spinAxis === 'y') {
          modelGroupRef.current.rotation.y += spinSpeed;
        } else {
          modelGroupRef.current.rotation.x += spinSpeed;
        }
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
  }, [modelUrl]);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerDownPos.current) return;
    const dist = Math.hypot(e.clientX - pointerDownPos.current.x, e.clientY - pointerDownPos.current.y);
    pointerDownPos.current = null;
    // Only toggle playback if it was an intentional stationary tap/click (< 6px movement)
    if (dist < 6 && onTogglePlay) {
      onTogglePlay();
    }
  };

  return (
    <div
      id="vinyl-3d-viewer"
      className={`relative w-full rounded-3xl overflow-hidden select-none flex items-center justify-center ${className}`}
      style={{ height }}
    >
      {/* Pure 3D Canvas Mount Point - completely clean without UI clutter */}
      <div
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing flex items-center justify-center relative z-0"
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        title="Arraste para girar em 360°"
      />

      {/* Minimal Loading Indicator (fades out when loaded) */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-transparent pointer-events-none">
          <div className="w-9 h-9 rounded-full border-2 border-teal-600/30 border-t-teal-600 animate-spin flex items-center justify-center">
            <Disc3 className="w-4 h-4 text-[#153833] animate-pulse" />
          </div>
        </div>
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-4 text-center">
          <p className="text-xs font-mono text-slate-500">Erro ao carregar modelo 3D</p>
        </div>
      )}
    </div>
  );
};
