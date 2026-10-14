import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { soundManager } from '../audio/soundEffects';

export type GameState = 'MENU' | 'INSTRUCTIONS' | 'COUNTDOWN' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameMetrics {
  score: number;
  distance: number;
  energyOrbs: number;
  multiplier: number;
  speed: number;
  highScore: number;
}

interface ObstacleData {
  id: number;
  lane: number; // -1: Left, 0: Center, 1: Right
  z: number;
  type: 'LOW_BARRIER' | 'LASER_GRID' | 'CYBER_MONOLITH';
  passed: boolean;
}

interface OrbData {
  id: number;
  lane: number;
  z: number;
  collected: boolean;
}

interface ParticleData {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  color: string;
  life: number;
  maxLife: number;
}

interface CyberRunnerCanvasProps {
  gameState: GameState;
  onGameOver: (metrics: GameMetrics) => void;
  onScoreUpdate: (metrics: GameMetrics) => void;
  controlsRef: React.MutableRefObject<{
    moveLeft: () => void;
    moveRight: () => void;
    jump: () => void;
    slide: () => void;
  }>;
}

const LANE_WIDTH = 2.2;
const LANES = [-LANE_WIDTH, 0, LANE_WIDTH];

// The Player Cyber-Runner 3D Mesh
const PlayerShip: React.FC<{
  laneIndex: number;
  isJumping: boolean;
  isSliding: boolean;
  playerY: number;
  gameState: GameState;
}> = ({ laneIndex, isJumping, isSliding, playerY, gameState }) => {
  const meshRef = useRef<THREE.Group>(null);
  const flame1Ref = useRef<THREE.Mesh>(null);
  const flame2Ref = useRef<THREE.Mesh>(null);
  const targetX = LANES[laneIndex + 1]; // laneIndex is -1, 0, 1 -> maps to 0, 1, 2

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Smooth lane translation (lerp)
    meshRef.current.position.x = THREE.MathUtils.lerp(
      meshRef.current.position.x,
      targetX,
      14 * delta
    );

    // Dynamic bank / roll when changing lanes
    const xDiff = targetX - meshRef.current.position.x;
    meshRef.current.rotation.z = THREE.MathUtils.lerp(
      meshRef.current.rotation.z,
      -xDiff * 0.35,
      12 * delta
    );

    // Vertical Y position
    meshRef.current.position.y = playerY;

    // Slide compression
    const targetScaleY = isSliding ? 0.38 : 1.0;
    const targetScaleZ = isSliding ? 1.45 : 1.0;
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScaleY, 16 * delta);
    meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, targetScaleZ, 16 * delta);

    // Jet thruster flames flicker
    if (flame1Ref.current && flame2Ref.current) {
      const flicker = 0.8 + Math.random() * 0.4;
      flame1Ref.current.scale.set(1, 1, flicker);
      flame2Ref.current.scale.set(1, 1, flicker);
    }
  });

  return (
    <group ref={meshRef} position={[0, playerY, 0]}>
      {/* Aerodynamic Cockpit Hull */}
      <mesh position={[0, 0, 0]} castShadow>
        <coneGeometry args={[0.55, 1.8, 5]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#002233"
          emissiveIntensity={0.6}
          roughness={0.15}
          metalness={0.9}
        />
      </mesh>

      {/* Cyber Windshield Canopy */}
      <mesh position={[0, 0.15, -0.1]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[0.42, 0.4, 0.12]} />
        <meshStandardMaterial
          color="#00E5FF"
          emissive="#00E5FF"
          emissiveIntensity={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Swept Wings */}
      <mesh position={[0, 0.05, 0.3]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.65, 0.08, 0.5]} />
        <meshStandardMaterial
          color="#1e293b"
          emissive="#0284c7"
          emissiveIntensity={0.4}
          roughness={0.2}
          metalness={0.85}
        />
      </mesh>

      {/* Wingtip Light Rails */}
      <mesh position={[-0.82, 0.08, 0.3]}>
        <boxGeometry args={[0.06, 0.06, 0.52]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[0.82, 0.08, 0.3]}>
        <boxGeometry args={[0.06, 0.06, 0.52]} />
        <meshStandardMaterial color="#00E5FF" emissive="#00E5FF" emissiveIntensity={2.5} />
      </mesh>

      {/* Dual Ion Thrusters */}
      <mesh ref={flame1Ref} position={[-0.32, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.7, 8]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh ref={flame2Ref} position={[0.32, 0, 0.95]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.16, 0.7, 8]} />
        <meshBasicMaterial color="#38bdf8" />
      </mesh>

      {/* Cast Shadow Indicator on Floor */}
      <mesh position={[0, -playerY + 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.65, 16]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.65} />
      </mesh>
    </group>
  );
};

// Procedural 3D Obstacles Renderer
const ObstaclesRenderer: React.FC<{ obstacles: ObstacleData[] }> = ({ obstacles }) => {
  return (
    <group>
      {obstacles.map((obs) => {
        const x = LANES[obs.lane + 1];

        if (obs.type === 'LOW_BARRIER') {
          // Low Barrier: Jumpable!
          return (
            <group key={obs.id} position={[x, 0.45, obs.z]}>
              <mesh castShadow>
                <boxGeometry args={[1.9, 0.85, 0.45]} />
                <meshStandardMaterial
                  color="#111827"
                  emissive="#00E5FF"
                  emissiveIntensity={0.8}
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>
              {/* Neon top rim */}
              <mesh position={[0, 0.45, 0]}>
                <boxGeometry args={[1.95, 0.08, 0.48]} />
                <meshBasicMaterial color="#00E5FF" />
              </mesh>
              {/* Pulsing warning chevron */}
              <mesh position={[0, 0, 0.24]}>
                <planeGeometry args={[1.2, 0.4]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          );
        }

        if (obs.type === 'LASER_GRID') {
          // Laser Grid: Slidable!
          return (
            <group key={obs.id} position={[x, 1.8, obs.z]}>
              {/* Side Posts */}
              <mesh position={[-0.95, -0.6, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
              <mesh position={[0.95, -0.6, 0]}>
                <cylinderGeometry args={[0.08, 0.08, 2.4, 8]} />
                <meshStandardMaterial color="#334155" metalness={0.9} />
              </mesh>
              {/* High Laser Beams */}
              <mesh position={[0, 0.1, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
                <meshBasicMaterial color="#f43f5e" />
              </mesh>
              <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[0.04, 0.04, 2.0, 8]} />
                <meshBasicMaterial color="#fb7185" />
              </mesh>
              {/* Caution Laser Plane */}
              <mesh position={[0, -0.1, 0]}>
                <planeGeometry args={[1.9, 0.5]} />
                <meshBasicMaterial color="#e11d48" transparent opacity={0.35} />
              </mesh>
            </group>
          );
        }

        // CYBER_MONOLITH: Must Dodge / Change Lane!
        return (
          <group key={obs.id} position={[x, 1.75, obs.z]}>
            <mesh castShadow>
              <boxGeometry args={[1.9, 3.5, 0.8]} />
              <meshStandardMaterial
                color="#090d16"
                emissive="#8b5cf6"
                emissiveIntensity={0.6}
                roughness={0.1}
                metalness={0.9}
              />
            </mesh>
            {/* Glowing vertical cyber conduit */}
            <mesh position={[0, 0, 0.42]}>
              <boxGeometry args={[0.3, 3.3, 0.05]} />
              <meshBasicMaterial color="#a855f7" />
            </mesh>
            <mesh position={[0, 1.76, 0]}>
              <boxGeometry args={[1.92, 0.05, 0.82]} />
              <meshBasicMaterial color="#c084fc" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Energy Orbs Renderer
const OrbsRenderer: React.FC<{ orbs: OrbData[] }> = ({ orbs }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.getElapsedTime();
      groupRef.current.children.forEach((child, i) => {
        child.rotation.y = t * 3 + i;
        child.rotation.x = Math.sin(t * 2 + i) * 0.4;
      });
    }
  });

  return (
    <group ref={groupRef}>
      {orbs.map((orb) => {
        if (orb.collected) return null;
        const x = LANES[orb.lane + 1];
        return (
          <group key={orb.id} position={[x, 0.95, orb.z]}>
            {/* Core Energy Crystal */}
            <mesh>
              <octahedronGeometry args={[0.35, 0]} />
              <meshStandardMaterial
                color="#00E5FF"
                emissive="#00E5FF"
                emissiveIntensity={2.0}
                metalness={0.9}
                roughness={0.1}
              />
            </mesh>
            {/* Outer Orbital Ring */}
            <mesh rotation={[Math.PI / 4, 0, 0]}>
              <torusGeometry args={[0.55, 0.025, 8, 24]} />
              <meshBasicMaterial color="#38bdf8" />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// Neon Grid Highway with Moving Striped Runway
const InfiniteHighway: React.FC<{ speed: number; gameState: GameState }> = ({ speed, gameState }) => {
  const gridOffset = useRef(0);
  const meshRef = useRef<THREE.Mesh>(null);
  const pylonsRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gameState === 'PLAYING') {
      gridOffset.current = (gridOffset.current + speed * delta) % 6;
      if (meshRef.current) {
        meshRef.current.position.z = gridOffset.current;
      }
      if (pylonsRef.current) {
        pylonsRef.current.position.z = gridOffset.current;
      }
    }
  });

  return (
    <group>
      {/* Moving Track */}
      <mesh ref={meshRef} position={[0, -0.01, -40]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[7.8, 140, 1, 35]} />
        <meshStandardMaterial
          color="#050811"
          roughness={0.8}
          metalness={0.4}
        />
      </mesh>

      {/* Runway Border Neon Rails */}
      <mesh position={[-3.9, 0.08, -35]}>
        <boxGeometry args={[0.15, 0.16, 120]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>
      <mesh position={[3.9, 0.08, -35]}>
        <boxGeometry args={[0.15, 0.16, 120]} />
        <meshBasicMaterial color="#00E5FF" />
      </mesh>

      {/* Lane Separator Dashes */}
      <mesh position={[-LANE_WIDTH / 2, 0.01, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 120]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
      </mesh>
      <mesh position={[LANE_WIDTH / 2, 0.01, -35]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.06, 120]} />
        <meshBasicMaterial color="#0284c7" transparent opacity={0.4} />
      </mesh>

      {/* Cyber Pylons along roadside */}
      <group ref={pylonsRef}>
        {Array.from({ length: 14 }).map((_, i) => {
          const z = -i * 10;
          return (
            <group key={i}>
              <mesh position={[-4.8, 1.8, z]}>
                <cylinderGeometry args={[0.08, 0.12, 3.6, 6]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} />
              </mesh>
              <mesh position={[-4.8, 3.7, z]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color="#00E5FF" />
              </mesh>
              <mesh position={[4.8, 1.8, z]}>
                <cylinderGeometry args={[0.08, 0.12, 3.6, 6]} />
                <meshStandardMaterial color="#0f172a" metalness={0.9} />
              </mesh>
              <mesh position={[4.8, 3.7, z]}>
                <sphereGeometry args={[0.15, 8, 8]} />
                <meshBasicMaterial color="#38bdf8" />
              </mesh>
            </group>
          );
        })}
      </group>
    </group>
  );
};

// Particle Bursts on Collect and Crash
const ParticleExplosions: React.FC<{ particles: ParticleData[] }> = ({ particles }) => {
  return (
    <group>
      {particles.map((p, i) => (
        <mesh key={i} position={p.pos}>
          <boxGeometry args={[0.08, 0.08, 0.08]} />
          <meshBasicMaterial color={p.color} />
        </mesh>
      ))}
    </group>
  );
};

// Camera Management & Shakes
const DynamicCameraRig: React.FC<{
  gameState: GameState;
  shakeIntensity: number;
}> = ({ gameState, shakeIntensity }) => {
  const { camera } = useThree();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (gameState === 'MENU') {
      // Cinematic slow orbit around runner
      camera.position.x = Math.sin(t * 0.4) * 4.5;
      camera.position.y = 2.2 + Math.cos(t * 0.3) * 0.4;
      camera.position.z = 4.2 + Math.cos(t * 0.4) * 1.5;
      camera.lookAt(0, 0.8, -3);
    } else {
      // Third-person chase cam
      const shakeX = (Math.random() - 0.5) * shakeIntensity * 0.4;
      const shakeY = (Math.random() - 0.5) * shakeIntensity * 0.4;

      camera.position.x = THREE.MathUtils.lerp(camera.position.x, shakeX, 0.15);
      camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.8 + shakeY, 0.15);
      camera.position.z = THREE.MathUtils.lerp(camera.position.z, 5.0, 0.15);
      camera.lookAt(0, 0.8, -12);
    }
  });

  return null;
};

// Master 3D Game World Simulation
export const CyberRunnerCanvas: React.FC<CyberRunnerCanvasProps> = ({
  gameState,
  onGameOver,
  onScoreUpdate,
  controlsRef,
}) => {
  // Player state
  const [laneIndex, setLaneIndex] = useState(0); // -1: Left, 0: Center, 1: Right
  const [playerY, setPlayerY] = useState(0.5);
  const [isJumping, setIsJumping] = useState(false);
  const [isSliding, setIsSliding] = useState(false);

  // References for continuous physics loop
  const playerYRef = useRef(0.5);
  const velocityYRef = useRef(0);
  const isJumpingRef = useRef(false);
  const isSlidingRef = useRef(false);
  const laneIndexRef = useRef(0);
  const slideTimerRef = useRef(0);

  // Gameplay simulation state
  const speedRef = useRef(18);
  const distanceRef = useRef(0);
  const scoreRef = useRef(0);
  const energyCountRef = useRef(0);
  const multiplierRef = useRef(1);
  const shakeIntensityRef = useRef(0);
  const nextSpawnZRef = useRef(-25);
  const idCounterRef = useRef(1);

  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [orbs, setOrbs] = useState<OrbData[]>([]);
  const [particles, setParticles] = useState<ParticleData[]>([]);

  // Reset all game variables for a fresh run
  const resetGame = () => {
    setLaneIndex(0);
    laneIndexRef.current = 0;
    setPlayerY(0.5);
    playerYRef.current = 0.5;
    velocityYRef.current = 0;
    isJumpingRef.current = false;
    setIsJumping(false);
    isSlidingRef.current = false;
    setIsSliding(false);
    slideTimerRef.current = 0;

    speedRef.current = 18;
    distanceRef.current = 0;
    scoreRef.current = 0;
    energyCountRef.current = 0;
    multiplierRef.current = 1;
    shakeIntensityRef.current = 0;
    nextSpawnZRef.current = -25;

    // Seed initial obstacles and orbs
    const initialObs: ObstacleData[] = [];
    const initialOrbs: OrbData[] = [];

    for (let z = -25; z >= -100; z -= 18) {
      const emptyLane = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1 is ALWAYS free!
      const obstacleLanes = [-1, 0, 1].filter((l) => l !== emptyLane);
      const chosenLane = obstacleLanes[Math.floor(Math.random() * obstacleLanes.length)];

      const types: ('LOW_BARRIER' | 'LASER_GRID' | 'CYBER_MONOLITH')[] = [
        'LOW_BARRIER',
        'LASER_GRID',
        'CYBER_MONOLITH',
      ];
      const type = types[Math.floor(Math.random() * types.length)];

      initialObs.push({
        id: idCounterRef.current++,
        lane: chosenLane,
        z,
        type,
        passed: false,
      });

      // Place orbs in the open lane!
      initialOrbs.push({
        id: idCounterRef.current++,
        lane: emptyLane,
        z: z + 2,
        collected: false,
      });
    }

    setObstacles(initialObs);
    setOrbs(initialOrbs);
    setParticles([]);
  };

  // Bind controls to ref
  useEffect(() => {
    controlsRef.current = {
      moveLeft: () => {
        if (gameState !== 'PLAYING') return;
        if (laneIndexRef.current > -1) {
          laneIndexRef.current -= 1;
          setLaneIndex(laneIndexRef.current);
          soundManager.playLaneSwitch();
        }
      },
      moveRight: () => {
        if (gameState !== 'PLAYING') return;
        if (laneIndexRef.current < 1) {
          laneIndexRef.current += 1;
          setLaneIndex(laneIndexRef.current);
          soundManager.playLaneSwitch();
        }
      },
      jump: () => {
        if (gameState !== 'PLAYING') return;
        if (!isJumpingRef.current && playerYRef.current <= 0.55) {
          velocityYRef.current = 13.5;
          isJumpingRef.current = true;
          setIsJumping(true);
          soundManager.playJump();
        }
      },
      slide: () => {
        if (gameState !== 'PLAYING') return;
        isSlidingRef.current = true;
        setIsSliding(true);
        slideTimerRef.current = 0.65;
        // Fast pull down if in mid-air
        if (isJumpingRef.current) {
          velocityYRef.current = -18;
        }
        soundManager.playSlide();
      },
    };
  }, [gameState]);

  // Handle Game State Transitions
  useEffect(() => {
    if (gameState === 'COUNTDOWN' || gameState === 'PLAYING') {
      resetGame();
    }
  }, [gameState]);

  // Master Simulation Loop Component inside Canvas
  const SimulationRunner: React.FC = () => {
    useFrame((_, delta) => {
      // Clamp delta to prevent huge jumps on tab switch
      const dt = Math.min(delta, 0.05);

      if (gameState !== 'PLAYING') return;

      // 1. Move Track & Update Distance
      const moveDistance = speedRef.current * dt;
      distanceRef.current += moveDistance;
      // Gradual acceleration
      speedRef.current = Math.min(38, speedRef.current + dt * 0.25);

      // 2. Player Jump / Gravity Physics
      if (isJumpingRef.current || playerYRef.current > 0.5) {
        velocityYRef.current -= 36 * dt; // gravity
        playerYRef.current += velocityYRef.current * dt;

        if (playerYRef.current <= 0.5) {
          playerYRef.current = 0.5;
          velocityYRef.current = 0;
          isJumpingRef.current = false;
          setIsJumping(false);
        }
        setPlayerY(playerYRef.current);
      }

      // 3. Player Slide Timer
      if (isSlidingRef.current) {
        slideTimerRef.current -= dt;
        if (slideTimerRef.current <= 0) {
          isSlidingRef.current = false;
          setIsSliding(false);
        }
      }

      // Camera shake decay
      if (shakeIntensityRef.current > 0) {
        shakeIntensityRef.current = Math.max(0, shakeIntensityRef.current - dt * 2.5);
      }

      // 4. Update Obstacles & Check Collisions
      setObstacles((prevObs) => {
        const updated = prevObs.map((obs) => ({
          ...obs,
          z: obs.z + moveDistance,
        }));

        // Check Collisions
        for (const obs of updated) {
          // Bounding Box Proximity to Player (Player is at Z = 0)
          if (obs.z >= -0.8 && obs.z <= 0.8 && obs.lane === laneIndexRef.current) {
            let safe = false;

            if (obs.type === 'LOW_BARRIER' && playerYRef.current > 1.35) {
              safe = true; // Clean jump!
            } else if (obs.type === 'LASER_GRID' && isSlidingRef.current) {
              safe = true; // Clean duck/slide!
            }

            if (!safe) {
              // CRASH! Trigger Game Over
              soundManager.playCrash();
              shakeIntensityRef.current = 1.0;

              // Spawn crash explosion particles
              const burst: ParticleData[] = [];
              for (let i = 0; i < 24; i++) {
                burst.push({
                  pos: new THREE.Vector3(LANES[laneIndexRef.current + 1], playerYRef.current, 0),
                  vel: new THREE.Vector3(
                    (Math.random() - 0.5) * 12,
                    Math.random() * 8,
                    (Math.random() - 0.5) * 12
                  ),
                  color: Math.random() > 0.5 ? '#f43f5e' : '#00E5FF',
                  life: 0,
                  maxLife: 0.6,
                });
              }
              setParticles(burst);

              onGameOver({
                score: Math.floor(scoreRef.current),
                distance: Math.floor(distanceRef.current),
                energyOrbs: energyCountRef.current,
                multiplier: multiplierRef.current,
                speed: Math.floor(speedRef.current * 3.6),
                highScore: 0,
              });
              return updated;
            }
          }
        }

        // Recycle passed obstacles & spawn new ones
        const active = updated.filter((obs) => obs.z < 12);
        while (active.length < 7) {
          const minZ = active.reduce((min, o) => Math.min(min, o.z), -20);
          const newZ = minZ - (15 + Math.random() * 8);

          const emptyLane = Math.floor(Math.random() * 3) - 1;
          const obstacleLanes = [-1, 0, 1].filter((l) => l !== emptyLane);
          const chosenLane = obstacleLanes[Math.floor(Math.random() * obstacleLanes.length)];

          const types: ('LOW_BARRIER' | 'LASER_GRID' | 'CYBER_MONOLITH')[] = [
            'LOW_BARRIER',
            'LASER_GRID',
            'CYBER_MONOLITH',
          ];
          const type = types[Math.floor(Math.random() * types.length)];

          active.push({
            id: idCounterRef.current++,
            lane: chosenLane,
            z: newZ,
            type,
            passed: false,
          });
        }
        return active;
      });

      // 5. Update Orbs & Check Collections
      setOrbs((prevOrbs) => {
        const updated = prevOrbs.map((orb) => ({
          ...orb,
          z: orb.z + moveDistance,
        }));

        for (const orb of updated) {
          if (!orb.collected && orb.z >= -1.0 && orb.z <= 1.0 && orb.lane === laneIndexRef.current) {
            orb.collected = true;
            energyCountRef.current += 1;
            multiplierRef.current = Math.min(5, multiplierRef.current + 0.2);
            scoreRef.current += 150 * multiplierRef.current;
            soundManager.playCollect();

            // Burst particles
            const burst: ParticleData[] = [];
            for (let i = 0; i < 8; i++) {
              burst.push({
                pos: new THREE.Vector3(LANES[orb.lane + 1], 0.95, 0),
                vel: new THREE.Vector3(
                  (Math.random() - 0.5) * 5,
                  Math.random() * 4,
                  (Math.random() - 0.5) * 5
                ),
                color: '#00E5FF',
                life: 0,
                maxLife: 0.4,
              });
            }
            setParticles((p) => [...p, ...burst]);
          }
        }

        const activeOrbs = updated.filter((orb) => orb.z < 12);
        while (activeOrbs.length < 8) {
          const minZ = activeOrbs.reduce((min, o) => Math.min(min, o.z), -15);
          activeOrbs.push({
            id: idCounterRef.current++,
            lane: Math.floor(Math.random() * 3) - 1,
            z: minZ - (8 + Math.random() * 12),
            collected: false,
          });
        }
        return activeOrbs;
      });

      // 6. Update Particle Bursts
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            pos: p.pos.clone().add(p.vel.clone().multiplyScalar(dt)),
            life: p.life + dt,
          }))
          .filter((p) => p.life < p.maxLife)
      );

      // 7. Update Live Score & Dispatch to HUD
      scoreRef.current += dt * speedRef.current * 2;
      onScoreUpdate({
        score: Math.floor(scoreRef.current),
        distance: Math.floor(distanceRef.current),
        energyOrbs: energyCountRef.current,
        multiplier: parseFloat(multiplierRef.current.toFixed(1)),
        speed: Math.floor(speedRef.current * 3.6),
        highScore: 0,
      });
    });

    return null;
  };

  return (
    <Canvas
      camera={{ position: [0, 2.8, 5.0], fov: 60 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      className="w-full h-full select-none"
    >
      <color attach="background" args={['#04060b']} />
      <fog attach="fog" args={['#04060b', 25, 75]} />

      {/* Lighting */}
      <ambientLight intensity={0.45} color="#081026" />
      <directionalLight position={[5, 12, 6]} intensity={1.2} color="#ffffff" castShadow />
      <pointLight position={[0, 4, -4]} intensity={2.0} color="#00E5FF" distance={25} />
      <pointLight position={[0, 2, 4]} intensity={1.4} color="#3B82F6" distance={15} />

      {/* Camera Controller with Shakes */}
      <DynamicCameraRig gameState={gameState} shakeIntensity={shakeIntensityRef.current} />

      {/* 3D World Objects */}
      <InfiniteHighway speed={speedRef.current} gameState={gameState} />
      <PlayerShip
        laneIndex={laneIndex}
        isJumping={isJumping}
        isSliding={isSliding}
        playerY={playerY}
        gameState={gameState}
      />
      <ObstaclesRenderer obstacles={obstacles} />
      <OrbsRenderer orbs={orbs} />
      <ParticleExplosions particles={particles} />

      {/* Frame Loop Runner */}
      <SimulationRunner />
    </Canvas>
  );
};
