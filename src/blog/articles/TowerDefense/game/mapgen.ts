import type { CellState } from './types';
import { COLS, ROWS } from './constants';
import { hasPath } from './pathfinding';

// ---- Seeded PRNG (mulberry32) ----

export function createRng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---- Water shape system ----

type ShapeCell = readonly [number, number];
type Shape = readonly ShapeCell[];

function normalizeShape(shape: Shape): Shape {
  const minC = Math.min(...shape.map(([c]) => c));
  const minR = Math.min(...shape.map(([, r]) => r));
  return shape.map(([c, r]) => [c - minC, r - minR] as const);
}

function rotate90(shape: Shape): Shape {
  // 90° CCW: [c, r] → [−r, c]
  return normalizeShape(shape.map(([c, r]) => [-r, c] as const));
}

function mirrorH(shape: Shape): Shape {
  return normalizeShape(shape.map(([c, r]) => [-c, r] as const));
}

function shapeKey(shape: Shape): string {
  return [...shape]
    .sort(([ac, ar], [bc, br]) => ac !== bc ? ac - bc : ar - br)
    .join(';');
}

function getOrientations(base: Shape): Shape[] {
  const result: Shape[] = [];
  const seen = new Set<string>();
  let s = normalizeShape(base);
  for (let rot = 0; rot < 4; rot++) {
    for (const candidate of [s, mirrorH(s)]) {
      const key = shapeKey(candidate);
      if (!seen.has(key)) { seen.add(key); result.push(candidate); }
    }
    s = rotate90(s);
  }
  return result;
}

// Eight base shapes — varied sizes (3–5 cells) to create lake/river formations
const BASE_SHAPES: Shape[] = [
  // 2×2 compact lake (4 cells)
  [[0,0],[1,0],[0,1],[1,1]],
  // 3-cell channel — 2 orientations: horizontal / vertical
  [[0,0],[1,0],[2,0]],
  // L-tetromino (4 cells) — 4 orientations
  [[0,0],[1,0],[2,0],[0,1]],
  // T-tetromino (4 cells) — 4 orientations
  [[0,0],[1,0],[2,0],[1,1]],
  // S-tetromino (4 cells) — 2 orientations
  [[1,0],[2,0],[0,1],[1,1]],
  // Plus cross (5 cells) — 1 orientation (symmetric)
  [[1,0],[0,1],[1,1],[2,1],[1,2]],
  // Long-L (5 cells) — 4 orientations
  [[0,0],[1,0],[2,0],[3,0],[3,1]],
  // Zigzag staircase (5 cells) — 2 orientations
  [[0,0],[1,0],[1,1],[2,1],[2,2]],
];

const ALL_ORIENTATIONS: Shape[][] = BASE_SHAPES.map(getOrientations);

export const WATER_GROUP_COUNT = 4;

/**
 * Randomly places `count` water shape groups on the grid using `rng`.
 * Each placement is validated to ensure a path still exists.
 * Modifies `grid` in place.
 */
export function generateWater(
  grid: CellState[][],
  rng: () => number,
  count: number,
): void {
  const MAX_ATTEMPTS = 500;
  let placed = 0;
  let attempts = 0;

  while (placed < count && attempts < MAX_ATTEMPTS) {
    attempts++;

    // Pick a random shape and one of its orientations
    const group = ALL_ORIENTATIONS[Math.floor(rng() * ALL_ORIENTATIONS.length)];
    const shape = group[Math.floor(rng() * group.length)];

    const maxC = Math.max(...shape.map(([c]) => c));
    const maxR = Math.max(...shape.map(([, r]) => r));

    // Random anchor so the entire shape fits within the grid
    const anchorC = Math.floor(rng() * (COLS - maxC));
    const anchorR = Math.floor(rng() * (ROWS - maxR));

    const cells = shape.map(([c, r]): [number, number] => [anchorC + c, anchorR + r]);

    // All cells must be currently empty (start/end/tower/water cells are excluded)
    if (!cells.every(([c, r]) => grid[c][r] === 'empty')) continue;

    // Place tentatively
    for (const [c, r] of cells) grid[c][r] = 'water';

    // Ensure a ground path still exists — revert if not
    if (!hasPath(grid)) {
      for (const [c, r] of cells) grid[c][r] = 'empty';
      continue;
    }

    placed++;
  }
}
