import React, { FC, useMemo, useRef } from "react";
import { Frame } from "@craftjs/core";
import { Box, Grid, GridItem, useToken } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import weakMemoize from "@emotion/weak-memoize";

import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { usePreviewMode } from "./hooks/usePreviewMode";
import FrameComponent, { FrameContextConsumer } from "react-frame-component";
import { CacheProvider } from "@emotion/react";
import { useIsScrolling } from "./hooks/useIsScrolling";
import { useCallback } from "react";

const memoizedCreateCacheWithContainer = weakMemoize(
  (container: HTMLElement) => {
    let newCache = createCache({ container, key: "iframe" });
    return newCache;
  }
);

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
    <Grid
      width="full"
      height="full"
      templateRows={`${useToken("sizes", 14)} 1fr ${useToken("sizes", 8)}`}
      templateColumns={`${useToken("sizes", 80)} 1fr ${useToken("sizes", 80)}`}
    >
      <GridItem colSpan={3}>
        <TopBar />
      </GridItem>

      <GridItem rowSpan={2} borderRightWidth="1px">
        <SideBar />
      </GridItem>

      <GridItem colSpan={2}>
        <StatusBar />
        <Box
          pos="relative"
          className="page-container"
          mx="auto"
          width={iframeWidth}
          height="full"
          h="calc(100vh - 88px)"
          overflow="hidden"
        >
          <FrameComponent
            id="iframe-component"
            style={{
              width: "100%",
              height: "100%",
              margin: "0 auto",
              borderLeft: previewMode !== "desktop" && "1px solid #ccc",
              borderRight: previewMode !== "desktop" && "1px solid #ccc",
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
                frameContext.document.addEventListener("scroll", handleScroll);
                return (
                  <CacheProvider
                    value={memoizedCreateCacheWithContainer(
                      frameContext.document.head
                    )}
                  >
                    <Frame
                      data={
                        typeof window !== "undefined"
                          ? localStorage.getItem("data")
                          : ""
                      }
                    >
                      {children}
                    </Frame>
                  </CacheProvider>
                );
              }}
            </FrameContextConsumer>
          </FrameComponent>
        </Box>
      </GridItem>
    </Grid>
  );
};
