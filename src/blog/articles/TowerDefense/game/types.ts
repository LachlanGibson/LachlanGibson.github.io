export type EnemyType = 'critter' | 'runner' | 'brute' | 'swarm' | 'splitter' | 'flyer' | 'boss';
export type TowerType = 'arrow' | 'cannon' | 'slow' | 'sniper' | 'antiair';
export type GamePhase = 'preparing' | 'wave-in-progress' | 'wave-complete' | 'game-over' | 'victory';
export type CellState = 'empty' | 'tower' | 'start' | 'end';

export interface Cell {
  col: number;
  row: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  cellX: number;             // position in cell units (col+0.5 = center of cell col)
  cellY: number;
  hp: number;
  maxHp: number;
  speed: number;             // cells per second
  reward: number;
  waypoints: Cell[] | null;  // null for flyers
  waypointIndex: number;
  slowFactor: number;        // 1.0 = normal, <1.0 = slowed
  slowTimer: number;         // seconds remaining on slow
  isFlyer: boolean;
  livesLost: number;
  poisonDps: number;         // damage per second from poison
  poisonTimer: number;       // seconds of poison remaining
  isChilled: boolean;        // slow tower tier 3: +20% damage taken
  flashTimer: number;        // seconds remaining on hit-flash overlay
}

export interface FloatingText {
  id: string;
  cellX: number;
  cellY: number;
  value: number;             // damage to display
  isCrit: boolean;
  age: number;               // seconds elapsed since creation
}

export interface DeathParticle {
  id: string;
  cellX: number;
  cellY: number;
  color: string;
  age: number;               // seconds elapsed since creation
}

export interface SplashEffect {
  id: string;
  cellX: number;             // impact centre
  cellY: number;
  radius: number;            // splash radius in cell units
  color: string;
  age: number;
}

export interface Tower {
  id: string;
  type: TowerType;
  col: number;
  row: number;
  tier: number;              // 0 = base
  totalCostSpent: number;
  cooldown: number;          // seconds until next shot (counts down)
  targetEnemyId: string | null;
  angle: number;             // radians, atan2 convention — direction barrel faces
}

export interface Projectile {
  id: string;
  cellX: number;
  cellY: number;
  targetEnemyId: string;
  lastKnownTargetCellX: number;
  lastKnownTargetCellY: number;
  speed: number;             // cells per second
  damage: number;
  splashRadius: number;      // cells, 0 = single target
  sourceType: TowerType;
  piercedEnemyIds: string[];
  // Straight-line piercing (vx/vy non-zero = straight-line; 0,0 = homing)
  vx: number;
  vy: number;
  piercingCount: number;     // 0 = non-piercing, -1 = unlimited, N = hits N targets
  // Hit effects
  slowStrength: number;      // slowFactor applied on hit (e.g. 0.5 = 50% speed)
  slowDuration: number;      // seconds
  critChance: number;        // 0–1
  poisonDps: number;
  poisonDuration: number;
  applyChilled: boolean;     // mark enemy as chilled on hit
}

export interface SpawnEntry {
  type: EnemyType;
  timeUntilSpawn: number;    // seconds until this enemy spawns
}

export interface GameState {
  grid: CellState[][];       // grid[col][row]
  towers: Tower[];
  enemies: Enemy[];
  projectiles: Projectile[];
  floatingTexts: FloatingText[];
  deathParticles: DeathParticle[];
  splashEffects: SplashEffect[];
  path: Cell[] | null;       // current A* path from start to end
  gold: number;
  lives: number;
  wave: number;              // current wave number (0 = not started)
  phase: GamePhase;
  waveTimer: number;         // countdown for wave-complete pause
  spawnQueue: SpawnEntry[];
  hasLeakedThisWave: boolean;
  nextId: number;            // incrementing ID counter for all entities
}
