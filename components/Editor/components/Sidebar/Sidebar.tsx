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
import { StylePanel } from "../StylePanel";
import { LayerPanel } from "../LayerPanel";

export const SideBar: FC = () => {
  const { active, related } = useEditor((state) => ({
    active: state.events.selected,
    related:
      state.events.selected && state.nodes[state.events.selected].related,
  }));

  return (
    <Tabs height="full">
      <TabList>
        <Tab>添加</Tab>
        <Tab>选项</Tab>
        <Tab>图层</Tab>
        <Tab>样式</Tab>
      </TabList>

      <TabPanels>
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
