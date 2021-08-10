import { Input, InputProps } from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC } from "react";

export interface ToolBarInputProps extends InputProps {
  onChange?: (value: any) => void;
}

export const ToolBarInput: FC<ToolBarInputProps> = ({
  name,
  onChange,
  ...props
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[name],
  }));

  return (
    <Input
      size="sm"
      value={propValue}
      onChange={(event) => {
        setProp((props: any) => {
          props[name] = onChange
            ? onChange(event.target.value)
            : event.target.value;
        }, 500);
      }}
      {...props}
    />
  );
};
