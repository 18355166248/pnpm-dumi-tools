/**
 * title: Modal
 * description: 声明式和命令式弹窗
 */
// @ts-ignore
import { Modal } from "basic-element";
import type { ModalShowHandler } from "../index";
import React, { useRef, useState } from "react";
import { Button } from "antd";
import closeIcon from "./assets/close.png";
import "./scss/retain.scoped.scss";

export default () => {
  const [visible, setVisible] = useState(false);
  const show0Ref = useRef<ModalShowHandler>();
  const show01Ref = useRef<ModalShowHandler>();

  function close0() {
    show0Ref.current?.close();
  }
  function close01() {
    show01Ref.current?.close();
  }
  function show0() {
    show0Ref.current = Modal.show({
      modalStyle: { width: 275 },
      children: (
        <>
          <div
            style={{
              paddingTop: 20,
              marginBottom: 3,
              fontFamily: "苹方-简",
              fontSize: 16,
              color: "#333",
              textAlign: "center",
            }}
          >
            支付未确认
          </div>
          <div className="text-center my-4">
            <Button onClick={close0}>手动关闭</Button>
          </div>
        </>
      ),
      actions: [
        {
          key: "online",
          text: "内置按钮关闭",
          primary: true,
        },
      ],
      closeOnAction: true,
    });
  }

  function show01() {
    show01Ref.current = Modal.show({
      modalStyle: { width: 275, padding: 0, overflow: "hidden" },
      children: (
        <div className='modal-demo-1'>
          <div className="header flex justify-end">
            <img
              src={closeIcon}
              onClick={close01}
              alt=""
              style={{ width: 16, height: 16 }}
            />
          </div>
          <div className="title">确认要离开收银台吗？</div>
          <div className="content-txt">
            您的订单在指定时间内未支付将被取消，请尽快支付
          </div>
          <div className="footer flex">
            <div className="left flex-1" onClick={close01}>
              确认离开
            </div>
            <div className="right flex-1">继续支付</div>
          </div>
        </div>
      ),
    });
  }

  function show1() {
    Modal.alert({
      modalStyle: { width: 275 },
      children: (
        <>
          <div
            style={{
              paddingTop: 20,
              marginBottom: 3,
              fontFamily: "苹方-简",
              fontSize: 16,
              color: "#333",
              textAlign: "center",
            }}
          >
            支付未确认
          </div>
          <div
            style={{
              fontFamily: "苹方-简",
              fontSize: 13,
              color: "#666",
              marginBottom: 16,
              textAlign: "center",
              padding: "0 12px",
            }}
          >
            第三方支付未响应，可点击“刷新”获取最新状态
          </div>
        </>
      ),
      confirmText: "刷新",
      onConfirm: async () => {},
    });
  }
  function show2() {
    Modal.confirm({
      modalStyle: { width: 260 },
      children: (
        <>
          <div
            style={{
              paddingTop: 20,
              marginBottom: 3,
              fontFamily: "苹方-简",
              fontSize: 16,
              color: "#333",
              textAlign: "center",
            }}
          >
            支付未确认
          </div>
          <div
            style={{
              fontFamily: "苹方-简",
              fontSize: 13,
              color: "#666",
              marginBottom: 16,
              textAlign: "center",
              padding: "0 12px",
            }}
          >
            第三方支付未响应，可点击“刷新”获取最新状态
          </div>
        </>
      ),
      confirmText: "刷新",
      onConfirm: async () => {},
      cancelText: "取消",
    });
  }

  return (
    <>
      <div className="mb-2 text-gray-700">声明式</div>
      <div>
        <Button
          className="mt-4"
          onClick={() => {
            setVisible(true);
          }}
        >
          显示弹窗
        </Button>
      </div>

      <div className="mt-6 mb-2 text-gray-700">指令式</div>
      <div>
        <Button className="mt-4" onClick={show0}>
          显示弹窗
        </Button>
      </div>
      <div>
        <Button className="mt-4" onClick={show01}>
          显示弹窗(自定义按钮)
        </Button>
      </div>
      <div>
        <Button className="mt-4" onClick={show1}>
          显示弹窗Alert
        </Button>
      </div>
      <div>
        <Button className="mt-4" onClick={show2}>
          显示弹窗Confirm
        </Button>
      </div>

      <Modal
        modalStyle={{ width: 200 }}
        visible={visible}
        closeOnAction
        onClose={() => {
          setVisible(false);
        }}
        actions={[
          {
            key: "confirm",
            text: "我知道了",
            primary: true,
          },
        ]}
      >
        <div className="py-6 text-lg text-center">标题内容</div>
      </Modal>
    </>
  );
};
