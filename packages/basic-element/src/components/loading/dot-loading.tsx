import React from "react";
import { memo } from "react";

export const DotLoading = memo(() => {
  return (
    <div className="loading" style={{ display: "inline-block" }}>
      <svg
        height="1em"
        viewBox="0 0 100 40"
        style={{ verticalAlign: "-0.125em" }}
      >
        <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
          <g transform="translate(-100.000000, -71.000000)">
            <g transform="translate(95.000000, 71.000000)">
              <g transform="translate(5.000000, 0.000000)">
                {[0, 1, 2].map((i) => (
                  <rect
                    key={i}
                    fill="currentColor"
                    x={20 + i * 26}
                    y="16"
                    width="8"
                    height="8"
                    rx="2"
                  >
                    <animate
                      attributeName="y"
                      from="16"
                      to="16"
                      dur="2s"
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                      values="16; 6; 26; 16; 16"
                      keyTimes="0; 0.1; 0.3; 0.4; 1"
                    />
                  </rect>
                ))}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
});
