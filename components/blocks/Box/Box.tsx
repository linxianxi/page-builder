import { UserComponent, useNode } from "@craftjs/core";
import React from "react";

export const Box: UserComponent = ({ children, ...otherProps }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <div ref={connect} {...otherProps}>
      {children}
    </div>
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
