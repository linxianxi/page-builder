import { UserComponent, useNode } from "@craftjs/core";
import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import React from "react";

import { ToolBar } from "../../Editor/components/ToolBar";
import { StylePanel } from "../../Editor/components/StylePanel";

export interface GridProps extends SimpleGridProps {}

export const Grid: UserComponent<GridProps> = ({ children, ...otherProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <SimpleGrid
      ref={(ref) => connect(drag(ref))}
      width="full"
      {...(!children
        ? {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minH: 10,
            borderColor: "gray.200",
            borderWidth: 1,
            borderStyle: "dashed",
          }
        : {})}
      {...otherProps}
    >
      {children || "网格"}
    </SimpleGrid>
  );
};

Grid.craft = {
  displayName: "网格",
  isCanvas: true,
  related: {
    inputPanel: () => {
      return (
        <ToolBar
          inputs={[
            {
              type: "number",
              name: "每行列数量",
              prop: "columns",
            },
            {
              type: "string",
              name: "间距",
              prop: "spacing",
            },
          ]}
        />
      );
    },
    stylePanel: () => {
      return <StylePanel />;
    },
  },
};
