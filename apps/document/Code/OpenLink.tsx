import React from "react";
import { Input, Button } from "antd";

function OpenLink() {
  const [value, setValue] = React.useState("");

  function open() {
    window.location.href = value;
  }
  return (
    <div>
      <div className="mb-4 break-all">链接: {value}</div>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />

      <div className="mt-4">
        <Button type="primary" onClick={open}>
          打开链接
        </Button>
      </div>
    </div>
  );
}

export default OpenLink;
