import React, { FC } from "react";
import { Editor as CraftEditor, Frame, Element } from "@craftjs/core";
import { Box, Flex } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";

import { Sidebar } from "./components/Sidebar";
import { Toolbox } from "./components/Toolbox";

export const EditorContent: FC = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <Flex height="full" width="full">
      <Toolbox />

      <Box flex="1" className="page-container">
        {/* <Header /> */}
        <Box
          ref={(ref) => connectors.select(connectors.hover(ref, null), null)}
        >
          <Box mx="auto" my={0} width="full" height="full">
            <Frame>{children}</Frame>
          </Box>
        </Box>
      </Box>

      <Sidebar />
    </Flex>
  );
};
