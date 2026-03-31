import { COLS, ROWS, END_COL, END_ROW, START_COL, START_ROW } from './constants';
import type { Cell, CellState } from './types';

function cellKey(col: number, row: number): number {
  return row * COLS + col;
}

function neighbors(col: number, row: number): Cell[] {
  const result: Cell[] = [];
  if (col > 0)        result.push({ col: col - 1, row });
  if (col < COLS - 1) result.push({ col: col + 1, row });
  if (row > 0)        result.push({ col, row: row - 1 });
  if (row < ROWS - 1) result.push({ col, row: row + 1 });
  return result;
}

function manhattan(a: Cell, b: Cell): number {
  return Math.abs(a.col - b.col) + Math.abs(a.row - b.row);
}

/** BFS connectivity check — cheaper than A*, just returns bool. */
export function hasPath(
  grid: CellState[][],
  sc = START_COL, sr = START_ROW,
  ec = END_COL,   er = END_ROW,
): boolean {
  const visited = new Set<number>();
  const queue: Cell[] = [{ col: sc, row: sr }];
  visited.add(cellKey(sc, sr));
  while (queue.length > 0) {
    const cur = queue.shift()!;
    if (cur.col === ec && cur.row === er) return true;
    for (const nb of neighbors(cur.col, cur.row)) {
      const k = cellKey(nb.col, nb.row);
      const s = grid[nb.col][nb.row];
      if (!visited.has(k) && s !== 'tower' && s !== 'water') {
        visited.add(k);
        queue.push(nb);
      }
    }
  }
  return false;
}

/** A* — returns ordered path or null. */
export function findPath(
  grid: CellState[][],
  sc = START_COL, sr = START_ROW,
  ec = END_COL,   er = END_ROW,
): Cell[] | null {
  const end = { col: ec, row: er };
  const gScore = new Map<number, number>();
  const fScore = new Map<number, number>();
  const cameFrom = new Map<number, number>();
  const open = new Set<number>();
  const closed = new Set<number>();

  const startKey = cellKey(sc, sr);
  gScore.set(startKey, 0);
  fScore.set(startKey, manhattan({ col: sc, row: sr }, end));
  open.add(startKey);

  while (open.size > 0) {
    let cur = -1, lowestF = Infinity;
    for (const k of open) {
      const f = fScore.get(k) ?? Infinity;
      if (f < lowestF) { lowestF = f; cur = k; }
    }
    const curRow = Math.floor(cur / COLS);
    const curCol = cur % COLS;
    if (curCol === ec && curRow === er) {
      const path: Cell[] = [];
      let k: number | undefined = cur;
      while (k !== undefined) {
        path.unshift({ col: k % COLS, row: Math.floor(k / COLS) });
        k = cameFrom.get(k);
      }
      return path;
    }
    open.delete(cur);
    closed.add(cur);
    const g = gScore.get(cur) ?? Infinity;
    for (const nb of neighbors(curCol, curRow)) {
      const ns = grid[nb.col][nb.row];
      if (ns === 'tower' || ns === 'water') continue;
      const nk = cellKey(nb.col, nb.row);
      if (closed.has(nk)) continue;
      const tg = g + 1;
      if (tg < (gScore.get(nk) ?? Infinity)) {
        cameFrom.set(nk, cur);
        gScore.set(nk, tg);
        fScore.set(nk, tg + manhattan(nb, end));
        open.add(nk);
      }
    }
  }
  return null;
}
