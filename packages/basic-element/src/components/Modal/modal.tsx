import type { FC, ReactNode } from "react";
import React, { useRef, useState } from "react";
import { mergeProps } from "../../utils/with-default-utls";
import { ShouldRender } from "../../utils/should-render";
import { renderToContainer } from "../../utils/render-to-container";
import type { PropagationEvent } from "../../utils/with-stop-propagation";
import { withStopPropagation } from "../../utils/with-stop-propagation";
import type { NativeProps } from "../../utils/with-native-props";
import { withNativeProps } from "../../utils/with-native-props";
import { animated, useSpring } from "@react-spring/web";
import type { GetContainerType } from "../../utils/utils";
import { useLockScroll } from "../../hooks/useLockScroll";
import useUnmountedRef from "../../hooks/useUnmountRef";
import { useInnerVisible } from "../../hooks/useInnerVisible";
import Mask from "../Mask";
import useIsomorphicLayoutEffect from "../../hooks/useIsomorphicLayoutEffect";
import { ModalStyle } from "./modal.style";
import { ModalActionButton } from "./modal-action-button";
import GlobalStyle from "../../style/GlobalStyle";

export type Action = {
  key: string | number;
  text: ReactNode;
  disabled?: boolean;
  danger?: boolean;
  primary?: boolean;
  onClick?: () => void | Promise<void>;
} & NativeProps;

export type ModalProps = {
  visible?: boolean;
  modalStyle?: React.CSSProperties;
  getContainer?: GetContainerType;
  stopPropagation?: PropagationEvent[];
  disableBodyScroll?: boolean;
  afterShow?: () => void;
  afterClose?: () => void;
  opacity?: "default" | "thin" | "thick" | number;
  children?: ReactNode;
  mask?: boolean;
  forceRender?: boolean;
  destroyOnClose?: boolean;
  maskStyle?: React.CSSProperties;
  onMaskClick?: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => void;
  closeOnMaskClick?: boolean; // 点击蒙层可关闭浮层
  onClose?: () => void;
  bodyStyle?: React.CSSProperties;
  showCloseButton?: boolean;
  // 操作按钮列表
  actions?: Action[];
  // 点击操作按钮后后是否关闭
  closeOnAction?: boolean;
  // 点击操作按钮时触发
  onAction?: (action: Action, index: number) => void | Promise<void>;
} & NativeProps<"--z-index">;

const defaultProps = {
  visible: true,
  mask: true,
  stopPropagation: ["click"],
  disableBodyScroll: true,
  opacity: "default",
  getContainer: () => document.body,
  closeOnMaskClick: false,
  actions: [],
  closeOnAction: false,
};

const Modal: FC<ModalProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const [active, setActive] = useState(props.visible);

  const ref = useRef<HTMLDivElement>(null);

  // 展示蒙层禁止滑动
  useLockScroll(ref, props.visible && props.disableBodyScroll);

  useIsomorphicLayoutEffect(() => {
    if (props.visible) {
      setActive(true);
    }
  }, [props.visible]);

  const unmountedRef = useUnmountedRef();
  const animatedStyle = useSpring({
    scale: props.visible ? 1 : 0.8,
    opacity: props.visible ? 1 : 0,
    config: {
      mass: 1.2,
      tension: 200,
      friction: 25,
      clamp: true,
    },
    onRest: () => {
      if (unmountedRef.current) return;
      setActive(props.visible);
      if (props.visible) {
        props.afterShow?.();
      } else {
        props.afterClose?.();
      }
    },
  });

  const maskVisible = useInnerVisible(active && props.visible);

  const node = withStopPropagation(
    props.stopPropagation,
    withNativeProps(
      props,
      <ModalStyle $active={active} className="check-stand-modal">
        <GlobalStyle />
        {props.mask && (
          <Mask
            opacity={props.opacity}
            visible={maskVisible}
            forceRender={props.forceRender}
            destroyOnClose={props.destroyOnClose}
            disableBodyScroll={props.disableBodyScroll}
            stopPropagation={props.stopPropagation}
            onMaskClick={(e) => {
              props.onMaskClick?.(e);
              if (props.closeOnMaskClick) {
                props.onClose?.();
              }
            }}
            style={props.maskStyle}
          />
        )}
        <div className="animated-div-modal" style={props.style}>
          <animated.div ref={ref} style={animatedStyle}>
            <div style={props.modalStyle} className="animated-div-modal-body">
              {props.showCloseButton && (
                <a
                  className="close-icon"
                  role="button"
                  aria-label="关闭"
                  onClick={() => props.onClose?.()}
                >
                  <img
                    src="https://imagev2.xmcdn.com/storages/ab9f-audiofreehighqps/08/29/GKwRIMAJ0Hc9AAABDAK6eHRL.png"
                    alt=""
                  />
                </a>
              )}
              <div className="content" style={props.bodyStyle}>
                {props.children}
              </div>
              {props.actions.length > 0 ? (
                <div className="footer">
                  {props.actions.map((action, index) => (
                    <ModalActionButton
                      key={action.key}
                      action={action}
                      onAction={async () => {
                        await Promise.all([
                          action.onClick?.(),
                          props.onAction?.(action, index),
                        ]);
                        if (props.closeOnAction) {
                          props.onClose?.();
                        }
                      }}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </animated.div>
        </div>
      </ModalStyle>,
    ),
  );

  return (
    <ShouldRender
      active={active}
      forceRender={props.forceRender}
      destroyOnClose={props.destroyOnClose}
    >
      {renderToContainer(props.getContainer, node)}
    </ShouldRender>
  );
};

export default Modal;
