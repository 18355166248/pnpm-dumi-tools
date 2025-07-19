export const isWindow = () => {
  return typeof window !== "undefined";
};

const href = isWindow() ? window.location.href : "";
const ua = isWindow() ? window.navigator.userAgent : "";

export const isInNative = /(iting|xmly\(baby\))/i.test(ua); // 主站和喜马儿童
export const isInWeChat = /micromessenger/i.test(ua) && !/wxwork/i.test(ua);
export const isInIos = /(?:iPad)|(?:iPhone)/i.test(ua);
export const isInAndroid = /android/i.test(ua);
export const isTest =
  href.indexOf("test.ximalaya.com") > -1 || href.indexOf("localhost") > -1;
export const isUat = href.indexOf("uat.ximalaya.com") > -1;

export const isSafari = ua.indexOf("Safari") > -1;

export const appVersion = isInNative
  ? (ua.match(
      /(kdtunion_iting|iting)\/(\d(\.\d{1,3}){2,3})/,
      // eslint-disable-next-line no-sparse-arrays
    ) || [, , "0"])[2]
  : "0";

export const object2Query = (obj: Record<string, any>) => {
  const arr: string[] = [];
  Object.keys(obj).forEach((key) => {
    const str = `${key}=${
      typeof obj[key] === "string" ? obj[key] : JSON.stringify(obj[key])
    }`;
    arr.push(str);
  });
  return arr.join("&");
};

interface OnPageVisibilityProps {
  show?: () => void;
  hide?: () => void;
}
type DestroyCB = () => void;

/* 监听页面显示隐藏 */
export function onPageVisibility({
  show,
  hide,
}: OnPageVisibilityProps): () => void {
  const destroyList: DestroyCB[] = [];
  const _t: {
    showTime?: number;
    hideTime?: number;
  } = {};

  const onShowCall = function () {
    if (!show) {
      return;
    }
    window.clearTimeout(_t.showTime);
    _t.showTime = window.setTimeout(() => {
      show?.();
    }, 100);
  };

  const onHideCall = function () {
    if (!hide) {
      return;
    }
    window.clearTimeout(_t.hideTime);
    _t.hideTime = window.setTimeout(() => {
      hide?.();
    }, 100);
  };

  function onChangeVisibility() {
    const visibility = document.visibilityState;
    if (visibility === "visible") {
      onShowCall();
    } else if (visibility === "hidden") {
      onHideCall();
    }
  }

  document.addEventListener("visibilitychange", onChangeVisibility, false);
  destroyList.push(() => {
    document.removeEventListener("visibilitychange", onChangeVisibility, false);
  });

  if (show) {
    window.addEventListener("pageshow", onShowCall, false);
    destroyList.push(() => {
      window.removeEventListener("pageshow", onShowCall, false);
    });
  }

  if (hide) {
    window.addEventListener("pagehide", onHideCall, false);
    destroyList.push(() => {
      window.removeEventListener("pagehide", onHideCall, false);
    });
  }

  return function () {
    destroyList.forEach((item) => item());
  };
}
