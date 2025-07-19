import type { FC, ReactNode } from "react";
import React, { useState } from "react";
import {
  withNativeProps,
  type NativeProps,
} from "../../utils/with-native-props";
import { isPromise } from "../../utils/base";
import { DotLoading } from "../loading/dot-loading";

export type Action = {
  key: string | number;
  text: ReactNode;
  disabled?: boolean;
  primary?: boolean;
  onClick?: () => void | Promise<void>;
} & NativeProps;

export const ModalActionButton: FC<{
  action: Action;
  onAction: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => void | Promise<void>;
}> = (props) => {
  const { action } = props;
  const [innerLoading, setInnerLoading] = useState(false);

  const onClick: React.MouseEventHandler<HTMLButtonElement> = async (e) => {
    if (!props.onAction) return;
    const promise = props.onAction(e);

    if (isPromise(promise)) {
      try {
        setInnerLoading(true);
        await promise;
        setInnerLoading(false);
      } catch (e) {
        setInnerLoading(false);
        throw e;
      }
    }
  };

  return withNativeProps(
    props.action,
    <button
      key={action.key}
      onClick={onClick}
      disabled={action.disabled}
      className={`${action.className || ""} ${action.primary ? "primary" : ""}`}
    >
      {innerLoading ? (
        <div className="loading-wrapper">
          <DotLoading />
        </div>
      ) : (
        action.text
      )}
    </button>
  );
};
