---
title: Toast
nav:
  title: 基础组件
  path: /basic-element
  order: 2
group:
  title: 弹窗
  path: /modal
  order: 1
order: 3
---

## Toast 弹窗

### 使用场景

对操作结果的轻量级反馈，无需用户操作即可自行消失。

### 何时使用

适用于页面内容的变化不能直接反应操作结果时使用。

### 代码演示

<code src="./Demo/Demo1.tsx" ></code>

### Toast

#### 指令式 API

Toast 只支持指令式调用。

##### Toast.show

show 方法支持传入一个 props 对象，它包含了以下这些属性：

| 参数            | 说明                                | 类型                                       | 默认值    | 版本 |
| --------------- | ----------------------------------- | ------------------------------------------ | --------- | ---- |
| afterClose      | Toast 完全关闭后的回调              | () => void                                 | -         |      |
| maskStyle       | Toast 遮罩样式                      | React.CSSProperties                        | -         |      |
| maskClickable   | 是否允许背景点击                    | boolean                                    | true      |      |
| content         | Toast 文本内容                      | React.ReactNode                            | -         |      |
| duration        | 提示持续时间，若为 0 则不会自动关闭 | number                                     | 2000      |      |
| getContainer    | 自定义轻提示的父容器                | HTMLElement \| (() => HTMLElement) \| null | body      |      |
| stopPropagation | 阻止某些事件的冒泡                  | PropagationEvent[]                         | ['click'] |      |

> 同一时间只允许弹出一个轻提示，新出现的 Toast 会将之前正在显示中的 Toast 挤掉。

你也可以直接传入一个字符串，Toast.show 会自动把它作为 content。

show 方法的返回值为一个组件控制器，包含以下属性：

| 参数  | 说明          | 类型       | 默认值 | 版本 |
| ----- | ------------- | ---------- | ------ | ---- |
| close | 关闭当前Toast | () => void | -      |      |

##### Toast.clear

关闭所有显示中的 Toast。
