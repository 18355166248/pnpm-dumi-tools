import { canUseDom } from "./can-use-dom";

/* 检测浏览器是否支持该特性 */
export let supportsPassive = false;

// 使用 passive 改善滚屏性能
// https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#%E4%BD%BF%E7%94%A8_passive_%E6%94%B9%E5%96%84%E6%BB%9A%E5%B1%8F%E6%80%A7%E8%83%BD
if (canUseDom) {
  try {
    const opts = {};
    Object.defineProperty(opts, "passive", {
      // eslint-disable-next-line getter-return
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener("test-passive", null as any, opts);
  } catch (e) {}
}
