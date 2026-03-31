import type { GameState, Tower, Enemy, Projectile, Cell, TowerType, FloatingText, DeathParticle, SplashEffect } from './types';
import { COLS, ROWS, START_COL, START_ROW, END_COL, END_ROW, TOWER_STATS, ENEMY_STATS, FLOAT_DURATION, DEATH_PARTICLE_DURATION, SPLASH_EFFECT_DURATION } from './constants';
import { getEffectiveStats } from './towers';

export function renderGame(
  ctx: CanvasRenderingContext2D,
  state: GameState,
  cellSize: number,
  hoverCell: Cell | null,
  isHoverValid: boolean,
  selectedTowerType: TowerType | null,
  selectedTowerIds: ReadonlySet<string>,
  dragRect: { x1: number; y1: number; x2: number; y2: number } | null,
  isDark: boolean,
): void {
  ctx.clearRect(0, 0, COLS * cellSize, ROWS * cellSize);
  drawGrid(ctx, cellSize, isDark);
  drawPath(ctx, state.path, cellSize);
  drawStartEnd(ctx, cellSize);
  drawTowers(ctx, state.towers, cellSize, selectedTowerIds);
  drawEnemies(ctx, state.enemies, cellSize);
  drawProjectiles(ctx, state.projectiles, cellSize);
  drawSplashEffects(ctx, state.splashEffects, cellSize);
  drawDeathParticles(ctx, state.deathParticles, cellSize);
  drawFloatingTexts(ctx, state.floatingTexts, cellSize);
  if (hoverCell && selectedTowerType) {
    drawHoverGhost(ctx, hoverCell, cellSize, isHoverValid, selectedTowerType);
  } else if (hoverCell && !selectedTowerType) {
    // show range circle for hovered tower (unless it's already shown via selection)
    const tower = state.towers.find(t => t.col === hoverCell.col && t.row === hoverCell.row);
    if (tower && !selectedTowerIds.has(tower.id)) drawRangeCircle(ctx, tower, cellSize);
  }
  if (dragRect) drawDragRect(ctx, dragRect);
}

function drawGrid(ctx: CanvasRenderingContext2D, cellSize: number, isDark: boolean): void {
  ctx.fillStyle = isDark ? '#1a1a2e' : '#eef2f7';
  ctx.fillRect(0, 0, COLS * cellSize, ROWS * cellSize);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)';
  ctx.lineWidth = 0.5;
  for (let c = 0; c <= COLS; c++) {
    ctx.beginPath();
    ctx.moveTo(c * cellSize, 0);
    ctx.lineTo(c * cellSize, ROWS * cellSize);
    ctx.stroke();
  }
  for (let r = 0; r <= ROWS; r++) {
    ctx.beginPath();
    ctx.moveTo(0, r * cellSize);
    ctx.lineTo(COLS * cellSize, r * cellSize);
    ctx.stroke();
  }
}

function drawPath(ctx: CanvasRenderingContext2D, path: Cell[] | null, cellSize: number): void {
  if (!path || path.length < 2) return;
  ctx.save();
  ctx.strokeStyle = 'rgba(251,191,36,0.28)';
  ctx.lineWidth = cellSize * 0.55;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo((path[0].col + 0.5) * cellSize, (path[0].row + 0.5) * cellSize);
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo((path[i].col + 0.5) * cellSize, (path[i].row + 0.5) * cellSize);
  }
  ctx.stroke();
  ctx.restore();
}

function drawStartEnd(ctx: CanvasRenderingContext2D, cellSize: number): void {
  // Start cell — green tint + right-pointing arrow
  const sx = START_COL * cellSize, sy = START_ROW * cellSize;
  ctx.fillStyle = 'rgba(74,222,128,0.18)';
  ctx.fillRect(sx, sy, cellSize, cellSize);
  const scx = sx + cellSize / 2, scy = sy + cellSize / 2;
  ctx.fillStyle = '#4ade80';
  ctx.beginPath();
  ctx.moveTo(scx + cellSize * 0.28, scy);
  ctx.lineTo(scx - cellSize * 0.18, scy - cellSize * 0.22);
  ctx.lineTo(scx - cellSize * 0.18, scy + cellSize * 0.22);
  ctx.closePath();
  ctx.fill();

  // End cell — red tint + X
  const ex = END_COL * cellSize, ey = END_ROW * cellSize;
  ctx.fillStyle = 'rgba(248,113,113,0.18)';
  ctx.fillRect(ex, ey, cellSize, cellSize);
  const m = cellSize * 0.26;
  ctx.strokeStyle = '#f87171';
  ctx.lineWidth = cellSize * 0.1;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ex + m, ey + m); ctx.lineTo(ex + cellSize - m, ey + cellSize - m);
  ctx.moveTo(ex + cellSize - m, ey + m); ctx.lineTo(ex + m, ey + cellSize - m);
  ctx.stroke();
}

function drawTowerShape(ctx: CanvasRenderingContext2D, tower: Tower, cellSize: number): void {
  const stats = TOWER_STATS[tower.type];
  const cx = (tower.col + 0.5) * cellSize, cy = (tower.row + 0.5) * cellSize;
  const r = cellSize * 0.38;
  const tier = tower.tier;

  // Base circle
  ctx.fillStyle = stats.primaryColor;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Tier upgrade ring — grey → gold → bright white
  if (tier > 0) {
    const ringColor = tier === 1 ? '#9ca3af' : tier === 2 ? '#fbbf24' : '#e0e7ff';
    const ringWidth = tier === 1 ? 1.5 : tier === 2 ? 2.5 : 3.5;
    ctx.strokeStyle = ringColor;
    ctx.lineWidth = ringWidth;
    ctx.beginPath();
    ctx.arc(cx, cy, r + ringWidth, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Rotated barrel section — angle=0 means right (atan2 convention), +PI/2 rotates "up" to face target
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(tower.angle + Math.PI / 2);

  if (tower.type === 'arrow') {
    const barrelLen = r * (0.9 + tier * 0.06);
    ctx.strokeStyle = stats.accentColor;
    ctx.lineWidth = cellSize * (0.09 + tier * 0.015);
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, r * 0.2);
    ctx.lineTo(0, -barrelLen);
    ctx.stroke();
    // Tier 2: second offset barrel (piercing)
    if (tier >= 2) {
      ctx.lineWidth = cellSize * 0.06;
      ctx.globalAlpha = 0.75;
      ctx.beginPath();
      ctx.moveTo(r * 0.32, r * 0.1);
      ctx.lineTo(r * 0.32, -barrelLen * 0.85);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Centre dot
    ctx.fillStyle = stats.accentColor;
    ctx.beginPath();
    ctx.arc(0, 0, r * 0.30, 0, Math.PI * 2);
    ctx.fill();
    // Tier 3: poison dot at barrel tip
    if (tier >= 3) {
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(0, -barrelLen, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (tower.type === 'cannon') {
    const bw = cellSize * (0.13 + tier * 0.02);
    const bh = r * (0.88 + tier * 0.04);
    ctx.fillStyle = stats.accentColor;
    // Main barrel
    ctx.fillRect(-bw / 2, -bh, bw, bh * 0.9);
    // Tier 1+: collar near barrel base
    if (tier >= 1) {
      ctx.fillRect(-bw * 0.95, -bh * 0.28, bw * 1.9, bh * 0.14);
    }
    // Tier 2+: second collar higher up
    if (tier >= 2) {
      ctx.fillRect(-bw * 0.95, -bh * 0.52, bw * 1.9, bh * 0.11);
    }
    // Tier 3: muzzle cap
    if (tier >= 3) {
      ctx.beginPath();
      ctx.arc(0, -bh * 0.95, bw * 0.9, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (tower.type === 'slow') {
    ctx.strokeStyle = stats.accentColor;
    ctx.lineWidth = cellSize * 0.06;
    for (let i = 0; i < 3; i++) {
      const sr = r * 0.32 + i * r * (0.22 + tier * 0.02);
      ctx.beginPath();
      ctx.arc(0, 0, sr, 0, Math.PI * 2);
      ctx.stroke();
    }
    // Tier 2+: four directional spikes (AoE indicator), will visually rotate with target
    if (tier >= 2) {
      ctx.lineWidth = cellSize * 0.05;
      ctx.globalAlpha = 0.75;
      for (let i = 0; i < 4; i++) {
        const a = (i * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82);
        ctx.lineTo(Math.cos(a) * r * 1.12, Math.sin(a) * r * 1.12);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
    // Tier 3: icy centre fill (chill)
    if (tier >= 3) {
      ctx.fillStyle = '#bfdbfe';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.28, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (tower.type === 'sniper') {
    const barrelLen = r * (1.05 + tier * 0.08);
    const chY = -(barrelLen * 0.52);
    const chLen = r * (0.38 + tier * 0.04);
    ctx.strokeStyle = stats.accentColor;
    ctx.lineWidth = cellSize * 0.06;
    ctx.lineCap = 'round';
    // Barrel
    ctx.beginPath();
    ctx.moveTo(0, r * 0.2);
    ctx.lineTo(0, -barrelLen);
    ctx.stroke();
    // Primary crosshair
    ctx.lineWidth = cellSize * 0.05;
    ctx.beginPath();
    ctx.moveTo(-chLen, chY);
    ctx.lineTo(chLen, chY);
    ctx.stroke();
    // Tier 2+: second crosshair (piercing)
    if (tier >= 2) {
      ctx.globalAlpha = 0.55;
      ctx.beginPath();
      ctx.moveTo(-chLen * 0.65, chY + r * 0.22);
      ctx.lineTo(chLen * 0.65, chY + r * 0.22);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Tier 3: crit star — bright dot at crosshair centre
    if (tier >= 3) {
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, chY, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }

  } else if (tower.type === 'antiair') {
    const barrelLen = r * (0.85 + tier * 0.07);
    const spread = r * 0.18;
    ctx.strokeStyle = stats.accentColor;
    ctx.lineWidth = cellSize * 0.08;
    ctx.lineCap = 'round';
    // Two angled barrels
    ctx.beginPath();
    ctx.moveTo(-spread, 0);
    ctx.lineTo(-spread - r * 0.45, -barrelLen);
    ctx.moveTo(spread, 0);
    ctx.lineTo(spread + r * 0.45, -barrelLen);
    ctx.stroke();
    // Tier 2+: arc indicating rapid rotation
    if (tier >= 2) {
      ctx.lineWidth = cellSize * 0.045;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.62, -Math.PI * 0.78, -Math.PI * 0.22);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.62, Math.PI * 0.22, Math.PI * 0.78);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    // Tier 3: orange flash dots at barrel tips (explosive splash)
    if (tier >= 3) {
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.arc(-spread - r * 0.45, -barrelLen, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(spread + r * 0.45, -barrelLen, r * 0.13, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.restore();
}

function drawTowers(
  ctx: CanvasRenderingContext2D,
  towers: Tower[],
  cellSize: number,
  selectedTowerIds: ReadonlySet<string>,
): void {
  for (const tower of towers) {
    drawTowerShape(ctx, tower, cellSize);
    if (selectedTowerIds.has(tower.id)) {
      const cx = (tower.col + 0.5) * cellSize, cy = (tower.row + 0.5) * cellSize;
      ctx.strokeStyle = 'rgba(255,255,255,0.85)';
      ctx.lineWidth = cellSize * 0.06;
      ctx.beginPath();
      ctx.arc(cx, cy, cellSize * 0.44, 0, Math.PI * 2);
      ctx.stroke();
      // Range circle only for single selection to avoid visual noise
      if (selectedTowerIds.size === 1) drawRangeCircle(ctx, tower, cellSize);
    }
  }
}

function drawDragRect(
  ctx: CanvasRenderingContext2D,
  rect: { x1: number; y1: number; x2: number; y2: number },
): void {
  ctx.save();
  ctx.strokeStyle = 'rgba(100,180,255,0.8)';
  ctx.fillStyle = 'rgba(100,180,255,0.1)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.beginPath();
  ctx.rect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

export function drawRangeCircle(ctx: CanvasRenderingContext2D, tower: Tower, cellSize: number): void {
  const effectiveRange = getEffectiveStats(tower).range;
  const cx = (tower.col + 0.5) * cellSize, cy = (tower.row + 0.5) * cellSize;
  ctx.save();
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, effectiveRange * cellSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}

function drawEnemies(ctx: CanvasRenderingContext2D, enemies: Enemy[], cellSize: number): void {
  for (const enemy of enemies) {
    const stats = ENEMY_STATS[enemy.type];
    const px = enemy.cellX * cellSize, py = enemy.cellY * cellSize;
    const r = cellSize * stats.radiusFraction;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(px, py + r * 0.85, r * 0.7, r * 0.25, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = stats.color;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();

    // Outline
    ctx.strokeStyle = 'rgba(0,0,0,0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.stroke();

    // Hit flash
    if (enemy.flashTimer > 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.55)';
      ctx.beginPath();
      ctx.arc(px, py, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // HP bar
    const bw = r * 2.4, bh = Math.max(3, cellSize * 0.07);
    const bx = px - bw / 2, by = py - r - bh - 2;
    const hpFrac = enemy.hp / enemy.maxHp;
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(bx, by, bw, bh);
    ctx.fillStyle = hpFrac > 0.5 ? '#4ade80' : hpFrac > 0.25 ? '#fbbf24' : '#f87171';
    ctx.fillRect(bx, by, bw * hpFrac, bh);
  }
}

function drawProjectiles(ctx: CanvasRenderingContext2D, projectiles: Projectile[], cellSize: number): void {
  for (const proj of projectiles) {
    const px = proj.cellX * cellSize, py = proj.cellY * cellSize;
    // Color by source tower type
    const color = TOWER_STATS[proj.sourceType].accentColor;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(px, py, Math.max(2, cellSize * 0.07), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSplashEffects(ctx: CanvasRenderingContext2D, effects: SplashEffect[], cellSize: number): void {
  for (const e of effects) {
    const progress = e.age / SPLASH_EFFECT_DURATION;
    const px = e.cellX * cellSize, py = e.cellY * cellSize;
    const r = e.radius * cellSize;
    ctx.save();
    // Filled blast — fades and grows slightly
    const fillR = r * (0.7 + progress * 0.3);
    ctx.globalAlpha = (1 - progress) * 0.28;
    ctx.fillStyle = e.color;
    ctx.beginPath();
    ctx.arc(px, py, fillR, 0, Math.PI * 2);
    ctx.fill();
    // Crisp ring at the splash boundary
    ctx.globalAlpha = (1 - progress) * 0.75;
    ctx.strokeStyle = e.color;
    ctx.lineWidth = Math.max(1, cellSize * 0.1 * (1 - progress * 0.6));
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawDeathParticles(ctx: CanvasRenderingContext2D, particles: DeathParticle[], cellSize: number): void {
  for (const p of particles) {
    const progress = p.age / DEATH_PARTICLE_DURATION;
    const px = p.cellX * cellSize, py = p.cellY * cellSize;
    const r = (0.3 + progress * 0.55) * cellSize;
    ctx.save();
    ctx.globalAlpha = (1 - progress) * 0.7;
    ctx.strokeStyle = p.color;
    ctx.lineWidth = Math.max(1, cellSize * 0.07 * (1 - progress));
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawFloatingTexts(ctx: CanvasRenderingContext2D, texts: FloatingText[], cellSize: number): void {
  for (const ft of texts) {
    const progress = ft.age / FLOAT_DURATION;
    const px = ft.cellX * cellSize;
    const py = ft.cellY * cellSize - progress * cellSize * 1.4;
    const opacity = progress < 0.6 ? 1 : 1 - (progress - 0.6) / 0.4;
    const fontSize = ft.isCrit
      ? Math.round(cellSize * 0.52)
      : Math.round(cellSize * 0.38);
    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Shadow for legibility
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillText(String(ft.value), px + 1, py + 1);
    ctx.fillStyle = ft.isCrit ? '#fde047' : '#ffffff';
    ctx.fillText(String(ft.value), px, py);
    ctx.restore();
  }
}

function drawHoverGhost(
  ctx: CanvasRenderingContext2D,
  cell: Cell,
  cellSize: number,
  isValid: boolean,
  towerType: TowerType,
): void {
  const x = cell.col * cellSize, y = cell.row * cellSize;
  ctx.save();
  ctx.globalAlpha = 0.45;
  ctx.fillStyle = isValid ? '#4ade80' : '#f87171';
  ctx.fillRect(x, y, cellSize, cellSize);
  ctx.globalAlpha = 0.7;
  // Draw ghost tower shape
  const fakeTower = { id: '', type: towerType, col: cell.col, row: cell.row, tier: 0, totalCostSpent: 0, cooldown: 0, targetEnemyId: null, angle: -Math.PI / 2 };
  drawTowerShape(ctx, fakeTower, cellSize);
  ctx.restore();

  // Show range circle in ghost color
  ctx.save();
  const stats = TOWER_STATS[towerType];
  const cx = (cell.col + 0.5) * cellSize, cy = (cell.row + 0.5) * cellSize;
  ctx.strokeStyle = isValid ? 'rgba(74,222,128,0.4)' : 'rgba(248,113,113,0.4)';
  ctx.fillStyle = isValid ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)';
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(cx, cy, stats.range * cellSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
