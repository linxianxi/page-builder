import { Alert, Box } from "@chakra-ui/react";
import { useEditor } from "@craftjs/core";
import React from "react";

export * from "./ToolbarItem";
export * from "./ToolbarSection";
export * from "./ToolbarTextInput";
export * from "./ToolbarDropdown";

export const Toolbar = () => {
  const { active, related } = useEditor((state) => ({
    active: state.events.selected,
    related:
      state.events.selected && state.nodes[state.events.selected].related,
  }));

  return (
    <Box width="full" padding={4}>
      {active && related.toolbar && React.createElement(related.toolbar)}

      {!active && (
        <Alert status="info">
          从左侧的页面画布中选择一个元素来查看它的参数。
        </Alert>
      )}
    </Box>
  );
};
