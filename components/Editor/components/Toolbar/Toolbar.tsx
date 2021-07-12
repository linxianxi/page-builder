import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Heading,
  Tabs,
} from "@chakra-ui/react";
import React, { FC, useMemo } from "react";
import { ToolbarInput } from "./ToolbarInput";

const baseConfigs = [
  {
    name: "样式",
    toolbarGroups: [
      {
        name: "间距",
        toolbars: [
          {
            name: "内边距",
            prop: "padding",
            type: "input",
          },
          {
            name: "外边距",
            prop: "margin",
            type: "input",
          },
        ],
      },
      {
        name: "边框",
        toolbars: [
          {
            name: "边框样式",
            prop: "borderStyle",
            type: "input",
          },
          {
            name: "边框颜色",
            prop: "borderColor",
            type: "input",
          },
          {
            name: "边框大小",
            prop: "borderWidth",
            type: "input",
          },
        ],
      },
    ],
  },
];

export interface ToolbarProps {
  config: any;
}

export const Toolbar: FC<ToolbarProps> = ({ config }) => {
  const configs = useMemo(() => {
    return [
      {
        name: "选项",
        toolbarGroups: [...config],
      },
      ...baseConfigs,
    ];
  }, [config]);

  return (
    <Tabs>
      <TabList>
        {configs.map((toolbarTab) => (
          <Tab key={toolbarTab.name}>{toolbarTab.name}</Tab>
        ))}
      </TabList>

      <TabPanels>
        {configs.map((toolbarTab) => (
          <TabPanel key={toolbarTab.name} padding={0}>
            <Accordion
              defaultIndex={toolbarTab.toolbarGroups.map(
                (_toolbarGroup, index) => index
              )}
              allowMultiple
            >
              {toolbarTab.toolbarGroups.map((toolbarGroup) => {
                return (
                  <AccordionItem key={toolbarGroup.name}>
                    <Heading as="h2">
                      <AccordionButton>
                        <Box flex="1" textAlign="left">
                          {toolbarGroup.name}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                    </Heading>

                    <AccordionPanel pb={4}>
                      <Box>
                        {toolbarGroup.toolbars.map((toolbar) => {
                          return (
                            <FormControl key={toolbar.name}>
                              <FormLabel>{toolbar.name}</FormLabel>
                              <ToolbarInput name={toolbar.prop} />
                            </FormControl>
                          );
                        })}
                      </Box>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};
