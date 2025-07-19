import { Table, Image, Button } from "antd";
import React from "react";
import type { FC } from "react";

function CheckStandPreview({ src }: any) {
  return <Image src={`${process.env.DUMI_PUBLIC_PATH}${src}`} width={80} />;
}

function Link({ href, title = "对接地址" }: any) {
  return (
    <Button type="link" href={href} target="_blank" style={{ padding: 0 }}>
      {title}
    </Button>
  );
}

const dataSource = [
  {
    key: "1",
    name: (
      <>
        <div>H5单买收银台</div>
        <div>h5_checkstand</div>
      </>
    ),
    scene: "站外",
    way: "H5链接",
    connect: "通过H5结算页或联系中台",
    preview: <CheckStandPreview src="checkstand-img/H5收银台.png" />,
  },
  {
    key: "2",
    name: (
      <>
        <div>H5单买浮层收银台</div>
        <div>h5_popup_checkstand</div>
      </>
    ),
    scene: "站内&微信环境",
    way: "组件",
    connect: (
      <Link href="http://cft.pages.xmly.work/sunshine/#/packages/popup-checkstand" />
    ),
    preview: <CheckStandPreview src="checkstand-img/H5浮层收银台.png" />,
  },
  {
    key: "3",
    name: (
      <>
        <div>H5单买前置收银台</div>
        <div>h5_pre_checkstand</div>
      </>
    ),
    scene: "站内&微信环境",
    way: "组件",
    connect: (
      <Link href="https://m.test.ximalaya.com/gatekeeper/checkstand-tools#/checkstands" />
    ),
    preview: <CheckStandPreview src="checkstand-img/H5前置收银台.png" />,
  },
  {
    key: "4",
    name: (
      <>
        <div>RN单买收银台</div>
        <div>rn_checkstand</div>
        <div>rn_popup_checkstand</div>
      </>
    ),
    scene: "站内",
    way: "iting链接",
    connect: "通过H5结算页或联系中台",
    preview: (
      <>
        浮层
        <CheckStandPreview src="checkstand-img/RN单买收银台(弹窗).png" />
        全屏
        <CheckStandPreview src="checkstand-img/RN单买收银台(全屏).png" />
      </>
    ),
  },
  {
    key: "5",
    name: (
      <>
        <div>RN单买前置收银台</div>
        <div>rn_pre_checkstand</div>
      </>
    ),
    scene: "站内",
    way: "iting链接",
    connect: "联系中台",
    preview: <CheckStandPreview src="checkstand-img/H5前置收银台.png" />,
  },
  {
    key: "6",
    name: (
      <>
        <div>H5订阅收银台</div>
        <div>h5_sub_checkstand</div>
      </>
    ),
    scene: "站外",
    way: "H5链接",
    connect: (
      <Link href="https://m.test.ximalaya.com/gatekeeper/checkstand-tools#/checkstands/subscribe" />
    ),
    preview: <CheckStandPreview src="checkstand-img/H5订阅收银台.png" />,
  },
  {
    key: "7",
    name: (
      <>
        <div>H5订阅浮层收银台</div>
        <div>h5_popup_sub_checkstand</div>
      </>
    ),
    scene: "站内&微信环境&普通浏览器",
    way: "组件",
    connect: (
      <Link href="https://m.test.ximalaya.com/gatekeeper/checkstand-tools#/checkstands/subscirbe" />
    ),
    preview: <CheckStandPreview src="checkstand-img/H5浮层订阅收银台.png" />,
  },
  {
    key: "8",
    name: (
      <>
        <div>
          H5订阅前置收银台
        </div>
        <div>h5_pre_sub_checkstand</div>
      </>
    ),
    scene: "站内&微信环境&普通浏览器",
    way: "组件",
    connect: (
      <Link href="https://m.test.ximalaya.com/gatekeeper/checkstand-tools#/checkstands/pre-subscirbe" />
    ),
    preview: "开发中",
  },
  {
    key: "9",
    name: (
      <>
        <div>RN订阅收银台</div>
        <div>rn_popup_sub_checkstand</div>
      </>
    ),
    scene: "站内",
    way: "iting链接",
    connect: (
      <Link href="https://alidocs.dingtalk.com/i/nodes/MNDoBb60VLrORlpeSvwDwevN8lemrZQ3" />
    ),
    preview: (
      <>
        默认
        <CheckStandPreview src="checkstand-img/RN订阅收银台.png" />
        暗黑
        <CheckStandPreview src="checkstand-img/RN订阅收银台暗黑.png" />
      </>
    ),
  },
];

const columns = [
  {
    title: "名称",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "场景",
    dataIndex: "scene",
    key: "scene",
  },
  {
    title: "使用方式",
    dataIndex: "way",
    key: "way",
  },
  {
    title: "对接",
    dataIndex: "connect",
    key: "connect",
  },
  {
    title: "预览",
    dataIndex: "preview",
    key: "preview",
  },
];

const MapCheckStand: FC = () => {
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={false} />
    </div>
  );
};

export default MapCheckStand;
