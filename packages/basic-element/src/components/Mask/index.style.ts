import styled from "styled-components";

export const MaskStyle = styled.section`
  .animated-div-mask {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--z-index);
    display: block;
    width: 100%;
    height: 100%;
    /* 修复ios下弹窗层级不够的情况 */
    transform: translateZ(2px);
    &.content {
      z-index: calc(var(--z-index) + 1);
    }
  }
`;
