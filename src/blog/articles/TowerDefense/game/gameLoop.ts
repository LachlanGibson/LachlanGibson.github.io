import type { GameState, Enemy } from './types';
import {
  TOTAL_WAVES, WAVE_COMPLETE_DURATION, NO_LEAK_BONUS, MAX_DELTA_TIME,
  FLASH_DURATION, FLOAT_DURATION, DEATH_PARTICLE_DURATION, SPLASH_EFFECT_DURATION,
  ENEMY_STATS, TOWER_STATS,
} from './constants';
import { updateEnemies, createEnemy } from './enemies';
import { updateTowers } from './towers';
import { updateProjectiles } from './projectiles';
import { buildSpawnQueue } from './waves';

export function startWave(state: GameState): void {
  if (state.phase !== 'preparing') return;
  if (state.wave >= TOTAL_WAVES) return;
  state.wave += 1;
  state.phase = 'wave-in-progress';
  state.hasLeakedThisWave = false;
  state.spawnQueue = buildSpawnQueue(state.wave - 1); // 0-indexed
}

export function update(state: GameState, dt: number, syncHUD: () => void): void {
  const safeDt = Math.min(dt, MAX_DELTA_TIME);

  if (state.phase === 'game-over' || state.phase === 'victory') return;

  // Always tick visual effects so they finish regardless of phase transition
  for (const ft of state.floatingTexts) ft.age += safeDt;
  state.floatingTexts = state.floatingTexts.filter(ft => ft.age < FLOAT_DURATION);
  for (const dp of state.deathParticles) dp.age += safeDt;
  state.deathParticles = state.deathParticles.filter(dp => dp.age < DEATH_PARTICLE_DURATION);
  for (const se of state.splashEffects) se.age += safeDt;
  state.splashEffects = state.splashEffects.filter(se => se.age < SPLASH_EFFECT_DURATION);

  if (state.phase === 'wave-complete') {
    state.waveTimer -= safeDt;
    if (state.waveTimer <= 0) {
      state.phase = state.wave >= TOTAL_WAVES ? 'victory' : 'preparing';
      syncHUD();
    }
    return;
  }

  if (state.phase === 'wave-in-progress') {
    // Advance spawn queue
    for (const entry of state.spawnQueue) entry.timeUntilSpawn -= safeDt;
    const toSpawn = state.spawnQueue.filter(e => e.timeUntilSpawn <= 0);
    state.spawnQueue = state.spawnQueue.filter(e => e.timeUntilSpawn > 0);
    for (const entry of toSpawn) {
      state.enemies.push(createEnemy(entry.type, state.path ? [...state.path] : null, `e${state.nextId++}`));
    }

    // Move enemies (also ticks poison in enemies.ts)
    updateEnemies(state, safeDt, (livesLost) => {
      state.lives = Math.max(0, state.lives - livesLost);
      state.hasLeakedThisWave = true;
      if (state.lives === 0) state.phase = 'game-over';
    });

    if (state.phase === 'game-over') { syncHUD(); return; }

    // Towers fire
    updateTowers(state, safeDt, (proj) => state.projectiles.push(proj));

    // Projectiles move and hit — only applies damage/effects, does not remove enemies
    updateProjectiles(state, safeDt, (proj, enemyId, hx, hy) => {
      const isCrit = proj.critChance > 0 && Math.random() < proj.critChance;
      const actualDamage = isCrit ? proj.damage * 3 : proj.damage;

      const applyHit = (e: Enemy, dmg: number, crit: boolean) => {
        const dealt = e.isChilled ? dmg * 1.2 : dmg;
        e.hp -= dealt;
        e.flashTimer = FLASH_DURATION;
        state.floatingTexts.push({
          id: `f${state.nextId++}`,
          cellX: e.cellX,
          cellY: e.cellY,
          value: Math.round(dealt),
          isCrit: crit,
          age: 0,
        });
      };

      if (proj.splashRadius > 0) {
        state.splashEffects.push({
          id: `s${state.nextId++}`,
          cellX: hx,
          cellY: hy,
          radius: proj.splashRadius,
          color: TOWER_STATS[proj.sourceType].accentColor,
          age: 0,
        });
        const r2 = proj.splashRadius * proj.splashRadius;
        for (const e of state.enemies) {
          const dx = e.cellX - hx, dy = e.cellY - hy;
          if (dx * dx + dy * dy <= r2) {
            applyHit(e, actualDamage, isCrit);
            if (proj.slowStrength > 0) {
              e.slowFactor = Math.min(e.slowFactor, proj.slowStrength);
              e.slowTimer = Math.max(e.slowTimer, proj.slowDuration);
              if (proj.applyChilled) e.isChilled = true;
            }
            if (proj.poisonDps > 0) {
              e.poisonDps = Math.max(e.poisonDps, proj.poisonDps);
              e.poisonTimer = Math.max(e.poisonTimer, proj.poisonDuration);
            }
          }
        }
      } else {
        const enemy = state.enemies.find(e => e.id === enemyId);
        if (enemy) {
          applyHit(enemy, actualDamage, isCrit);
          if (proj.slowStrength > 0) {
            enemy.slowFactor = Math.min(enemy.slowFactor, proj.slowStrength);
            enemy.slowTimer = Math.max(enemy.slowTimer, proj.slowDuration);
            if (proj.applyChilled) enemy.isChilled = true;
          }
          if (proj.poisonDps > 0) {
            enemy.poisonDps = Math.max(enemy.poisonDps, proj.poisonDps);
            enemy.poisonTimer = Math.max(enemy.poisonTimer, proj.poisonDuration);
          }
        }
      }
    });

    // Process dead enemies (from projectile damage and poison ticks)
    const dead = state.enemies.filter(e => e.hp <= 0);
    if (dead.length > 0) {
      const spawned: Enemy[] = [];
      for (const e of dead) {
        state.gold += e.reward;
        state.deathParticles.push({
          id: `d${state.nextId++}`,
          cellX: e.cellX,
          cellY: e.cellY,
          color: ENEMY_STATS[e.type].color,
          age: 0,
        });
        if (e.type === 'splitter' && state.path) {
          // Spawn 2 critters at the splitter's position
          for (let i = 0; i < 2; i++) {
            const child = createEnemy('critter', [...state.path], `e${state.nextId++}`);
            child.cellX = e.cellX;
            child.cellY = e.cellY;
            // Find the closest waypoint ahead
            const col = Math.round(e.cellX - 0.5);
            const row = Math.round(e.cellY - 0.5);
            let bestIdx = 0, bestDist = Infinity;
            for (let j = 0; j < state.path.length; j++) {
              const dx = state.path[j].col - col, dy = state.path[j].row - row;
              const d = dx * dx + dy * dy;
              if (d < bestDist) { bestDist = d; bestIdx = j; }
            }
            child.waypointIndex = Math.min(bestIdx + 1, state.path.length - 1);
            spawned.push(child);
          }
        }
      }
      state.enemies = [...state.enemies.filter(e => e.hp > 0), ...spawned];
      syncHUD();
    }

    // Wave complete when all enemies are gone and nothing left to spawn or fly
    if (state.spawnQueue.length === 0 && state.enemies.length === 0 && state.projectiles.length === 0) {
      if (!state.hasLeakedThisWave) state.gold += NO_LEAK_BONUS;
      state.phase = 'wave-complete';
      state.waveTimer = WAVE_COMPLETE_DURATION;
      syncHUD();
    }
  }
}
