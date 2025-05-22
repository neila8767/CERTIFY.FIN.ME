// components/BlockchainAnimation.jsx
import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BlockchainAnimation = () => {
  const mountRef = useRef(null);

  useEffect(() => {
const colors = {
  darkBlue: 0x0b1f3a,      // bleu foncé sérieux
  mediumBlue: 0x1666c7,    // bleu corporate
  lightBlue: 0x33a9ff,     // bleu néon clair
  edgeGlow: 0x0b1f3a      // néon pour edges
};



    const scene = new THREE.Scene();
  scene.background = null;
    

    const camera = new THREE.PerspectiveCamera(
      60,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 10, 25);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(10, 20, 15);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    const blocks = [];
    const blockCount = 30;
    const blockSpacing = 4.5;

    const createBlock = (x, y, z) => {
      const geometry = new THREE.BoxGeometry(2.2, 2.2, 2.2);
      const color = new THREE.Color().lerpColors(
        new THREE.Color(colors.mediumBlue),
        new THREE.Color(colors.darkBlue),
        Math.random() * 0.4 + 0.3
      );

      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: colors.darkBlue,
        shininess: 120,
        transparent: true,
        opacity: 0.92,
        specular: 0x111111
      });

      const block = new THREE.Mesh(geometry, material);
      block.position.set(x, y, z);
      block.castShadow = true;
      block.receiveShadow = true;

      const edges = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({
        color: colors.edgeGlow,
        linewidth: 3,
        transparent: true,
        opacity: 0.8
      });
      const edgesMesh = new THREE.LineSegments(edges, edgesMaterial);
      block.add(edgesMesh);

      scene.add(block);
      if (Math.random() > 0.8) {
            block.renderOrder = 1; // passe devant
        }

      return block;
    };

    for (let i = 0; i < blockCount; i++) {
      const angle = (i / blockCount) * Math.PI * 8;
      const radius = 12 + Math.sin(i * 0.3) * 5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = i * blockSpacing - 40;

      blocks.push(createBlock(x, y, z));
    }

    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      blocks.forEach((block, index) => {
        block.position.y += 0.08;
        block.rotation.x += 0.008 * Math.sin(Date.now() * 0.001 + index);
        block.rotation.y += 0.01;

        const scale = 1 + Math.sin(Date.now() * 0.002 + index) * 0.05;
        block.scale.set(scale, scale, scale);

        if (block.position.y > 50) {
          block.position.y = -50;
        }
      });

      renderer.render(scene, camera);
      renderer.setClearAlpha(0);
    };

    animate();

    const handleResize = () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current?.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="w-full h-full min-h-[600px] lg:min-h-[700px]" />;
};

export default BlockchainAnimation;
