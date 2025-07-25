import { useTouch } from "./useTouch";
import type { RefObject } from "react";
import { useEffect } from "react";
import { getScrollParent } from "../utils/get-scroll-parent";
import { supportsPassive } from "../utils/supports-passive";

let totalLockCount = 0;

const BODY_LOCK_CLASS = "overflow-hidden";

function getScrollableElement(el: HTMLElement | null) {
  let current = el?.parentElement;

  while (current) {
    if (current.clientHeight < current.scrollHeight) {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

// 移植自vant：https://github.com/youzan/vant/blob/HEAD/src/composables/use-lock-scroll.ts
export function useLockScroll(
  rootRef: RefObject<HTMLElement>,
  shouldLock: boolean | "strict"
) {
  const touch = useTouch();

  const onTouchMove = (event: TouchEvent) => {
    touch.move(event);

    const direction = touch.deltaY.current > 0 ? "10" : "01";
    const el = getScrollParent(
      event.target as Element,
      rootRef.current
    ) as HTMLElement;
    if (!el) return;

    // This has perf cost but we have to compatible with iOS 12
    if (shouldLock === "strict") {
      const scrollableParent = getScrollableElement(
        event.target as HTMLElement
      );
      if (
        scrollableParent === document.body ||
        scrollableParent === document.documentElement
      ) {
        event.preventDefault();
        return;
      }
    }

    const { scrollHeight, offsetHeight, scrollTop } = el;
    const { height } = el.getBoundingClientRect();
    let status = "11";

    if (scrollTop === 0) {
      status = offsetHeight >= scrollHeight ? "00" : "01";
    } else if (scrollHeight <= Math.round(height + scrollTop)) {
      status = "10";
    }

    if (
      status !== "11" &&
      touch.isVertical() &&
      !(parseInt(status, 2) & parseInt(direction, 2))
    ) {
      if (event.cancelable && supportsPassive) {
        // https://github.com/ant-design/ant-design-mobile/issues/6282
        event.preventDefault();
      }
    }
  };

  const lock = () => {
    document.addEventListener("touchstart", touch.start);
    document.addEventListener(
      "touchmove",
      onTouchMove,
      supportsPassive ? { passive: false } : false
    );

    if (!totalLockCount) {
      document.body.classList.add(BODY_LOCK_CLASS);
    }

    totalLockCount++;
  };

  const unlock = () => {
    if (totalLockCount) {
      document.removeEventListener("touchstart", touch.start);
      document.removeEventListener("touchmove", onTouchMove);

      totalLockCount--;

      if (!totalLockCount) {
        document.body.classList.remove(BODY_LOCK_CLASS);
      }
    }
  };

  useEffect(() => {
    if (shouldLock) {
      lock();
      return () => {
        unlock();
      };
    }
  }, [shouldLock]);
}
