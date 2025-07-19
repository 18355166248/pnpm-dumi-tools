import { show } from "./show";
import type { ModalProps } from "./index";
import type { ReactNode } from "react";
import { mergeProps } from "../../utils/with-default-utls";

export type ModalAlertProps = Omit<
  ModalProps,
  "visible" | "closeOnAction" | "actions"
> & {
  confirmText?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  confirmStyle?: React.CSSProperties;
};

export function alert(p: ModalAlertProps) {
  const defaultProps = {};
  const props = mergeProps(defaultProps, p);
  return new Promise<void>((resolve) => {
    show({
      showCloseButton: true,
      ...props,
      closeOnAction: true,
      actions: [
        {
          key: "confirm",
          text: props.confirmText,
          primary: true,
          style: props.confirmStyle,
        },
      ],
      onAction: props.onConfirm,
      onClose: () => {
        props.onClose?.();
        resolve();
      },
    });
  });
}
