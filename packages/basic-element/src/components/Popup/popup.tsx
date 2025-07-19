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
import { PopupStyle } from "./index.style";
import GlobalStyle from "../../style/GlobalStyle";

export type PopupProps = {
  visible?: boolean;
  getContainer?: GetContainerType;
  stopPropagation?: PropagationEvent[];
  disableBodyScroll?: boolean;
  afterShow?: () => void;
  afterClose?: () => void;
  color?: "white" | "black" | (string & {});
  opacity?: "default" | "thin" | "thick" | number;
  children?: ReactNode;
  mask?: boolean;
  forceRender?: boolean;
  destroyOnClose?: boolean;
  onMaskClick?: (
    event:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => void;
  closeOnMaskClick?: boolean; // 点击蒙层可关闭浮层
  onClose?: () => void;
  bodyStyle?: React.CSSProperties;
  showCloseButton?: boolean;
} & NativeProps<"--z-index">;

const defaultProps = {
  visible: true,
  stopPropagation: ["click"],
  disableBodyScroll: true,
  color: "black",
  opacity: "default",
  getContainer: () => document.body,
  closeOnMaskClick: false,
  mask: true,
};

const Popup: FC<PopupProps> = (p) => {
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

  const { percent } = useSpring({
    percent: props.visible ? 0 : 100,
    config: {
      precision: 0.1,
      mass: 0.4,
      tension: 300,
      friction: 30,
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
      <PopupStyle $active={active} className="check-stand-popup">
        <GlobalStyle />
        {props.mask && (
          <Mask
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
          />
        )}
        <animated.div
          ref={ref}
          className="animated-div-popup"
          style={{
            ...props.bodyStyle,
            paddingTop: props.showCloseButton ? 34 : 0,
            transform: percent.to((v) => {
              /* 修复ios下弹窗层级不够的情况 */
              return `translate3d(0, ${v}%, 2px)`;
            }),
          }}
        >
          {props.showCloseButton && (
            <a
              className="close-icon"
              role="button"
              aria-label="关闭"
              onClick={(e) => props.onMaskClick?.(e)}
            >
              <img
                src="https://imagev2.xmcdn.com/storages/72b9-audiofreehighqps/A5/CA/GMCoOScFymS-AAABLgESU70K.png"
                alt=""
              />
            </a>
          )}
          {props.children}
        </animated.div>
      </PopupStyle>,
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

export default Popup;
