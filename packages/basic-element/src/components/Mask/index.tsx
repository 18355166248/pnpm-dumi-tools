import type { FC, ReactNode } from "react";
import React, { useMemo, useRef, useState } from "react";
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
import { MaskStyle } from "./index.style";
import GlobalStyle from "../../style/GlobalStyle";

const opacityRecord = {
  default: 0.55,
  thin: 0.35,
  thick: 0.75,
};
const colorRecord: Record<string, string> = {
  black: "0, 0, 0",
  white: "255, 255, 255",
};

export type MaskProps = {
  visible?: boolean;
  getContainer?: GetContainerType;
  stopPropagation?: PropagationEvent[];
  destroyOnClose?: boolean;
  forceRender?: boolean;
  disableBodyScroll?: boolean;
  afterShow?: () => void;
  afterClose?: () => void;
  color?: "white" | "black" | (string & {});
  opacity?: "default" | "thin" | "thick" | number;
  children?: ReactNode;
  onMaskClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
} & NativeProps<"--z-index">;

const defaultProps = {
  visible: true,
  getContainer: null,
  stopPropagation: ["click"],
  disableBodyScroll: true,
  color: "black",
  opacity: "default",
};

const Mask: FC<MaskProps> = (p) => {
  const props = mergeProps(defaultProps, p);

  const [active, setActive] = useState(props.visible);

  const ref = useRef<HTMLDivElement>(null);

  // 展示蒙层禁止滑动
  useLockScroll(ref, props.visible && props.disableBodyScroll);

  const background = useMemo(() => {
    const opacity = opacityRecord[props.opacity] ?? props.opacity;
    const rgb = colorRecord[props.color];
    return rgb ? `rgba(${rgb}, ${opacity})` : props.color;
  }, [props.color, props.opacity]);

  const unmountedRef = useUnmountedRef();

  const { opacity } = useSpring({
    opacity: props.visible ? 1 : 0,
    config: {
      precision: 0.01,
      mass: 1,
      tension: 250,
      friction: 30,
      clamp: true,
    },
    onStart: () => {
      setActive(true);
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

  const node = withStopPropagation(
    props.stopPropagation,
    withNativeProps(
      props,
      <MaskStyle className="popup-mask">
        <GlobalStyle />
        <animated.div
          ref={ref}
          className="animated-div-mask"
          style={{
            ...props.style,
            opacity,
            background,
            display: active ? undefined : "none",
          }}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            if (e.target === e.currentTarget) {
              props.onMaskClick?.(e);
            }
          }}
        >
          {props.children}
        </animated.div>
      </MaskStyle>,
    ),
  );

  return (
    <ShouldRender active={active}>
      {renderToContainer(props.getContainer, node)}
    </ShouldRender>
  );
};

export default Mask;
