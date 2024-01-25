export function isNotNullish<T>(input: T): input is NonNullable<T> {
  return input !== null && input !== undefined;
}

export function isNullish<T>(value: T | undefined | null): value is undefined | null {
  return value === undefined || value === null;
}
