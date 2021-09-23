import { Flex, Text, Select as BaseSelect, FormLabel } from "@chakra-ui/react";
import { useNode } from "@craftjs/core";
import React, { FC, ReactNode } from "react";

export interface SelectProps {
  label: ReactNode;
  propName: string;
  layout?: "vertical" | "horizontal";
  options?: { value: string | number; label: string }[];
}

export const Select: FC<SelectProps> = ({
  label,
  propName,
  layout = "horizontal",
  options = [],
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
      <BaseSelect
        value={propValue}
        onChange={(event) => {
          setProp((props) => {
            props[propName] = event.target.value;
          });
        }}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </BaseSelect>
    </Flex>
  );
};
