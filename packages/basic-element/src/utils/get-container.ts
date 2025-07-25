import type { GetContainerType } from "./utils";

export type GetContainer = () => HTMLElement;

export function resolveContainer(getContainer: GetContainerType) {
  const container =
    typeof getContainer === "function"
      ? (getContainer as GetContainer)()
      : getContainer;

  return container || document.body;
}
