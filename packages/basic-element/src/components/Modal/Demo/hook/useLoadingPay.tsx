// @ts-ignore
import { Modal } from "basic-element";
import type { ModalShowHandler } from "../../index";
import { useRef } from "react";
import React from "react";

const LOADING_IMG =
  "https://imagev2.xmcdn.com/storages/02fd-audiofreehighqps/E8/89/GMCoOR4J2qK9AAAF1AK-W6yq.png";

const styles = {
  loadingView: {
    width: 28,
    height: 28,
    display: "block",
    margin: "0 auto",
    animation: "turn 1.8s linear infinite",
  },
  loadingBg: {
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    display: "flex",
    width: "max-content",
  },
  loadingText: {
    fontFamily: "苹方-简",
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    whiteSpace: "nowrap" as "nowrap",
  },
};

interface LoadingViewProps {
  backgroundColor?: string;
}

const useLoadingPay = (props?: LoadingViewProps) => {
  const { backgroundColor = "rgba(0, 0, 0, 0.8)" } = props || {};
  const modal1Ref = useRef<ModalShowHandler>();

  function showSearchResultLoading() {
    modal1Ref.current = Modal.show({
      children: (
        <div style={{ ...styles.loadingBg, backgroundColor }}>
          <img src={LOADING_IMG} alt="loading" style={styles.loadingView} />
          <span style={{ ...styles.loadingText, textAlign: "center" }}>
            确认签约结果中，请等待...
          </span>
        </div>
      ),
      modalStyle: {
        padding: 0,
        backgroundColor: "transparent",
      },
      opacity: 0,
    });
  }

  function hideSearchResultLoading() {
    modal1Ref.current?.close();
  }

  return { showSearchResultLoading, hideSearchResultLoading };
};

export default useLoadingPay;
