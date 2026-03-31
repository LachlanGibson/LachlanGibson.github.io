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
import { createRng, generateWater, WATER_GROUP_COUNT } from "./game/mapgen";
import type { GameState, GamePhase, TowerType, Tower, Cell, CellState } from "./game/types";

interface GameSettings {
  seed: number | null;   // null = random each game
  startingGold: number;
  startingLives: number;
}

const DEFAULT_SETTINGS: GameSettings = {
  seed: null,
  startingGold: STARTING_GOLD,
  startingLives: STARTING_LIVES,
};

function createInitialState(settings: GameSettings = DEFAULT_SETTINGS): GameState {
  const actualSeed = settings.seed ?? Math.floor(Math.random() * 1e8);
  const grid: CellState[][] = Array.from({ length: COLS }, () =>
    Array.from({ length: ROWS }, () => "empty" as CellState),
  );
  grid[START_COL][START_ROW] = "start";
  grid[END_COL][END_ROW] = "end";
  generateWater(grid, createRng(actualSeed), WATER_GROUP_COUNT);
  return {
    seed: actualSeed,
    grid,
    towers: [],
    enemies: [],
    projectiles: [],
    floatingTexts: [],
    deathParticles: [],
    splashEffects: [],
    path: findPath(grid),
    gold: settings.startingGold,
    lives: settings.startingLives,
    wave: 0,
    phase: "preparing",
    waveTimer: 0,
    spawnQueue: [],
    hasLeakedThisWave: false,
    nextId: 0,
  };
}

type DragRect = { x1: number; y1: number; x2: number; y2: number };

const TOWER_ORDER: TowerType[] = ["arrow", "cannon", "slow", "sniper", "antiair"];
const ENABLED_TOWERS = new Set<TowerType>(["arrow", "cannon", "slow", "sniper", "antiair"]);

interface SettingsModalProps {
  settings: GameSettings;
  currentSeed: number;
  onApply: (s: GameSettings) => void;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ settings, currentSeed, onApply, onClose }) => {
  const [seedMode, setSeedMode] = React.useState<"random" | "fixed">(
    settings.seed === null ? "random" : "fixed",
  );
  const [seedInput, setSeedInput] = React.useState(
    settings.seed !== null ? String(settings.seed) : String(currentSeed),
  );
  const [gold, setGold] = React.useState(String(settings.startingGold));
  const [lives, setLives] = React.useState(String(settings.startingLives));

  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const handleApply = () => {
    const parsedSeed = seedMode === "fixed" ? (parseInt(seedInput) || 0) : null;
    const parsedGold = clamp(parseInt(gold) || STARTING_GOLD, 25, 9999);
    const parsedLives = clamp(parseInt(lives) || STARTING_LIVES, 1, 99);
    onApply({ seed: parsedSeed, startingGold: parsedGold, startingLives: parsedLives });
  };

  // Close on Escape or backdrop click
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-sm rounded-lg border border-(--site-border) bg-(--site-bg) shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--site-border) px-4 py-3">
          <h2 className="text-sm font-semibold text-(--site-text)">Game Settings</h2>
          <button
            onClick={onClose}
            className="rounded px-1.5 py-0.5 text-sm text-(--site-text-muted) hover:text-(--site-text)"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-4 py-4">
          {/* Seed */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-(--site-text)">Map Seed</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSeedMode("random")}
                className={[
                  "rounded border px-3 py-1 text-xs font-medium transition-colors",
                  seedMode === "random"
                    ? "border-yellow-400 bg-yellow-400/15 text-(--site-text)"
                    : "border-(--site-border) text-(--site-text-muted) hover:border-yellow-400/60",
                ].join(" ")}
              >
                Random
              </button>
              <button
                onClick={() => setSeedMode("fixed")}
                className={[
                  "rounded border px-3 py-1 text-xs font-medium transition-colors",
                  seedMode === "fixed"
                    ? "border-yellow-400 bg-yellow-400/15 text-(--site-text)"
                    : "border-(--site-border) text-(--site-text-muted) hover:border-yellow-400/60",
                ].join(" ")}
              >
                Fixed
              </button>
            </div>
            {seedMode === "fixed" ? (
              <input
                type="number"
                value={seedInput}
                onChange={(e) => setSeedInput(e.target.value)}
                className="mt-2 w-full rounded border border-(--site-border) bg-(--site-bg-secondary) px-3 py-1.5 text-sm text-(--site-text) focus:outline-none focus:ring-1 focus:ring-yellow-400/60"
                placeholder="Enter seed number"
              />
            ) : (
              <p className="mt-2 text-xs text-(--site-text-muted)">
                Current seed: <span className="tabular-nums text-(--site-text)" suppressHydrationWarning>{currentSeed}</span>
                {" "}— a new random seed is chosen each restart.
              </p>
            )}
          </div>

          {/* Starting Gold */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-(--site-text)">
              Starting Gold
              <span className="ml-1 font-normal text-(--site-text-muted)">(25 – 9999)</span>
            </label>
            <div className="flex items-center gap-2">
              {[50, 100, 200, 500].map((v) => (
                <button
                  key={v}
                  onClick={() => setGold(String(v))}
                  className={[
                    "rounded border px-2 py-0.5 text-xs transition-colors",
                    gold === String(v)
                      ? "border-yellow-400 bg-yellow-400/15 text-(--site-text)"
                      : "border-(--site-border) text-(--site-text-muted) hover:border-yellow-400/60",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
              <input
                type="number"
                value={gold}
                onChange={(e) => setGold(e.target.value)}
                min={25}
                max={9999}
                className="w-20 rounded border border-(--site-border) bg-(--site-bg-secondary) px-2 py-1 text-sm text-(--site-text) focus:outline-none focus:ring-1 focus:ring-yellow-400/60"
              />
            </div>
          </div>

          {/* Starting Lives */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-(--site-text)">
              Starting Lives
              <span className="ml-1 font-normal text-(--site-text-muted)">(1 – 99)</span>
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 20, 50].map((v) => (
                <button
                  key={v}
                  onClick={() => setLives(String(v))}
                  className={[
                    "rounded border px-2 py-0.5 text-xs transition-colors",
                    lives === String(v)
                      ? "border-yellow-400 bg-yellow-400/15 text-(--site-text)"
                      : "border-(--site-border) text-(--site-text-muted) hover:border-yellow-400/60",
                  ].join(" ")}
                >
                  {v}
                </button>
              ))}
              <input
                type="number"
                value={lives}
                onChange={(e) => setLives(e.target.value)}
                min={1}
                max={99}
                className="w-20 rounded border border-(--site-border) bg-(--site-bg-secondary) px-2 py-1 text-sm text-(--site-text) focus:outline-none focus:ring-1 focus:ring-yellow-400/60"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-(--site-border) px-4 py-3">
          <button
            onClick={onClose}
            className="rounded border border-(--site-border) px-3 py-1.5 text-xs font-medium text-(--site-text-muted) hover:text-(--site-text)"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="rounded bg-green-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-green-600"
          >
            Apply &amp; Restart
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const selectedTowerIdsRef = useRef<Set<string>>(new Set());
  const isDarkRef = useRef<boolean>(isDark);
  const speedMultiplierRef = useRef<number>(1);
  // Drag-select state (canvas pixel coordinates)
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const dragRectRef = useRef<DragRect | null>(null);
  const isDraggingRef = useRef(false);
  const didDragRef = useRef(false);

  const [gold, setGold] = useState(STARTING_GOLD);
  const [lives, setLives] = useState(STARTING_LIVES);
  const [wave, setWave] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("preparing");
  const [pathLength, setPathLength] = useState(() => {
    const p = stateRef.current.path;
    return p ? p.length - 1 : 0;
  });
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>("arrow");
  const [selectedTowers, setSelectedTowers] = useState<Tower[]>([]);
  const [speed, setSpeed] = useState(1);
  const [countdown, setCountdown] = useState(0);
  const [seed, setSeed] = useState(() => stateRef.current.seed);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [pendingSettings, setPendingSettings] = useState<GameSettings>(DEFAULT_SETTINGS);

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
        selectedTowerIdsRef.current = new Set();
        setSelectedTowers([]);
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
      // Remove from selection if present
      const sel = selectedTowerIdsRef.current;
      if (sel.has(towerId)) {
        const newSel = new Set(sel);
        newSel.delete(towerId);
        selectedTowerIdsRef.current = newSel;
        setSelectedTowers(state.towers.filter((t) => newSel.has(t.id)));
      }
      setGold(state.gold);
      if (hoverCellRef.current) computeHoverValidity(hoverCellRef.current.col, hoverCellRef.current.row);
    },
    [computeHoverValidity],
  );

  const handleSellSelected = useCallback(() => {
    const state = stateRef.current;
    if (state.phase === "game-over") return;
    const sel = selectedTowerIdsRef.current;
    if (sel.size === 0) return;
    let totalRefund = 0;
    state.towers = state.towers.filter((t) => {
      if (!sel.has(t.id)) return true;
      totalRefund += Math.floor(t.totalCostSpent * SELL_REFUND_RATE);
      state.grid[t.col][t.row] = "empty";
      return false;
    });
    state.gold += totalRefund;
    const newPath = findPath(state.grid);
    if (newPath) {
      state.path = newPath;
      rerouteEnemies(state.enemies, newPath);
      setPathLength(newPath.length - 1);
    }
    selectedTowerIdsRef.current = new Set();
    setSelectedTowers([]);
    setGold(state.gold);
    if (hoverCellRef.current) computeHoverValidity(hoverCellRef.current.col, hoverCellRef.current.row);
  }, [computeHoverValidity]);

  const handleUpgradeTower = useCallback((towerId: string) => {
    const state = stateRef.current;
    const success = upgradeTower(state, towerId);
    if (success) {
      const sel = selectedTowerIdsRef.current;
      setSelectedTowers(state.towers.filter((t) => sel.has(t.id)).map((t) => ({ ...t })));
      setGold(state.gold);
    }
  }, []);

  const handleUpgradeSelected = useCallback(() => {
    const state = stateRef.current;
    const sel = selectedTowerIdsRef.current;
    let anyUpgraded = false;
    for (const id of sel) {
      if (upgradeTower(state, id)) anyUpgraded = true;
    }
    if (anyUpgraded) {
      setSelectedTowers(state.towers.filter((t) => sel.has(t.id)).map((t) => ({ ...t })));
      setGold(state.gold);
    }
  }, []);

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
    window.addEventListener("resize", handleResize);

    // --- Coordinate helpers ---
    const getCell = (e: MouseEvent): Cell | null => {
      const rect = canvas.getBoundingClientRect();
      const col = Math.floor((e.clientX - rect.left) * COLS / rect.width);
      const row = Math.floor((e.clientY - rect.top) * ROWS / rect.height);
      if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return null;
      return { col, row };
    };

    const toCanvasCoords = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: (clientX - rect.left) * canvas.width / rect.width,
        y: (clientY - rect.top) * canvas.height / rect.height,
      };
    };

    // --- Cell click logic (shared by mouse and touch) ---
    const handleCellClick = (cell: Cell, shiftKey = false) => {
      const state = stateRef.current;
      const { col, row } = cell;
      const cellState = state.grid[col][row];
      const selType = selectedTowerTypeRef.current;

      if (cellState === "tower") {
        const tower = state.towers.find((t) => t.col === col && t.row === row);
        if (!tower) return;
        if (shiftKey) {
          // Toggle in multi-selection (keep placement mode active)
          const sel = selectedTowerIdsRef.current;
          const newSel = new Set(sel);
          if (newSel.has(tower.id)) newSel.delete(tower.id);
          else newSel.add(tower.id);
          selectedTowerIdsRef.current = newSel;
          setSelectedTowers(state.towers.filter((t) => newSel.has(t.id)));
        } else {
          // Single-select this tower, exit placement mode
          selectedTowerIdsRef.current = new Set([tower.id]);
          setSelectedTowers([{ ...tower }]);
          selectedTowerTypeRef.current = null;
          setSelectedTowerType(null);
        }
        return;
      }

      if (cellState === "empty" && !selType) {
        if (!shiftKey) {
          selectedTowerIdsRef.current = new Set();
          setSelectedTowers([]);
        }
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

    // --- Mouse events ---
    const onMouseDown = (e: MouseEvent) => {
      if (e.button !== 0) return;
      // Only drag-select when not in tower-placement mode
      if (selectedTowerTypeRef.current) return;
      dragStartRef.current = toCanvasCoords(e.clientX, e.clientY);
      isDraggingRef.current = false;
      didDragRef.current = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      const cell = getCell(e);
      hoverCellRef.current = cell;
      if (cell) computeHoverValidity(cell.col, cell.row);
      else isHoverValidRef.current = false;

      // Drag-select detection
      if (e.buttons === 1 && dragStartRef.current && !selectedTowerTypeRef.current) {
        const { x, y } = toCanvasCoords(e.clientX, e.clientY);
        const dx = x - dragStartRef.current.x, dy = y - dragStartRef.current.y;
        if (!isDraggingRef.current && Math.sqrt(dx * dx + dy * dy) > 4) {
          isDraggingRef.current = true;
          didDragRef.current = true;
        }
        if (isDraggingRef.current) {
          dragRectRef.current = {
            x1: Math.min(dragStartRef.current.x, x),
            y1: Math.min(dragStartRef.current.y, y),
            x2: Math.max(dragStartRef.current.x, x),
            y2: Math.max(dragStartRef.current.y, y),
          };
        }
      } else if (e.buttons !== 1 && isDraggingRef.current) {
        // Button released outside canvas — cancel drag
        dragRectRef.current = null;
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (e.button !== 0) return;
      if (isDraggingRef.current && dragRectRef.current) {
        const cs = cellSizeRef.current;
        const dr = dragRectRef.current;
        const state = stateRef.current;
        // Map drag rect (canvas pixels) to cell range
        const c1 = Math.floor(dr.x1 / cs);
        const r1 = Math.floor(dr.y1 / cs);
        const c2 = Math.floor(dr.x2 / cs);
        const r2 = Math.floor(dr.y2 / cs);
        const towersInRect = state.towers.filter(
          (t) => t.col >= c1 && t.col <= c2 && t.row >= r1 && t.row <= r2,
        );
        if (towersInRect.length > 0) {
          const base = e.shiftKey ? selectedTowerIdsRef.current : new Set<string>();
          const newSel = new Set([...base, ...towersInRect.map((t) => t.id)]);
          selectedTowerIdsRef.current = newSel;
          setSelectedTowers(state.towers.filter((t) => newSel.has(t.id)));
        }
        dragRectRef.current = null;
      }
      isDraggingRef.current = false;
      dragStartRef.current = null;
    };

    const onMouseLeave = () => {
      hoverCellRef.current = null;
      isHoverValidRef.current = false;
      if (isDraggingRef.current) {
        dragRectRef.current = null;
        isDraggingRef.current = false;
        dragStartRef.current = null;
      }
    };

    const onClick = (e: MouseEvent) => {
      if (didDragRef.current) { didDragRef.current = false; return; }
      const cell = getCell(e);
      if (cell) handleCellClick(cell, e.shiftKey);
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      const cell = getCell(e);
      if (!cell) return;
      const tower = stateRef.current.towers.find((t) => t.col === cell.col && t.row === cell.row);
      if (tower) {
        handleSellTower(tower.id);
      } else {
        selectedTowerTypeRef.current = null;
        setSelectedTowerType(null);
        selectedTowerIdsRef.current = new Set();
        setSelectedTowers([]);
      }
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        selectedTowerTypeRef.current = null;
        setSelectedTowerType(null);
        selectedTowerIdsRef.current = new Set();
        setSelectedTowers([]);
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
      const col = Math.floor((touch.clientX - rect.left) * COLS / rect.width);
      const row = Math.floor((touch.clientY - rect.top) * ROWS / rect.height);
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

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("click", onClick);
    canvas.addEventListener("contextmenu", onContextMenu);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mouseup", onMouseUp);

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
      // Sync selected towers (towers can die, removing them from state)
      const sel = selectedTowerIdsRef.current;
      if (sel.size > 0) {
        setSelectedTowers(s.towers.filter((t) => sel.has(t.id)));
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
          selectedTowerIdsRef.current,
          dragRectRef.current,
          isDarkRef.current,
        );
      }
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      if (longPressTimer) clearTimeout(longPressTimer);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("click", onClick);
      canvas.removeEventListener("contextmenu", onContextMenu);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleStartWave = useCallback(() => {
    startWave(stateRef.current);
    setPhase(stateRef.current.phase);
    setWave(stateRef.current.wave);
  }, []);

  const applyRestart = useCallback((settings: GameSettings) => {
    stateRef.current = createInitialState(settings);
    selectedTowerTypeRef.current = "arrow";
    selectedTowerIdsRef.current = new Set();
    hoverCellRef.current = null;
    isHoverValidRef.current = false;
    setGold(stateRef.current.gold);
    setLives(stateRef.current.lives);
    setWave(0);
    setPhase("preparing");
    setSelectedTowerType("arrow");
    setSelectedTowers([]);
    speedMultiplierRef.current = 1;
    setSpeed(1);
    setCountdown(0);
    setSeed(stateRef.current.seed);
    const p = stateRef.current.path;
    setPathLength(p ? p.length - 1 : 0);
  }, []);

  const handleRestart = useCallback(() => {
    applyRestart(pendingSettings);
  }, [applyRestart, pendingSettings]);

  const handleApplySettings = useCallback((newSettings: GameSettings) => {
    setPendingSettings(newSettings);
    setSettingsOpen(false);
    applyRestart(newSettings);
  }, [applyRestart]);

  const canPlace = phase === "preparing" || phase === "wave-in-progress" || phase === "wave-complete";
  const nextWaveNum = wave + 1;
  const nextWaveIsBoss =
    nextWaveNum > PROCEDURAL_WAVE_START_INDEX && nextWaveNum % BOSS_WAVE_INTERVAL === 0;

  // Multi-select panel derived values
  const upgradableTowers = selectedTowers.filter((t) => {
    const ups = TOWER_UPGRADES[t.type];
    return t.tier < ups.length;
  });
  const totalUpgradeCost = upgradableTowers.reduce(
    (sum, t) => sum + TOWER_UPGRADES[t.type][t.tier].cost,
    0,
  );
  const totalSellValue = selectedTowers.reduce(
    (sum, t) => sum + Math.floor(t.totalCostSpent * SELL_REFUND_RATE),
    0,
  );

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
      <div
        ref={containerRef}
        className="relative w-full border border-(--site-border)"
        style={{ aspectRatio: `${COLS}/${ROWS}` }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 block h-full w-full"
          style={{ cursor: canPlace && selectedTowerType ? "crosshair" : "default", touchAction: "none" }}
        />
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

        {/* Single-tower inspect panel */}
        {selectedTowers.length === 1 &&
          (() => {
            const tower = selectedTowers[0];
            const upgrades = TOWER_UPGRADES[tower.type];
            const maxTier = upgrades.length;
            const nextUpgrade = tower.tier < maxTier ? upgrades[tower.tier] : null;
            const canUpgrade = nextUpgrade !== null && gold >= nextUpgrade.cost;
            const sellValue = Math.floor(tower.totalCostSpent * SELL_REFUND_RATE);
            return (
              <div className="mt-2 rounded border border-(--site-border) bg-(--site-bg) px-3 py-2 text-sm text-(--site-text)">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <span className="font-semibold">{TOWER_STATS[tower.type].name} Tower</span>
                    <span className="ml-2 text-xs text-(--site-text-muted)">
                      Tier {tower.tier}/{maxTier}
                      {tower.tier === maxTier ? " · MAX" : ""}
                    </span>
                  </div>
                  <button
                    onClick={() => handleSellTower(tower.id)}
                    className="shrink-0 rounded bg-red-700 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-600"
                  >
                    Sell ${sellValue}
                  </button>
                </div>
                {nextUpgrade && (
                  <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-(--site-border) pt-1.5">
                    <span className="text-xs text-(--site-text-muted)">Upgrade: {nextUpgrade.description}</span>
                    <button
                      onClick={() => handleUpgradeTower(tower.id)}
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

        {/* Multi-tower panel */}
        {selectedTowers.length > 1 && (
          <div className="mt-2 rounded border border-(--site-border) bg-(--site-bg) px-3 py-2 text-sm text-(--site-text)">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold">
                {selectedTowers.length} towers selected
                {upgradableTowers.length < selectedTowers.length && upgradableTowers.length > 0 && (
                  <span className="ml-2 text-xs font-normal text-(--site-text-muted)">
                    ({selectedTowers.length - upgradableTowers.length} at max tier)
                  </span>
                )}
              </span>
              <button
                onClick={handleSellSelected}
                className="shrink-0 rounded bg-red-700 px-2 py-0.5 text-xs font-semibold text-white hover:bg-red-600"
              >
                Sell All ${totalSellValue}
              </button>
            </div>
            {upgradableTowers.length > 0 && (
              <div className="mt-1.5 flex items-center justify-between gap-2 border-t border-(--site-border) pt-1.5">
                <span className="text-xs text-(--site-text-muted)">
                  Upgrade {upgradableTowers.length === selectedTowers.length ? "all" : `${upgradableTowers.length}/${selectedTowers.length}`}
                </span>
                <button
                  onClick={handleUpgradeSelected}
                  disabled={gold < totalUpgradeCost}
                  className={[
                    "shrink-0 rounded px-2 py-0.5 text-xs font-semibold",
                    gold >= totalUpgradeCost
                      ? "bg-green-700 text-white hover:bg-green-600"
                      : "cursor-not-allowed opacity-50 bg-(--site-bg-secondary) text-(--site-text-muted)",
                  ].join(" ")}
                >
                  ${totalUpgradeCost}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tips + settings */}
        <div className="mt-1.5 flex items-center justify-between gap-2 text-xs text-(--site-text-muted)">
          <span className="min-w-0 truncate">
            {selectedTowerType
              ? "Place · R-click to sell · Esc deselect · Space wave · F 2×"
              : "Click to select · Shift+click or drag multi-select · R-click to sell"}
          </span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="shrink-0 rounded border border-(--site-border) px-2 py-0.5 text-xs text-(--site-text-muted) hover:border-yellow-400/60 hover:text-(--site-text)"
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {/* Settings modal */}
      {settingsOpen && (
        <SettingsModal
          settings={pendingSettings}
          currentSeed={seed}
          onApply={handleApplySettings}
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </div>
  );
};

export default GameTowerDefense;
