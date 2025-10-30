/* eslint-disable @typescript-eslint/no-explicit-any */

export function getValueByPath(
  target: Record<string, any> | string | null | undefined,
  path: string,
): any {
  if (!target || typeof path !== 'string') {
    return undefined;
  }

  if (typeof target === 'string') {
    return target;
  }

  const keys = path.split('.');
  let current: any = target;

  for (const key of keys) {
    if (
      current &&
      typeof current === 'object' &&
      current !== null &&
      key in current
    ) {
      current = current[key];
    } else {
      return undefined; // Key not found at this level
    }
  }

  return current;
}
