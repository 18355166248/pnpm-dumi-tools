import React from "react";
import type { ModalProps } from "./modal";
import Modal from "./modal";
import { renderImperatively } from "../../utils/render-imperatively";

export type ModalShowProps = Omit<
  ModalProps,
  "visible" | "destroyOnClose" | "forceRender"
>;

export interface ModalShowHandler {
  close: () => void;
}

export const closeFnSet = new Set<() => void>();

export function show(props: ModalShowProps) {
  const handler: ModalShowHandler = renderImperatively(
    <Modal
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
