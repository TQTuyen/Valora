/**
 * Unique ID Generation
 * @module utils/id
 */

let idCounter = 0;

/**
 * Generate a unique ID
 * @param prefix - Optional prefix for the ID
 * @returns Unique ID string
 */
export function uniqueId(prefix = 'valora'): string {
  idCounter += 1;
  return `${prefix}_${String(idCounter)}_${Date.now().toString(36)}`;
}
