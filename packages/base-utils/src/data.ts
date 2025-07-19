export function safeParse<T>(params: string): T | null {
  try {
    return JSON.parse(params);
  } catch (error) {
    return null;
  }
}
