import type { CSSProperties } from "react";
import { cloneElement, type ReactElement, type AriaAttributes } from "react";

export type NativeProps<S extends string = never> = {
  className?: string;
  style?: CSSProperties & Partial<Record<S, string>>;
  tabIndex?: number;
} & AriaAttributes;

export function withNativeProps<P extends NativeProps>(
  props: P,
  element: ReactElement
) {
  const p = { ...element.props };

  if (props.className) {
    p.className = `${p.className || ""} ${props.className || ""}`;
  }
  if (props.style) {
    p.style = {
      ...p.style,
      ...props.style,
    };
  }
  if (props.tabIndex !== undefined) {
    p.tabIndex = props.tabIndex;
  }

  for (const key in props) {
    if (!props.hasOwnProperty(key)) continue;
    if (key.startsWith("data-") || key.startsWith("aria-")) {
      p[key] = props[key];
    }
  }

  return cloneElement(element, p);
}
