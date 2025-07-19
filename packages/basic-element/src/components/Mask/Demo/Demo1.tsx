/**
 * title: Mask
 * description:
 */

// @ts-ignore
import { Mask } from "basic-element";
import { useState } from "react";
import { Button } from "antd";
import React from "react";

export default () => {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Button onClick={() => setVisible(true)}>显示背景蒙层</Button>
      <Mask
        visible={visible}
        forceRender
        disableBodyScroll
        onMaskClick={() => {
          setVisible(false);
        }}
      />
    </>
  );
};
