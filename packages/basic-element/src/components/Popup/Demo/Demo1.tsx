/**
 * title: Modal
 * description: 使用Hook模式
 */

import { Button } from "antd";
// @ts-ignore
import { Popup } from "basic-element";
import React, { useState } from "react";

export default () => {
  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);

  function popupShow() {
    Popup.show({
      children: <div>222</div>,
      closeOnMaskClick: true,
      bodyStyle: {
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        height: "auto",
        minHeight: 380,
      },
    });
  }

  return (
    <>
      <div className="mt-6 mb-2 text-gray-700">声明式</div>
      <div className="mb-4">
        <Button
          onClick={() => {
            setVisible1(true);
          }}
        >
          底部弹出
        </Button>
      </div>

      <div>
        <Button
          onClick={() => {
            setVisible2(true);
          }}
        >
          圆角的弹出层
        </Button>
      </div>

      <div className="mt-6 mb-2 text-gray-700">指令式</div>

      <div className="mb-4">
        <Button
          onClick={() => {
            popupShow();
          }}
        >
          指令式弹出
        </Button>
      </div>
      <Popup
        visible={visible1}
        onMaskClick={() => {
          setVisible1(false);
        }}
        onClose={() => {
          setVisible1(false);
        }}
        bodyStyle={{
          height: "40vh",
        }}
      >
        Popup 内容
      </Popup>
      <Popup
        visible={visible2}
        onMaskClick={() => {
          setVisible2(false);
        }}
        onClose={() => {
          setVisible2(false);
        }}
        bodyStyle={{
          height: "40vh",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
        showCloseButton
      >
        Popup 内容
        <div>带圆角的浮层</div>
      </Popup>
    </>
  );
};
