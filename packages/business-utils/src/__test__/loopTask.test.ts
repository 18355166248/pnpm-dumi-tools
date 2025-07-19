import { loopTask } from "../loopTask";

let numberCounter = 3;

beforeEach(() => {
  numberCounter = 3;
});

// 确保测试运行环境支持Promise
if (!global.Promise) {
  global.Promise = require("promise-polyfill");
}

const mockErrorCallback = jest.fn();
const mockFn = jest.fn(() => Promise.resolve("mockFn result"));

beforeEach(() => {
  mockErrorCallback.mockClear();
  mockFn.mockClear();
});

describe("loopTask", () => {
  test("测试成功的场景", (done) => {
    loopTask({
      fn: mockFn,
      params: "mockParams",
      interval: 3,
      handler: mockHandler,
      successCallback: mockSuccessCallback,
      errorCallback: mockErrorCallback,
      timeout: 0,
    });

    function mockSuccessCallback(res: string) {
      expect(res).toBe("111");
      done();
    }

    function mockHandler(res: string) {
      expect(res).toBe("mockFn result");
      return Promise.resolve("111");
    }
    expect(mockFn).toHaveBeenCalledWith("mockParams");
  });
});
