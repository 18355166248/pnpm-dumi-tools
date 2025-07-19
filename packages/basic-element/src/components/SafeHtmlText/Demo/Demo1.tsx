/**
 * title: SafeHtmlText
 * description:
 */

// @ts-ignore
import { SafeHtmlText } from "basic-element";
import { useState } from "react";
import { Input } from "antd";
import React from "react";

export default () => {
  const [value, setValue] = useState(
    "到期前1天为您<b>自动续费20元/月</b>，可随时取消"
  );

  return (
    <>
      <div className="mb-8">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </div>

      <div>
        <span style={{ color: "#AAAAAA" }}>
          <SafeHtmlText text={value} />
        </span>
      </div>
    </>
  );
};
