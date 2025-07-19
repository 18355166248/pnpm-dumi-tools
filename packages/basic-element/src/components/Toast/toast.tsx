import type { ReactNode, FC } from "react";
import type { GetContainerType } from "../../utils/utils";
import type { PropagationEvent } from "../../utils/with-stop-propagation";
import { mergeProps } from "../../utils/with-default-utls";
import type { MaskProps } from "../Mask";
import Mask from "../Mask";
import { ToastWrapStyle } from "./index.style";
import React from "react";

export interface ToastProps {
  afterClose?: () => void;
  maskStyle?: MaskProps["style"];
  maskClickable?: boolean;
  content?: ReactNode;
  duration?: number;
  visible?: boolean;
  getContainer?: GetContainerType;
  stopPropagation?: PropagationEvent[];
}

const defaultProps = {
  maskClickable: true,
  stopPropagation: ["click"],
};

export const InternalToast: FC<ToastProps> = (p) => {
  const props = mergeProps(defaultProps, p);
  const {
    maskClickable,
    content,
    visible,
    getContainer,
    afterClose,
    maskStyle,
    stopPropagation,
  } = props;

  return (
    <Mask
      visible={visible}
      opacity={0}
      disableBodyScroll={!maskClickable}
      getContainer={getContainer}
      afterClose={afterClose}
      style={{
        pointerEvents: maskClickable ? "none" : "auto",
        zIndex: "calc(var(--z-index) + 1)",
        ...maskStyle,
      }}
      stopPropagation={stopPropagation}
    >
      <ToastWrapStyle>
        <div className="main">{content}</div>
      </ToastWrapStyle>
    </Mask>
  );
};
