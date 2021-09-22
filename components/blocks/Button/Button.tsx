import { UserComponent, useNode } from "@craftjs/core";
import { Button as BaseButton, ButtonProps } from "@chakra-ui/react";
import React from "react";

import { ToolBar } from "../../Editor/components/ToolBar";
import { StylePanel } from "../../Editor/components/StylePanel";

export const Button: UserComponent<ButtonProps> = ({ children, ...rest }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <BaseButton ref={(ref) => connect(drag(ref))} {...rest}>
      {children || "按钮"}
    </BaseButton>
  );
};

Button.craft = {
  displayName: "按钮",
  props: {},
  rules: {
    canDrop: (targetNode) => {
      if (targetNode.data.name === "Row") {
        return false;
      }
      return true;
    },
  },
  //   related: {
  //     inputPanel: () => {
  //       return (
  //         <ToolBar
  //           inputs={[
  //             {
  //               type: "string",
  //               name: "地址",
  //               prop: "src",
  //             },
  //           ]}
  //         />
  //       );
  //     },
  //     stylePanel: () => {
  //       return <StylePanel />;
  //     },
  //   },
};
