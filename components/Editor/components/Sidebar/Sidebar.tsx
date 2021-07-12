import { useEditor } from "@craftjs/core";
import { Layers } from "@craftjs/layers";
import React, { FC, useState } from "react";
import styled from "styled-components";

import { SidebarItem } from "./SidebarItem";

import CustomizeIcon from "../../../../public/icons/customize.svg";
import LayerIcon from "../../../../public/icons/layers.svg";
import { Toolbar } from "../Toolbar";
import { Box, Flex } from "@chakra-ui/react";

export const Sidebar: FC = () => {
  const [layersVisible, setLayerVisible] = useState(true);
  const [toolbarVisible, setToolbarVisible] = useState(true);
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  return (
    <Flex basis="xs" borderLeftColor="gray.300" borderLeftWidth={1}>
      <Toolbar />
    </Flex>
  );
};
