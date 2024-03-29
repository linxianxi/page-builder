import { UserComponent, useNode } from "@craftjs/core";
import React from "react";
import { ToolBar } from "../../editor/components/ToolBar";

export interface CodeProps {
  code?: string;
  params?: object;
}

export const Code: UserComponent<CodeProps> = () => {
  const {
    connectors: { connect },
    props,
  } = useNode((node) => ({
    selected: node.events.selected,
    props: node.data.props,
  }));

  return (
    <div
      ref={connect}
      style={{ height: props.code ? null : 30 }}
      dangerouslySetInnerHTML={{
        __html: props.code,
      }}
    />
  );
};

Code.craft = {
  isCanvas: true,
  displayName: "代码",
  related: {
    inputPanel: () => {
      return (
        <ToolBar
          inputs={[
            {
              type: "code",
              name: "代码",
              prop: "code",
            },
          ]}
        />
      );
    },
  },
};
