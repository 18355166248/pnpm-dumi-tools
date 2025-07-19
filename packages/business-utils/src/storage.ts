import { isLyInvokeApp, isWindow } from "./_base";

// 获取缓存
export const getStorage = ({
  key,
}: {
  key: string;
}): Promise<string | null> => {
  return new Promise((resolve) => {
    if (isLyInvokeApp()) {
      window.ly.invokeApp("storage.getItem", {
        key, // 存储信息的key
        success(data: { key: string; value: string }) {
          resolve(data.value);
        },
        fail() {
          resolve(null);
        },
      });
    } else if (isWindow() && window.localStorage) {
      const value = window.localStorage.getItem(key);
      resolve(value || null);
    } else {
      resolve(null);
    }
  });
};
export const setStorage = ({ key, value }: { key: string; value: string }) => {
  return new Promise((resolve, reject) => {
    isLyInvokeApp()
      ? window.ly.invokeApp("storage.setItem", {
          key, // 存储信息的key
          value, // 存储信息的value
          success(data: any) {
            resolve(data);
          },
          fail(err: any) {
            reject(new Error(err));
          },
        })
      : reject(new Error());
  });
};
