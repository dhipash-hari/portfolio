import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Geometric Core
const IntelligentCore: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const wireframeRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.2;
      // Gentle reaction to pointer
      meshRef.current.rotation.x += (state.pointer.y * 0.4 - meshRef.current.rotation.x) * 0.05;
      meshRef.current.rotation.y += (state.pointer.x * 0.4 - meshRef.current.rotation.y) * 0.05;
    }

    if (wireframeRef.current) {
      wireframeRef.current.rotation.x = -time * 0.1;
      wireframeRef.current.rotation.z = time * 0.15;
    }
  });

  return (
    <group>
      {/* Inner fluid / metallic orb */}
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
        <mesh ref={meshRef} scale={1.8}>
          <icosahedronGeometry args={[1, 32]} />
          <MeshDistortMaterial
            color="#0e1726"
            emissive="#002b3d"
            emissiveIntensity={0.6}
            roughness={0.15}
            metalness={0.9}
            distort={0.45}
            speed={2.2}
          />
        </mesh>
      </Float>

      {/* Outer crystalline data wireframe cage */}
      <Float speed={1.8} rotationIntensity={0.8} floatIntensity={0.5}>
        <mesh ref={wireframeRef} scale={2.5}>
          <icosahedronGeometry args={[1, 1]} />
          <meshStandardMaterial
            color="#00E5FF"
            wireframe
            transparent
            opacity={0.35}
            roughness={0.2}
            metalness={0.8}
            emissive="#00E5FF"
            emissiveIntensity={0.2}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Subtle surrounding particle data cloud
const DataParticleField: React.FC<{ count?: number }> = ({ count = 80 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 3 + Math.random() * 2.5;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);
    }
    return [pos];
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.04;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.02) * 0.1;
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
        size={0.04}
        color="#00E5FF"
        transparent
        opacity={0.65}
        sizeAttenuation
      />
    </points>
  );
};

// Elegant static / lightweight fallback for mobile or reduced motion
const StaticSceneFallback: React.FC = () => (
  <div className="w-full h-full flex items-center justify-center relative">
    <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border border-[#00E5FF]/20 bg-gradient-to-tr from-[#00E5FF]/10 via-[#0d1017]/80 to-[#131722] backdrop-blur-2xl flex items-center justify-center relative shadow-[0_0_80px_rgba(0,229,255,0.15)] animate-pulse-slow">
      <div className="w-48 h-48 rounded-full border border-dashed border-[#00E5FF]/30 flex items-center justify-center animate-spin" style={{ animationDuration: '30s' }}>
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#00E5FF]/30 to-transparent flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-[#00E5FF] shadow-[0_0_15px_#00E5FF]" />
        </div>
      </div>
    </div>
  </div>
);

export const HeroScene: React.FC = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  const [isLowPower, setIsLowPower] = React.useState(false);

  React.useEffect(() => {
    // Check reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check low-power / small screen
    if (window.innerWidth < 768) {
      setIsLowPower(true);
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  if (prefersReducedMotion || isLowPower) {
    return <StaticSceneFallback />;
  }

  return (
    <div className="w-full h-full min-h-[420px] md:min-h-[550px] relative pointer-events-auto">
      <Suspense fallback={<StaticSceneFallback />}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full"
        >
          {/* Lighting setup */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[10, 10, 5]} intensity={1.8} color="#ffffff" />
          <pointLight position={[-6, -6, -4]} intensity={2.5} color="#00E5FF" />
          <pointLight position={[6, 4, 3]} intensity={1.5} color="#3B82F6" />

          {/* 3D Model group */}
          <IntelligentCore />
          <DataParticleField count={100} />
        </Canvas>
      </Suspense>

      {/* Decorative ambient glow underneath */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-[#00E5FF]/10 via-transparent to-transparent blur-3xl -z-10" />
    </div>
  );
};
