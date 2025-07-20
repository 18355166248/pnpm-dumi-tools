---
title: Mask
nav:
  title: 基础组件
  path: /basic-element
  order: 2
group:
  title: 弹窗
  path: /modal
  order: 1
order: 4
---

## Mask 背景蒙层

深色背景层。

### 何时使用

常用于模态窗口的背景层，使视觉焦点突出在模态窗口本身。

### 代码演示

<code src="./Demo/Demo1.tsx" ></code>

### Modal

#### 属性

| 参数              | 说明                                                     | 类型                                                       | 默认值    | 版本 |
| ----------------- | -------------------------------------------------------- | ---------------------------------------------------------- | --------- | ---- |
| visible           | 是否可见                                                 | boolean                                                    | true      |      |
| getContainer      | 指定挂载的 HTML 节点，如果为 null 的话，会渲染到当前节点 | HTMLElement \| () => HTMLElement \| null                   | body      |      |
| stopPropagation   | 阻止某些事件的冒泡                                       | PropagationEvent[]                                         | ['click'] |      |
| destroyOnClose    | 不可见时是否销毁 DOM 结构                                | boolean                                                    | false     |      |
| forceRender       | 强制渲染内容                                             | boolean                                                    | false     |      |
| disableBodyScroll | 是否禁用 body 滚动                                       | boolean                                                    | true      |      |
| afterShow         | 完全展示后触发                                           | () =>                                                      | -         |      |
| afterClose        | 完全关闭后触发                                           | () =>                                                      | -         |      |
| color             | 背景色颜色                                               | `"white" \| "black" \| (string & {})`                      | black     |      |
| opacity           | 背景色透明度                                             | `"default" \| "thin" \| "thick" \| number`                 | default   |      |
| children          | 内容                                                     | React.ReactNode                                            | -         |      |
| onMaskClick       | 点击蒙层自身触发                                         | `(event: React.MouseEvent<HTMLDivElement, MouseEvent>) =>` | -         |      |
