import React, { FC, useMemo, useRef } from "react";
import { Frame } from "@craftjs/core";

import RightBar from "./components/RightBar";
import TopBar from "./components/TopBar";
import StatusBar from "./components/StatusBar";
import { usePreviewMode } from "./hooks/usePreviewMode";
import FrameComponent, { FrameContextConsumer } from "react-frame-component";
import { useIsScrolling } from "./hooks/useIsScrolling";
import { useCallback } from "react";
import { Layout } from "antd";
import { StyleSheetManager } from "styled-components";
import LeftBar from "./components/LeftBar";

export const EditorContent: FC = ({ children }) => {
  const [previewMode] = usePreviewMode();

  const timer = useRef(null);

  const [, setIsScrolling] = useIsScrolling();

  const iframeWidth = useMemo(() => {
    switch (previewMode) {
      case "mobile":
        return "375px";
      case "tablet":
        return "768px";
      default:
        return "100%";
    }
  }, [previewMode]);

  const handleScroll = useCallback(() => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    setIsScrolling(true);
    timer.current = setTimeout(() => {
      setIsScrolling(false);
    }, 100);
  }, [setIsScrolling]);

  return (
    <Layout>
      <Layout.Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          background: "#fff",
          padding: 16,
          height: "auto",
          lineHeight: "unset",
        }}
        className="border-b border-gray-300"
      >
        <TopBar />
      </Layout.Header>

      <Layout.Content className="flex bg-white">
        <LeftBar />
        <div className="flex-1 border-x border-gray-300">
          <StatusBar />

          <div
            className="page-container relative mx-auto h-full overflow-hidden"
            style={{ width: iframeWidth, height: "calc(100vh - 97px)" }}
          >
            <FrameComponent
              id="iframe-component"
              style={{
                width: "100%",
                height: "100%",
                margin: "0 auto",
                borderLeft:
                  previewMode !== "desktop" ? "1px solid #ccc" : undefined,
                borderRight:
                  previewMode !== "desktop" ? "1px solid #ccc" : undefined,
              }}
              head={
                <style type="text/css">
                  {`
                  *, *:before, *:after {
                    box-sizing: border-box;
                  }
                  body {
                    margin: 0;
                  }
                  .component-selected{ 
                    position: relative 
                  } 
                  .component-selected:after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: block;
                    content: "";
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    border: 2px solid #3182CE;
                  }
                  .component-selected-active{ 
                    position: relative 
                  } 
                  .component-selected-active:after {
                    position: absolute;
                    top: 0;
                    left: 0;
                    display: block;
                    content: "";
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    border: 2px dashed #3182CE;
                  }
                `}
                </style>
              }
            >
              <FrameContextConsumer>
                {(frameContext) => {
                  frameContext.document.addEventListener(
                    "scroll",
                    handleScroll
                  );
                  return (
                    <StyleSheetManager target={frameContext.document.head}>
                      <Frame
                        data={
                          typeof window !== "undefined"
                            ? localStorage.getItem("data")
                            : ""
                        }
                      >
                        {children}
                      </Frame>
                    </StyleSheetManager>
                  );
                }}
              </FrameContextConsumer>
            </FrameComponent>
          </div>
        </div>
        <RightBar />
      </Layout.Content>
    </Layout>
  );
};
