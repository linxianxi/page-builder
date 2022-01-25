import { UserComponent, useNode } from "@craftjs/core";
import React from "react";

export const Button: UserComponent = ({ children, ...rest }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <button ref={connect} {...rest}>
      {children || "按钮"}
    </button>
  );
};

Button.craft = {
  displayName: "按钮",
};
