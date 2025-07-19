export const isWindow = () => {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    window.document &&
    window.document.createElement
  );
};

export const isLyInvokeApp = () => {
  return (
    isWindow() &&
    typeof window.ly === "object" &&
    typeof window.ly.invokeApp === "function"
  );
};

