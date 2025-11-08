import { useEffect, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import homeMascot from '../../assets/menaquin.glb?url';
import productsMascot from '../../assets/product_page_mascot.glb?url';
import freeMascot from '../../assets/free_page_mascot.glb?url';
import dogLoader from '../../assets/happy_dog_loader.json?url';
import './Mascot.css';

interface MascotProps {
  model?: 'home' | 'products' | 'free';
}

export default function Mascot({ model = 'home' }: MascotProps) {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let mixer: any;
    let clock: any;
    let renderer: any = null;
    let camera: any = null;
    let animationFrameId: number;
    let handleResize: (() => void) | null = null;
    let loadTimeout: any;

    const container = document.getElementById('mascot');
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = null;

    camera = new THREE.PerspectiveCamera(30, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.2, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.8);
    dir.position.set(2, 3, 4);
    scene.add(dir);

    // Defer model loading to not block scrolling
    const loadModel = () => {
      const loader = new GLTFLoader();
      const modelUrl = model === 'free'
        ? freeMascot
        : model === 'products'
          ? productsMascot
          : homeMascot;
      loader.load(
        modelUrl,
        (gltf: any) => {
          const model = gltf.scene;
          scene.add(model);
          mixer = new THREE.AnimationMixer(model);
          const clips = gltf.animations;
          const idleClip = THREE.AnimationClip.findByName(clips, 'mixamo.com') || clips[0];
          const idleAction = mixer.clipAction(idleClip);
          idleAction.play();
          setIsLoading(false);
        },
        undefined,
        (error: any) => {
          console.error('Failed to load mascot GLB:', error);
          setIsLoading(false);
        }
      );
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(loadModel, { timeout: 2000 });
    } else {
      loadTimeout = setTimeout(loadModel, 100);
    }

    clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      if (renderer && camera) {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        renderer.render(scene, camera);
      }
    };
    animate();

    handleResize = () => {
      if (camera && renderer && container) {
        const w = container.clientWidth,
          h = container.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      if (loadTimeout) clearTimeout(loadTimeout);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer && container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, [model]);

  return (
    <div id="mascot">
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120px',
          height: '120px',
          pointerEvents: 'none',
          zIndex: 1
        }}>
          {(() => {
            const LottiePlayer = 'lottie-player' as any;
            return (
              <LottiePlayer
                src={dogLoader}
                background="transparent"
                speed="1"
                style={{ width: '100%', height: '100%' }}
                loop
                autoplay
              />
            );
          })()}
        </div>
      )}
    </div>
  );
}
