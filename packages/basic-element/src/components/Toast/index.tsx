import React from "react";
import { isWindow } from "../../utils/base";
import type { ImperativeHandler } from "../../utils/render-imperatively";
import { renderImperatively } from "../../utils/render-imperatively";
import { mergeProps } from "../../utils/with-default-utls";
import type { ToastProps } from "./toast";
import { InternalToast } from "./toast";

export type ToastShowProps = Omit<ToastProps, "visible">;

export interface ToastHandler {
  close: () => void;
}

let currentHandler: ImperativeHandler | null = null;
let currentTimeout: number | null = null;

const defaultProps = {
  duration: 3000,
  maskClickAble: true, // 蒙层是否可点击
};

const InnerToast = (
  props: ToastShowProps & {
    onClose?: () => void;
  },
) => <InternalToast {...props} />;

const show = (p: ToastShowProps | string) => {
  const props = mergeProps(
    defaultProps,
    typeof p === "string" ? { content: p } : p,
  );
  const element = (
    <InnerToast
      {...props}
      onClose={() => {
        currentHandler = null;
      }}
    />
  );

  if (currentHandler) {
    currentHandler.replace(element);
  } else {
    currentHandler = renderImperatively(element);
  }
  if (isWindow()) {
    if (currentTimeout) {
      window.clearTimeout(currentTimeout);
    }

    if (props.duration !== 0) {
      currentTimeout = window.setTimeout(() => {
        clear();
      }, props.duration);
    }
  }

  return currentHandler as ToastHandler;
};

const clear = () => {
  currentHandler?.close();
  currentHandler = null;
};

export default {
  show,
  clear,
};
