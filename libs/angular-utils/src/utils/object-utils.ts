export function entries<O extends object = object, K extends keyof O = keyof O, V extends O[K] = O[K]>(
  o: O,
): Array<[K, V]> {
  return Object.entries(o) as Array<[K, V]>;
}

export function keys<O extends object = object, K extends keyof O = keyof O>(o: O): K[] {
  return Object.keys(o) as K[];
}
