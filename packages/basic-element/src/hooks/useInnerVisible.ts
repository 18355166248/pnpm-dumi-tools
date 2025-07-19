import { useState } from "react";
import useIsomorphicLayoutEffect from "./useIsomorphicLayoutEffect";

export function useInnerVisible(outerVisible: boolean) {
  const [innerVisible, setInnerVisible] = useState(outerVisible);

  useIsomorphicLayoutEffect(() => {
    setInnerVisible(outerVisible);
  }, [outerVisible]);

  return innerVisible;
}
