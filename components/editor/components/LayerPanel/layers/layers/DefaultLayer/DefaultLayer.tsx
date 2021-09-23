import React from "react";

import { DefaultLayerHeader } from "./DefaultLayerHeader";

import { useLayer } from "../useLayer";
import { Box } from "@chakra-ui/react";

export const DefaultLayer: React.FC = ({ children }) => {
  const {
    hovered,
    connectors: { layer },
  } = useLayer((layer) => ({
    hovered: layer.event.hovered,
    expanded: layer.expanded,
  }));

  return (
    <Box
      ref={layer}
      background={hovered ? "gray.100" : null}
      borderRadius="md"
      fontSize="xs"
    >
      <DefaultLayerHeader />
      {children ? <Box>{children}</Box> : null}
    </Box>
  );
};
