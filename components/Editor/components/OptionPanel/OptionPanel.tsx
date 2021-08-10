import { Box, Flex, Text } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import React, { FC } from "react";

export const OptionPanel: FC = () => {
  const { active, related } = useEditor((state) => ({
    active: state.events.selected,
    related:
      state.events.selected && state.nodes[state.events.selected].related,
  }));

  return (
    <Box>
      {active && related.inputPanel && React.createElement(related.inputPanel)}
      {!active && (
        <Flex align="center" justify="center" width="full" height="full">
          <Text color="gray">请选择一个元素来编辑它的选项</Text>
        </Flex>
      )}
    </Box>
  );
};
