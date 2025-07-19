import type { PopupProps } from "./popup";
import Popup from "./popup";
import { renderImperatively } from "../../utils/render-imperatively";
import React from "react";

export type PopupShowProps = Omit<
  PopupProps,
  "visible" | "destroyOnClose" | "forceRender"
>;

export interface PopupShowHandler {
  close: () => void;
}

export const closeFnSet = new Set<() => void>();

export function show(props: PopupShowProps) {
  const handler: PopupShowHandler = renderImperatively(
    <Popup
      {...props}
      afterClose={() => {
        closeFnSet.delete(handler.close);
        props.afterClose?.();
      }}
    />,
  );
  closeFnSet.add(handler.close);
  return handler;
}
