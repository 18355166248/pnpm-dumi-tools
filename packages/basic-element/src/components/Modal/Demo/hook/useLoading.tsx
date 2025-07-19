// @ts-ignore
import { Modal } from "basic-element";
import type { ModalShowHandler } from "../../index";
import { useRef } from "react";
import React from "react";

export const LOADING_IMG =
  "https://imagev2.xmcdn.com/storages/47cf-audiofreehighqps/DF/20/CKwRIRwFToiUAABFoADwx5Hi.gif";

const styles = {
  loadingView: {
    width: 62,
    height: 62,
    display: "block",
  },
  loadingBg: {
    width: 92,
    height: 92,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
};

interface LoadingViewProps {
  backgroundColor?: string;
}

const useLoading = (props?: LoadingViewProps) => {
  const { backgroundColor = "#fff" } = props || {};
  const modal1Ref = useRef<ModalShowHandler>();

  function showLoading() {
    modal1Ref.current = Modal.show({
      children: (
        <div style={{ ...styles.loadingBg, backgroundColor }}>
          <img src={LOADING_IMG} alt="loading" style={styles.loadingView} />
        </div>
      ),
      modalStyle: {
        padding: 0,
      },
    });
  }

  function hideLoading() {
    modal1Ref.current?.close();
  }

  return { showLoading, hideLoading };
};

export default useLoading;
