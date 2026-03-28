import type { Enemy, EnemyType, GameState, Cell } from './types';
import { ENEMY_STATS, END_COL, END_ROW, START_COL, START_ROW } from './constants';

export function createEnemy(
  type: EnemyType,
  waypoints: Cell[] | null,
  id: string,
): Enemy {
  const stats = ENEMY_STATS[type];
  return {
    id,
    type,
    cellX: START_COL + 0.5,
    cellY: START_ROW + 0.5,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: stats.speed,
    reward: stats.reward,
    waypoints,
    waypointIndex: 1,
    slowFactor: 1.0,
    slowTimer: 0,
    isFlyer: stats.isFlyer,
    livesLost: stats.livesLost,
    poisonDps: 0,
    poisonTimer: 0,
    isChilled: false,
    flashTimer: 0,
  };
}

export function updateEnemies(
  state: GameState,
  dt: number,
  onLeaked: (livesLost: number) => void,
): void {
  const toRemove = new Set<string>();

  for (const enemy of state.enemies) {
    if (enemy.flashTimer > 0) enemy.flashTimer = Math.max(0, enemy.flashTimer - dt);
    if (enemy.slowTimer > 0) {
      enemy.slowTimer = Math.max(0, enemy.slowTimer - dt);
      if (enemy.slowTimer === 0) {
        enemy.slowFactor = 1.0;
        enemy.isChilled = false;
      }
    }
    if (enemy.poisonTimer > 0) {
      enemy.hp -= enemy.poisonDps * dt;
      enemy.poisonTimer = Math.max(0, enemy.poisonTimer - dt);
      if (enemy.poisonTimer === 0) enemy.poisonDps = 0;
    }

    const dist = enemy.speed * enemy.slowFactor * dt;

    if (enemy.isFlyer || enemy.waypoints === null) {
      const tx = END_COL + 0.5, ty = END_ROW + 0.5;
      const dx = tx - enemy.cellX, dy = ty - enemy.cellY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= dist) {
        toRemove.add(enemy.id);
        onLeaked(enemy.livesLost);
      } else {
        enemy.cellX += (dx / d) * dist;
        enemy.cellY += (dy / d) * dist;
      }
      continue;
    }

    let remaining = dist;
    while (remaining > 0 && enemy.waypointIndex < enemy.waypoints.length) {
      const wp = enemy.waypoints[enemy.waypointIndex];
      const tx = wp.col + 0.5, ty = wp.row + 0.5;
      const dx = tx - enemy.cellX, dy = ty - enemy.cellY;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d <= remaining) {
        enemy.cellX = tx;
        enemy.cellY = ty;
        enemy.waypointIndex++;
        remaining -= d;
      } else {
        enemy.cellX += (dx / d) * remaining;
        enemy.cellY += (dy / d) * remaining;
        remaining = 0;
      }
    }
    if (enemy.waypointIndex >= enemy.waypoints.length) {
      toRemove.add(enemy.id);
      onLeaked(enemy.livesLost);
    }
  }

  state.enemies = state.enemies.filter(e => !toRemove.has(e.id));
}

/** Called when path changes mid-wave — reroutes all ground enemies onto the new global path. */
export function rerouteEnemies(enemies: Enemy[], newPath: Cell[]): void {
  for (const enemy of enemies) {
    if (enemy.isFlyer || !enemy.waypoints) continue;
    const col = Math.round(enemy.cellX - 0.5);
    const row = Math.round(enemy.cellY - 0.5);
    let bestIdx = 0, bestDist = Infinity;
    for (let i = 0; i < newPath.length; i++) {
      const dx = newPath[i].col - col, dy = newPath[i].row - row;
      const d = dx * dx + dy * dy;
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    enemy.waypoints = newPath;
    enemy.waypointIndex = Math.min(bestIdx + 1, newPath.length - 1);
  }
}
