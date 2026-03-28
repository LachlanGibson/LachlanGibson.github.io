import type { Tower, TowerType, Projectile, GameState } from './types';
import { TOWER_STATS, TOWER_UPGRADES, END_COL, END_ROW } from './constants';

export interface EffectiveStats {
  damage: number;
  range: number;
  fireRate: number;
  splashRadius: number;
  projectileSpeed: number;
  targetGround: boolean;
  targetAir: boolean;
  slowStrength: number;
  slowDuration: number;
  critChance: number;
  poisonDps: number;
  poisonDuration: number;
  aoeSlow: boolean;
  applyChilled: boolean;
  piercingCount: number;
}

export function getEffectiveStats(tower: Tower): EffectiveStats {
  const base = TOWER_STATS[tower.type];
  const upgrades = TOWER_UPGRADES[tower.type];

  let damage = base.damage;
  let range = base.range;
  let fireRate = base.fireRate;
  let splashRadius = base.splashRadius;
  // Slow tower base applies 50% slow (enemy moves at 50% speed) for 2s
  let slowStrength = tower.type === 'slow' ? 0.5 : 0;
  let slowDuration = tower.type === 'slow' ? 2.0 : 0;
  let critChance = 0;
  let poisonDps = 0;
  let poisonDuration = 0;
  let aoeSlow = false;
  let applyChilled = false;
  let piercingCount = 0;

  for (let i = 0; i < tower.tier && i < upgrades.length; i++) {
    const u = upgrades[i];
    if (u.damageMult !== undefined)    damage *= u.damageMult;
    if (u.rangeDelta !== undefined)    range += u.rangeDelta;
    if (u.fireRateMult !== undefined)  fireRate *= u.fireRateMult;
    if (u.splashDelta !== undefined)   splashRadius += u.splashDelta;
    if (u.slowStrength !== undefined)  slowStrength = u.slowStrength;
    if (u.slowDuration !== undefined)  slowDuration = u.slowDuration;
    if (u.critChance !== undefined)    critChance = u.critChance;
    if (u.poisonDps !== undefined)     poisonDps = u.poisonDps;
    if (u.poisonDuration !== undefined) poisonDuration = u.poisonDuration;
    if (u.aoeSlow)                     aoeSlow = true;
    if (u.applyChilled)                applyChilled = true;
    if (u.piercingCount !== undefined) piercingCount = u.piercingCount;
  }

  return {
    damage,
    range,
    fireRate,
    splashRadius,
    projectileSpeed: base.projectileSpeed,
    targetGround: base.targetGround,
    targetAir: base.targetAir,
    slowStrength,
    slowDuration,
    critChance,
    poisonDps,
    poisonDuration,
    aoeSlow,
    applyChilled,
    piercingCount,
  };
}

export function createTower(type: TowerType, col: number, row: number, id: string): Tower {
  return {
    id,
    type,
    col,
    row,
    tier: 0,
    totalCostSpent: TOWER_STATS[type].cost,
    cooldown: 0,
    targetEnemyId: null,
    angle: -Math.PI / 2, // default: pointing up
  };
}

export function upgradeTower(state: GameState, towerId: string): boolean {
  const tower = state.towers.find(t => t.id === towerId);
  if (!tower) return false;
  const upgrades = TOWER_UPGRADES[tower.type];
  if (tower.tier >= upgrades.length) return false;
  const cost = upgrades[tower.tier].cost;
  if (state.gold < cost) return false;
  state.gold -= cost;
  tower.totalCostSpent += cost;
  tower.tier++;
  return true;
}

export function updateTowers(
  state: GameState,
  dt: number,
  onFire: (proj: Projectile) => void,
): void {
  for (const tower of state.towers) {
    tower.cooldown = Math.max(0, tower.cooldown - dt);
    const stats = getEffectiveStats(tower);
    const tx = tower.col + 0.5, ty = tower.row + 0.5;
    const r2 = stats.range * stats.range;

    const eligible = state.enemies.filter(e => {
      if (!stats.targetGround && !e.isFlyer) return false;
      if (!stats.targetAir && e.isFlyer) return false;
      const dx = e.cellX - tx, dy = e.cellY - ty;
      return dx * dx + dy * dy <= r2;
    });

    if (eligible.length === 0) { tower.targetEnemyId = null; continue; }

    // AoE slow tower (tier 2+): directly apply slow to all in range, no projectile
    if (tower.type === 'slow' && stats.aoeSlow) {
      tower.targetEnemyId = eligible[0].id;
      tower.angle = Math.atan2(eligible[0].cellY - ty, eligible[0].cellX - tx);
      if (tower.cooldown <= 0) {
        tower.cooldown = 1 / stats.fireRate;
        for (const e of eligible) {
          e.slowFactor = Math.min(e.slowFactor, stats.slowStrength);
          e.slowTimer = Math.max(e.slowTimer, stats.slowDuration);
          if (stats.applyChilled) e.isChilled = true;
        }
      }
      continue;
    }

    // Targeting strategy
    let target = eligible[0];
    if (tower.type === 'sniper') {
      // Furthest along path for ground enemies; distance-to-end for flyers
      const ex = END_COL + 0.5, ey = END_ROW + 0.5;
      target = eligible.reduce((best, e) => {
        if (!e.isFlyer && !best.isFlyer) return e.waypointIndex > best.waypointIndex ? e : best;
        if (e.isFlyer && best.isFlyer) {
          const de = (e.cellX - ex) ** 2 + (e.cellY - ey) ** 2;
          const db = (best.cellX - ex) ** 2 + (best.cellY - ey) ** 2;
          return de < db ? e : best;
        }
        // Mixed: prefer ground (waypointIndex is meaningful)
        return e.isFlyer ? best : e;
      });
    } else if (tower.type === 'cannon') {
      const r2 = stats.splashRadius * stats.splashRadius;
      const splashCounts = new Map(eligible.map(e => [
        e.id,
        eligible.filter(o => {
          const dx = o.cellX - e.cellX, dy = o.cellY - e.cellY;
          return dx * dx + dy * dy <= r2;
        }).length,
      ]));
      target = eligible.reduce((best, e) =>
        (splashCounts.get(e.id) ?? 0) > (splashCounts.get(best.id) ?? 0) ? e : best
      );
    } else {
      target = eligible.reduce((best, e) => {
        const dx = e.cellX - tx, dy = e.cellY - ty;
        const bd = (best.cellX - tx) ** 2 + (best.cellY - ty) ** 2;
        return dx * dx + dy * dy < bd ? e : best;
      });
    }

    tower.targetEnemyId = target.id;
    tower.angle = Math.atan2(target.cellY - ty, target.cellX - tx);

    if (tower.cooldown <= 0) {
      tower.cooldown = 1 / stats.fireRate;

      // Straight-line direction for piercing projectiles
      let vx = 0, vy = 0;
      if (stats.piercingCount !== 0) {
        const dx = target.cellX - tx, dy = target.cellY - ty;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len > 0) { vx = dx / len; vy = dy / len; }
      }

      onFire({
        id: `p${state.nextId++}`,
        cellX: tx,
        cellY: ty,
        targetEnemyId: target.id,
        lastKnownTargetCellX: target.cellX,
        lastKnownTargetCellY: target.cellY,
        speed: stats.projectileSpeed,
        damage: stats.damage,
        splashRadius: stats.splashRadius,
        sourceType: tower.type,
        piercedEnemyIds: [],
        vx,
        vy,
        piercingCount: stats.piercingCount,
        slowStrength: stats.slowStrength,
        slowDuration: stats.slowDuration,
        critChance: stats.critChance,
        poisonDps: stats.poisonDps,
        poisonDuration: stats.poisonDuration,
        applyChilled: stats.applyChilled,
      });
    }
  }
}
