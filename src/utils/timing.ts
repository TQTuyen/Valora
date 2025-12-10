/**
 * Timing Utilities
 * @module utils/timing
 */

/**
 * Measure the execution time of a function
 * @template T - Return type of the function
 * @param fn - Function to measure
 * @returns Tuple of [result, duration in ms]
 */
export function measure<T>(fn: () => T): [T, number] {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  return [result, duration];
}
