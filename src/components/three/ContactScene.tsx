import React, { useRef, useMemo, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';
import { isWebGLAvailable } from './webglUtils';

// A meditative, elegant 3D crystalline transmission node
const TransmissionBeacon: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const outerCageRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const pulseRingRef = useRef<THREE.Mesh>(null);
  const targetRotation = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Smooth subtle pointer influence
    targetRotation.current.x = state.pointer.y * 0.25;
    targetRotation.current.y = state.pointer.x * 0.35;

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

    if (outerCageRef.current) {
      outerCageRef.current.rotation.y = time * 0.14;
      outerCageRef.current.rotation.z = Math.sin(time * 0.2) * 0.15;
    }

    if (innerRef.current) {
      innerRef.current.rotation.x = -time * 0.2;
      innerRef.current.rotation.y = time * 0.25;
      const scale = 0.85 + Math.sin(time * 2.0) * 0.06;
      innerRef.current.scale.setScalar(scale);
    }

    if (pulseRingRef.current) {
      pulseRingRef.current.rotation.z = time * 0.3;
      pulseRingRef.current.rotation.x = 1.2 + Math.sin(time * 0.4) * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Central Luminous Signal Core */}
        <mesh ref={innerRef}>
          <octahedronGeometry args={[1.0, 0]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.9}
            roughness={0.15}
            metalness={0.8}
          />
        </mesh>

        {/* Outer Translucent Faceted Cage */}
        <mesh ref={outerCageRef}>
          <icosahedronGeometry args={[1.8, 1]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#3B82F6"
            emissiveIntensity={0.2}
            wireframe
            transparent
            opacity={0.35}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Orbital Transmission Ring */}
        <mesh ref={pulseRingRef}>
          <torusGeometry args={[2.3, 0.015, 16, 64]} />
          <meshStandardMaterial
            color="#00E5FF"
            emissive="#00E5FF"
            emissiveIntensity={0.8}
            transparent
            opacity={0.5}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Subtle surrounding floating signal beacons
const BeaconParticles: React.FC<{ count?: number }> = ({ count = 50 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2.4 + Math.random() * 2.2;
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
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#00E5FF"
        transparent
        opacity={0.7}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export const ContactScene: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setHasWebGL(isWebGLAvailable());

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handleMotionChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handleMotionChange);

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
      observer.disconnect();
    };
  }, []);

  if (!hasWebGL || prefersReducedMotion) {
    return (
      <div ref={containerRef} className="w-full h-48 flex items-center justify-center relative">
        <div className="w-32 h-32 rounded-full border border-[#00E5FF]/20 bg-gradient-to-tr from-[#00E5FF]/10 to-transparent flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full border border-dashed border-[#00E5FF]/40" />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-48 sm:h-64 relative pointer-events-auto overflow-hidden"
    >
      <Suspense fallback={null}>
        <Canvas
          frameloop={isVisible ? 'always' : 'never'}
          camera={{ position: [0, 0, 5], fov: 42 }}
          dpr={[1, 1.5]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          className="w-full h-full"
        >
          <ambientLight intensity={0.6} color="#0d1b2a" />
          <pointLight position={[5, 5, 4]} intensity={2.2} color="#00E5FF" />
          <pointLight position={[-5, -4, -3]} intensity={1.8} color="#3B82F6" />
          <directionalLight position={[0, 4, 3]} intensity={1.0} color="#ffffff" />

          <TransmissionBeacon />
          <BeaconParticles count={40} />
        </Canvas>
      </Suspense>

      {/* Atmospheric bottom ambient glow */}
      <div className="absolute inset-0 pointer-events-none bg-radial from-[#00E5FF]/10 via-transparent to-transparent blur-2xl -z-10" />
    </div>
  );
};
export default ContactScene;
