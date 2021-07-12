import { UserComponent, useNode } from "@craftjs/core";
import { Box as BaseBox, BoxProps as BaseBoxProps } from "@chakra-ui/react";
import React from "react";

export interface BoxProps extends BaseBoxProps {}

export const Box: UserComponent<BoxProps> = ({ children, ...otherProps }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <BaseBox
      ref={(ref) => connect(drag(ref))}
      mx="auto"
      my={0}
      width="full"
      maxWidth="container.lg"
      {...(!children
        ? {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minH: 10,
            borderColor: "gray.300",
            borderWidth: 1,
            borderStyle: "dashed",
          }
        : {})}
      {...otherProps}
    >
      {children || "容器"}
    </BaseBox>
  );
};

Box.craft = {
  isCanvas: true,
  displayName: "盒子",
  props: {
    height: "200px",
  },
  related: {
    // toolbar: ButtonSettings,
  },
};