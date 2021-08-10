import { Box } from "@chakra-ui/react";
import React, { FC } from "react";
import { Layers } from "./layers";

export const LayerPanel: FC = () => {
  return (
    <Box>
      <Layers expandRootOnLoad={true} />
    </Box>
  );
};
