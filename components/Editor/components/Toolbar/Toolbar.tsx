import { FormControl, FormLabel } from "@chakra-ui/react";
import React, { FC } from "react";
import { CodeInput } from "./CodeInput";
import { ToolBarInput } from "./ToolBarInput";

interface Input {
  type: "string" | "number" | "image" | "code";
  name: string;
  prop: string;
}

export interface ToolBarProps {
  inputs: Input[];
}

export const ToolBar: FC<ToolBarProps> = ({ inputs = [] }) => {
  return inputs.map((input) => {
    switch (input.type) {
      case "string":
        return (
          <FormControl key={input.name}>
            <FormLabel>{input.name}</FormLabel>
            <ToolBarInput name={input.prop} />
          </FormControl>
        );
      case "code":
        return <CodeInput input={input} />;
      case "number":
        return (
          <FormControl key={input.name}>
            <FormLabel>{input.name}</FormLabel>
            <ToolBarInput name={input.prop} />
          </FormControl>
        );
      default:
        return null;
    }
  });
};
