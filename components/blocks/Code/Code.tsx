import { UserComponent, useNode } from "@craftjs/core";
import { chakra } from "@chakra-ui/react";
import React from "react";
import { liquid } from "../../../lib/liquid";
import { useEffect } from "react";
import { useState } from "react";
import { ToolBar } from "../../Editor/components/ToolBar";

export interface CodeProps {
  code?: string;
  params?: object;
}

export const Code: UserComponent<CodeProps> = ({ code, params }) => {
  const {
    connectors: { connect, drag },
  } = useNode((node) => ({
    selected: node.events.selected,
  }));

  const [html, setHtml] = useState("");

  useEffect(() => {
    liquid.parseAndRender(code, params).then(setHtml).catch(console.error);
  }, [code, params]);

  return (
    <chakra.div
      ref={(ref) => connect(drag(ref))}
      height={html ? null : 8}
      width="100%"
      dangerouslySetInnerHTML={{
        __html: html,
      }}
    />
  );
};

Code.craft = {
  isCanvas: true,
  displayName: "代码",
  props: {
    code: "",
  },
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
