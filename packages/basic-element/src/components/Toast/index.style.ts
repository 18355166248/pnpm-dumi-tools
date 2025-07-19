import styled from "styled-components";

export const ToastWrapStyle = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  .main {
    display: inline-block;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
    width: auto;
    max-width: 220px;
    min-width: 98px;
    max-height: 70%;
    overflow: auto;
    color: white;
    word-break: break-all;
    background-color: rgba(58, 58, 58, 0.9);
    border-radius: 3px;
    pointer-events: all;
    font-size: 14px;
    line-height: 1.5;
    box-sizing: border-box;
    text-align: initial;
    padding: 9px 15px;
  }
`;
