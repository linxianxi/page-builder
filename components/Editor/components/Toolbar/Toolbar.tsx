import React, { FC } from "react";
import { CodeInput } from "./CodeInput";
import { ToolBarInput } from "./ToolBarInput";

interface Input {
  type: "string" | "number" | "code" | "button";
  name: string;
  prop: string;
}

export interface ToolBarProps {
  inputs: Input[];
}

export const ToolBar: FC<ToolBarProps> = ({ inputs = [] }) => {
  return (
    <>
      {inputs.map((input) => {
        switch (input.type) {
          case "string" || "number":
            return <ToolBarInput input={input} />;
          case "code":
            return <CodeInput input={input} />;
          default:
            return null;
        }
      })}
    </>
  );
};
