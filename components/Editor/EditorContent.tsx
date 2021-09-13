import React, { FC } from "react";
import { Frame } from "@craftjs/core";
import { Box, Grid, GridItem, useToken } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";

import { SideBar } from "./components/SideBar";
import { TopBar } from "./components/TopBar";
import { StatusBar } from "./components/StatusBar/StatusBar";
import { usePreviewMode } from "./hooks/usePreviewMode";

export const EditorContent: FC = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [previewMode] = usePreviewMode();

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

      <GridItem rowSpan={2}>
        <SideBar />
      </GridItem>

      <GridItem colSpan={{ base: 2, "2xl": 1 }}>
        <StatusBar />
        <Box
          className="page-container"
          mx="auto"
          width="full"
          height="full"
          borderColor="gary.200"
          borderLeftWidth={1}
          borderRightWidth={1}
          overflow="auto"
          h="calc(100vh - 88px)"
        >
          <Box
            ref={(ref) => connectors.select(connectors.hover(ref, null), null)}
            bgColor="white"
            width={(() => {
              switch (previewMode) {
                case "mobile":
                  return "375px";
                case "desktop":
                  return "full";
                default:
                  return "full";
              }
            })()}
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
          </Box>
        </Box>
      </GridItem>

      <GridItem display={{ base: "none", "2xl": "block" }}>
        <SideBar />
      </GridItem>
    </Grid>
  );
};
