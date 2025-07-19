export const isWindow = () => {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    window.document &&
    window.document.createElement
  );
};

export const isFunction = (fn: any): any => {
  return fn && typeof fn === "function";
};

export function isObject(val: unknown): val is Record<any, any> {
  return val !== null && typeof val === "object";
}

export function isPromise(obj: unknown): obj is Promise<unknown> {
  return (
    !!obj && typeof obj === "object" && typeof (obj as any).then === "function"
  );
}
