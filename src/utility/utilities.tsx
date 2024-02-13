/**
 * Calculates the sum of all elements in a given array of numbers.
 *
 * This function iterates over each element in the input array, adding up their values to return the total sum.
 *
 * @param arr An array of numbers to be summed.
 * @returns The sum of the elements in the input array. Returns 0 for an empty array.
 *
 * @example
 * // Example usage:
 * console.log(sumArray([1, 2, 3, 4, 5])); // Output: 15
 * console.log(sumArray([-1, -2, -3, -4, -5])); // Output: -15
 * @remarks
 * - The input array is not modified by this function.
 */
export function sumArray(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

/**
 * Creates a shallow copy of a 2D array.
 *
 * This function duplicates a two-dimensional array by creating a new array where each element (which is an array itself)
 * is a shallow copy of the corresponding element in the input array.
 *
 * @param arr A two-dimensional array of any type T to be copied.
 * @returns A new two-dimensional array containing shallow copies of the original array's elements.
 *
 * @example
 * // Example usage:
 * const original = [[1, 2], [3, 4]];
 * const copy = copy2DArray(original);
 * console.log(copy); // Output: [[1, 2], [3, 4]]
 *
 * @remarks
 * - The function performs a shallow copy, meaning that it duplicates the array structure but not the nested objects or arrays.
 *   If the original 2D array contains objects, the copied array's elements will reference the same objects.
 * - This function is not suitable for deep copying scenarios where nested objects or arrays also need to be duplicated independently.
 */
export function copy2DArray<T>(arr: T[][]): T[][] {
  return arr.map((row) => row.slice());
}

/**
 * Calculates the softmax of an array of numbers, scaled by a temperature parameter.
 *
 * The softmax function converts an array of raw scores into probabilities by taking the exponential
 * of each element divided by the temperature, and then normalising these values by dividing by the sum
 * of all the exponentials. The temperature parameter adjusts the distribution, with lower temperatures
 * making the distribution more concentrated around the maximum value, and higher temperatures making it
 * more uniform.
 *
 * @param values An array of numbers for which to compute the softmax probabilities.
 * @param temperature A positive number representing the temperature to scale the raw scores. A temperature
 * of 1 applies the softmax function without scaling, higher values make the softmax output more uniform,
 * and lower values make the output more concentrated.
 * @returns An array of numbers representing the softmax probabilities of the input values, adjusted by the
 * specified temperature.
 *
 * @example
 * // Example usage:
 * console.log(softMaxT([1, 2, 3], 1));   // Outputs: [0.0900,0.2447,0.6652] approximately
 * console.log(softMaxT([1, 2, 3], 0.5)); // Outputs: [0.0159,0.1173,0.8668] approximately, more concentrated
 * console.log(softMaxT([1, 2, 3], 2));   // Outputs: [0.1863,0.3072,0.5065] approximately, more uniform
 *
 * @remarks
 * - Using a temperature of 0 will result in division by zero or undefined behavior.
 * - Using a negative temperature is equivalent to taking the softmax of the negative of the input values.
 * - Very low or very high temperature values might leed to numerical instability.
 */
export function softMaxT(values: number[], temperature: number): number[] {
  const valuesExp = values.map((value) => Math.exp(value / temperature));
  const valuesExpSum = valuesExp.reduce((acc, value) => acc + value, 0);
  return valuesExp.map((value) => value / valuesExpSum);
}

/**
 * Calculates the dot product of two arrays of numbers.
 *
 * This function computes the dot product by multiplying corresponding elements from the two arrays and summing the results.
 * It requires that both input arrays have the same length; otherwise, it throws an error.
 *
 * @param arr1 The first array of numbers, representing the first vector.
 * @param arr2 The second array of numbers, representing the second vector.
 * @returns The dot product of the two arrays, which is a single number representing the sum of the products of corresponding elements.
 *
 * @example
 * // Example usage:
 * console.log(dotProduct([1, 2, 3], [4, 5, 6])); // Output: 32 (1*4 + 2*5 + 3*6)
 * console.log(dotProduct([1, 2], [1, 2])); // Output: 5 (1*1 + 2*2)
 *
 * @remarks
 * - The function validates that the two input arrays are of the same length. If they are not, it throws an `Error` with the message "Arrays must have the same length".
 * - This function is specifically designed for numerical arrays and assumes that all elements in the input arrays are numbers.
 * - Switching the order of the input arrays does not affect the result, as the dot product is commutative.
 */
export function dotProduct(arr1: number[], arr2: number[]): number {
  if (arr1.length !== arr2.length) {
    throw new Error("Arrays must have the same length");
  }
  return arr1.reduce((acc, value, index) => acc + value * arr2[index], 0);
}

/**
 * Compares two arrays of numbers for equality by checking if they have the same length and if each corresponding element is equal.
 *
 * This function first checks if the two arrays have the same length. If they do not, it returns `false`. If they have the same length,
 * it then iteratively checks each pair of corresponding elements from both arrays for equality. The function returns `true` only if all
 * pairs of corresponding elements are equal.
 *
 * @param arr1 The first array of numbers to be compared.
 * @param arr2 The second array of numbers to be compared.
 * @returns A boolean value indicating whether the two arrays are equal. Returns `true` if both arrays have the same length and all their
 * corresponding elements are equal; otherwise, returns `false`.
 *
 * @example
 * // Example usage:
 * console.log(compareNumberArrays([1, 2, 3], [1, 2, 3])); // Output: true
 * console.log(compareNumberArrays([1, 2, 3], [3, 2, 1])); // Output: false
 * console.log(compareNumberArrays([1, 2, 3], [1, 2, 3, 4])); // Output: false
 *
 * @remarks
 * - The function specifically compares arrays of numbers. It is not suitable for arrays containing elements of other types.
 * - This comparison method is efficient for number arrays as it avoids the overhead of serializing arrays and is accurate for numeric comparisons,
 *   including handling of NaN values, which are considered unequal to themselves.
 * - The comparison is order-sensitive, meaning that the same numbers in a different order will result in `false`.
 */
export function compareNumberArrays(arr1: number[], arr2: number[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((item, index) => item === arr2[index]);
}

/**
 * Randomly shuffles the elements of an input array using the Fisher-Yates shuffle algorithm.
 *
 * This function creates a shuffled copy of the input array, ensuring that each element has an equal
 * probability of appearing in any position in the output array. The original array is not modified.
 *
 * @param inputArray An array of elements of type T to be shuffled.
 * @returns A new array containing the same elements as `inputArray`, but in a randomly shuffled order.
 *
 * @example
 * // Example usage:
 * const originalArray = [1, 2, 3, 4, 5];
 * const shuffledArray = shuffleArray(originalArray);
 * console.log(shuffledArray); // Output: [3, 1, 4, 5, 2] (output will vary)
 *
 * @remarks
 * - This function does not modify the input array.
 * - The Fisher-Yates shuffle algorithm is used to shuffle the array in O(n) time complexity.
 */
export function shuffleArray<T>(inputArray: T[]): T[] {
  const array = [...inputArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Generates an array containing a range of numbers from a specified start to an end value, allowing for an optional step size.
 *
 * This function creates an array of numbers starting from the `start` value, incrementing by the `step` size up to,
 * but not including, the `end` value. If the step size is not specified, it defaults to 1, creating a sequence of consecutive numbers.
 *
 * @param start The starting value of the number sequence, inclusive.
 * @param end The end value of the number sequence, exclusive.
 * @param step The difference between each number in the sequence. Defaults to 1 if not specified.
 * @returns An array of numbers from `start` to `end` - 1, incremented by `step`.
 *
 * @example
 * // Example usage:
 * console.log(range(1, 10, 2)); // Output: [1, 3, 5, 7, 9]
 * console.log(range(5, 15, 5)); // Output: [5, 10]
 * console.log(range(5, -5, -3)); // Output: [5, 2, -1, -4]
 *
 * @remarks
 * - The function returns an empty array if the `end` value is less than the `start` value and `step` is positive.
 * - It is designed to work with integers. Using non-integer values for `start`, `end`, or `step` may lead to unexpected results.
 */
export function range(start: number, end: number, step: number = 1): number[] {
  return Array.from(
    { length: Math.max(Math.ceil((end - start) / step), 0) },
    (_, i) => start + i * step
  );
}

/**
 * Selects an index based on specified probabilities, accommodating unnormalised inputs.
 *
 * This function takes an array of numbers representing unnormalised probabilities for each index and
 * returns a random index.
 *
 * @param probabilities An array of numbers representing the probabilities for each index. The numbers
 * should be positive and represent the relative likelihood of each index being chosen. They do not need to sum to 1.
 * @returns A random index based on the input probabilities. Returns -2 if the input array is empty.
 *
 * @example
 * // Example usage:
 * const probs = [10, 20, 70]; // Unnormalised probabilities
 * const chosenIndex = randomChoice(probs);
 * // Outputs: 0, 1, or 2, with probabilities proportional to 10, 20, and 70.
 *
 * @remarks
 * - The probabilities array should contain positive values. Negative values will produce unexpected results.
 * - The function employs `Math.random()` for generating randomness, which produces a number between 0 (inclusive) and 1 (exclusive).
 */
export function randomChoice(probabilities: number[]): number {
  const cumProb = probabilities.reduce(
    (acc, prob) => [...acc, acc[acc.length - 1] + prob],
    [0]
  );
  const rand = Math.random() * cumProb[cumProb.length - 1];
  const index = cumProb.findIndex((prob) => prob > rand) - 1;
  return index;
}

/**
 * Adjusts the brightness of a hexadecimal colour by a specified magnitude.
 *
 * This function takes a hexadecimal colour string (e.g., "#FFFFFF" for white) and a magnitude value.
 * The magnitude value adjusts the colour's brightness: positive values make the colour lighter,
 * while negative values make it darker. The function ensures that the resulting colour's RGB values
 * are within the valid range (0 to 255) before returning the adjusted colour in hexadecimal format.
 *
 * @param hexColour A string representing the colour in hexadecimal format. It starts with '#'
 * followed by 6 hexadecimal digits. If the input does not follow this format (e.g., it's not 6 digits long),
 * the function returns the input unmodified.
 * @param magnitude An integer representing how much to adjust the colour's brightness. Positive values
 * increase the brightness, making the colour lighter, while negative values decrease it, making the colour darker.
 * @returns A string representing the adjusted colour in hexadecimal format. If the input colour string is
 * not in the expected format, the original input string is returned. The returned colour string is formatted
 * with a leading '#' followed by 6 hexadecimal digits.
 *
 * @example
 * // Example usage:
 * transformHexColour("#123456", 20); // Returns a slightly lighter colour ("#26486a")
 * transformHexColour("#123456", -20); // Returns a slightly darker colour ("#002042")
 * transformHexColour("#ABC", 10); // Returns "#ABC" as it's not in the expected format
 *
 * @remarks
 * The function does not validate the input string as a valid hexadecimal colour beyond checking its length.
 * Incorrect inputs that still meet the length requirement might produce unexpected results.
 * The magnitude's effect is applied uniformly to the red, green, and blue components of the colour,
 * potentially leading to saturation if the magnitude is large enough.
 */
export function transformHexColour(hexColour: string, magnitude: number) {
  if (hexColour.length !== 7) return hexColour;

  hexColour = hexColour.replace(`#`, ``);
  const decimalColour = parseInt(hexColour, 16);
  let r = (decimalColour >> 16) + magnitude;
  r = Math.min(255, Math.max(0, r));
  let g = ((decimalColour >> 8) & 0x00ff) + magnitude;
  g = Math.min(255, Math.max(0, g));
  let b = (decimalColour & 0x0000ff) + magnitude;
  b = Math.min(255, Math.max(0, b));

  return `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/**
 * Counts the occurrences of each unique string in the provided array, sorts the results in specified order,
 * and returns an array of [string, number] pairs, where each pair consists of a unique string and its count.
 *
 * @param array An array of strings to be processed. Each string in the array will be counted for its occurrences.
 * @param sortOrder Optional. Specifies the sorting order of the returned array based on occurrences.
 * Can be 'ascending', 'descending', or omitted for no sorting.
 * @returns An array of [string, number] pairs where the first element is a unique string from the input array,
 * and the second element is the count of how many times that string appeared in the array.
 * If sortOrder is provided, the array's entries are sorted by their counts in the specified order.
 *
 * @example
 * // Example usage:
 * const fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
 * console.log(countUniqueStrings(fruits, 'ascending'));
 * // Output: [['orange', 1], ['banana', 2], ['apple', 3]]
 * console.log(countUniqueStrings(fruits, 'descending'));
 * // Output: [['apple', 3], ['banana', 2], ['orange', 1]]
 *
 * @remarks
 * This function does not modify the input array. It is case-sensitive, meaning 'Apple' and 'apple' would be counted as two different strings.
 */
export function countUniqueStrings(
  array: string[],
  sortOrder?: "ascending" | "descending"
): [string, number][] {
  const counts = array.reduce<Record<string, number>>((acc, value) => {
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  let entries = Object.entries(counts);

  if (sortOrder) {
    entries = entries.sort((a, b) => {
      return sortOrder === "ascending" ? a[1] - b[1] : b[1] - a[1];
    });
  }

  return entries;
}
