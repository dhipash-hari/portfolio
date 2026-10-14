import React, { useRef, useState, useEffect } from 'react';
import { motion, useSpring } from 'framer-motion';

interface ProjectCard3DProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const ProjectCard3D: React.FC<ProjectCard3DProps> = ({
  children,
  className = '',
  maxTilt = 8,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [shinePos, setShinePos] = useState({ x: 50, y: 50 });
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Smooth springs for tilt angles
  const rotateX = useSpring(0, { stiffness: 220, damping: 24, mass: 0.5 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 24, mass: 0.5 });

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(query.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion || !cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normalizedX = (x / rect.width) * 2 - 1; // -1 to 1
    const normalizedY = (y / rect.height) * 2 - 1; // -1 to 1

    rotateX.set(-normalizedY * maxTilt);
    rotateY.set(normalizedX * maxTilt);

    setShinePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1500 select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX: prefersReducedMotion ? 0 : rotateX,
          rotateY: prefersReducedMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="w-full h-full relative transition-shadow duration-500 rounded-3xl"
      >
        {children}

        {/* Dynamic Specular Sheen Layer following cursor */}
        {isHovered && !prefersReducedMotion && (
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none opacity-40 transition-opacity duration-300 z-30"
            style={{
              background: `radial-gradient(circle 380px at ${shinePos.x}% ${shinePos.y}%, rgba(0,229,255,0.18), transparent 70%)`,
            }}
          />
        )}
      </motion.div>
    </div>
  );
};
