import React, { FC } from "react";

import {
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import { InsertPanel } from "../InsertPanel";
import { OptionPanel } from "../OptionPanel";
import { LayerPanel } from "../LayerPanel";

export const SideBar: FC = () => {
  const { active, related } = useEditor((state, query) => {
    const currentlySelectedNodeId = query.getEvent("selected").first();
    return {
      active: currentlySelectedNodeId,
      related:
        currentlySelectedNodeId && state.nodes[currentlySelectedNodeId].related,
    };
  });

  return (
    <Tabs height="full">
      <TabList>
        <Tab>添加</Tab>
        <Tab>选项</Tab>
        <Tab>图层</Tab>
        <Tab>样式</Tab>
      </TabList>

      <TabPanels height="calc(100% - 42px)" overflow="auto">
        <TabPanel>
          <InsertPanel />
        </TabPanel>

        <TabPanel>
          <OptionPanel />
        </TabPanel>

        <TabPanel>
          <LayerPanel />
        </TabPanel>

        <TabPanel>
          {active &&
            related.stylePanel &&
            React.createElement(related.stylePanel)}
          {!active && (
            <Flex align="center" justify="center" width="full" height="full">
              <Text color="gray">请选择一个元素来编辑它的样式</Text>
            </Flex>
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};