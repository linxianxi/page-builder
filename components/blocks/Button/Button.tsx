import { UserComponent, useNode } from "@craftjs/core";
import { Button as BaseButton, ButtonProps } from "@chakra-ui/react";
import React from "react";

export const Button: UserComponent<ButtonProps> = ({ children, ...rest }) => {
  const {
    connectors: { connect },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  return (
    <BaseButton ref={connect} {...rest}>
      {children || "按钮"}
    </BaseButton>
  );
};

Button.craft = {
  displayName: "按钮",
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
