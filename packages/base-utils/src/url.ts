export function getUrlParams<T extends string>(
  keys: T | T[],
  url: string = window.location.href,
): Record<T | keyof T, string> {
  const search = new URL(url).search;
  const params = new URLSearchParams(search);

  // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
  const result = {} as Record<T | keyof T, string>;

  if (typeof keys === "string") {
    const v = params.get(keys);
    if (v) {
      result[keys] = v;
    }
  } else {
    keys.forEach((key) => {
      const v = params.get(key);
      if (v) {
        result[key] = v;
      }
    });
  }

  return result;
}
