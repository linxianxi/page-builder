import { UserComponent, useNode } from "@craftjs/core";
import { Box, BoxProps as BaseBoxProps } from "@chakra-ui/react";
import React from "react";

export interface BoxProps extends BaseBoxProps {}

export const Container: UserComponent<BoxProps> = ({
  children,
  ...otherProps
}) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <Box
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
            borderColor: "gray.200",
            borderWidth: 1,
            borderStyle: "dashed",
          }
        : {})}
      {...otherProps}
    >
      {children || "容器"}
    </Box>
  );
};

Container.craft = {
  displayName: "容器",
  isCanvas: true,
  related: {
    // toolbar: ButtonSettings,
  },
};
