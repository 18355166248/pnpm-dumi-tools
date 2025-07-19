import styled from "styled-components";

export const ModalStyle = styled.section<{ $active: boolean }>`
  font-size: 16px;
  display: ${(props) => (props.$active ? undefined : "none")};
  .animated-div-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3D(-50%, -50%, 2px);
    z-index: calc(var(--z-index) + 1);
    min-width: 30px;
    max-width: 75vw;
    max-height: 75vh;

    .animated-div-modal-body {
      background-color: #fff;
      border-radius: 10px;
      padding: 0 12px 24px;
      box-sizing: border-box;
    }

    .close-icon {
      position: absolute;
      right: 0;
      top: 0;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      img {
        width: 16px;
        height: 16px;
      }
    }
    .content {
    }
    .footer {
      display: flex;
      justify-content: center;
      > button {
        border: none;
        width: 110px;
        height: 40px;
        background: linear-gradient(270deg, #e82b24, #ff3722);
        border-radius: 22px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        font-size: 15px;
        font-weight: 500;
        box-sizing: border-box;
        text-align: center;
        text-decoration: none;
        outline: none;
        color: #f86342;
        font-size: 15px;
        line-height: 38px;
        background: #fff;
        border: 1px solid #f86342;
        border-radius: 22px;
        &:not(:first-child) {
          margin-left: 10px;
        }

        &.primary {
          color: #fff;
          background: #ff4444;
        }
      }
    }
  }
`;
