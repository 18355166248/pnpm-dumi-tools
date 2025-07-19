import styled from "styled-components";

export const PopupStyle = styled.section<{ $active: boolean }>`
  display: ${(props) => (props.$active ? undefined : "none")};
  .animated-div-popup {
    background-color: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: calc(var(--z-index) + 1);
    height: 75vh;

    .close-icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 43px;
      height: 43px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 15px;
        height: 15px;
      }
    }
  }
`;
