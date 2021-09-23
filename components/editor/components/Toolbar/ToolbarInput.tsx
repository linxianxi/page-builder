import { FormControl, FormLabel, Input, InputProps } from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC } from "react";

interface ToolBarInputProps extends InputProps {
  input: {
    name: string;
    prop: string;
  };
}

export const ToolBarInput: FC<ToolBarInputProps> = ({
  input,
  onChange,
  ...props
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[input.name],
  }));

  return (
    <FormControl key={input.name}>
      <FormLabel>{input.name}</FormLabel>
      <Input
        size="sm"
        value={propValue}
        onChange={(event) => {
          setProp((props: any) => {
            props[input.name] = event.target.value;
          }, 500);
        }}
        {...props}
      />
    </FormControl>
  );
};
