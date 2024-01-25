/**
 * Transform an array into a key-value map by the given idKey
 * @param arr
 * @param idKey
 * @returns the array reduced to a key-value map
 */
export function objectify<T extends Record<K, string | number>, K extends keyof T>(arr: T[], idKey = 'id' as K) {
  return arr.reduce(
    (obj, current) => {
      const id = current[idKey];
      obj[id] = current;
      return obj;
    },
    {} as Record<T[K], T>,
  );
}
