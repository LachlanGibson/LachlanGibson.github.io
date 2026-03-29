import React, { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "../../../theme/useTheme";
import {
  COLS,
  ROWS,
  STARTING_GOLD,
  STARTING_LIVES,
  BOSS_WAVE_INTERVAL,
  PROCEDURAL_WAVE_START_INDEX,
  TOWER_STATS,
  TOWER_UPGRADES,
  SELL_REFUND_RATE,
  START_COL,
  START_ROW,
  END_COL,
  END_ROW,
} from "./game/constants";
import { findPath, hasPath } from "./game/pathfinding";
import { createTower, upgradeTower } from "./game/towers";
import { rerouteEnemies } from "./game/enemies";
import { startWave, update } from "./game/gameLoop";
import { renderGame } from "./game/renderer";
import type { GameState, GamePhase, TowerType, Tower, Cell, CellState } from "./game/types";

function createInitialState(): GameState {
  const grid: CellState[][] = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => "empty" as CellState),
  );
  grid[START_COL][START_ROW] = "start";
  grid[END_COL][END_ROW] = "end";
  return {
    grid,
    towers: [],
    enemies: [],
    projectiles: [],
    floatingTexts: [],
    deathParticles: [],
    splashEffects: [],
    path: findPath(grid),
    gold: STARTING_GOLD,
    lives: STARTING_LIVES,
    wave: 0,
    phase: "preparing",
    waveTimer: 0,
    spawnQueue: [],
    hasLeakedThisWave: false,
    nextId: 0,
  };
}

const TOWER_ORDER: TowerType[] = ["arrow", "cannon", "slow", "sniper", "antiair"];
const ENABLED_TOWERS = new Set<TowerType>(["arrow", "cannon", "slow", "sniper", "antiair"]);

const GameTowerDefense: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const cellSizeRef = useRef<number>(36);
  const hoverCellRef = useRef<Cell | null>(null);
  const isHoverValidRef = useRef<boolean>(false);
  const selectedTowerTypeRef = useRef<TowerType | null>("arrow");
  const inspectedTowerIdRef = useRef<string | null>(null);
  const isDarkRef = useRef<boolean>(isDark);
  const speedMultiplierRef = useRef<number>(1);

  const [gold, setGold] = useState(STARTING_GOLD);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("preparing");
  const [pathLength, setPathLength] = useState(() => {
    const p = stateRef.current.path;
    return p ? p.length - 1 : 0;
  });
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>("arrow");
  const [inspectedTower, setInspectedTower] = useState<Tower | null>(null);
  const [speed, setSpeed] = useState(1);
  const [countdown, setCountdown] = useState(0);

  // Keep isDark ref in sync
  useEffect(() => {
    isDarkRef.current = isDark;
  }, [isDark]);

  const computeHoverValidity = useCallback((col: number, row: number) => {
    const state = stateRef.current;
    const selType = selectedTowerTypeRef.current;
    if (!selType || state.grid[col][row] !== "empty") {
      isHoverValidRef.current = false;
      return;
    }
    const testGrid = state.grid.map((c) => [...c]);
    testGrid[col][row] = "tower";
    isHoverValidRef.current = hasPath(testGrid);
  }, []);

  const handleSelectTowerType = useCallback(
    (type: TowerType | null) => {
      selectedTowerTypeRef.current = type;
      setSelectedTowerType(type);
      if (type !== null) {
        // Deselect any inspected tower
        inspectedTowerIdRef.current = null;
        setInspectedTower(null);
        // Recompute hover validity for current hover cell
        if (hoverCellRef.current) {
          computeHoverValidity(hoverCellRef.current.col, hoverCellRef.current.row);
        }
      }
    },
    [computeHoverValidity],
  );

  const handleToggleSpeed = useCallback(() => {
    const next = speedMultiplierRef.current === 1 ? 2 : 1;
    speedMultiplierRef.current = next;
    setSpeed(next);
  }, []);

  const handleUpgradeTower = useCallback((towerId: string) => {
    const success = upgradeTower(stateRef.current, towerId);
    if (success) {
      const tower = stateRef.current.towers.find((t) => t.id === towerId) ?? null;
      setInspectedTower(tower ? { ...tower } : null);
      setGold(stateRef.current.gold);
    }
  }, []);

  const handleSellTower = useCallback(
    (towerId: string) => {
      const state = stateRef.current;
      if (state.phase === "game-over") return;
      const idx = state.towers.findIndex((t) => t.id === towerId);
      if (idx === -1) return;
      const tower = state.towers[idx];
      const refund = Math.floor(tower.totalCostSpent * SELL_REFUND_RATE);
      state.towers.splice(idx, 1);
      state.grid[tower.col][tower.row] = "empty";
      state.gold += refund;
      const newPath = findPath(state.grid);
      if (newPath) {
        state.path = newPath;
        rerouteEnemies(state.enemies, newPath);
        setPathLength(newPath.length - 1);
      }
      if (inspectedTowerIdRef.current === towerId) {
        inspectedTowerIdRef.current = null;
        setInspectedTower(null);
      }
      setGold(state.gold);
      // Recompute hover validity
      if (hoverCellRef.current) {
        computeHoverValidity(hoverCellRef.current.col, hoverCellRef.current.row);
      }
    },
    [computeHoverValidity],
  );

  useEffect(() => {
    const canvas = canvasRef.current!;
    const container = containerRef.current!;

    // --- Resize ---
    const handleResize = () => {
      const w = container.clientWidth;
      const cs = Math.max(24, Math.floor(w / COLS));
      cellSizeRef.current = cs;
      canvas.width = cs * COLS;
      canvas.height = cs * ROWS;
    };
    handleResize();
    const ro = new ResizeObserver(handleResize);
    ro.observe(container);

    // --- Input ---
    const getCell = (e: MouseEvent): Cell | null => {
      const rect = canvas.getBoundingClientRect();
      const cs = cellSizeRef.current;
      const col = Math.floor((e.clientX - rect.left) / cs);
      const row = Math.floor((e.clientY - rect.top) / cs);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
      return { col, row };
    };

    const onMouseMove = (e: MouseEvent) => {
      const cell = getCell(e);
      hoverCellRef.current = cell;
      if (cell) computeHoverValidity(cell.col, cell.row);
      else isHoverValidRef.current = false;
    };

    const onMouseLeave = () => {
      hoverCellRef.current = null;
      isHoverValidRef.current = false;
    };

    const handleCellClick = (cell: Cell) => {
      const state = stateRef.current;
      const { col, row } = cell;
      const cellState = state.grid[col][row];
      const selType = selectedTowerTypeRef.current;

      if (cellState === "tower") {
        // Inspect
        const tower = state.towers.find((t) => t.col === col && t.row === row) ?? null;
        inspectedTowerIdRef.current = tower?.id ?? null;
        setInspectedTower(tower);
        selectedTowerTypeRef.current = null;
        setSelectedTowerType(null);
        return;
      }

      if (cellState === "empty" && !selType) {
        // Deselect inspected tower when clicking empty space
        inspectedTowerIdRef.current = null;
        setInspectedTower(null);
        return;
      }

      if (!selType || cellState !== "empty") return;
      if (state.phase === "game-over") return;
      const stats = TOWER_STATS[selType];
      if (state.gold < stats.cost) return;

      // Path check
      const testGrid = state.grid.map((c) => [...c]);
      testGrid[col][row] = "tower";
      if (!hasPath(testGrid)) return;

      // Place tower
      const tower = createTower(selType, col, row, `t${state.nextId++}`);
      state.grid[col][row] = "tower";
      state.towers.push(tower);
      state.gold -= stats.cost;
      const newPath = findPath(state.grid);
      if (newPath) {
        state.path = newPath;
        rerouteEnemies(state.enemies, newPath);
        setPathLength(newPath.length - 1);
      }

      setGold(state.gold);
      computeHoverValidity(col, row);
    };

    const onClick = (e: MouseEvent) => {
      const cell = getCell(e);
      if (cell) handleCellClick(cell);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const cell = getCell(e);
      if (!cell) return;
      const tower = stateRef.current.towers.find((t) => t.col === cell.col && t.row === cell.row);
      if (tower) {
        handleSellTower(tower.id);
      } else {
        // Deselect tower type and inspected tower when right-clicking empty space
        selectedTowerTypeRef.current = null;
        setSelectedTowerType(null);
        inspectedTowerIdRef.current = null;
        setInspectedTower(null);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        selectedTowerTypeRef.current = null;
        setSelectedTowerType(null);
        inspectedTowerIdRef.current = null;
        setInspectedTower(null);
      }
      if (e.key === " ") {
        e.preventDefault();
        const { phase: p } = stateRef.current;
        if (p === "preparing" || p === "wave-in-progress" || p === "wave-complete") {
          startWave(stateRef.current);
          setPhase(stateRef.current.phase);
          setWave(stateRef.current.wave);
        }
      }
      if (e.key === "f" || e.key === "F") {
        handleToggleSpeed();
      }
    };

    // --- Touch support ---
    const getTouchCell = (touch: Touch): Cell | null => {
      const rect = canvas.getBoundingClientRect();
      const cs = cellSizeRef.current;
      const col = Math.floor((touch.clientX - rect.left) / cs);
      const row = Math.floor((touch.clientY - rect.top) / cs);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
      return { col, row };
    };

    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let touchHasMoved = false;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      touchHasMoved = false;
      const touch = e.touches[0];
      const cell = getTouchCell(touch);
      hoverCellRef.current = cell;
      if (cell) computeHoverValidity(cell.col, cell.row);
      else isHoverValidRef.current = false;

      if (cell) {
        longPressTimer = setTimeout(() => {
          longPressTimer = null;
          if (!touchHasMoved) {
            const tower = stateRef.current.towers.find((t) => t.col === cell.col && t.row === cell.row);
            if (tower) handleSellTower(tower.id);
          }
        }, 500);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      touchHasMoved = true;
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      const touch = e.touches[0];
      const cell = getTouchCell(touch);
      hoverCellRef.current = cell;
      if (cell) computeHoverValidity(cell.col, cell.row);
      else isHoverValidRef.current = false;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      if (longPressTimer) {
        clearTimeout(longPressTimer);
        longPressTimer = null;
      }
      if (!touchHasMoved) {
        const touch = e.changedTouches[0];
        const cell = getTouchCell(touch);
        if (cell) handleCellClick(cell);
      }
      hoverCellRef.current = null;
      isHoverValidRef.current = false;
    };

    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);

    // --- Game loop ---
    let rafId: number;
    let lastTime = 0;

    const syncHUD = () => {
      const s = stateRef.current;
      setGold(s.gold);
      setLives(s.lives);
      setWave(s.wave);
      setPhase(s.phase);
      setCountdown(Math.ceil(s.waveTimer));
      // Sync inspected tower in case HP changed etc.
      if (inspectedTowerIdRef.current) {
        const t = s.towers.find((t) => t.id === inspectedTowerIdRef.current) ?? null;
        setInspectedTower(t);
        if (!t) inspectedTowerIdRef.current = null;
      }
    };

    const loop = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      update(stateRef.current, dt * speedMultiplierRef.current, syncHUD);

      const ctx = canvas.getContext("2d");
      if (ctx && cellSizeRef.current > 0) {
        renderGame(
          ctx,
          stateRef.current,
          cellSizeRef.current,
          hoverCellRef.current,
          isHoverValidRef.current,
          selectedTowerTypeRef.current,
          inspectedTowerIdRef.current,
          isDarkRef.current,
        );
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      if (longPressTimer) clearTimeout(longPressTimer);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartWave = useCallback(() => {
    startWave(stateRef.current);
    setPhase(stateRef.current.phase);
    setWave(stateRef.current.wave);
  }, []);

  const handleRestart = useCallback(() => {
    stateRef.current = createInitialState();
    selectedTowerTypeRef.current = "arrow";
    inspectedTowerIdRef.current = null;
    hoverCellRef.current = null;
    isHoverValidRef.current = false;
    setGold(STARTING_GOLD);
    setLives(STARTING_LIVES);
    setWave(0);
    setPhase("preparing");
    setSelectedTowerType("arrow");
    setInspectedTower(null);
    speedMultiplierRef.current = 1;
    setSpeed(1);
    setCountdown(0);
    const p = stateRef.current.path;
    setPathLength(p ? p.length - 1 : 0);
  }, []);

  const canPlace = phase === "preparing" || phase === "wave-in-progress" || phase === "wave-complete";
  const sellValue = inspectedTower ? Math.floor(inspectedTower.totalCostSpent * SELL_REFUND_RATE) : 0;
  const nextWaveNum = wave + 1;
  const nextWaveIsBoss =
    nextWaveNum > PROCEDURAL_WAVE_START_INDEX && nextWaveNum % BOSS_WAVE_INTERVAL === 0;

  return (
    <div className="my-4 select-none">
      {/* Top HUD */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-t border border-b-0 border-(--site-border) bg-(--site-bg-secondary) px-3 py-2 text-sm font-medium text-(--site-text)">
        <div className="flex items-center gap-4 tabular-nums">
          <span className="flex items-center gap-1">
            <span className="text-red-400">♥</span>
            <span className="inline-block min-w-[2ch] text-right">{lives}</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-yellow-400">$</span>
            <span className="inline-block min-w-[4ch] text-right">{gold}</span>
          </span>
          <span className="text-(--site-text-muted)">
            Wave{" "}
            <span className="inline-block min-w-[3ch] text-left tabular-nums">
              {wave}
            </span>
          </span>
          <span className="text-(--site-text-muted)">
            Path: <span className="inline-block min-w-[2ch]">{pathLength}</span> cells
          </span>
        </div>
        {/* Right side: always min-height of a button so the bar never shrinks */}
        <div className="flex min-h-6.5 items-center gap-2">
          {(phase === "wave-in-progress" || phase === "wave-complete") && (
            <button
              onClick={handleToggleSpeed}
              title="Toggle speed (F)"
              className={[
                "rounded border px-2 py-1 text-xs font-semibold transition-colors",
                speed === 2
                  ? "border-yellow-400 bg-yellow-400/15 text-yellow-400"
                  : "border-(--site-border) text-(--site-text-muted) hover:border-yellow-400/60",
              ].join(" ")}
            >
              ▶▶ 2×
            </button>
          )}
          {phase === "wave-in-progress" && (
            <button
              onClick={handleStartWave}
              title="Send next wave now (Space)"
              className={[
                "rounded px-3 py-1 text-xs font-semibold text-white",
                nextWaveIsBoss
                  ? "bg-red-700 hover:bg-red-600 active:bg-red-800"
                  : "bg-green-700 hover:bg-green-600 active:bg-green-800",
              ].join(" ")}
            >
              {nextWaveIsBoss ? "⚠ Boss Wave" : `Send Wave ${nextWaveNum}`}
            </button>
          )}
          {phase === "preparing" && (
            <button
              onClick={handleStartWave}
              className="rounded bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-500 active:bg-green-700"
            >
              {wave === 0 ? "Start Game" : "Next Wave"}
            </button>
          )}
          {phase === "wave-complete" && (
            <div className="flex items-center gap-2">
              <span className="py-1 text-xs text-(--site-text-muted)">
                Next wave in <span className="tabular-nums text-(--site-text)">{countdown}s</span>
              </span>
              <button
                onClick={handleStartWave}
                className={[
                  "rounded px-3 py-1 text-xs font-semibold text-white",
                  nextWaveIsBoss
                    ? "bg-red-700 hover:bg-red-600 active:bg-red-800"
                    : "bg-green-600 hover:bg-green-500 active:bg-green-700",
                ].join(" ")}
              >
                {nextWaveIsBoss ? "⚠ Boss Wave" : "Send Now"}
              </button>
            </div>
          )}
          {phase === "game-over" && (
            <button
              onClick={handleRestart}
              className="rounded bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-500"
            >
              Restart
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="relative w-full border border-(--site-border)">
        <canvas
          ref={canvasRef}
          className="block w-full"
          style={{ cursor: canPlace && selectedTowerType ? "crosshair" : "default" }}
        />
        {/* Overlays */}
        {phase === "game-over" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <div className="text-2xl font-bold text-red-400">Game Over</div>
            <div className="mt-1 text-sm text-(--site-text-muted)">You reached wave {wave}</div>
            <button
              onClick={handleRestart}
              className="mt-4 rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500"
            >
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Bottom: tower selection + inspect panel */}
      <div className="rounded-b border border-t-0 border-(--site-border) bg-(--site-bg-secondary) px-3 py-2">
        {/* Tower buttons */}
        <div className="flex flex-wrap gap-2">
          {TOWER_ORDER.map((type) => {
            const stats = TOWER_STATS[type];
            const isEnabled = ENABLED_TOWERS.has(type);
            const isSelected = selectedTowerType === type;
            const canAfford = gold >= stats.cost;
            return (
              <button
                key={type}
                disabled={!isEnabled || !canPlace}
                onClick={() => {
                  if (!isEnabled) return;
                  handleSelectTowerType(isSelected ? null : type);
                }}
                className={[
                  "flex flex-col items-center rounded border px-2 py-1 text-xs transition-colors",
                  isSelected
                    ? "border-yellow-400 bg-yellow-400/15 text-(--site-text)"
                    : "border-(--site-border) bg-(--site-bg) text-(--site-text) hover:border-yellow-400/60",
                  !isEnabled || !canPlace ? "cursor-not-allowed opacity-40" : "",
                  isEnabled && canPlace && !canAfford ? "opacity-60" : "",
                ].join(" ")}
              >
                <span className="font-semibold">{stats.name}</span>
                <span className={canAfford ? "text-yellow-400" : "text-red-400"}>${stats.cost}</span>
              </button>
            );
          })}
        </div>

        {/* Inspect panel */}
        {inspectedTower &&
          (() => {
            const upgrades = TOWER_UPGRADES[inspectedTower.type];
            const maxTier = upgrades.length;
            const nextUpgrade = inspectedTower.tier < maxTier ? upgrades[inspectedTower.tier] : null;
            const canUpgrade = nextUpgrade !== null && gold >= nextUpgrade.cost;
            return (
              <div className="mt-2 rounded border border-(--site-border) bg-(--site-bg) px-3 py-2 text-sm text-(--site-text)">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold">{TOWER_STATS[inspectedTower.type].name} Tower</span>
                    <span className="ml-2 text-xs text-(--site-text-muted)">
                      Tier {inspectedTower.tier}/{maxTier}
                      {inspectedTower.tier === maxTier ? " · MAX" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSellTower(inspectedTower.id)}
                    className="shrink-0 rounded bg-red-700 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Sell ${sellValue}
                  </button>
                </div>
                {nextUpgrade && (
                  <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-(--site-border) pt-1.5">
                    <span className="text-xs text-(--site-text-muted)">Upgrade: {nextUpgrade.description}</span>
                    <button
                      onClick={() => handleUpgradeTower(inspectedTower.id)}
                      disabled={!canUpgrade}
                      className={[
                        "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                        canUpgrade
                          ? "bg-green-700 text-white hover:bg-green-600"
                          : "cursor-not-allowed opacity-50 bg-(--site-bg-secondary) text-(--site-text-muted)",
                      ].join(" ")}
                    >
                      ${nextUpgrade.cost}
                    </button>
                  </div>
                )}
              </div>
            );
          })()}

        {/* Tips */}
        <div className="mt-1.5 text-xs text-(--site-text-muted)">
          {selectedTowerType
            ? `Click to place · Right-click to sell · Esc to deselect · Space to send wave · F to toggle 2×`
            : `Click a tower to inspect · Right-click to sell · Space to send wave · F to toggle 2×`}
        </div>
      </div>
    </div>
  );
};

export default GameTowerDefense;
