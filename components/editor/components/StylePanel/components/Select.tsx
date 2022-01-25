import { useNode } from "@craftjs/core";
import React, { FC, ReactNode } from "react";
import { Select as BaseSelect } from "antd";

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
    <div
    // direction={layout === "horizontal" ? "row" : "column"}
    // justify={layout === "horizontal" && "space-between"}
    // align={layout === "horizontal" && "center"}
    >
      {layout === "horizontal" && <>{label}</>}
      {layout === "vertical" && <>{label}</>}
      <BaseSelect
        value={propValue}
        onChange={(value) => {
          setProp((props) => {
            props[propName] = value;
          });
        }}
        options={options}
      />
    </div>
  );
};
