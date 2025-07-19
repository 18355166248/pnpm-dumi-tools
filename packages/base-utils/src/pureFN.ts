export const isFunction = (fn: any): fn is Function => {
  return typeof fn === "function";
};

export function callFn<T extends any[], R>(
  fn: ((...args: T) => R) | undefined,
  ...args: T
): R | undefined {
  if (isFunction(fn)) {
    return fn(...args);
  }
  return undefined;
}

export const safeJSONParse = (str: string) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return {};
  }
};
