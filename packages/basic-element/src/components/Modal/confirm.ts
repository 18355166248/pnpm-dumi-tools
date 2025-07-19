import { show } from "./show";
import type { ModalProps } from "./index";
import type { ReactNode } from "react";
import { mergeProps } from "../../utils/with-default-utls";

export type ModalConfirmProps = Omit<
  ModalProps,
  "visible" | "closeOnAction" | "actions"
> & {
  confirmText?: ReactNode;
  cancelText?: ReactNode;
  onConfirm?: () => void | Promise<void>;
  onCancel?: () => void | Promise<void>;
  confirmStyle?: React.CSSProperties;
  cancelStyle?: React.CSSProperties;
};

const defaultProps = {
  confirmText: "确认",
  cancelText: "取消",
};

export function confirm(p: ModalConfirmProps) {
  const props = mergeProps(defaultProps, p);
  return new Promise<boolean>((resolve) => {
    show({
      ...props,
      closeOnAction: true,
      onClose: () => {
        props.onClose?.();
        resolve(false);
      },
      actions: [
        {
          key: "cancel",
          text: props.cancelText,
          onClick: async () => {
            await props.onCancel?.();
            resolve(false);
          },
          style: props.cancelStyle,
        },
        {
          key: "confirm",
          text: props.confirmText,
          primary: true,
          onClick: async () => {
            await props.onConfirm?.();
            resolve(true);
          },
          style: props.confirmStyle,
        },
      ],
    });
  });
}
