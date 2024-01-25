export function assertNonNullable<T>(val: T, name: string, prefix?: string): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    const msg = `Expected "${name}" to be defined`;
    throw new Error(prefix ? `[${prefix}]: ${msg}` : msg);
  }
}
