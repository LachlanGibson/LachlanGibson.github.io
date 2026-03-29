import type { EnemyType, SpawnEntry } from './types';
import { BOSS_WAVE_INTERVAL, PROCEDURAL_WAVE_START_INDEX } from './constants';

export interface SpawnGroup {
  type: EnemyType;
  count: number;
  interval: number;   // seconds between spawns within this group
  delay: number;      // seconds after wave start before first spawn of this group
}

export type WaveDefinition = SpawnGroup[];

export const WAVE_DEFINITIONS: WaveDefinition[] = [
  // Wave 1 — tutorial
  [{ type: 'critter', count: 10, interval: 0.8, delay: 0 }],
  // Wave 2
  [{ type: 'critter', count: 18, interval: 0.65, delay: 0 }],
  // Wave 3
  [{ type: 'critter', count: 25, interval: 0.55, delay: 0 }],
  // Wave 4 — runners introduced
  [
    { type: 'critter', count: 20, interval: 0.6, delay: 0 },
    { type: 'runner',  count: 8,  interval: 0.4, delay: 4 },
  ],
  // Wave 5 — flyers introduced
  [
    { type: 'critter', count: 15, interval: 0.55, delay: 0 },
    { type: 'runner',  count: 10, interval: 0.35, delay: 3 },
    { type: 'flyer',   count: 6,  interval: 0.8,  delay: 6 },
  ],
  // Wave 6 — brutes introduced
  [
    { type: 'critter', count: 20, interval: 0.5,  delay: 0 },
    { type: 'brute',   count: 5,  interval: 2.0,  delay: 5 },
  ],
  // Wave 7
  [
    { type: 'runner',  count: 15, interval: 0.35, delay: 0 },
    { type: 'brute',   count: 8,  interval: 1.8,  delay: 2 },
    { type: 'flyer',   count: 8,  interval: 0.7,  delay: 8 },
  ],
  // Wave 8 — swarms introduced
  [
    { type: 'swarm',   count: 40, interval: 0.18, delay: 0 },
    { type: 'critter', count: 10, interval: 0.5,  delay: 6 },
  ],
  // Wave 9 — splitters introduced
  [
    { type: 'critter',  count: 20, interval: 0.5,  delay: 0 },
    { type: 'splitter', count: 5,  interval: 1.5,  delay: 4 },
    { type: 'runner',   count: 10, interval: 0.35, delay: 8 },
  ],
  // Wave 10 — first boss
  [
    { type: 'critter', count: 15, interval: 0.5,  delay: 0 },
    { type: 'runner',  count: 10, interval: 0.4,  delay: 3 },
    { type: 'flyer',   count: 8,  interval: 0.7,  delay: 6 },
    { type: 'boss',    count: 1,  interval: 1,    delay: 12 },
  ],
  // Wave 11
  [
    { type: 'swarm',   count: 30, interval: 0.18, delay: 0 },
    { type: 'brute',   count: 10, interval: 1.5,  delay: 5 },
    { type: 'flyer',   count: 10, interval: 0.6,  delay: 8 },
  ],
  // Wave 12
  [
    { type: 'splitter', count: 15, interval: 1.2,  delay: 0 },
    { type: 'runner',   count: 20, interval: 0.3,  delay: 3 },
    { type: 'brute',    count: 10, interval: 1.5,  delay: 10 },
  ],
  // Wave 13
  [
    { type: 'swarm',    count: 50, interval: 0.15, delay: 0 },
    { type: 'splitter', count: 15, interval: 1.0,  delay: 5 },
    { type: 'flyer',    count: 15, interval: 0.5,  delay: 10 },
  ],
  // Wave 14 — second boss
  [
    { type: 'brute',   count: 20, interval: 1.2,  delay: 0 },
    { type: 'runner',  count: 20, interval: 0.3,  delay: 4 },
    { type: 'flyer',   count: 20, interval: 0.4,  delay: 8 },
    { type: 'boss',    count: 1,  interval: 1,    delay: 15 },
  ],
  // Wave 15 — finale (last hardcoded)
  [
    { type: 'swarm',    count: 50, interval: 0.15, delay: 0 },
    { type: 'runner',   count: 25, interval: 0.28, delay: 4 },
    { type: 'splitter', count: 20, interval: 0.9,  delay: 8 },
    { type: 'brute',    count: 15, interval: 1.0,  delay: 12 },
    { type: 'flyer',    count: 20, interval: 0.4,  delay: 16 },
    { type: 'boss',     count: 3,  interval: 8,    delay: 20 },
  ],
];

// ---- Procedural wave generation ----

interface EnemyProcEntry {
  type: EnemyType;
  budgetCost: number;
  unlockWave: number; // 0-indexed wave index when this type becomes available
  weight: number;
  interval: number;   // spawn interval within group (seconds)
}

const ENEMY_PROC_POOL: EnemyProcEntry[] = [
  { type: 'critter',  budgetCost: 1,   unlockWave: 0,  weight: 3,   interval: 0.5  },
  { type: 'runner',   budgetCost: 1,   unlockWave: 3,  weight: 2.5, interval: 0.35 },
  { type: 'swarm',    budgetCost: 0.3, unlockWave: 7,  weight: 3,   interval: 0.15 },
  { type: 'flyer',    budgetCost: 1.5, unlockWave: 4,  weight: 2,   interval: 0.7  },
  { type: 'brute',    budgetCost: 5,   unlockWave: 5,  weight: 1.5, interval: 1.5  },
  { type: 'splitter', budgetCost: 2,   unlockWave: 8,  weight: 2,   interval: 1.0  },
];

function weightedSample(pool: EnemyProcEntry[]): EnemyProcEntry {
  const total = pool.reduce((s, e) => s + e.weight, 0);
  let r = Math.random() * total;
  for (const e of pool) {
    r -= e.weight;
    if (r <= 0) return e;
  }
  return pool[pool.length - 1];
}

function generateProceduralWave(waveIndex: number): SpawnEntry[] {
  const excess = waveIndex - PROCEDURAL_WAVE_START_INDEX; // 0 at first procedural wave
  const hpMultiplier  = Math.round((1 + excess * 0.15) * 100) / 100;
  const speedMultiplier = Math.round((1 + excess * 0.03) * 100) / 100;
  const isBossWave = (waveIndex + 1) % BOSS_WAVE_INTERVAL === 0;

  const totalBudget = 30 + excess * 6;
  const available = ENEMY_PROC_POOL.filter(e => e.unlockWave <= waveIndex);

  // Choose 2-4 distinct group types, weighted
  const numGroups = Math.min(available.length, 2 + Math.floor(excess / 4));
  const groups: EnemyProcEntry[] = [];
  const usedTypes = new Set<EnemyType>();
  for (let i = 0; i < numGroups; i++) {
    const eligible = available.filter(e => !usedTypes.has(e.type));
    if (eligible.length === 0) break;
    const chosen = weightedSample(eligible);
    groups.push(chosen);
    usedTypes.add(chosen.type);
  }

  // Distribute budget among groups proportional to weight
  const groupWeightTotal = groups.reduce((s, e) => s + e.weight, 0);
  const queue: SpawnEntry[] = [];
  let time = 0;

  for (const group of groups) {
    const groupBudget = (group.weight / groupWeightTotal) * totalBudget;
    const count = Math.max(1, Math.round(groupBudget / group.budgetCost));
    for (let i = 0; i < count; i++) {
      queue.push({ type: group.type, timeUntilSpawn: time + i * group.interval, hpMultiplier, speedMultiplier });
    }
    time += count * group.interval + 2.5; // gap between groups
  }

  if (isBossWave) {
    // Bosses scale more aggressively
    const bossHp = Math.round((hpMultiplier + excess * 0.25) * 100) / 100;
    queue.push({ type: 'boss', timeUntilSpawn: time, hpMultiplier: bossHp, speedMultiplier });
  }

  return queue.sort((a, b) => a.timeUntilSpawn - b.timeUntilSpawn);
}

export function buildSpawnQueue(waveIndex: number): SpawnEntry[] {
  if (waveIndex >= PROCEDURAL_WAVE_START_INDEX) {
    return generateProceduralWave(waveIndex);
  }
  const def = WAVE_DEFINITIONS[waveIndex];
  const queue: SpawnEntry[] = [];
  for (const group of def) {
    for (let i = 0; i < group.count; i++) {
      queue.push({
        type: group.type,
        timeUntilSpawn: group.delay + i * group.interval,
        hpMultiplier: 1,
        speedMultiplier: 1,
      });
    }
  }
  return queue.sort((a, b) => a.timeUntilSpawn - b.timeUntilSpawn);
}
