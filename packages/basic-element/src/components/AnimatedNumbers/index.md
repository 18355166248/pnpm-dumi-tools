---
title: AnimatedNumbers
nav:
  title: 基础组件
  path: /basic-element
  order: 2
group:
  title: 动画组件
  path: /animated
  order: 1
order: 1
---

## AnimatedNumbers 数字动画

一个优雅的数字滚动动画组件，支持数字从随机值滚动到目标值的动画效果。

### 何时使用

- 展示统计数据时，需要吸引用户注意
- 计数器、价格、评分等需要动态展示数字的场景
- 需要平滑的数字变化动画效果
- 支持千分位分隔符和国际化格式

### 特性

- 🎯 **精确动画**: 从随机数字滚动到目标数字
- 🌍 **国际化支持**: 支持不同地区的数字格式
- 💫 **流畅过渡**: 基于 Framer Motion 的流畅动画
- 📱 **响应式**: 自动适应不同屏幕尺寸
- 🎨 **高度可定制**: 支持自定义样式和动画参数
- 👁️ **视口触发**: 当组件进入视口时自动开始动画

### 代码演示

<code src="./Demo/Demo1.tsx" ></code>

### API

#### 属性

| 参数                  | 说明                 | 类型                          | 默认值  | 版本 |
| --------------------- | -------------------- | ----------------------------- | ------- | ---- |
| animateToNumber       | 动画目标数字         | number                        | -       |      |
| className             | 自定义类名           | string                        | -       |      |
| fontStyle             | 字体样式             | React.CSSProperties           | -       |      |
| transitions           | 自定义动画过渡效果   | (index: number) => Transition | -       |      |
| useThousandsSeparator | 是否使用千分位分隔符 | boolean                       | false   |      |
| locale                | 国际化语言代码       | string                        | "en-US" |      |

#### 动画参数

组件使用 Framer Motion 进行动画，默认的动画参数如下：

- **持续时间**: 1.8秒 + 每个数字位 0.1秒延迟
- **缓动函数**: `[0.25, 0.1, 0.25, 1]` (自定义贝塞尔曲线)
- **目标数字效果**: 缩放从 1.2 到 1，透明度从 0.6 到 1
- **非目标数字**: 透明度 0.2，缩放 0.9

#### 国际化支持

支持所有标准的 locale 代码，例如：

- `"en-US"`: 1,234,567
- `"zh-CN"`: 1,234,567
- `"de-DE"`: 1.234.567
- `"fr-FR"`: 1 234 567

### 使用示例

#### 基础用法

```ts
import AnimatedNumbers from "@your-package/animated-numbers";

function App() {
  return <AnimatedNumbers animateToNumber={1234} />;
}
```

#### 带千分位分隔符

```ts
<AnimatedNumbers
  animateToNumber={1234567}
  useThousandsSeparator={true}
  locale="en-US"
/>
```

#### 自定义样式

```ts
<AnimatedNumbers
  animateToNumber={999}
  fontStyle={{
    fontSize: "48px",
    fontWeight: "bold",
    color: "#ff6b6b",
  }}
/>
```

#### 自定义动画

```ts
<AnimatedNumbers
  animateToNumber={888}
  transitions={(index) => ({
    duration: 2 + index * 0.2,
    ease: "easeOut",
  })}
/>
```

### 注意事项

1. 组件会自动检测视口可见性，当进入视口时开始动画
2. 动画会生成随机数字序列，确保每次都有不同的视觉效果
3. 支持负数，但显示时会取绝对值
4. 组件使用 `ResizeObserver` 自动测量数字尺寸，确保动画准确性
5. 非数字字符（如千分位分隔符）会静态显示，不参与动画
