// Level system utilities
export const XP_THRESHOLDS = [
  0,     // Level 1: 0-100
  101,   // Level 2
  251,   // Level 3
  451,   // Level 4
  701,   // Level 5
  1001,  // Level 6
  1351,  // Level 7
  1751,  // Level 8
  2201,  // Level 9
  2701,  // Level 10
  3251,  // Level 11
  3851,  // Level 12
  4501,  // Level 13
  5201,  // Level 14
  5951,  // Level 15
  6751,  // Level 16
  7601,  // Level 17
  8501,  // Level 18
  9451,  // Level 19
  10451, // Level 20
];

export const calculateLevel = (xp: number): number => {
  for (let i = XP_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= XP_THRESHOLDS[i]) {
      return i + 1;
    }
  }
  return 1;
};

export const getXPForNextLevel = (currentLevel: number): number => {
  if (currentLevel >= 20) return XP_THRESHOLDS[19];
  return XP_THRESHOLDS[currentLevel];
};

export const getXPForCurrentLevel = (currentLevel: number): number => {
  if (currentLevel <= 1) return 0;
  return XP_THRESHOLDS[currentLevel - 2];
};

export const getLevelTitle = (level: number): string => {
  if (level <= 3) return "Novice";
  if (level <= 7) return "Explorer";
  if (level <= 12) return "Champion";
  if (level <= 16) return "Master";
  return "Legend";
};
