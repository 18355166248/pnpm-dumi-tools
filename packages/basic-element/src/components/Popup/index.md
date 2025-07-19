---
title: Popup
nav:
  title: 基础组件
  path: /basic-element
  order: 2
group:
  title: 弹窗
  path: /modal
  order: 1
order: 2
---

## Popup 弹出层

从屏幕滑出或弹出一块自定义内容区。

### 何时使用

适用于展示弹窗、信息提示、选择输入、切换等内容，支持多个弹出层叠加展示。

### 代码演示

<code src="./Demo/Demo1.tsx" ></code>

### Modal

#### 属性

| 参数              | 说明                                                     | 类型                                                            | 默认值    | 版本 |
| ----------------- | -------------------------------------------------------- | --------------------------------------------------------------- | --------- | ---- |
| visible           | 是否可见                                                 | boolean                                                         | true      |      |
| getContainer      | 指定挂载的 HTML 节点，如果为 null 的话，会渲染到当前节点 | HTMLElement \| () => HTMLElement \| null                        | body      |      |
| stopPropagation   | 阻止某些事件的冒泡                                       | PropagationEvent[]                                              | ['click'] |      |
| destroyOnClose    | 不可见时是否销毁 DOM 结构                                | boolean                                                         | false     |      |
| forceRender       | 强制渲染内容                                             | boolean                                                         | false     |      |
| disableBodyScroll | 是否禁用 body 滚动                                       | boolean                                                         | true      |      |
| afterShow         | 完全展示后触发                                           | () => void                                                      | -         |      |
| afterClose        | 完全关闭后触发                                           | () => void                                                      | -         |      |
| color             | 背景色颜色                                               | `"white" \| "black" \| (string & {})`                           | black     |      |
| opacity           | 背景色透明度                                             | `"default" \| "thin" \| "thick" \| number`                      | default   |      |
| children          | 内容                                                     | React.ReactNode                                                 | -         |      |
| onMaskClick       | 点击蒙层自身触发                                         | `(event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void` | -         |      |
| closeOnMaskClick  | 点击蒙层可关闭浮层                                       | boolean                                                         | false     |      |
| bodyStyle         | 内容区域样式                                             | React.CSSProperties                                             | -         |      |
| showCloseButton   | 是否显示关闭按钮                                         | boolean                                                         | false     |      |
| onClose           | 关闭时触发                                               | () => void                                                      | -         |      |
| mask              | 蒙层                                                     | boolean                                                         | true      |      |
