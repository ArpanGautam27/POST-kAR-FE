import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './Mascot.css';

export default function Mascot() {
  useEffect(() => {
    let mixer: any;
    let clock: any;
    let renderer: any = null;
    let camera: any = null;
    let animationFrameId: number;
    let handleResize: (() => void) | null = null;

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

    const loader = new GLTFLoader();
    const modelUrl = new URL('../../assets/menaquin.glb', import.meta.url).href;
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
      },
      undefined,
      (error: any) => {
        console.error('Failed to load mascot GLB:', error);
      }
    );

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
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (renderer && container && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
        renderer.dispose();
      }
    };
  }, []);

  return <div id="mascot" />;
}
