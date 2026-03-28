import type { GameState, Projectile } from './types';
import { COLS, ROWS } from './constants';

const HIT_RADIUS = 0.32; // cell units

export function updateProjectiles(
  state: GameState,
  dt: number,
  onHit: (proj: Projectile, enemyId: string, hx: number, hy: number) => void,
): void {
  const toRemove = new Set<string>();
  const enemyMap = new Map(state.enemies.map(e => [e.id, e]));

  for (const proj of state.projectiles) {
    if (toRemove.has(proj.id)) continue;

    const isPiercing = proj.piercingCount !== 0 && (proj.vx !== 0 || proj.vy !== 0);

    if (isPiercing) {
      // Straight-line piercing projectile
      proj.cellX += proj.vx * proj.speed * dt;
      proj.cellY += proj.vy * proj.speed * dt;

      // Remove when off-screen
      if (proj.cellX < -1 || proj.cellX > COLS + 1 || proj.cellY < -1 || proj.cellY > ROWS + 1) {
        toRemove.add(proj.id);
        continue;
      }

      // Check proximity to all enemies
      for (const enemy of state.enemies) {
        if (proj.piercedEnemyIds.includes(enemy.id)) continue;
        const dx = enemy.cellX - proj.cellX, dy = enemy.cellY - proj.cellY;
        if (dx * dx + dy * dy <= HIT_RADIUS * HIT_RADIUS) {
          proj.piercedEnemyIds.push(enemy.id);
          onHit(proj, enemy.id, proj.cellX, proj.cellY);
          if (proj.piercingCount > 0) {
            proj.piercingCount--;
            if (proj.piercingCount === 0) { toRemove.add(proj.id); break; }
          }
          // piercingCount === -1: unlimited, continue
        }
      }
    } else {
      // Homing projectile
      const target = enemyMap.get(proj.targetEnemyId);
      if (target) {
        proj.lastKnownTargetCellX = target.cellX;
        proj.lastKnownTargetCellY = target.cellY;
      }

      const dx = proj.lastKnownTargetCellX - proj.cellX;
      const dy = proj.lastKnownTargetCellY - proj.cellY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const move = proj.speed * dt;

      if (dist <= move || dist === 0) {
        proj.cellX = proj.lastKnownTargetCellX;
        proj.cellY = proj.lastKnownTargetCellY;
        if (!proj.piercedEnemyIds.includes(proj.targetEnemyId)) {
          onHit(proj, proj.targetEnemyId, proj.cellX, proj.cellY);
        }
        toRemove.add(proj.id);
      } else {
        proj.cellX += (dx / dist) * move;
        proj.cellY += (dy / dist) * move;
      }
    }
  }

  state.projectiles = state.projectiles.filter(p => !toRemove.has(p.id));
}
