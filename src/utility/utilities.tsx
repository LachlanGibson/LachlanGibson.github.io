export function sumArray(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

export function copy2DArray<T>(arr: T[][]): T[][] {
  return arr.map((row) => row.slice());
}

export function softMaxT(values: number[], temperature: number): number[] {
  const valuesExp = values.map((value) => Math.exp(value / temperature));
  const valuesExpSum = valuesExp.reduce((acc, value) => acc + value, 0);
  return valuesExp.map((value) => value / valuesExpSum);
}

export function dotProduct(arr1: number[], arr2: number[]): number {
  return arr1.reduce((acc, value, index) => acc + value * arr2[index], 0);
}

export function compareNumberArrays(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

export function compareArrays(arr1: [], arr2: []): boolean {
  return JSON.stringify(arr1) === JSON.stringify(arr2);
}

export function shuffleArray<T>(inputArray: T[]): T[] {
  //Fisher–Yates shuffle
  const array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start }, (_, i) => start + i);
}
