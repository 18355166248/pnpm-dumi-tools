// 监听横竖屏
// 重写 orientationchange 原生方法
// 参考 https://github.com/zhansingsong/orientationchange-fix/tree/master
// MDN https://developer.mozilla.org/zh-CN/docs/Web/API/Window/orientationchange_event

let init = false;

export function rewriteOrientationchange() {
  if (typeof window === "undefined" || !window || init) return;
  init = true;

  const meta: {
    current: string;
    init: string;
    isOrientation: boolean;
    font?: any;
  } = {
    isOrientation: false,
    current: "",
    init: "",
  };
  let timer: any;

  const eventType = "orientationchange";
  // 是否支持orientationchange事件
  const isOrientation =
    "orientation" in window && "onorientationchange" in window;
  meta.isOrientation = isOrientation;

  // font-family
  const html = document.documentElement;
  const hstyle = window.getComputedStyle(html, null);
  // @ts-ignore
  const ffstr = hstyle["font-family"];
  meta.font = ffstr;

  // automatically load css script
  function loadStyleString(css: string) {
    const _style = document.createElement("style");
    const _head = document.head
      ? document.head
      : document.getElementsByTagName("head")[0];
    _style.type = "text/css";
    try {
      _style.appendChild(document.createTextNode(css));
    } catch (ex) {
      // lower IE support, if you want to know more about this to see http://www.quirksmode.org/dom/w3c_css.html
      // @ts-ignore
      _style.styleSheet.cssText = css;
    }
    _head.appendChild(_style);
    return _style;
  }

  // 触发原生orientationchange
  const isSupportCustomEvent = window.CustomEvent ? true : false;
  let fireEvent: any;

  // https://github.com/krambuhl/custom-event-polyfill/blob/master/custom-event-polyfill.js
  // Polyfill for creating CustomEvents on IE9/10/11
  if (isSupportCustomEvent) {
    try {
      const ce = new window.CustomEvent("test");
      ce.preventDefault();
      if (ce.defaultPrevented !== true) {
        // IE has problems with .preventDefault() on custom events
        // http://stackoverflow.com/questions/23349191
        throw new Error("Could not prevent default");
      }
    } catch (e) {
      const CustomEvent = function (
        event: string,
        params: { bubbles: any; cancelable: any; detail: any },
      ) {
        let evt: CustomEvent<any>;
        let origPrevent: { (): void; call?: any };
        // eslint-disable-next-line no-param-reassign
        params = params || {
          bubbles: false,
          cancelable: false,
          detail: undefined,
        };

        evt = document.createEvent("CustomEvent");
        evt.initCustomEvent(
          event,
          params.bubbles,
          params.cancelable,
          params.detail,
        );
        origPrevent = evt.preventDefault;
        evt.preventDefault = function () {
          origPrevent.call(this);
          try {
            Object.defineProperty(this, "defaultPrevented", {
              get: function () {
                return true;
              },
            });
          } catch (e) {
            // @ts-ignore
            this.defaultPrevented = true;
          }
        };
        return evt;
      };

      CustomEvent.prototype = window.Event.prototype;
      // @ts-ignore
      window.CustomEvent = CustomEvent; // expose definition to window
    }
  }

  fireEvent = isSupportCustomEvent
    ? function (
        element: { dispatchEvent: (arg0: CustomEvent<any>) => void },
        eventName: string,
        params: {
          bubbles: boolean | undefined;
          cancelable: boolean | undefined;
          detail: any;
        },
      ) {
        const evt = document.createEvent("CustomEvent");
        if (params) {
          evt.initCustomEvent(
            eventName,
            params.bubbles,
            params.cancelable,
            params.detail,
          );
        } else {
          // eslint-disable-next-line no-void
          evt.initCustomEvent(eventName, false, false, void 0);
        }
        if (element.dispatchEvent) {
          element.dispatchEvent(evt);
        }
        return evt;
      }
    : function (
        element: {
          [x: string]: (arg0: any) => void;
          // @ts-ignore
          fireEvent: (arg0: string, arg1: any) => void;
        },
        eventName: string,
        params: { bubbles: any; cancelable: any; detail: any },
      ) {
        // @ts-ignore
        const evt = document.createEventObject();
        evt.type = eventName;
        if (params) {
          evt.bubbles = Boolean(params.bubbles);
          evt.cancelable = Boolean(params.cancelable);
          evt.detail = params.detail;
        } else {
          evt.bubbles = false;
          evt.cancelable = false;
          // eslint-disable-next-line no-void
          evt.detail = void 0;
        }
        // fire
        if (element[eventName]) {
          element[eventName](evt);
        } else if (element["on" + eventName]) {
          element["on" + eventName](evt);
        } else if (element.fireEvent && "on" + eventName in element) {
          // 针对IE8及以下版本，fireEvent|attachEvent|detachEvent只能使用如下事件名
          element.fireEvent("on" + eventName, evt);
        }
        return evt;
      };

  // callback
  const orientationCB = function () {
    if (window.orientation === 180 || window.orientation === 0) {
      meta.init = "portrait";
      meta.current = "portrait";
    }
    if (window.orientation === 90 || window.orientation === -90) {
      meta.init = "landscape";
      meta.current = "landscape";
    }
    return function () {
      if (window.orientation === 180 || window.orientation === 0) {
        meta.current = "portrait";
      }
      if (window.orientation === 90 || window.orientation === -90) {
        meta.current = "landscape";
      }
      // @ts-ignore
      fireEvent(window, eventType);
    };
  };
  let resizeCB = function () {
    const pstr = "portrait, " + ffstr;
    const lstr = "landscape, " + ffstr;
    const cssstr =
      "@media (orientation: portrait) { .orientation{font-family:" +
      pstr +
      ";} } @media (orientation: landscape) {  .orientation{font-family:" +
      lstr +
      ";}}";

    // 载入样式
    loadStyleString(cssstr);
    // 添加类
    html.className = "orientation " + html.className;
    // @ts-ignore
    if (hstyle["font-family"] === pstr) {
      // 初始化判断
      meta.init = "portrait";
      meta.current = "portrait";
    } else {
      meta.init = "landscape";
      meta.current = "landscape";
    }
    resizeCB = function () {
      // @ts-ignore
      if (hstyle["font-family"] === pstr) {
        if (meta.current !== "portrait") {
          meta.current = "portrait";
          // @ts-ignore
          fireEvent(window, eventType);
        }
      } else {
        if (meta.current !== "landscape") {
          meta.current = "landscape";
          // @ts-ignore
          fireEvent(window, eventType);
        }
      }
    };
  };
  const callback = isOrientation
    ? orientationCB()
    : (function () {
        resizeCB();
        return function () {
          timer && window.clearTimeout(timer);
          timer = window.setTimeout(resizeCB, 300);
        };
      })();

  // 监听
  window.addEventListener(
    isOrientation ? "orientationchange" : "resize",
    callback,
    false,
  );

  // @ts-ignore
  window.neworientation = meta;
}
