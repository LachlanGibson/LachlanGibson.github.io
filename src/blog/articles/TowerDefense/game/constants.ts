import type { EnemyType, TowerType } from "./types";

export const COLS = 22;
export const ROWS = 15;
export const START_COL = 0;
export const START_ROW = 7;
export const END_COL = 21;
export const END_ROW = 7;

export const STARTING_GOLD = 100;
export const STARTING_LIVES = 20;
export const BOSS_WAVE_INTERVAL = 20;
export const PROCEDURAL_WAVE_START_INDEX = 15; // 0-indexed; wave 16+ is procedural
export const WAVE_COMPLETE_DURATION = 8.0;
export const SELL_REFUND_RATE = 0.6;
export const NO_LEAK_BONUS = 25;
export const MAX_DELTA_TIME = 0.1;
export const FLASH_DURATION = 0.1; // seconds of white hit-flash on enemy
export const FLOAT_DURATION = 0.9; // seconds floating damage text lives
export const DEATH_PARTICLE_DURATION = 0.45; // seconds death ring expands
export const SPLASH_EFFECT_DURATION = 0.35; // seconds AoE blast expands

export interface EnemyStats {
  name: string;
  hp: number;
  speed: number;
  reward: number;
  radiusFraction: number; // radius as fraction of cellSize
  color: string;
  isFlyer: boolean;
  livesLost: number;
}

export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  critter: {
    name: "Critter",
    hp: 90,
    speed: 2.5,
    reward: 5,
    radiusFraction: 0.28,
    color: "#4ade80",
    isFlyer: false,
    livesLost: 1,
  },
  runner: {
    name: "Runner",
    hp: 45,
    speed: 5.0,
    reward: 4,
    radiusFraction: 0.22,
    color: "#facc15",
    isFlyer: false,
    livesLost: 1,
  },
  brute: {
    name: "Brute",
    hp: 600,
    speed: 1.2,
    reward: 12,
    radiusFraction: 0.4,
    color: "#f87171",
    isFlyer: false,
    livesLost: 1,
  },
  swarm: {
    name: "Swarm",
    hp: 22,
    speed: 3.0,
    reward: 2,
    radiusFraction: 0.18,
    color: "#fb923c",
    isFlyer: false,
    livesLost: 1,
  },
  splitter: {
    name: "Splitter",
    hp: 180,
    speed: 2.0,
    reward: 8,
    radiusFraction: 0.32,
    color: "#c084fc",
    isFlyer: false,
    livesLost: 1,
  },
  flyer: {
    name: "Flyer",
    hp: 75,
    speed: 3.5,
    reward: 7,
    radiusFraction: 0.26,
    color: "#38bdf8",
    isFlyer: true,
    livesLost: 1,
  },
  boss: {
    name: "Boss",
    hp: 3000,
    speed: 1.0,
    reward: 50,
    radiusFraction: 0.55,
    color: "#dc2626",
    isFlyer: false,
    livesLost: 5,
  },
};

export interface TowerStats {
  name: string;
  cost: number;
  damage: number;
  range: number; // cells
  fireRate: number; // shots per second
  projectileSpeed: number; // cells per second
  splashRadius: number; // cells
  primaryColor: string;
  accentColor: string;
  targetGround: boolean;
  targetAir: boolean;
}

export const TOWER_STATS: Record<TowerType, TowerStats> = {
  arrow: {
    name: "Arrow",
    cost: 10,
    damage: 8,
    range: 2.5,
    fireRate: 1.5,
    projectileSpeed: 16,
    splashRadius: 0,
    primaryColor: "#92400e",
    accentColor: "#fbbf24",
    targetGround: true,
    targetAir: true,
  },
  cannon: {
    name: "Cannon",
    cost: 100,
    damage: 60,
    range: 2.5,
    fireRate: 0.6,
    projectileSpeed: 12,
    splashRadius: 1.2,
    primaryColor: "#374151",
    accentColor: "#9ca3af",
    targetGround: true,
    targetAir: false,
  },
  slow: {
    name: "Slow",
    cost: 75,
    damage: 5,
    range: 3.0,
    fireRate: 1.0,
    projectileSpeed: 14,
    splashRadius: 0,
    primaryColor: "#1d4ed8",
    accentColor: "#93c5fd",
    targetGround: true,
    targetAir: false,
  },
  sniper: {
    name: "Sniper",
    cost: 125,
    damage: 120,
    range: 7.0,
    fireRate: 0.4,
    projectileSpeed: 22,
    splashRadius: 0,
    primaryColor: "#065f46",
    accentColor: "#6ee7b7",
    targetGround: true,
    targetAir: true,
  },
  antiair: {
    name: "Anti-Air",
    cost: 80,
    damage: 30,
    range: 4.0,
    fireRate: 2.5,
    projectileSpeed: 18,
    splashRadius: 0,
    primaryColor: "#4c1d95",
    accentColor: "#c4b5fd",
    targetGround: false,
    targetAir: true,
  },
};

export interface TowerUpgrade {
  cost: number;
  description: string;
  damageMult?: number;
  rangeDelta?: number;
  fireRateMult?: number;
  splashDelta?: number;
  /** slowStrength = slowFactor applied to enemy (0.5 = 50% speed). 0 = no slow. */
  slowStrength?: number;
  slowDuration?: number;
  critChance?: number;
  poisonDps?: number;
  poisonDuration?: number;
  aoeSlow?: boolean; // slow tower tier 2: apply to all in range (no projectile)
  applyChilled?: boolean; // slow tower tier 3: mark hit enemies as chilled
  piercingCount?: number; // -1 = unlimited, N = N targets
}

export const TOWER_UPGRADES: Record<TowerType, TowerUpgrade[]> = {
  arrow: [
    { cost: 50, description: "+60% dmg, +0.5 range", damageMult: 1.6, rangeDelta: 0.5 },
    { cost: 50, description: "Piercing (2 targets)", piercingCount: 2 },
    { cost: 50, description: "Poison: 10 dmg/s for 4s", poisonDps: 10, poisonDuration: 4.0 },
  ],
  cannon: [
    { cost: 100, description: "+40% dmg, +0.3 splash", damageMult: 1.4, splashDelta: 0.3 },
    { cost: 100, description: "+40% fire rate", fireRateMult: 1.4 },
    { cost: 100, description: "Slows targets 30% for 1.5s", slowStrength: 0.7, slowDuration: 1.5 },
  ],
  slow: [
    { cost: 75, description: "65% slow, +1s duration", slowStrength: 0.35, slowDuration: 3.0 },
    { cost: 75, description: "AoE: slows all in range", aoeSlow: true },
    { cost: 75, description: "Chilled: +20% dmg taken", applyChilled: true },
  ],
  sniper: [
    { cost: 125, description: "+50% dmg, +1.0 range", damageMult: 1.5, rangeDelta: 1.0 },
    { cost: 125, description: "Piercing: all in line", piercingCount: -1 },
    { cost: 125, description: "20% crit (3× dmg)", critChance: 0.2 },
  ],
  antiair: [
    { cost: 80, description: "+30% dmg, +0.5 range", damageMult: 1.3, rangeDelta: 0.5 },
    { cost: 80, description: "+30% fire rate", fireRateMult: 1.3 },
    { cost: 80, description: "Explosive splash (r=1)", splashDelta: 1.0 },
  ],
};
