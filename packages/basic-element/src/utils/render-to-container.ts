import type { ReactElement } from "react";
import { canUseDom } from "./can-use-dom";
import type { GetContainerType } from "./utils";
import { resolveContainer } from "./get-container";
import { createPortal } from "react-dom";

export function renderToContainer(
  getContainer: GetContainerType,
  node: ReactElement,
) {
  if (canUseDom && getContainer) {
    const container = resolveContainer(getContainer);
    return createPortal(node, container);
  }
  return node;
}
