/**
 * title: Modal
 * description: 使用Hook模式
 */

import { Button } from "antd";
import useLoading from "./hook/useLoading";
import useLoadingPay from "./hook/useLoadingPay";
import "./common.css";
import React from "react";

export default () => {
  const { showLoading, hideLoading } = useLoading();
  const { showSearchResultLoading, hideSearchResultLoading } = useLoadingPay();

  function show1() {
    showLoading();

    setTimeout(() => {
      hideLoading();
    }, 1000);
  }

  function show2() {
    showSearchResultLoading();

    setTimeout(() => {
      hideSearchResultLoading();
    }, 2000);
  }

  return (
    <>
      <div className="mb-4">
        <Button onClick={show1}>展示 Loading</Button>
      </div>

      <div>
        <Button onClick={show2}>展示结果 Loading</Button>
      </div>
    </>
  );
};
