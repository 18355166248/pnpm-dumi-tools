import type { FC, ReactElement } from "react";
import { useInitialized } from "../hooks/useInitialized";

interface ShouldRenderProps {
  active: boolean;
  forceRender?: boolean;
  destroyOnClose?: boolean;
  children: ReactElement;
}

export const ShouldRender: FC<ShouldRenderProps> = (props) => {
  const showRender = useShouldRender(
    props.active,
    props.forceRender,
    props.destroyOnClose
  );
  return showRender ? props.children : null;
};

export function useShouldRender(
  active: boolean,
  forceRender?: boolean, // 强制渲染内容 也就是初始化不管要不要展示就要渲染 优先级高于 destroyOnClose
  destroyOnClose?: boolean // 不可见时卸载内容
) {
  // 初始化 也就是说初始化完之后就不会变成false了
  const initialed = useInitialized(active);
  if (forceRender) return true;
  if (active) return true;
  if (!initialed) return false;
  return !destroyOnClose;
}
