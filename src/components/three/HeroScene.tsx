import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './webglUtils';

interface SculptureProps {
  isMobile: boolean;
}

// Award-winning procedural 3D sculpture: "The Intelligent Singularity"
const IntelligentSingularity: React.FC<SculptureProps> = ({ isMobile }) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const cageRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Target rotations for damped pointer interpolation
  const targetRotation = useRef({ x: 0, y: 0 });
  const entranceProgress = useRef(0);

  const knotSegments = isMobile ? [64, 24] : [128, 32];

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Smooth entrance emergence
    if (entranceProgress.current < 1) {
      entranceProgress.current = Math.min(1, entranceProgress.current + delta * 0.6);
      if (groupRef.current) {
        const ease = 1 - Math.pow(1 - entranceProgress.current, 3);
        groupRef.current.scale.setScalar(ease);
      }
    }

    // Pointer response with lerping
    if (!isMobile) {
      targetRotation.current.x = state.pointer.y * 0.35;
      targetRotation.current.y = state.pointer.x * 0.45;
    } else {
      // Autonomous organic oscillation on touch/mobile
      targetRotation.current.x = Math.sin(time * 0.5) * 0.15;
      targetRotation.current.y = Math.cos(time * 0.4) * 0.2;
    }

    if (groupRef.current) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotation.current.x,
        0.04
      );
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotation.current.y,
        0.04
      );
    }

    // Continuous kinetic rotation of individual topological layers
    if (coreRef.current) {
      coreRef.current.rotation.x = time * 0.12;
      coreRef.current.rotation.y = time * 0.16;
      coreRef.current.rotation.z = Math.sin(time * 0.08) * 0.2;
    }

    if (innerRef.current) {
      innerRef.current.rotation.y = -time * 0.25;
      innerRef.current.rotation.x = time * 0.18;
      const pulse = 1 + Math.sin(time * 2.5) * 0.08;
      innerRef.current.scale.setScalar(0.75 * pulse);
    }

    if (cageRef.current) {
      cageRef.current.rotation.x = -time * 0.08;
      cageRef.current.rotation.z = time * 0.1;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z = time * 0.22;
      ring1Ref.current.rotation.x = 0.785 + Math.sin(time * 0.3) * 0.08;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.z = -time * 0.18;
      ring2Ref.current.rotation.y = -0.61 + Math.cos(time * 0.25) * 0.08;
    }

    // Dynamic sweeping key light
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.8) * 4.5;
      lightRef.current.position.y = Math.cos(time * 0.6) * 3.5;
      lightRef.current.position.z = 2.5 + Math.sin(time * 0.5) * 1.5;
    }
  });

  return (
    <group ref={groupRef} scale={0.01}>
      {/* Dynamic Key Light Orbiting the Core */}
      <pointLight
        ref={lightRef}
        intensity={2.8}
        distance={12}
        color="#00E5FF"
      />

      <Float speed={2.0} rotationIntensity={0.3} floatIntensity={0.4}>
        {/* Layer 1: Inner Luminous Energy Seed */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[0.75, 2]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#0099b8"
            emissiveIntensity={1.2}
            roughness={0.2}
            metalness={0.7}
            wireframe={false}
          />
        </mesh>

        {/* Layer 2: Master Topological Chrome Torus Knot */}
        <mesh ref={coreRef}>
          <torusKnotGeometry args={[1.05, 0.32, knotSegments[0], knotSegments[1], 2, 3]} />
          <meshStandardMaterial
            color="#0a101d"
            emissive="#021c29"
            emissiveIntensity={0.4}
            metalness={0.94}
            roughness={0.12}
          />
        </mesh>

        {/* Layer 3: Crystalline Faceted Geodesic Cage */}
        <mesh ref={cageRef}>
          <icosahedronGeometry args={[2.05, 1]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.2}
            wireframe
            transparent
            opacity={0.3}
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>

        {/* Layer 4: Primary Orbital Quantum Ring + Traveling Photon */}
        <group ref={ring1Ref}>
          <mesh>
            <torusGeometry args={[2.45, 0.015, 16, isMobile ? 48 : 80]} />
            <meshStandardMaterial
              color="#00E5FF"
              emissive="#00E5FF"
              emissiveIntensity={0.6}
              transparent
              opacity={0.6}
            />
          </mesh>
          {/* Orbital satellite beacon */}
          <mesh position={[2.45, 0, 0]}>
            <sphereGeometry args={[0.065, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#00E5FF"
              emissiveIntensity={2.5}
            />
          </mesh>
        </group>

        {/* Layer 5: Secondary Complementary Orbital Ring */}
        <group ref={ring2Ref}>
          <mesh>
            <torusGeometry args={[2.75, 0.012, 16, isMobile ? 48 : 80]} />
            <meshStandardMaterial
              color="#3B82F6"
              emissive="#3B82F6"
              emissiveIntensity={0.5}
              transparent
              opacity={0.5}
            />
          </mesh>
          {/* Orbital satellite beacon */}
          <mesh position={[-2.75, 0, 0]}>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial
              color="#FFFFFF"
              emissive="#3B82F6"
              emissiveIntensity={2.0}
            />
          </mesh>
        </group>
      </Float>
    </group>
  );
};

// Subtle atmospheric data dust field
const AtmosphericDataParticles: React.FC<{ count: number }> = ({ count }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, opacities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const op = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const radius = 2.8 + Math.random() * 3.2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
      op[i] = 0.3 + Math.random() * 0.7;
    }
    return [pos, op];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      const t = state.clock.getElapsedTime();
      pointsRef.current.rotation.y = t * 0.035;
      pointsRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00E5FF"
        transparent
        opacity={0.65}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// Camera controller with subtle breathing
const CameraRig: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const ptr = state.pointer;

    // Gentle camera parallax
    const targetZ = isMobile ? 6.8 : 5.8;
    const targetX = isMobile ? Math.sin(t * 0.3) * 0.15 : ptr.x * 0.3;
    const targetY = isMobile ? Math.cos(t * 0.25) * 0.15 : ptr.y * 0.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.03);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.03);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.03);
    camera.lookAt(0, 0, 0);
  });

  return null;
};

import { CinematicHoloFallback } from './HoloFallback';

export { CinematicHoloFallback };

export const HeroScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Check WebGL support
    setHasWebGL(isWebGLAvailable());

    // 2. Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

    // 3. Check mobile screen
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener('resize', checkSize);

    // 4. Performance IntersectionObserver: pause rendering when scrolled out of view
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.05 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
      window.removeEventListener('resize', checkSize);
      observer.disconnect();
    };
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div ref={containerRef} className="w-full h-full min-h-[360px] sm:min-h-[460px] lg:min-h-[560px]">
        <CinematicHoloFallback />
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[360px] sm:min-h-[460px] lg:min-h-[560px] relative pointer-events-auto"
    >
      <Suspense fallback={<CinematicHoloFallback />}>
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0, isMobile ? 6.8 : 5.8], fov: 45 }}
          dpr={[1, isMobile ? 1.25 : 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          {/* Studio Lighting Architecture */}
          <ambientLight intensity={0.65} color="#08101e" />
          <directionalLight position={[6, 8, 5]} intensity={1.5} color="#ffffff" />
          <directionalLight position={[-8, -6, -4]} intensity={1.8} color="#1d4ed8" />
          <pointLight position={[0, -4, 2]} intensity={1.2} color="#00E5FF" distance={8} />

          {/* Centerpiece & Camera */}
          <CameraRig isMobile={isMobile} />
          <IntelligentSingularity isMobile={isMobile} />
          <AtmosphericDataParticles count={isMobile ? 55 : 110} />
        </Canvas>
      </Suspense>

      {/* Atmospheric radial glow and specular sheen */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-[#00E5FF]/10 via-transparent to-transparent blur-3xl -z-10" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none text-[10px] font-mono text-zinc-500/60 uppercase tracking-widest hidden sm:flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-pulse" />
        Interactive 3D Topology // Drag to Orbit
      </div>
    </div>
  );
};
export default HeroScene;
