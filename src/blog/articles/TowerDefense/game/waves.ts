import type { EnemyType } from './types';

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
  // Wave 15 — finale
  [
    { type: 'swarm',    count: 50, interval: 0.15, delay: 0 },
    { type: 'runner',   count: 25, interval: 0.28, delay: 4 },
    { type: 'splitter', count: 20, interval: 0.9,  delay: 8 },
    { type: 'brute',    count: 15, interval: 1.0,  delay: 12 },
    { type: 'flyer',    count: 20, interval: 0.4,  delay: 16 },
    { type: 'boss',     count: 3,  interval: 8,    delay: 20 },
  ],
];

export function buildSpawnQueue(waveIndex: number): { type: EnemyType; timeUntilSpawn: number }[] {
  const def = WAVE_DEFINITIONS[waveIndex];
  const queue: { type: EnemyType; timeUntilSpawn: number }[] = [];
  for (const group of def) {
    for (let i = 0; i < group.count; i++) {
      queue.push({ type: group.type, timeUntilSpawn: group.delay + i * group.interval });
    }
  }
  return queue.sort((a, b) => a.timeUntilSpawn - b.timeUntilSpawn);
}
