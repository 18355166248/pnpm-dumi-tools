import React, { useState } from "react";
import AnimatedNumbers from "../index";

const Demo1: React.FC = () => {
  // 状态管理
  const [currentNumber, setCurrentNumber] = useState(1234);
  const [initNumber, setInitNumber] = useState(1234);
  const [price, setPrice] = useState(2999);
  const [rating, setRating] = useState(4.8);
  const [customNumber, setCustomNumber] = useState(888);

  // 数字增减函数
  const increaseNumber = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    amount = 100
  ) => {
    setter((prev) => prev + amount);
  };

  const decreaseNumber = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    amount = 100
  ) => {
    setter((prev) => Math.max(0, prev - amount));
  };

  // 按钮样式
  const buttonStyle = {
    padding: "8px 16px",
    margin: "0 8px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#007bff",
    color: "white",
    cursor: "pointer",
    fontSize: "14px",
  };

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
    width: "100px",
    marginRight: "8px",
  };

  const controlPanelStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "15px",
    flexWrap: "wrap" as const,
    gap: "8px",
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2 style={{ marginBottom: "30px", color: "#333" }}>
        AnimatedNumbers 组件演示
      </h2>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>
          基础用法（可控制）
        </h3>
        <div style={controlPanelStyle}>
          <input
            type="number"
            value={initNumber}
            onChange={(e) => setInitNumber(Number(e.target.value))}
            style={inputStyle}
            placeholder="初始数字"
          />
          <button
            onClick={() => setCurrentNumber(initNumber)}
            style={buttonStyle}
          >
            设置初始值
          </button>
          <button
            onClick={() => increaseNumber(setCurrentNumber, 100)}
            style={buttonStyle}
          >
            +100
          </button>
          <button
            onClick={() => decreaseNumber(setCurrentNumber, 100)}
            style={buttonStyle}
          >
            -100
          </button>
        </div>
        <div style={{ fontSize: "32px", fontWeight: "bold" }}>
          <AnimatedNumbers animateToNumber={currentNumber} />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>带千分位分隔符</h3>
        <div style={controlPanelStyle}>
          <button
            onClick={() => increaseNumber(setCurrentNumber, 1000)}
            style={buttonStyle}
          >
            +1000
          </button>
          <button
            onClick={() => decreaseNumber(setCurrentNumber, 1000)}
            style={buttonStyle}
          >
            -1000
          </button>
        </div>
        <div style={{ fontSize: "28px", fontWeight: "bold", color: "#2c3e50" }}>
          <AnimatedNumbers
            animateToNumber={currentNumber}
            useThousandsSeparator={true}
            locale="en-US"
          />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>自定义样式</h3>
        <div style={controlPanelStyle}>
          <button
            onClick={() => increaseNumber(setCurrentNumber, 50)}
            style={buttonStyle}
          >
            +50
          </button>
          <button
            onClick={() => decreaseNumber(setCurrentNumber, 50)}
            style={buttonStyle}
          >
            -50
          </button>
        </div>
        <div>
          <AnimatedNumbers
            animateToNumber={currentNumber}
            fontStyle={{
              fontSize: "48px",
              fontWeight: "bold",
              color: "#e74c3c",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>不同数字长度</h3>
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ fontSize: "24px" }}>
            <AnimatedNumbers animateToNumber={42} />
          </div>
          <div style={{ fontSize: "24px" }}>
            <AnimatedNumbers animateToNumber={1000} />
          </div>
          <div style={{ fontSize: "24px" }}>
            <AnimatedNumbers animateToNumber={99999} />
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>
          价格展示（可控制）
        </h3>
        <div style={controlPanelStyle}>
          <button
            onClick={() => increaseNumber(setPrice, 100)}
            style={buttonStyle}
          >
            +$100
          </button>
          <button
            onClick={() => decreaseNumber(setPrice, 100)}
            style={buttonStyle}
          >
            -$100
          </button>
        </div>
        <div style={{ fontSize: "36px", fontWeight: "bold", color: "#27ae60" }}>
          $
          <AnimatedNumbers
            animateToNumber={price}
            useThousandsSeparator={true}
            locale="en-US"
          />
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>
          评分展示（可控制）
        </h3>
        <div style={controlPanelStyle}>
          <button
            onClick={() => setRating((prev) => Math.min(5.0, prev + 0.1))}
            style={buttonStyle}
          >
            +0.1
          </button>
          <button
            onClick={() => setRating((prev) => Math.max(0, prev - 0.1))}
            style={buttonStyle}
          >
            -0.1
          </button>
        </div>
        <div style={{ fontSize: "32px", color: "#f39c12" }}>
          <AnimatedNumbers animateToNumber={rating} />
          <span style={{ fontSize: "24px", marginLeft: "5px" }}>/ 5.0</span>
        </div>
      </div>

      <div style={{ marginBottom: "40px" }}>
        <h3 style={{ marginBottom: "15px", color: "#666" }}>
          自定义动画（可控制）
        </h3>
        <div style={controlPanelStyle}>
          <button
            onClick={() => increaseNumber(setCustomNumber, 111)}
            style={buttonStyle}
          >
            +111
          </button>
          <button
            onClick={() => decreaseNumber(setCustomNumber, 111)}
            style={buttonStyle}
          >
            -111
          </button>
        </div>
        <div style={{ fontSize: "40px", fontWeight: "bold", color: "#8e44ad" }}>
          <AnimatedNumbers
            animateToNumber={customNumber}
            transitions={(index) => ({
              duration: 20 + index * 0.3,
              ease: "easeOut",
            })}
          />
        </div>
      </div>

      <div
        style={{
          backgroundColor: "#f8f9fa",
          padding: "20px",
          borderRadius: "8px",
          marginTop: "40px",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#495057" }}>使用说明</h3>
        <ul style={{ color: "#6c757d", lineHeight: "1.6" }}>
          <li>组件会在进入视口时自动开始动画</li>
          <li>支持负数，但显示时会取绝对值</li>
          <li>可以通过 fontStyle 自定义字体样式</li>
          <li>支持千分位分隔符和国际化格式</li>
          <li>可以自定义动画过渡效果</li>
          <li>点击按钮可以实时控制数字的增减</li>
          <li>可以设置初始数字值</li>
        </ul>
      </div>
    </div>
  );
};

export default Demo1;
