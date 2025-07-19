import type { FC } from "react";
import React from "react";
import styled from "styled-components";

export interface SafeHtmlTextProps {
  text: string;
}
interface Part {
  type: string;
  content: string;
}
interface TagMapProps {
  [key: string]: (content: string, key: number) => React.ReactNode;
}

// 支持的标签映射
const TAG_MAP: TagMapProps = {
  b: (content, key) => <TextBold key={key}>{content}</TextBold>,
  // 可以添加更多标签
};

const TextBold = styled.span`
  font-weight: 700;
  color: #8d8d91;
`;

// 解析HTML标签的正则表达式
const parseHtml = (text: string) => {
  const parts: Part[] = [];
  let lastIndex = 0;

  // 匹配所有支持的HTML标签
  const regex = /<(\w+)>(.*?)<\/\1>/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // 添加标签前的普通文本
    if (match.index > lastIndex) {
      parts.push({
        type: "text",
        content: text.slice(lastIndex, match.index),
      });
    }

    // 添加标签包裹的内容
    const [, tag, content] = match;
    if (TAG_MAP[tag]) {
      parts.push({
        type: tag,
        content: content,
      });
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余的文本
  if (lastIndex < text.length) {
    parts.push({
      type: "text",
      content: text.slice(lastIndex),
    });
  }

  return parts;
};

const SafeHtmlText: FC<SafeHtmlTextProps> = ({ text }) => {
  const parts = parseHtml(text);

  return parts.map((part, index) => {
    if (part.type === "text") {
      return part.content;
    }
    return TAG_MAP[part.type](part.content, index);
  });
};

export default SafeHtmlText;
