import {
  Flex,
  FormLabel,
  Input as BaseInput,
  InputProps as BaseInputProps,
} from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC } from "react";
import { ReactNode } from "react";

export interface InputProps extends BaseInputProps {
  label: ReactNode;
  propName: string;
  layout?: "vertical" | "horizontal";
}

export const Input: FC<InputProps> = ({
  label,
  propName,
  layout = "vertical",
  ...props
}) => {
  const {
    actions: { setProp },
    propValue,
  } = useNode((node) => ({
    propValue: node.data.props[propName],
  }));

  return (
    <Flex
      direction={layout === "horizontal" ? "row" : "column"}
      justify={layout === "horizontal" && "space-between"}
      align={layout === "horizontal" && "center"}
    >
      {layout === "horizontal" && (
        <FormLabel wordBreak="keep-all" mb={0}>
          {label}
        </FormLabel>
      )}
      {layout === "vertical" && <FormLabel>{label}</FormLabel>}
      <BaseInput
        size="sm"
        value={propValue || ""}
        onChange={(event) => {
          setProp((props) => {
            props[propName] = event.target.value;
          }, 500);
        }}
        {...props}
      />
    </Flex>
  );
};
