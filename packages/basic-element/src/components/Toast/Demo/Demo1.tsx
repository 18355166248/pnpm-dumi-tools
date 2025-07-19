/**
 * title: Toast
 * description:
 */
// @ts-ignore
import { Toast } from "basic-element";
import React, { useState } from "react";

export default () => {
  const [num, setNum] = useState(1);
  return (
    <>
      <div className="mb-2 text-gray-700">基础用法</div>
      <div className="text-red-700">{num}</div>
      <div className="mb-4">
        <button
          className="w-full px-4 py-2 border border-gray-500 text-center rounded"
          onClick={() => setNum(num + 1)}
        >
          Toast不阻碍背景点击
        </button>
      </div>
      <button
        className="w-full px-4 py-2 mb-4 border border-gray-500 text-center rounded"
        onClick={() => {
          Toast.show({
            content: "Hello World, This is a long text",
            afterClose: () => {
              console.log("after");
            },
          });
        }}
      >
        轻提示
      </button>

      <button
        className="w-full px-4 py-2 mb-4 border border-gray-500 text-center rounded"
        onClick={() => {
          Toast.show({
            content: "Hello World, This is a long text",
            afterClose: () => {
              console.log("after");
            },
            maskClickable: false,
          });
        }}
      >
        阻止背景点击
      </button>
    </>
  );
};
