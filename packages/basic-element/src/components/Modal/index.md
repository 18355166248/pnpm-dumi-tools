---
title: Modal
nav:
  title: 基础组件
  path: /basic-element
  order: 2
group:
  title: 弹窗
  path: /modal
  order: 1
order: 1
---

## Modal 弹窗

### 使用场景

用于重要信息的告知或操作的反馈，并附带少量的选项供用户进行操作。

### 何时使用

需要用户处理事务，又不希望跳转页面以致打断工作流程时，可以使用 Modal 在当前页面正中打开一个浮层，承载相应的操作。

### 代码演示

<code src="./Demo/Demo1.tsx" ></code>
<code src="./Demo/Demo2.tsx" ></code>

### Modal

#### 属性

| 参数              | 说明                         | 类型                                       | 默认值    | 版本 |
| ----------------- | ---------------------------- | ------------------------------------------ | --------- | ---- |
| visible           | 显示隐藏                     | boolean                                    | false     |      |
| modalStyle        | Modal 内容样式               | React.CSSProperties                        | -         |      |
| bodyStyle         | content 内容样式             | React.CSSProperties                        | -         |      |
| getContainer      | 自定义弹窗的父容器           | HTMLElement \| (() => HTMLElement) \| null | body      |      |
| stopPropagation   | 阻止某些事件的冒泡           | PropagationEvent[]                         | ['click'] |      |
| disableBodyScroll | 背景蒙层是否禁用 body 滚动   | boolean                                    | true      |      |
| afterShow         | 完全展示后触发               | () => void                                 | -         |      |
| afterClose        | Modal 完全关闭后的回调       | () => void                                 | -         |      |
| opacity           | mask透明度                   | default \| thin \| thick \| number         | default   |      |
| children          | 弹窗内容                     | React.ReactNode                            | -         |      |
| mask              | 是否展示蒙层                 | boolean                                    | true      |      |
| forceRender       | 被隐藏时是否渲染 DOM 结构    | boolean                                    | false     |      |
| destroyOnClose    | 不可见时是否销毁 DOM 结构    | boolean                                    | false     |      |
| onMaskClick       | 点击蒙层的回调               | (e) => void                                | -         |      |
| closeOnMaskClick  | 是否支持点击遮罩关闭弹窗     | boolean                                    | false     |      |
| onClose           | 关闭时触发                   | () => void                                 | -         |      |
| showCloseButton   | 是否在右上角显示关闭图标按钮 | boolean                                    | false     |      |
| actions           | 操作按钮列表                 | Action[]                                   | []        |      |
| closeOnAction     | 点击操作按钮后后是否关闭     | boolean                                    | false     |      |

#### Action

| 属性      | 说明           | 类型                          | 默认值 |
| --------- | -------------- | ----------------------------- | ------ |
| className | Action 类名    | string                        | -      |
| danger    | 是否为危险状态 | boolean                       | false  |
| disabled  | 是否为禁用状态 | boolean                       | false  |
| key       | 唯一标记       | string \| number              | -      |
| onClick   | 点击时触发     | () => void \| Promise<void> - | -      |
| primary   | 是否为主要状态 | boolean                       | false  |
| style     | Action 样式    | React.CSSProperties           | -      |
| text      | 标题           | React.ReactNode               | -      |

### 指令式

可以通过指令式的方式使用 Modal

#### Modal.show

```js
const handler = Modal.show(props);
```

可以通过调用 Modal 上的 show 方法直接打开弹窗，其中 props 参数的类型同上表，但不支持传入 visible 属性。

当弹窗被关闭后，组件实例会自动销毁。

show 方法的返回值为一个组件控制器，包含以下属性：

| 属性  | 说明     | 类型       | 默认值 |
| ----- | -------- | ---------- | ------ |
| close | 关闭弹窗 | () => void | -      |

show 只是一个很基础的方法，在实际业务中，更为常用的是下面的 alert 和 confirm 方法：

#### Modal.alert

alert 接受的参数同 show，但不支持 closeOnAction actions 属性，它的返回值不是一个控制器对象，而是 Promise<void>。

此外，它还额外支持以下属性：

| 属性        | 说明               | 类型                        | 默认值 |
| ----------- | ------------------ | --------------------------- | ------ |
| confirmText | 确认按钮的内容     | ReactNode                   | -      |
| onConfirm   | 点击确认按钮时触发 | () => void \| Promise<void> | -      |

#### Modal.confirm

confirm 接受的参数同 show，但不支持 closeOnAction actions 属性，它的返回值不是一个控制器对象，而是 Promise<boolean>。

此外，它还额外支持以下属性：

| 属性         | 说明               | 类型                        | 默认值 |
| ------------ | ------------------ | --------------------------- | ------ |
| cancelText   | 取消按钮的内容     | ReactNode                   | 取消   |
| confirmText  | 确认按钮的内容     | ReactNode                   | 确认   |
| onCancel     | 点击取消按钮时触发 | () => void \| Promise<void> | -      |
| onConfirm    | 点击确认按钮时触发 | () => void \| Promise<void> | -      |
| confirmStyle | 确认按钮样式       | React.CSSProperties         | -      |
| cancelStyle  | 取消按钮样式       | React.CSSProperties         | -      |

#### Modal.clear

可以通过调用 Modal 上的 clear 方法关闭所有打开的弹窗，通常用于路由监听中，处理路由前进、后退不能关闭弹窗的问题。
