import { OperatorProfile, MissionResultPayload, ALL_ACHIEVEMENTS } from '../types';

const STORAGE_KEY = 'cyberops_operator_v1';

export const DEFAULT_OPERATOR: OperatorProfile = {
  codename: 'CIPHER-7',
  xp: 0,
  level: 1,
  score: 0,
  unlockedMissions: [1],
  completedMissions: [],
  missionScores: {},
  missionAttempts: {},
  achievements: [],
  soundEnabled: true,
  reducedMotion: false,
  hintsUsedTotal: 0,
  mistakesTotal: 0,
  createdAt: new Date().toISOString(),
  lastActiveAt: new Date().toISOString(),
};

/**
 * Calculates current level from total XP.
 * Level 1: 0-99 XP
 * Level 2: 100-399 XP
 * Level 3: 400-899 XP
 * Level 4: 900-1599 XP
 * Level 5: 1600-2499 XP
 * etc. Formula: L = Math.floor(Math.sqrt(xp / 100)) + 1
 */
export function calculateLevelFromXP(xp: number): number {
  if (xp <= 0) return 1;
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function getXPForNextLevel(currentLevel: number): { currentMinXP: number; nextLevelXP: number } {
  const currentMinXP = Math.pow(currentLevel - 1, 2) * 100;
  const nextLevelXP = Math.pow(currentLevel, 2) * 100;
  return { currentMinXP, nextLevelXP };
}

export function loadOperator(): OperatorProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_OPERATOR };

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return { ...DEFAULT_OPERATOR };

    // Validate and sanitize
    const sanitized: OperatorProfile = {
      codename: typeof parsed.codename === 'string' && parsed.codename.trim() ? parsed.codename.slice(0, 16) : 'CIPHER-7',
      xp: typeof parsed.xp === 'number' && parsed.xp >= 0 ? parsed.xp : 0,
      level: 1, // recalculated below
      score: typeof parsed.score === 'number' && parsed.score >= 0 ? parsed.score : 0,
      unlockedMissions: Array.isArray(parsed.unlockedMissions) && parsed.unlockedMissions.length > 0 ? parsed.unlockedMissions : [1],
      completedMissions: Array.isArray(parsed.completedMissions) ? parsed.completedMissions : [],
      missionScores: parsed.missionScores && typeof parsed.missionScores === 'object' ? parsed.missionScores : {},
      missionAttempts: parsed.missionAttempts && typeof parsed.missionAttempts === 'object' ? parsed.missionAttempts : {},
      achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
      soundEnabled: typeof parsed.soundEnabled === 'boolean' ? parsed.soundEnabled : true,
      reducedMotion: typeof parsed.reducedMotion === 'boolean' ? parsed.reducedMotion : false,
      hintsUsedTotal: typeof parsed.hintsUsedTotal === 'number' ? parsed.hintsUsedTotal : 0,
      mistakesTotal: typeof parsed.mistakesTotal === 'number' ? parsed.mistakesTotal : 0,
      createdAt: parsed.createdAt || new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };

    sanitized.level = calculateLevelFromXP(sanitized.xp);
    return sanitized;
  } catch (e) {
    console.warn('[CYBER OPS] Corrupted storage reset to default:', e);
    return { ...DEFAULT_OPERATOR };
  }
}

export function saveOperator(profile: OperatorProfile): void {
  try {
    profile.lastActiveAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('[CYBER OPS] Failed to save profile:', e);
  }
}

export function resetOperatorProgress(): OperatorProfile {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
  return { ...DEFAULT_OPERATOR, createdAt: new Date().toISOString() };
}

export function awardMissionCompletion(
  prev: OperatorProfile,
  result: MissionResultPayload
): {
  profile: OperatorProfile;
  leveledUp: boolean;
  unlockedAchievements: string[];
} {
  const newXp = prev.xp + result.xpEarned;
  const newLevel = calculateLevelFromXP(newXp);
  const leveledUp = newLevel > prev.level;

  const prevBestScore = prev.missionScores[result.missionId] || 0;
  const newBestScore = Math.max(prevBestScore, result.scoreEarned);

  // Score increases by the delta of improvement or new score
  const scoreDelta = Math.max(0, result.scoreEarned - prevBestScore);
  const totalScore = prev.score + (prevBestScore > 0 ? scoreDelta : result.scoreEarned);

  const completed = new Set(prev.completedMissions);
  completed.add(result.missionId);

  const unlocked = new Set(prev.unlockedMissions);
  if (result.missionId < 7) {
    unlocked.add(result.missionId + 1);
  }

  // Check achievements
  const currentAchievements = new Set(prev.achievements);
  const newlyUnlocked: string[] = [];

  const triggerAchievement = (id: string) => {
    if (!currentAchievements.has(id)) {
      currentAchievements.add(id);
      newlyUnlocked.push(id);
    }
  };

  // 1. First contact
  if (result.missionId === 1 && result.passed) {
    triggerAchievement('first_contact');
  }

  // 2. Cipher specialist
  if (result.missionId === 2 && result.passed && result.hintsUsed === 0) {
    triggerAchievement('cipher_specialist');
  }

  // 3. Silent analyst
  if (result.missionId === 3 && result.passed && result.mistakes === 0) {
    triggerAchievement('silent_analyst');
  }

  // 4. Bug hunter
  if (result.missionId === 4 && result.passed && result.mistakes === 0) {
    triggerAchievement('bug_hunter');
  }

  // 5. Logic architect
  if (result.missionId === 5 && result.passed && result.hintsUsed === 0) {
    triggerAchievement('logic_architect');
  }

  // 6. Network sentinel
  if (result.missionId === 6 && result.passed) {
    triggerAchievement('network_sentinel');
  }

  // 7. Elite operator
  if (result.missionId === 7 && result.passed) {
    triggerAchievement('elite_operator');
  }

  // 8. Flawless run
  if (result.passed && result.hintsUsed === 0 && result.mistakes === 0) {
    triggerAchievement('perfect_run');
  }

  const updated: OperatorProfile = {
    ...prev,
    xp: newXp,
    level: newLevel,
    score: totalScore,
    completedMissions: Array.from(completed),
    unlockedMissions: Array.from(unlocked),
    missionScores: {
      ...prev.missionScores,
      [result.missionId]: newBestScore,
    },
    missionAttempts: {
      ...prev.missionAttempts,
      [result.missionId]: (prev.missionAttempts[result.missionId] || 0) + 1,
    },
    achievements: Array.from(currentAchievements),
    hintsUsedTotal: prev.hintsUsedTotal + result.hintsUsed,
    mistakesTotal: prev.mistakesTotal + result.mistakes,
  };

  saveOperator(updated);

  return {
    profile: updated,
    leveledUp,
    unlockedAchievements: newlyUnlocked,
  };
}
